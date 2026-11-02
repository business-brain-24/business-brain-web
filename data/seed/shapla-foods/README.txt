Shapla Foods Ltd — seed data for Business Brain 24
Fictional FMCG company in Bangladesh. All names, phones (010 prefix, not allocated in BD), emails (.test) and barcodes are dummy.
Period: 1 Jul – 5 Nov 2026 (Fridays off). Currency BDT. VAT % and salary split (basic 50%, house rent 25%, medical 10%) are illustrative, not tax or labour advice.
Tables and keys:
  Company | —
  Locations | Location ID
  Categories | Category ID
  Products | SKU · 52 SKUs
  Raw_Materials | RM ID · 20
  Suppliers | Supplier ID · 18
  BOM | SKU → RM ID
  Departments | Dept ID
  Employees | Employee ID · 112
  Regions | Region ID → Employee ID
  Customers | Customer ID · 120 → Region, Sales officer
  Sales_Orders | SO ID · 1309
  Sales_Order_Lines | SO ID + Line · 7082
  Invoices | Invoice ID · 1237
  Collections | Receipt ID · 1013
  Purchase_Orders | PO ID · 150
  Purchase_Order_Lines | PO ID + Line · 353
  Production_Orders | MO ID · 105
  Stock_On_Hand | Location + SKU · 468
  Chart_of_Accounts | Account code · 30
Extension to 5 Nov 2026 (prepared 2 Nov 2026):
  Added 26 Oct to 5 Nov (Fridays off): new sales orders, lines, invoices, receipts, purchase orders and production orders, built from the patterns already in this file.
  Rolled forward records that were still open on 25 Oct: most pending and invoiced orders are now delivered, planned production is done, due POs are received.
  Invoices that fell due 26 Oct to 5 Nov were settled on the due date (about 88% paid, 5% half paid, 7% left unpaid); invoices already overdue on 25 Oct were left as they were.
  Stock_On_Hand is now as of 5 Nov: deliveries taken out of depots, finished production added to the central warehouse, depots topped up from it when below reorder level (not every time, so some SKUs sit below reorder).
  Demo hook: a 12,000 kg palm oil PO is waiting for approval (dated 4 Nov) for the procurement agent story.
