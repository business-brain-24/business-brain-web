// Seed data for the demo workspace. Each app picks a layout that suits the work it does.

import { shapla } from "./shapla-seed";

export type Tone = "orange" | "ink" | "green" | "gray";

export type Layout =
  | { kind: "analytics" }
  | { kind: "records"; cols: string[]; rows: string[][]; action: string }
  | { kind: "kanban"; columns: { name: string; cards: { title: string; sub: string; who: string; tag?: string; meta?: string }[] }[]; action: string }
  | { kind: "calendar"; week: string; events: { day: number; start: string; end: string; title: string; where?: string; tone: Tone }[]; side: { title: string; items: [string, string][] } }
  | { kind: "chat"; channels: { name: string; unread?: number; dm?: boolean }[]; active: string; topic: string; messages: { who: string; time: string; text: string; me?: boolean }[] }
  | { kind: "feed"; posts: { who: string; role: string; time: string; title: string; body: string; tag: string; reads: string; comments: number; pinned?: boolean }[]; action: string }
  | { kind: "directory"; groups: string[]; people: { name: string; role: string; group: string; location: string; email: string; phone: string; status?: string }[]; action: string }
  | { kind: "cards"; filters: string[]; items: { title: string; sub: string; group: string; meta: [string, string][]; progress?: number; status?: string }[]; action: string }
  | { kind: "settings"; sections: { title: string; rows: { label: string; desc: string; value: string | boolean }[] }[] };

const P = {
  jubair: "Jubair",
  sadia: "Sadia Islam",
  rafiq: "Rafiq Uddin",
  kamal: "Kamal Hasan",
  nadia: "Nadia Akter",
  tanim: "Tanim Roy",
  shuvo: "Shuvo Das",
  rina: "Rina Begum",
  selim: "Selim Reza",
  farhana: "Farhana Hoque",
  arif: "Arif Khan",
  mim: "Mim Sultana",
};

export const seeds: Record<string, Layout> = {
  // ─── General ───
  announcements: {
    kind: "feed",
    action: "New announcement",
    posts: [
      { who: P.farhana, role: "Head of HR", time: "2h ago", tag: "Holiday", pinned: true, title: "Office schedule for the Durga Puja holidays", body: "Head office and all depots close from 1 to 3 November. The Gazipur plant runs a skeleton crew on the night shift; supervisors have the roster in Shift. Salaries for October will be credited on 30 October, before the break.", reads: "92%", comments: 14 },
      { who: P.sadia, role: "Finance lead", time: "Yesterday", tag: "Policy", title: "New expense policy from 1 November", body: "Meal claims above ৳1,500 now need a receipt photo. Fuel is reimbursed at ৳18/km for personal vehicles. Claims older than 30 days will be returned. Submit everything through the Expenses app.", reads: "78%", comments: 9 },
      { who: P.jubair, role: "Operations manager", time: "3 days ago", tag: "Operations", title: "Line 3 at Gazipur is back to full capacity", body: "Thanks to the maintenance team for turning the extruder repair around in 36 hours. We recovered 92% of the lost output by Thursday. Demand planning has been updated.", reads: "88%", comments: 21 },
      { who: P.kamal, role: "Plant supervisor", time: "Last week", tag: "Safety", title: "Fire drill: Gazipur plant, 5 November at 11:00", body: "All three shifts take part. Assembly point is the north parking yard. Floor wardens, please collect your vests from the security office by Monday.", reads: "95%", comments: 4 },
    ],
  },
  discuss: {
    kind: "chat",
    active: "sales-north",
    topic: "Rangpur, Dinajpur and Bogura distributors",
    channels: [
      { name: "general" }, { name: "sales-north", unread: 4 }, { name: "procurement", unread: 2 }, { name: "factory-floor" }, { name: "finance" },
      { name: P.sadia, dm: true, unread: 1 }, { name: P.kamal, dm: true }, { name: P.nadia, dm: true },
    ],
    messages: [
      { who: P.rafiq, time: "09:12", text: "Morning all. Rangpur depot closed 112% of last week's target 🎉" },
      { who: P.tanim, time: "09:14", text: "Nice. Dinajpur is at 81%: two distributors are waiting on credit limit increases." },
      { who: P.jubair, time: "09:20", text: "Which two? I can ask Sadia to fast-track if their ageing is clean.", me: true },
      { who: P.tanim, time: "09:22", text: "Mollah Traders and Sky Distribution. Both under 30 days outstanding." },
      { who: P.sadia, time: "09:41", text: "Approved both to ৳8 L. They'll see it in the dealer app within the hour." },
      { who: P.rafiq, time: "10:42", text: "Thanks! Also, biscuits 200g are running low at Bogura, can we move stock from Rangpur?" },
    ],
  },
  calendar: {
    kind: "calendar",
    week: "27 Oct to 2 Nov 2026",
    events: [
      { day: 0, start: "09:30", end: "10:00", title: "Daily stand-up", where: "Room 2", tone: "gray" },
      { day: 0, start: "11:00", end: "12:30", title: "Supplier review: Akij Packaging", where: "Online", tone: "orange" },
      { day: 0, start: "14:00", end: "15:00", title: "Budget sign-off", where: "Board room", tone: "ink" },
      { day: 1, start: "09:30", end: "10:00", title: "Daily stand-up", where: "Room 2", tone: "gray" },
      { day: 1, start: "13:00", end: "14:30", title: "Dealer portal demo", where: "Room 1", tone: "green" },
      { day: 2, start: "10:00", end: "12:00", title: "Plant visit: Gazipur", where: "Gazipur", tone: "orange" },
      { day: 2, start: "16:30", end: "17:00", title: "1:1 with Sadia", where: "Room 1", tone: "ink" },
      { day: 3, start: "09:30", end: "10:00", title: "Daily stand-up", where: "Room 2", tone: "gray" },
      { day: 3, start: "11:30", end: "13:00", title: "Q4 sales review", where: "Board room", tone: "ink" },
      { day: 4, start: "15:00", end: "16:00", title: "Interview: Area sales manager", where: "Room 3", tone: "green" },
    ],
    side: { title: "Coming up", items: [["Today 11:00", "Supplier review: Akij"], ["Today 14:00", "Budget sign-off"], ["Tue 13:00", "Dealer portal demo"], ["Wed 10:00", "Plant visit: Gazipur"]] },
  },
  todo: {
    kind: "kanban",
    action: "New task",
    columns: [
      { name: "To do", cards: [
        { title: "Send Q3 report to the board", sub: "Finance", who: P.jubair, tag: "High", meta: "Due tomorrow" },
        { title: "Update winter price list", sub: "Sales", who: P.rafiq, tag: "Low", meta: "Due 28 Oct" },
        { title: "Renew fire licence: Tongi warehouse", sub: "Compliance", who: P.shuvo, tag: "Medium", meta: "Due 5 Nov" },
      ] },
      { name: "In progress", cards: [
        { title: "Approve October payroll", sub: "HR", who: P.jubair, tag: "High", meta: "Due today" },
        { title: "Review PO-2291", sub: "Procurement", who: P.nadia, tag: "Medium", meta: "Due today" },
      ] },
      { name: "Waiting", cards: [{ title: "Bank guarantee for City Sugar", sub: "Finance", who: P.sadia, tag: "Medium", meta: "With bank" }] },
      { name: "Done", cards: [
        { title: "Line 3 maintenance sign-off", sub: "Production", who: P.kamal, meta: "Done 24 Oct" },
        { title: "Dealer credit limits: north", sub: "Sales", who: P.sadia, meta: "Done 25 Oct" },
      ] },
    ],
  },
  contacts: {
    kind: "directory",
    action: "Add contact",
    groups: shapla.contacts.groups,
    people: shapla.contacts.people,
  },
  crm: {
    kind: "kanban",
    action: "New deal",
    columns: [
      { name: "Qualified", cards: [
        { title: "Meghna Logistics", sub: "Fleet & depot ERP", who: P.nadia, tag: "৳ 21 L", meta: "Next: discovery call" },
        { title: "Bengal Plastics", sub: "Manufacturing", who: P.rafiq, tag: "৳ 18 L", meta: "Next: site visit" },
      ] },
      { name: "Demo", cards: [{ title: "Apex Footwear", sub: "Retail + POS, 60 stores", who: P.kamal, tag: "৳ 35 L", meta: "Demo Tue 13:00" }] },
      { name: "Proposal", cards: [
        { title: "Shwapno: 40 outlets", sub: "POS & inventory", who: P.rafiq, tag: "৳ 48 L", meta: "Sent 22 Oct" },
        { title: "Square Toiletries", sub: "Distribution", who: P.tanim, tag: "৳ 26 L", meta: "Sent 20 Oct" },
      ] },
      { name: "Negotiation", cards: [{ title: "Akij Food ERP", sub: "Full suite, 3 plants", who: P.sadia, tag: "৳ 72 L", meta: "Legal review" }] },
      { name: "Won", cards: [{ title: "Unimart", sub: "Retail", who: P.rafiq, tag: "৳ 15 L", meta: "Closed 18 Oct" }] },
    ],
  },
  project: {
    kind: "kanban",
    action: "New project",
    columns: [
      { name: "Planning", cards: [{ title: "Chattogram depot automation", sub: "Q1 2027", who: P.shuvo, tag: "12%", meta: "Scoping" }] },
      { name: "In progress", cards: [
        { title: "Gazipur plant expansion", sub: "Line 4 and cold room", who: P.kamal, tag: "64%", meta: "Due Dec 2026" },
        { title: "Dealer portal", sub: "Self-serve orders", who: P.tanim, tag: "82%", meta: "Due Nov 2026" },
      ] },
      { name: "At risk", cards: [{ title: "New warehouse WMS", sub: "Tongi", who: P.nadia, tag: "41%", meta: "2 weeks behind" }] },
      { name: "Done", cards: [{ title: "Payroll migration", sub: "From spreadsheets", who: P.farhana, tag: "100%", meta: "Live 1 Oct" }] },
    ],
  },
  website: { kind: "analytics" },
  events: {
    kind: "cards",
    action: "New event",
    filters: ["Upcoming", "Past"],
    items: [
      { title: "Dealer meet 2026", sub: "Radisson Blu, Dhaka", group: "Upcoming", meta: [["Date", "2 Nov"], ["Registered", "142 / 180"]], progress: 79, status: "Open" },
      { title: "Safety training", sub: "Gazipur plant", group: "Upcoming", meta: [["Date", "5 Nov"], ["Registered", "60 / 60"]], progress: 100, status: "Open" },
      { title: "Annual sports day", sub: "Army Stadium", group: "Upcoming", meta: [["Date", "14 Nov"], ["Registered", "96 / 250"]], progress: 38, status: "Open" },
      { title: "Year-end party", sub: "Head office rooftop", group: "Upcoming", meta: [["Date", "28 Dec"], ["Registered", "20 / 400"]], progress: 5, status: "Scheduled" },
      { title: "Eid get-together", sub: "Head office", group: "Past", meta: [["Date", "Jun 2026"], ["Attended", "312"]], progress: 100, status: "Completed" },
      { title: "Distributor summit: north", sub: "Rangpur", group: "Past", meta: [["Date", "Aug 2026"], ["Attended", "86"]], progress: 100, status: "Completed" },
    ],
  },
  apps: {
    kind: "cards",
    action: "Browse marketplace",
    filters: ["Installed", "Integrations"],
    items: [
      { title: "Payroll", sub: "v4.2 · 18 users", group: "Installed", meta: [["Last update", "12 Oct"], ["Owner", "HR"]], status: "Up to date" },
      { title: "Inventory", sub: "v3.9 · 64 users", group: "Installed", meta: [["Last update", "2 Sep"], ["Owner", "Warehouse"]], status: "Update available" },
      { title: "CRM", sub: "v5.1 · 41 users", group: "Installed", meta: [["Last update", "20 Oct"], ["Owner", "Sales"]], status: "Up to date" },
      { title: "Gate Pass", sub: "v1.4 · 22 users", group: "Installed", meta: [["Last update", "1 Aug"], ["Owner", "Security"]], status: "Update available" },
      { title: "bKash", sub: "Collections & payouts", group: "Integrations", meta: [["Status", "Connected"], ["Since", "Mar 2026"]], status: "Active" },
      { title: "NBR e-VAT", sub: "Mushak 6.3 returns", group: "Integrations", meta: [["Status", "Connected"], ["Since", "Jan 2026"]], status: "Active" },
      { title: "City Bank BEFTN", sub: "Salary disbursement", group: "Integrations", meta: [["Status", "Connected"], ["Since", "Oct 2026"]], status: "Active" },
      { title: "ChatGPT & Claude (MCP)", sub: "Ask your ERP from any AI", group: "Integrations", meta: [["Status", "Connected"], ["Since", "Sep 2026"]], status: "Active" },
    ],
  },
  settings: {
    kind: "settings",
    sections: [
      { title: "Company", rows: [
        { label: "Legal name", desc: "Shown on invoices and Mushak forms", value: "Brain Foods Ltd." },
        { label: "BIN", desc: "Business identification number", value: "000123456-0101" },
        { label: "Fiscal year", desc: "Used for budgets and reports", value: "July to June" },
        { label: "Base currency", desc: "All amounts are stored in this currency", value: "BDT (৳)" },
      ] },
      { title: "Security", rows: [
        { label: "Two-factor sign-in", desc: "Required for everyone with finance access", value: true },
        { label: "Sign out idle users", desc: "After 30 minutes without activity", value: true },
        { label: "Allow sign-in outside Bangladesh", desc: "Blocks foreign IPs unless approved", value: false },
      ] },
      { title: "Notifications", rows: [
        { label: "Daily summary email", desc: "Sales, stock and cash at 08:00", value: true },
        { label: "SMS for approvals", desc: "Payroll, POs and expenses above ৳50,000", value: true },
        { label: "Weekly AI digest", desc: "Brain AI highlights what changed", value: false },
      ] },
    ],
  },

  // ─── HRMS ───
  "hr-dashboard": { kind: "analytics" },
  users: {
    kind: "directory",
    action: "Invite user",
    groups: ["Admins", "Managers", "Staff"],
    people: [
      { name: P.jubair, role: "Operations manager", group: "Managers", location: "Head office", email: "jubair@brainfoods.com.bd", phone: "+880 1711-000101", status: "Active" },
      { name: P.sadia, role: "Finance lead", group: "Managers", location: "Head office", email: "sadia@brainfoods.com.bd", phone: "+880 1711-000102", status: "Active" },
      { name: P.farhana, role: "HR admin", group: "Admins", location: "Head office", email: "farhana@brainfoods.com.bd", phone: "+880 1711-000103", status: "Active" },
      { name: P.rafiq, role: "Sales manager", group: "Managers", location: "Rangpur", email: "rafiq@brainfoods.com.bd", phone: "+880 1711-000104", status: "Active" },
      { name: P.kamal, role: "Plant supervisor", group: "Staff", location: "Gazipur", email: "kamal@brainfoods.com.bd", phone: "+880 1711-000105", status: "Active" },
      { name: P.arif, role: "IT admin", group: "Admins", location: "Head office", email: "arif@brainfoods.com.bd", phone: "+880 1711-000106", status: "Pending" },
      { name: P.nadia, role: "Procurement officer", group: "Staff", location: "Head office", email: "nadia@brainfoods.com.bd", phone: "+880 1711-000107", status: "Active" },
      { name: P.shuvo, role: "Warehouse lead", group: "Staff", location: "Tongi", email: "shuvo@brainfoods.com.bd", phone: "+880 1711-000108", status: "Active" },
    ],
  },
  movement: {
    kind: "records",
    action: "Request movement",
    cols: ["Employee", "Destination", "Purpose", "Out", "Back", "Status"],
    rows: [
      ["Rafiq Uddin", "Rangpur dealers", "Collection", "08:30", "17:00", "Approved"],
      ["Nadia Akter", "Akij office, Tejgaon", "Supplier meeting", "10:00", "13:00", "Approved"],
      ["Tanim Roy", "City Bank, Motijheel", "Bank guarantee", "11:15", "Not yet", "Pending"],
      ["Shuvo Das", "Chattogram port", "Container release", "07:00", "Not yet", "Approved"],
      ["Selim Reza", "BSTI office", "Licence renewal", "12:00", "Not yet", "Pending"],
      ["Mim Sultana", "Gazipur plant", "Training", "09:00", "16:00", "Approved"],
      ["Arif Khan", "Data centre, Mohakhali", "Server maintenance", "14:00", "Not yet", "Rejected"],
    ],
  },
  shift: {
    kind: "calendar",
    week: "Gazipur plant · 27 Oct to 2 Nov",
    events: [0, 1, 2, 3, 4, 5, 6].flatMap((d) => [
      { day: d, start: "06:00", end: "14:00", title: d % 2 ? "Morning · Kamal" : "Morning · Rina", where: "112 staff", tone: "orange" as Tone },
      { day: d, start: "14:00", end: "22:00", title: d % 2 ? "Evening · Rina" : "Evening · Kamal", where: "100 staff", tone: "ink" as Tone },
    ]),
    side: { title: "Swap requests", items: [["Tanim → Selim", "Tue evening"], ["Mim → Rina", "Thu morning"], ["Shuvo → Kamal", "Sat evening"], ["Arif → Selim", "Sun morning"]] },
  },
  elearning: {
    kind: "cards",
    action: "New course",
    filters: ["My courses", "Catalogue"],
    items: [
      { title: "Workplace safety", sub: "45 min · 6 lessons", group: "My courses", meta: [["Enrolled", "212"], ["Due", "5 Nov"]], progress: 100, status: "Completed" },
      { title: "Using Business Brain", sub: "50 min · 8 lessons", group: "My courses", meta: [["Enrolled", "180"], ["Due", "15 Nov"]], progress: 62, status: "Active" },
      { title: "VAT basics for managers", sub: "1h 20m · 10 lessons", group: "My courses", meta: [["Enrolled", "64"], ["Due", "30 Nov"]], progress: 20, status: "Active" },
      { title: "Customer service", sub: "1h · 7 lessons", group: "Catalogue", meta: [["Enrolled", "96"], ["Rating", "4.7"]] },
      { title: "Food hygiene (HACCP)", sub: "2h · 12 lessons", group: "Catalogue", meta: [["Enrolled", "148"], ["Rating", "4.8"]] },
      { title: "Leading a shift", sub: "1h 30m · 9 lessons", group: "Catalogue", meta: [["Enrolled", "38"], ["Rating", "4.6"]] },
    ],
  },
  surveys: {
    kind: "cards",
    action: "New survey",
    filters: ["Open", "Closed"],
    items: [
      { title: "Employee engagement 2026", sub: "24 questions · anonymous", group: "Open", meta: [["Responses", "248 / 412"], ["Closes", "31 Oct"]], progress: 60, status: "Open" },
      { title: "Canteen feedback", sub: "6 questions", group: "Open", meta: [["Responses", "52 / 214"], ["Closes", "26 Oct"]], progress: 24, status: "Open" },
      { title: "Training needs", sub: "10 questions · managers", group: "Open", meta: [["Responses", "18 / 40"], ["Closes", "5 Nov"]], progress: 45, status: "Open" },
      { title: "Pulse: September", sub: "5 questions", group: "Closed", meta: [["Responses", "301"], ["eNPS", "+32"]], progress: 100, status: "Completed" },
      { title: "Transport survey", sub: "8 questions", group: "Closed", meta: [["Responses", "276"], ["Result", "2 new routes"]], progress: 100, status: "Completed" },
    ],
  },
  employees: {
    kind: "directory",
    action: "Add employee",
    groups: shapla.employees.groups,
    people: shapla.employees.people,
  },
  payroll: {
    kind: "records",
    action: "Run payroll",
    cols: shapla.payroll.cols,
    rows: shapla.payroll.rows,
  },
  attendance: {
    kind: "records",
    action: "Export register",
    cols: ["Employee", "Shift", "In", "Out", "Hours", "Status"],
    rows: [
      ["Kamal Hasan", "Morning", "05:52", "Not yet", "4h 40m", "Present"],
      ["Rina Begum", "Morning", "None", "None", "None", "On leave"],
      ["Sadia Islam", "Office", "09:04", "Not yet", "1h 28m", "Present"],
      ["Tanim Roy", "Office", "09:41", "Not yet", "0h 51m", "Late"],
      ["Shuvo Das", "Office", "08:55", "Not yet", "1h 37m", "Present"],
      ["Mim Sultana", "Office", "None", "None", "None", "Absent"],
      ["Selim Reza", "Night", "21:58", "06:04", "8h 06m", "Present"],
      ["Nadia Akter", "Office", "09:12", "Not yet", "1h 20m", "Late"],
    ],
  },
  recruitment: {
    kind: "kanban",
    action: "New position",
    columns: [
      { name: "Applied", cards: [
        { title: "Mahfuz Rahman", sub: "Accountant", who: P.sadia, meta: "BBA, 3 yrs" },
        { title: "Sumaiya Khan", sub: "Machine operator", who: P.kamal, meta: "2 yrs, Pran" },
        { title: "Rakib Hasan", sub: "Area sales manager", who: P.rafiq, meta: "5 yrs, Square" },
      ] },
      { name: "Interview", cards: [
        { title: "Tahmina Akter", sub: "Area sales manager", who: P.rafiq, tag: "Fri 15:00", meta: "Round 2" },
        { title: "Jahid Hossain", sub: "Warehouse lead", who: P.shuvo, tag: "Mon 11:00", meta: "Round 1" },
      ] },
      { name: "Offer", cards: [{ title: "Nasir Uddin", sub: "Machine operator", who: P.kamal, tag: "৳ 24,000", meta: "Sent 23 Oct" }] },
      { name: "Hired", cards: [{ title: "Arif Khan", sub: "IT admin", who: P.farhana, meta: "Joins 27 Oct" }] },
    ],
  },
  leave: {
    kind: "calendar",
    week: "Team leave · 27 Oct to 2 Nov",
    events: [
      { day: 0, start: "08:00", end: "18:00", title: "Rina Begum · Sick", tone: "gray" },
      { day: 0, start: "08:00", end: "18:00", title: "Nadia Akter · Casual", tone: "orange" },
      { day: 1, start: "08:00", end: "18:00", title: "Nadia Akter · Casual", tone: "orange" },
      { day: 2, start: "08:00", end: "13:00", title: "Shuvo Das · Half day", tone: "ink" },
      { day: 5, start: "08:00", end: "18:00", title: "Tanim Roy · Annual", tone: "green" },
      { day: 6, start: "08:00", end: "18:00", title: "Tanim Roy · Annual", tone: "green" },
    ],
    side: { title: "Your balance", items: [["Annual", "11 of 20 days"], ["Casual", "6 of 10 days"], ["Sick", "12 of 14 days"], ["Pending requests", "2"]] },
  },
  expenses: {
    kind: "records",
    action: "New claim",
    cols: ["Claim", "Employee", "Category", "Date", "Amount", "Status"],
    rows: [
      ["EXP-3381", "Rafiq Uddin", "Travel: Rangpur", "22 Oct", "৳ 12,400", "Pending"],
      ["EXP-3380", "Nadia Akter", "Supplier lunch", "21 Oct", "৳ 2,150", "Approved"],
      ["EXP-3378", "Shuvo Das", "Fuel", "20 Oct", "৳ 6,800", "Pending"],
      ["EXP-3375", "Sadia Islam", "Training fee", "18 Oct", "৳ 18,000", "Reimbursed"],
      ["EXP-3371", "Tanim Roy", "Mobile bill", "15 Oct", "৳ 1,200", "Reimbursed"],
      ["EXP-3369", "Kamal Hasan", "Tools", "14 Oct", "৳ 4,750", "Rejected"],
      ["EXP-3366", "Selim Reza", "Night meals", "12 Oct", "৳ 3,300", "Approved"],
    ],
  },

  // ─── Operational ───
  "purchase-requisition": {
    kind: "kanban",
    action: "New requisition",
    columns: [
      { name: "Draft", cards: [{ title: "PR-1186 · Cleaning chemicals", sub: "Gazipur plant", who: P.rina, tag: "৳ 38,000" }] },
      { name: "Awaiting approval", cards: [
        { title: "PR-1184 · Packaging film 20 rolls", sub: "Gazipur plant", who: P.kamal, tag: "৳ 4.6 L", meta: "Needs you" },
        { title: "PR-1181 · Safety boots × 40", sub: "Warehouse", who: P.rina, tag: "৳ 86,000", meta: "Needs you" },
      ] },
      { name: "Approved", cards: [{ title: "PR-1183 · Forklift service", sub: "Tongi", who: P.shuvo, tag: "৳ 1.2 L" }] },
      { name: "Converted to PO", cards: [{ title: "PR-1179 · Flour 50kg × 400", sub: "Gazipur plant", who: P.kamal, tag: "৳ 9.4 L", meta: "PO-2290" }] },
    ],
  },
  demand: { kind: "analytics" },
  sales: { kind: "analytics" },
  dashboards: { kind: "analytics" },
  campaigns: {
    kind: "cards",
    action: "New campaign",
    filters: ["Running", "Scheduled", "Ended"],
    items: [
      { title: "Winter snacks", sub: "Facebook + Instagram", group: "Running", meta: [["Leads", "312"], ["Spend", "৳ 2.1 L"]], progress: 64, status: "Running" },
      { title: "Dealer bonus Q4", sub: "SMS to 1,240 dealers", group: "Running", meta: [["Leads", "128"], ["Spend", "৳ 38,000"]], progress: 40, status: "Running" },
      { title: "New juice launch", sub: "YouTube pre-roll", group: "Scheduled", meta: [["Starts", "4 Nov"], ["Budget", "৳ 3.5 L"]], progress: 0, status: "Scheduled" },
      { title: "Eid offer", sub: "TV + digital", group: "Ended", meta: [["Leads", "402"], ["ROI", "3.4×"]], progress: 100, status: "Completed" },
    ],
  },
  "gate-pass": {
    kind: "records",
    action: "Issue gate pass",
    cols: ["Pass", "Type", "Vehicle / visitor", "Gate", "Time", "Status"],
    rows: [
      ["GP-5521", "Goods out", "Dhaka Metro-Ta 11-2034", "Gate 2", "08:12", "Exited"],
      ["GP-5522", "Visitor", "Akij Packaging: 2 persons", "Gate 1", "09:40", "Pending"],
      ["GP-5523", "Goods in", "Chatta Metro-Ma 14-8890", "Gate 2", "10:05", "Pending"],
      ["GP-5524", "Returnable", "Pallet jack × 2", "Gate 3", "10:30", "Approved"],
      ["GP-5525", "Goods out", "Dhaka Metro-Na 18-5512", "Gate 2", "11:02", "Exited"],
      ["GP-5526", "Visitor", "BSTI inspector", "Gate 1", "11:45", "Approved"],
    ],
  },
  procurement: {
    kind: "records",
    action: "New purchase order",
    cols: shapla.procurement.cols,
    rows: shapla.procurement.rows,
  },
  timesheets: {
    kind: "records",
    action: "Log time",
    cols: ["Employee", "Project", "Mon", "Tue", "Wed", "Thu", "Total", "Status"],
    rows: [
      ["Tanim Roy", "Dealer portal", "9", "10", "9", "9", "46h", "Pending"],
      ["Nadia Akter", "WMS rollout", "8", "8", "8", "8", "40h", "Pending"],
      ["Shuvo Das", "Warehouse", "10", "11", "10", "11", "52h", "Pending"],
      ["Rina Begum", "Plant expansion", "8", "7", "8", "8", "38h", "Approved"],
      ["Arif Khan", "Dealer portal", "8", "9", "8", "9", "42h", "Approved"],
    ],
  },
  purchase: {
    kind: "records",
    action: "Record bill",
    cols: ["Bill", "Supplier", "PO", "Due", "Amount", "Status"],
    rows: [
      ["BILL-882", "Meghna Flour Mills", "PO-2290", "27 Oct", "৳ 42.0 L", "Pending"],
      ["BILL-879", "Akij Packaging", "PO-2291", "29 Oct", "৳ 18.6 L", "Pending"],
      ["BILL-874", "Titas Gas", "PO-2283", "30 Oct", "৳ 3.4 L", "Pending"],
      ["BILL-871", "City Sugar", "PO-2288", "2 Nov", "৳ 9.8 L", "Pending"],
      ["BILL-866", "Bashundhara Paper", "PO-2285", "18 Oct", "৳ 6.2 L", "Paid"],
      ["BILL-861", "ACI Chemicals", "PO-2280", "15 Oct", "৳ 1.9 L", "Paid"],
    ],
  },
  inventory: {
    kind: "records",
    action: "Stock adjustment",
    cols: shapla.inventory.cols,
    rows: shapla.inventory.rows,
  },

  // ─── Other ───
  onboarding: {
    kind: "kanban",
    action: "Start onboarding",
    columns: [
      { name: "Pre-joining", cards: [
        { title: "Mim Sultana", sub: "HR executive · joins 1 Nov", who: P.farhana, tag: "2/10", meta: "Documents pending" },
        { title: "Lina Das", sub: "QC officer · joins 3 Nov", who: P.kamal, tag: "1/10", meta: "Offer signed" },
      ] },
      { name: "First week", cards: [{ title: "Arif Khan", sub: "IT admin · joined 27 Oct", who: P.farhana, tag: "6/10", meta: "Laptop issued" }] },
      { name: "Offboarding", cards: [{ title: "Habib Rahman", sub: "Accountant · last day 31 Oct", who: P.sadia, tag: "5/8", meta: "Return laptop, ID card" }] },
      { name: "Done", cards: [{ title: "Nasrin Akter", sub: "Sales officer", who: P.rafiq, tag: "10/10", meta: "Completed 20 Oct" }] },
    ],
  },
  invoicing: {
    kind: "records",
    action: "New invoice",
    cols: shapla.invoicing.cols,
    rows: shapla.invoicing.rows,
  },
  "hr-reporting": { kind: "analytics" },
};
