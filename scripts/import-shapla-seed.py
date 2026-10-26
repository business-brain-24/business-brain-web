"""Import the Shapla Foods seed workbook into the site.

Usage:
    python3 scripts/import-shapla-seed.py path/to/Shapla_Foods_Seed_Data_BB24.xlsx

Writes:
    data/seed/shapla-foods/<table>.json   every sheet, cleaned: dates as ISO strings, numbers as numbers
    src/lib/shapla-seed.ts                 small, ready-made views the demo workspace and Ask Brain use

Only the standard library is used. Re-run it whenever the workbook changes, then commit both outputs.
"""

import json
import re
import sys
import zipfile
from collections import Counter, defaultdict
from datetime import date, timedelta
from pathlib import Path
from xml.etree import ElementTree as ET

ROOT = Path(__file__).resolve().parent.parent
OUT_DATA = ROOT / "data" / "seed" / "shapla-foods"
OUT_TS = ROOT / "src" / "lib" / "shapla-seed.ts"
OUT_AGENT = ROOT / "src" / "lib" / "shapla-agent-data.ts"
NS = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main"}
REL = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id"
EXCEL_EPOCH = date(1899, 12, 30)
AS_OF = date(2026, 10, 25)  # last day in the workbook
DATE_COLS = re.compile(r"date|as of", re.I)


# ---------- reading the workbook ----------

def read_workbook(path):
    z = zipfile.ZipFile(path)
    shared = []
    if "xl/sharedStrings.xml" in z.namelist():
        for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", NS):
            shared.append("".join(t.text or "" for t in si.iter("{%s}t" % NS["m"])))
    rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))}
    sheets = {}
    for sh in ET.fromstring(z.read("xl/workbook.xml")).find("m:sheets", NS):
        target = rels[sh.get(REL)].lstrip("/")
        target = target if target.startswith("xl/") else "xl/" + target
        rows = []
        for r in ET.fromstring(z.read(target)).iter("{%s}row" % NS["m"]):
            row = {}
            for c in r.findall("m:c", NS):
                col = re.match(r"[A-Z]+", c.get("r")).group(0)
                v = c.find("m:v", NS)
                t = c.get("t")
                if t == "s" and v is not None:
                    row[col] = shared[int(v.text)]
                elif t == "inlineStr":
                    row[col] = "".join(x.text or "" for x in c.iter("{%s}t" % NS["m"]))
                else:
                    row[col] = v.text if v is not None else ""
            if any(str(x).strip() for x in row.values()):
                rows.append(row)
        sheets[sh.get("name")] = rows
    return sheets


def to_records(rows):
    """First row is the header. Dates become ISO strings, numeric text becomes numbers."""
    head = rows[0]
    cols = sorted(head, key=lambda c: (len(c), c))
    out = []
    for r in rows[1:]:
        rec = {}
        for c in cols:
            key, val = head[c], r.get(c, "")
            if isinstance(val, str) and re.fullmatch(r"-?\d+(\.\d+)?", val):
                num = float(val)
                if DATE_COLS.search(key) and 30000 < num < 60000:
                    val = (EXCEL_EPOCH + timedelta(days=int(num))).isoformat()
                else:
                    val = round(num, 2) if not num.is_integer() else int(num)
            rec[key] = val
        out.append(rec)
    return out


# ---------- formatting, matching the rest of the demo ----------

def lakh_crore(v):
    a = abs(v)
    if a >= 1e7:
        return f"৳ {a / 1e7:.2f} Cr"
    if a >= 1e5:
        return f"৳ {a / 1e5:.1f} L"
    return "৳ " + indian(round(a))


def indian(n):
    s = str(int(n))
    if len(s) <= 3:
        return s
    head, tail = s[:-3], s[-3:]
    parts = []
    while len(head) > 2:
        parts.insert(0, head[-2:])
        head = head[:-2]
    if head:
        parts.insert(0, head)
    return ",".join(parts) + "," + tail


def d(iso):
    x = date.fromisoformat(iso)
    return f"{x.day} {x.strftime('%b')}"


def dy(iso):
    x = date.fromisoformat(iso)
    return f"{x.day} {x.strftime('%b %Y')}"


def phone(p):
    p = str(p)
    return f"+880 {p[1:5]}-{p[5:]}" if len(p) == 11 else p


def pct(v):
    return f"{v:.0f}%"


# ---------- building the views ----------

def build(t):
    loc = {r["Location ID"]: r for r in t["Locations"]}
    loc_name = lambda i: "Head office, Tejgaon" if i == "HO" else loc[i]["Name"]
    dept = {r["Dept ID"]: r["Department"] for r in t["Departments"]}
    cat = {r["Category ID"]: r["Category"] for r in t["Categories"]}
    prod = {r["SKU"]: r for r in t["Products"]}
    rm = {r["RM ID"]: r for r in t["Raw_Materials"]}
    sup = {r["Supplier ID"]: r for r in t["Suppliers"]}
    cus = {r["Customer ID"]: r for r in t["Customers"]}
    emp = {r["Employee ID"]: r for r in t["Employees"]}
    region = {r["Region ID"]: r["Region"].replace(" Region", "") for r in t["Regions"]}
    month = lambda iso: iso[:7]
    MONTHS = ["2026-07", "2026-08", "2026-09", "2026-10"]
    MLAB = ["Jul", "Aug", "Sep", "Oct*"]
    this_month = "2026-10"
    v = {}

    # Employees and payroll
    emps = t["Employees"]
    tenure = [(AS_OF - date.fromisoformat(e["Join date"])).days / 365.25 for e in emps]
    joined_year = [e for e in emps if e["Join date"][:4] == str(AS_OF.year)]
    by_dept = Counter(dept[e["Dept ID"]] for e in emps)
    by_loc = Counter(loc_name(e["Location ID"]) for e in emps)
    newest = sorted(emps, key=lambda e: e["Join date"], reverse=True)
    bands = Counter()
    for y in tenure:
        bands["<1 yr" if y < 1 else "1 to 2" if y < 3 else "3 to 5" if y < 6 else "6 to 10" if y < 11 else "10+"] += 1
    gross = sum(e["Gross salary (BDT/month)"] for e in emps)
    dept_gross = defaultdict(float)
    for e in emps:
        dept_gross[dept[e["Dept ID"]]] += e["Gross salary (BDT/month)"]

    v["employees"] = {
        "kpis": [["Employees", str(len(emps))], [f"Joined in {AS_OF.year}", str(len(joined_year))], ["Departments", str(len(dept))], ["Avg. tenure", f"{sum(tenure) / len(tenure):.1f} yrs"]],
        "table": {"title": "Newest joiners", "cols": ["Name", "Designation", "Department", "Joined"], "rows": [[e["Name"], e["Designation"], dept[e["Dept ID"]], dy(e["Join date"])] for e in newest[:4]]},
        "groups": [g for g, _ in by_dept.most_common()],
        "people": [
            {
                "name": e["Name"],
                "role": e["Designation"],
                "group": dept[e["Dept ID"]],
                "location": f"{loc_name(e['Location ID']).split(',')[0]} · since {e['Join date'][:4]}",
                "email": e["Email (dummy)"],
                "phone": phone(e["Phone (dummy)"]),
                **({"status": "Probation"} if e["Employment type"] == "Probation" else {}),
            }
            for e in sorted(emps, key=lambda e: e["Employee ID"])
        ],
        "overview": [
            {"type": "kpis", "items": [{"label": "Employees", "value": str(len(emps))}, {"label": f"Joined in {AS_OF.year}", "value": str(len(joined_year))}, {"label": "Average tenure", "value": f"{sum(tenure) / len(tenure):.1f} yrs"}, {"label": "On probation", "value": str(sum(e["Employment type"] == "Probation" for e in emps))}]},
            {"w": 6, "type": "bars", "horizontal": True, "title": "Employees by location", "items": [{"label": l.split(",")[0], "value": n} for l, n in by_loc.most_common(6)]},
            {"w": 6, "type": "bars", "title": "Tenure", "items": [{"label": k, "value": bands[k]} for k in ["<1 yr", "1 to 2", "3 to 5", "6 to 10", "10+"]]},
            {"w": 6, "type": "donut", "title": "Employees by department", "center": str(len(emps)), "centerLabel": "people", "slices": [{"label": k, "value": n} for k, n in by_dept.most_common()]},
            {"w": 6, "type": "list", "title": "Newest joiners", "rows": [{"label": e["Name"], "sub": f"{e['Designation']} · {dept[e['Dept ID']]}", "value": d(e["Join date"])} for e in newest[:5]]},
        ],
    }

    split = lambda g: (g * 0.5, g * 0.25, g * 0.10, g * 0.15)  # basic, house rent, medical, other (illustrative)
    v["payroll"] = {
        "kpis": [["October gross", lakh_crore(gross)], ["Employees paid", str(len(emps))], ["Basic", lakh_crore(gross * 0.5)], ["Allowances", lakh_crore(gross * 0.5)]],
        "table": {"title": "Payroll by department", "cols": ["Department", "Employees", "Gross", "Status"], "rows": [[k, str(by_dept[k]), lakh_crore(dept_gross[k]), "Awaiting approval"] for k, _ in sorted(dept_gross.items(), key=lambda x: -x[1])[:4]]},
        "cols": ["Employee", "Department", "Basic", "House rent", "Medical", "Other", "Gross", "Status"],
        "rows": [[e["Name"], dept[e["Dept ID"]], *["৳ " + indian(round(x)) for x in split(e["Gross salary (BDT/month)"])], "৳ " + indian(e["Gross salary (BDT/month)"]), "Awaiting approval"] for e in sorted(emps, key=lambda e: -e["Gross salary (BDT/month)"])],
        "overview": [
            {"type": "kpis", "items": [{"label": "October gross", "value": lakh_crore(gross)}, {"label": "Employees", "value": str(len(emps))}, {"label": "Average gross", "value": lakh_crore(gross / len(emps))}, {"label": "Status", "value": "Awaiting approval"}]},
            {"w": 5, "type": "donut", "title": "Where the money goes", "center": lakh_crore(gross), "centerLabel": "gross", "slices": [{"label": "Basic", "value": round(gross * 0.5), "display": lakh_crore(gross * 0.5)}, {"label": "House rent", "value": round(gross * 0.25), "display": lakh_crore(gross * 0.25)}, {"label": "Medical", "value": round(gross * 0.1), "display": lakh_crore(gross * 0.1)}, {"label": "Other", "value": round(gross * 0.15), "display": lakh_crore(gross * 0.15)}]},
            {"w": 7, "type": "bars", "horizontal": True, "title": "Cost by department", "items": [{"label": k, "value": round(x / 1e5, 1), "display": lakh_crore(x)} for k, x in sorted(dept_gross.items(), key=lambda x: -x[1])]},
            {"w": 12, "type": "insight", "text": "The salary split (basic 50%, house rent 25%, medical 10%, other 15%) is illustrative sample data, not tax or labour advice."},
        ],
    }

    # Contacts: customers and suppliers
    custs = t["Customers"]
    sups = t["Suppliers"]
    ctype = Counter(c["Type"] for c in custs)
    slug = lambda s: re.sub(r"[^a-z0-9]+", ".", s.lower()).strip(".")
    v["contacts"] = {
        "kpis": [["Contacts", str(len(custs) + len(sups))], ["Customers", str(len(custs))], ["Suppliers", str(len(sups))], ["Sales regions", str(len(region))]],
        "table": {"title": "Largest credit limits", "cols": ["Name", "Company", "Type", "Phone"], "rows": [[c["Contact person"], c["Customer"], c["Type"], phone(c["Phone (dummy)"])] for c in sorted(custs, key=lambda c: -c["Credit limit (BDT)"])[:4]]},
        "groups": [k for k, _ in ctype.most_common()] + ["Supplier"],
        "people": [
            {"name": c["Contact person"], "role": c["Customer"], "group": c["Type"], "location": f"{c['Area / town']}, {c['Division']}", "email": f"{slug(c['Contact person'])}@{slug(c['Customer'])}.test", "phone": phone(c["Phone (dummy)"])}
            for c in custs
        ]
        + [{"name": s["Contact person"], "role": s["Supplier"], "group": "Supplier", "location": s["City"], "email": s["Email (dummy)"], "phone": phone(s["Phone (dummy)"])} for s in sups],
    }

    # Sales
    sos = [o for o in t["Sales_Orders"]]
    net_by_month = defaultdict(float)
    for o in sos:
        net_by_month[month(o["Order date"])] += o["Net amount (BDT)"]
    oct_orders = [o for o in sos if month(o["Order date"]) == this_month]
    last_day = max(o["Order date"] for o in sos)
    today = [o for o in sos if o["Order date"] == last_day]
    reg_mtd, reg_today, reg_orders = defaultdict(float), defaultdict(float), Counter()
    for o in oct_orders:
        r = region[cus[o["Customer ID"]]["Region ID"]]
        reg_mtd[r] += o["Net amount (BDT)"]
        reg_orders[r] += 1
    for o in today:
        reg_today[region[cus[o["Customer ID"]]["Region ID"]]] += o["Net amount (BDT)"]
    oct_ids = {o["SO ID"] for o in oct_orders}
    prod_mtd, cat_mtd = defaultdict(float), defaultdict(float)
    for l in t["Sales_Order_Lines"]:
        if l["SO ID"] in oct_ids:
            p = prod[l["SKU"]]
            prod_mtd[f"{p['Product name']} {p['Pack size']}"] += l["Net (BDT)"]
            cat_mtd[cat[p["Category ID"]]] += l["Net (BDT)"]
    officer_mtd = defaultdict(float)
    for o in oct_orders:
        officer_mtd[emp[o["Sales officer (Emp ID)"]]["Name"]] += o["Net amount (BDT)"]
    mtd = sum(reg_mtd.values())
    v["sales"] = {
        "kpis": [[f"Sales on {d(last_day)}", lakh_crore(sum(o["Net amount (BDT)"] for o in today))], ["Orders in October", indian(len(oct_orders))], ["Month to date", lakh_crore(mtd)], ["Avg. order", lakh_crore(mtd / len(oct_orders))]],
        "table": {"title": "Sales by region", "cols": ["Region", d(last_day), "Month to date", "Orders"], "rows": [[r, lakh_crore(reg_today[r]), lakh_crore(x), str(reg_orders[r])] for r, x in sorted(reg_mtd.items(), key=lambda x: -x[1])[:4]]},
        "overview": [
            {"type": "kpis", "items": [{"label": f"Sales on {d(last_day)}", "value": lakh_crore(sum(o["Net amount (BDT)"] for o in today))}, {"label": "Month to date", "value": lakh_crore(mtd), "note": "1 to 25 Oct, net of VAT"}, {"label": "Orders in October", "value": indian(len(oct_orders))}, {"label": "Customers ordering", "value": str(len({o["Customer ID"] for o in oct_orders}))}]},
            {"w": 8, "type": "line", "title": "Monthly sales", "sub": "৳ crore, net of VAT · *October to the 25th", "labels": MLAB, "series": [{"name": "Sales", "data": [round(net_by_month[m] / 1e7, 2) for m in MONTHS]}]},
            {"w": 4, "type": "donut", "title": "Sales by category", "sub": "Month to date", "center": lakh_crore(mtd), "centerLabel": "October", "slices": [{"label": k, "value": round(x), "display": lakh_crore(x)} for k, x in sorted(cat_mtd.items(), key=lambda x: -x[1])]},
            {"w": 6, "type": "bars", "horizontal": True, "title": "Sales by region", "sub": "Month to date", "items": [{"label": r, "value": round(x / 1e5, 1), "display": lakh_crore(x)} for r, x in sorted(reg_mtd.items(), key=lambda x: -x[1])]},
            {"w": 6, "type": "bars", "horizontal": True, "title": "Top products", "sub": "Month to date", "items": [{"label": k, "value": round(x / 1e5, 1), "display": lakh_crore(x)} for k, x in sorted(prod_mtd.items(), key=lambda x: -x[1])[:6]]},
            {"w": 12, "type": "leaders", "title": "Top sales officers", "sub": "Month to date", "rows": [{"name": k, "value": lakh_crore(x)} for k, x in sorted(officer_mtd.items(), key=lambda x: -x[1])[:5]]},
        ],
    }

    # Invoicing
    invs = t["Invoices"]
    def inv_status(i):
        if i["Outstanding (BDT)"] > 0 and i["Due date"] < AS_OF.isoformat():
            return "Overdue"
        return i["Payment status"]
    outstanding = sum(i["Outstanding (BDT)"] for i in invs)
    overdue = sum(i["Outstanding (BDT)"] for i in invs if inv_status(i) == "Overdue")
    inv_oct = sum(i["Amount (BDT)"] for i in invs if month(i["Invoice date"]) == this_month)
    collected_rate = sum(i["Paid (BDT)"] for i in invs) / sum(i["Amount (BDT)"] for i in invs) * 100
    ageing = Counter()
    for i in invs:
        if i["Outstanding (BDT)"] <= 0:
            continue
        late = (AS_OF - date.fromisoformat(i["Due date"])).days
        ageing["Not due" if late <= 0 else "1 to 30" if late <= 30 else "31 to 60" if late <= 60 else "61 to 90" if late <= 90 else "90+"] += i["Outstanding (BDT)"]
    bal = defaultdict(lambda: [0.0, 0])
    for i in invs:
        if i["Outstanding (BDT)"] > 0:
            bal[cus[i["Customer ID"]]["Customer"]][0] += i["Outstanding (BDT)"]
            bal[cus[i["Customer ID"]]["Customer"]][1] += 1
    inv_m, col_m = defaultdict(float), defaultdict(float)
    for i in invs:
        inv_m[month(i["Invoice date"])] += i["Amount (BDT)"]
    for c in t["Collections"]:
        col_m[month(c["Receipt date"])] += c["Amount (BDT)"]
    recent = sorted(invs, key=lambda i: (i["Invoice date"], i["Invoice ID"]), reverse=True)
    v["invoicing"] = {
        "kpis": [["Outstanding", lakh_crore(outstanding)], ["Overdue", lakh_crore(overdue)], ["Invoiced in October", lakh_crore(inv_oct)], ["Collected", pct(collected_rate)]],
        "table": {"title": "Recent invoices", "cols": ["Invoice", "Customer", "Amount", "Status"], "rows": [[i["Invoice ID"], cus[i["Customer ID"]]["Customer"], lakh_crore(i["Amount (BDT)"]), inv_status(i)] for i in recent[:4]]},
        "cols": ["Invoice", "Customer", "Issued", "Due", "Amount", "Status"],
        "rows": [[i["Invoice ID"], cus[i["Customer ID"]]["Customer"], d(i["Invoice date"]), d(i["Due date"]), lakh_crore(i["Amount (BDT)"]), inv_status(i)] for i in recent[:40]],
        "overview": [
            {"type": "kpis", "items": [{"label": "Invoiced in October", "value": lakh_crore(inv_oct)}, {"label": "Outstanding", "value": lakh_crore(outstanding)}, {"label": "Overdue", "value": lakh_crore(overdue)}, {"label": "Collected", "value": pct(collected_rate), "note": "of everything invoiced since July"}]},
            {"w": 7, "type": "bars", "title": "Receivables ageing", "sub": "Days past due · ৳ lakh", "items": [{"label": k, "value": round(ageing[k] / 1e5, 1), "display": lakh_crore(ageing[k])} for k in ["Not due", "1 to 30", "31 to 60", "61 to 90", "90+"]]},
            {"w": 5, "type": "leaders", "avatars": False, "title": "Largest balances", "rows": [{"name": k, "sub": f"{n} open invoice{'s' if n > 1 else ''}", "value": lakh_crore(x)} for k, (x, n) in sorted(bal.items(), key=lambda x: -x[1][0])[:5]]},
            {"w": 12, "type": "line", "title": "Invoiced vs collected", "sub": "৳ crore · *October to the 25th", "labels": MLAB, "series": [{"name": "Invoiced", "data": [round(inv_m[m] / 1e7, 2) for m in MONTHS]}, {"name": "Collected", "data": [round(col_m[m] / 1e7, 2) for m in MONTHS]}]},
        ],
    }

    # Inventory
    stock = t["Stock_On_Hand"]
    value = lambda s: s["Qty (units)"] * prod[s["SKU"]]["Std cost (BDT)"]
    total_value = sum(value(s) for s in stock)
    low = sorted([s for s in stock if s["Qty (units)"] < s["Reorder level (units)"]], key=lambda s: s["Qty (units)"] / s["Reorder level (units)"])
    val_loc, val_cat = defaultdict(float), defaultdict(float)
    for s in stock:
        val_loc[loc[s["Location ID"]]["Name"].split(",")[0]] += value(s)
        val_cat[cat[prod[s["SKU"]]["Category ID"]]] += value(s)
    item = lambda s: f"{prod[s['SKU']]['Product name']} {prod[s['SKU']]['Pack size']}"
    shown = [s for s in stock if s["Location ID"] == "LOC-002"] + [s for s in low if s["Location ID"] != "LOC-002"]
    v["inventory"] = {
        "kpis": [["Stock value", lakh_crore(total_value)], ["SKUs", str(len(prod))], ["Below reorder level", str(len(low))], ["Locations", str(len({s['Location ID'] for s in stock}))]],
        "table": {"title": "Low stock", "cols": ["Item", "Warehouse", "On hand", "Reorder at"], "rows": [[item(s), loc[s["Location ID"]]["Name"].split(",")[0], indian(s["Qty (units)"]), indian(s["Reorder level (units)"])] for s in low[:4]]},
        "cols": ["SKU", "Item", "Warehouse", "On hand", "Reorder at", "Value", "Status"],
        "rows": [[s["SKU"], item(s), loc[s["Location ID"]]["Name"].split(",")[0], indian(s["Qty (units)"]), indian(s["Reorder level (units)"]), lakh_crore(value(s)), "Low stock" if s["Qty (units)"] < s["Reorder level (units)"] else "In stock"] for s in shown],
        "overview": [
            {"type": "kpis", "items": [{"label": "Stock value", "value": lakh_crore(total_value), "note": f"as of {d(stock[0]['As of'])}"}, {"label": "SKUs", "value": str(len(prod))}, {"label": "Below reorder level", "value": str(len(low))}, {"label": "Locations", "value": str(len(val_loc))}]},
            {"w": 5, "type": "donut", "title": "Stock value by location", "center": lakh_crore(total_value), "centerLabel": "on hand", "slices": [{"label": k, "value": round(x), "display": lakh_crore(x)} for k, x in sorted(val_loc.items(), key=lambda x: -x[1])[:6]]},
            {"w": 7, "type": "progress", "title": "Stock vs reorder level", "sub": "Lowest first", "warnBelow": 60, "goal": 100, "items": [{"label": f"{item(s)} · {loc[s['Location ID']]['Name'].split(',')[0]}", "value": round(s["Qty (units)"] / s["Reorder level (units)"] * 100), "right": f"{indian(s['Qty (units)'])} / {indian(s['Reorder level (units)'])}"} for s in low[:5]]},
            {"w": 12, "type": "bars", "title": "Stock value by category", "sub": "৳ lakh", "items": [{"label": k, "value": round(x / 1e5, 1), "display": lakh_crore(x)} for k, x in sorted(val_cat.items(), key=lambda x: -x[1])]},
        ],
    }

    # Procurement
    pos = t["Purchase_Orders"]
    lines = defaultdict(list)
    for l in t["Purchase_Order_Lines"]:
        lines[l["PO ID"]].append(rm[l["RM ID"]]["Material"])
    open_pos = [p for p in pos if p["Status"] != "Received"]
    late = [p for p in open_pos if p["Expected date"] < AS_OF.isoformat()]
    spend_oct = sum(p["Total (BDT)"] for p in pos if month(p["PO date"]) == this_month)
    spend_sup, spend_m = defaultdict(float), defaultdict(float)
    for p in pos:
        spend_sup[sup[p["Supplier ID"]]["Supplier"]] += p["Total (BDT)"]
        spend_m[month(p["PO date"])] += p["Total (BDT)"]
    recent_po = sorted(pos, key=lambda p: (p["PO date"], p["PO ID"]), reverse=True)
    items = lambda p: lines[p["PO ID"]][0] + (f" +{len(lines[p['PO ID']]) - 1}" if len(lines[p["PO ID"]]) > 1 else "")
    v["procurement"] = {
        "kpis": [["Open POs", str(len(open_pos))], ["Spend in October", lakh_crore(spend_oct)], ["Late deliveries", str(len(late))], ["Suppliers", str(len(sups))]],
        "table": {"title": "Purchase orders", "cols": ["PO", "Supplier", "Value", "Status"], "rows": [[p["PO ID"], sup[p["Supplier ID"]]["Supplier"], lakh_crore(p["Total (BDT)"]), p["Status"]] for p in recent_po[:4]]},
        "cols": ["PO", "Supplier", "Items", "Ordered", "Expected", "Value", "Status"],
        "rows": [[p["PO ID"], sup[p["Supplier ID"]]["Supplier"], items(p), d(p["PO date"]), d(p["Expected date"]), lakh_crore(p["Total (BDT)"]), p["Status"]] for p in recent_po[:30]],
        "overview": [
            {"type": "kpis", "items": [{"label": "Spend in October", "value": lakh_crore(spend_oct)}, {"label": "Open POs", "value": str(len(open_pos))}, {"label": "Late deliveries", "value": str(len(late))}, {"label": "Suppliers", "value": str(len(sups))}]},
            {"w": 7, "type": "bars", "horizontal": True, "title": "Spend by supplier", "sub": "July to October", "items": [{"label": k, "value": round(x / 1e5, 1), "display": lakh_crore(x)} for k, x in sorted(spend_sup.items(), key=lambda x: -x[1])[:6]]},
            {"w": 5, "type": "bars", "title": "Spend by month", "sub": "৳ crore · *October to the 25th", "items": [{"label": lab, "value": round(spend_m[m] / 1e7, 2), "display": lakh_crore(spend_m[m])} for m, lab in zip(MONTHS, MLAB)]},
            {"w": 12, "type": "list", "status": True, "title": "Open purchase orders", "rows": [{"label": f"{p['PO ID']} · {sup[p['Supplier ID']]['Supplier']} · {lakh_crore(p['Total (BDT)'])}", "sub": f"{items(p)} · expected {d(p['Expected date'])}", "value": p["Status"]} for p in sorted(open_pos, key=lambda p: p["Expected date"])[:6]]},
        ],
    }

    # Small facts for Ask Brain and the rest of the demo
    v["company"] = {
        "name": "Shapla Foods Ltd",
        "asOf": AS_OF.isoformat(),
        "categories": list(cat.values()),
        "regions": list(region.values()),
        "monthly": [{"label": lab.rstrip("*"), "sales": round(net_by_month[m]), "invoiced": round(inv_m[m]), "collected": round(col_m[m]), "purchases": round(spend_m[m])} for m, lab in zip(MONTHS, MLAB)],
        "salesByRegion": [{"label": r, "value": round(x)} for r, x in sorted(reg_mtd.items(), key=lambda x: -x[1])],
        "salesByCategory": [{"label": k, "value": round(x)} for k, x in sorted(cat_mtd.items(), key=lambda x: -x[1])],
        "topProducts": [{"label": k, "value": round(x)} for k, x in sorted(prod_mtd.items(), key=lambda x: -x[1])[:8]],
        "stockByCategory": [{"label": k, "value": round(x)} for k, x in sorted(val_cat.items(), key=lambda x: -x[1])],
        "headcountByDept": [{"label": k, "value": n} for k, n in by_dept.most_common()],
        "ageing": [{"label": k, "value": round(ageing[k])} for k in ["Not due", "1 to 30", "31 to 60", "61 to 90", "90+"]],
        "production": production_summary(t, prod),
        "regionScorecard": region_scorecard(t, cus, region),
        "orderFunnel": [
            {"label": "Orders placed", "value": len(sos)},
            {"label": "Invoiced", "value": len(invs)},
            {"label": "Paid in part or full", "value": sum(i["Paid (BDT)"] > 0 for i in invs)},
            {"label": "Paid in full", "value": sum(i["Payment status"] == "Paid" for i in invs)},
        ],
        "collectionMethods": [{"label": k, "value": round(x)} for k, x in sorted(collection_methods(t).items(), key=lambda x: -x[1])],
    }
    return v


def region_scorecard(t, cus, region):
    """Each region scored 0 to 100 on five measures, where 100 is the best region on that measure."""
    sales, orders, custs = defaultdict(float), Counter(), defaultdict(set)
    for o in t["Sales_Orders"]:
        r = region[cus[o["Customer ID"]]["Region ID"]]
        sales[r] += o["Net amount (BDT)"]
        orders[r] += 1
        custs[r].add(o["Customer ID"])
    billed, paid, ontime = defaultdict(float), defaultdict(float), defaultdict(lambda: [0, 0])
    for i in t["Invoices"]:
        r = region[cus[i["Customer ID"]]["Region ID"]]
        billed[r] += i["Amount (BDT)"]
        paid[r] += i["Paid (BDT)"]
        ontime[r][1] += 1
        if i["Outstanding (BDT)"] <= 0 or i["Due date"] >= AS_OF.isoformat():
            ontime[r][0] += 1
    raw = {
        r: {
            "Sales": sales[r],
            "Orders": orders[r],
            "Customers": len(custs[r]),
            "Avg. order": sales[r] / orders[r],
            "Collection": paid[r] / billed[r] * 100,
            "On-time payment": ontime[r][0] / ontime[r][1] * 100,
        }
        for r in sales
    }
    metrics = ["Sales", "Orders", "Customers", "Avg. order", "Collection", "On-time payment"]
    best = {m: max(x[m] for x in raw.values()) for m in metrics}
    ranked = sorted(raw, key=lambda r: -raw[r]["Sales"])
    return {
        "metrics": metrics,
        "regions": ranked,
        "scores": {r: {m: round(raw[r][m] / best[m] * 100) for m in metrics} for r in ranked},
        "raw": {r: {m: round(raw[r][m], 1) for m in metrics} for r in ranked},
    }


def collection_methods(t):
    out = defaultdict(float)
    for c in t["Collections"]:
        out[c["Method"]] += c["Amount (BDT)"]
    return out


def production_summary(t, prod):
    mos = [m for m in t["Production_Orders"] if m["Status"] == "Done"]
    by_sku = defaultdict(lambda: [0, 0, 0])
    for m in mos:
        name = f"{prod[m['SKU']]['Product name']} {prod[m['SKU']]['Pack size']}"
        by_sku[name][0] += m["Produced qty"]
        by_sku[name][1] += m["Good qty"]
        by_sku[name][2] += m["Rejected qty"]
    produced = sum(x[0] for x in by_sku.values())
    good = sum(x[1] for x in by_sku.values())
    return {
        "orders": len(mos),
        "produced": produced,
        "yield": round(good / produced * 100, 1),
        "bySku": [{"label": k, "produced": x[0], "yield": round(x[1] / x[0] * 100, 1)} for k, x in sorted(by_sku.items(), key=lambda x: -x[1][0])[:8]],
    }


def build_agent(t):
    """Compact records and pre-computed totals the Shapla chat agent answers from."""
    co = t["Company"]
    prod = {r["SKU"]: r for r in t["Products"]}
    cus = {r["Customer ID"]: r for r in t["Customers"]}
    sales_lines = defaultdict(list)
    for l in t["Sales_Order_Lines"]:
        sales_lines[l["SO ID"]].append(l)
    so_date = {o["SO ID"]: o["Order date"] for o in t["Sales_Orders"]}
    months = ["2026-07", "2026-08", "2026-09", "2026-10"]
    mi = {m: i for i, m in enumerate(months)}
    z = lambda: [0.0] * len(months)
    r0 = lambda x: round(x)

    # per product: net sales, units and cost of goods by month
    pm = defaultdict(lambda: {"net": z(), "qty": z(), "cogs": z()})
    for so, ls in sales_lines.items():
        m = mi[so_date[so][:7]]
        for l in ls:
            p = pm[l["SKU"]]
            p["net"][m] += l["Net (BDT)"]
            p["qty"][m] += l["Qty (units)"]
            p["cogs"][m] += l["Qty (units)"] * prod[l["SKU"]]["Std cost (BDT)"]

    # orders: daily totals, plus totals by customer, officer, depot and status
    daily = defaultdict(lambda: [0.0, 0])
    by_cus = defaultdict(lambda: {"net": z(), "orders": 0, "last": ""})
    by_off = defaultdict(lambda: {"net": z(), "orders": 0})
    by_dep = defaultdict(lambda: {"net": z(), "Delivered": 0, "Invoiced": 0, "Pending": 0})
    pending = []
    for o in t["Sales_Orders"]:
        m = mi[o["Order date"][:7]]
        daily[o["Order date"]][0] += o["Net amount (BDT)"]
        daily[o["Order date"]][1] += 1
        c = by_cus[o["Customer ID"]]
        c["net"][m] += o["Net amount (BDT)"]
        c["orders"] += 1
        c["last"] = max(c["last"], o["Order date"])
        f = by_off[o["Sales officer (Emp ID)"]]
        f["net"][m] += o["Net amount (BDT)"]
        f["orders"] += 1
        dp = by_dep[o["Depot (Location ID)"]]
        dp["net"][m] += o["Net amount (BDT)"]
        dp[o["Status"]] += 1
        if o["Status"] == "Pending":
            pending.append({"id": o["SO ID"], "date": o["Order date"], "cus": o["Customer ID"], "dep": o["Depot (Location ID)"], "total": r0(o["Total (BDT)"])})

    inv = [{"id": i["Invoice ID"], "so": i["SO ID"], "date": i["Invoice date"], "due": i["Due date"], "cus": i["Customer ID"], "amt": r0(i["Amount (BDT)"]), "paid": r0(i["Paid (BDT)"]), "out": r0(i["Outstanding (BDT)"]), "st": i["Payment status"]} for i in t["Invoices"]]
    col = defaultdict(lambda: defaultdict(float))
    for c in t["Collections"]:
        col[c["Receipt date"][:7]][c["Method"]] += c["Amount (BDT)"]

    po_lines = defaultdict(list)
    for l in t["Purchase_Order_Lines"]:
        po_lines[l["PO ID"]].append([l["RM ID"], l["Qty"], l["Unit price (BDT)"]])
    bom = defaultdict(list)
    for b in t["BOM"]:
        bom[b["SKU"]].append([b["RM ID"], b["Qty per unit"]])

    data = {
        "company": {"name": co["Company name"], "industry": co["Industry"], "headOffice": co["Head office"], "factory": co["Factory"], "fiscalYear": co["Fiscal year"].replace(" – ", " to "), "period": "1 Jul to 25 Oct 2026", "asOf": AS_OF.isoformat()},
        "months": ["Jul", "Aug", "Sep", "Oct"],
        "locations": [{"id": r["Location ID"], "name": r["Name"], "type": r["Type"], "division": r["Division"], "district": r["District"]} for r in t["Locations"]],
        "categories": {r["Category ID"]: r["Category"] for r in t["Categories"]},
        "departments": {r["Dept ID"]: r["Department"] for r in t["Departments"]},
        "regions": [{"id": r["Region ID"], "name": r["Region"].replace(" Region", ""), "division": r["Division"], "rsm": r["Regional Sales Manager (Emp ID)"]} for r in t["Regions"]],
        "products": [{"sku": r["SKU"], "name": r["Product name"], "pack": r["Pack size"], "cat": r["Category ID"], "unit": r["Unit"], "perCase": r["Units per case"], "mrp": r["MRP (BDT)"], "tp": r["Trade price (BDT)"], "cost": r["Std cost (BDT)"], "vat": r["VAT % (illustrative)"]} for r in t["Products"]],
        "rawMaterials": [{"id": r["RM ID"], "name": r["Material"], "unit": r["Unit"], "cost": r["Std cost (BDT)"]} for r in t["Raw_Materials"]],
        "suppliers": [{"id": r["Supplier ID"], "name": r["Supplier"], "city": r["City"], "contact": r["Contact person"], "terms": r["Payment terms (days)"]} for r in t["Suppliers"]],
        "bom": bom,
        "employees": [{"id": r["Employee ID"], "name": r["Name"], "gender": r["Gender"], "dept": r["Dept ID"], "title": r["Designation"], "grade": r["Grade"], "loc": r["Location ID"], "join": r["Join date"], "type": r["Employment type"], "gross": r["Gross salary (BDT/month)"], "basic": r["Basic"], "house": r["House rent"], "medical": r["Medical"], "other": r["Conveyance & other"]} for r in t["Employees"]],
        "customers": [{"id": r["Customer ID"], "name": r["Customer"], "type": r["Type"], "division": r["Division"], "area": r["Area / town"], "region": r["Region ID"], "officer": r["Sales officer (Emp ID)"], "contact": r["Contact person"], "credit": r["Credit limit (BDT)"], "terms": r["Credit terms (days)"]} for r in t["Customers"]],
        "productMonthly": {k: {kk: [r0(x) for x in vv] for kk, vv in v.items()} for k, v in pm.items()},
        "daily": [{"date": dd, "net": r0(v[0]), "orders": v[1]} for dd, v in sorted(daily.items())],
        "customerTotals": {k: {"net": [r0(x) for x in v["net"]], "orders": v["orders"], "last": v["last"]} for k, v in by_cus.items()},
        "officerTotals": {k: {"net": [r0(x) for x in v["net"]], "orders": v["orders"]} for k, v in by_off.items()},
        "depotTotals": {k: {"net": [r0(x) for x in v["net"]], "Delivered": v["Delivered"], "Invoiced": v["Invoiced"], "Pending": v["Pending"]} for k, v in by_dep.items()},
        "pendingOrders": sorted(pending, key=lambda x: x["date"]),
        "invoices": inv,
        "collections": {m: {k: r0(x) for k, x in v.items()} for m, v in sorted(col.items())},
        "purchaseOrders": [{"id": p["PO ID"], "date": p["PO date"], "sup": p["Supplier ID"], "to": p["Deliver to"], "st": p["Status"], "total": r0(p["Total (BDT)"]), "exp": p["Expected date"], "lines": po_lines[p["PO ID"]]} for p in t["Purchase_Orders"]],
        "production": [{"id": m["MO ID"], "date": m["Date"], "sku": m["SKU"], "planned": m["Planned qty"], "produced": m["Produced qty"], "good": m["Good qty"], "rejected": m["Rejected qty"], "st": m["Status"]} for m in t["Production_Orders"]],
        "stock": [{"loc": s["Location ID"], "sku": s["SKU"], "qty": s["Qty (units)"], "reorder": s["Reorder level (units)"]} for s in t["Stock_On_Hand"]],
        "accounts": [{"code": a["Account code"], "name": a["Account name"], "type": a["Type"]} for a in t["Chart_of_Accounts"]],
    }
    OUT_AGENT.write_text(
        "// Generated by scripts/import-shapla-seed.py from the Shapla Foods seed workbook. Do not edit by hand.\n"
        "// Compact records and totals the Shapla chat agent (src/lib/shapla-agent.ts) answers from.\n\n"
        f"export const S = {json.dumps(data, ensure_ascii=False, separators=(',', ':'))};\n",
        encoding="utf-8",
    )


def main():
    if len(sys.argv) != 2:
        sys.exit(__doc__)
    sheets = read_workbook(sys.argv[1])
    OUT_DATA.mkdir(parents=True, exist_ok=True)
    tables = {}
    for name, rows in sheets.items():
        if name == "README":
            (OUT_DATA / "README.txt").write_text("\n".join(" | ".join(v for v in r.values() if v) for r in rows) + "\n", encoding="utf-8")
            continue
        if name == "Company":
            tables[name] = {r["A"]: r.get("B", "") for r in rows[1:]}
        else:
            tables[name] = to_records(rows)
        (OUT_DATA / f"{name}.json").write_text(json.dumps(tables[name], ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
    views = build(tables)
    body = json.dumps(views, ensure_ascii=False, indent=2)
    OUT_TS.write_text(
        "// Generated by scripts/import-shapla-seed.py from the Shapla Foods seed workbook. Do not edit by hand.\n"
        "// Fictional company: names, phones (010 prefix) and emails (.test) are dummy.\n\n"
        f"export const shapla = {body};\n",
        encoding="utf-8",
    )
    build_agent(tables)
    print(f"wrote {len(tables)} tables to {OUT_DATA.relative_to(ROOT)} and views to {OUT_TS.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
