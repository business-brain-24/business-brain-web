Shapla Foods Ltd — seed data for Business Brain 24
Fictional FMCG company in Bangladesh. All names, phones (010 prefix, not allocated in BD), emails (.test) and barcodes are dummy.
Period: 1 Jul – 25 Oct 2026 (Fridays off). Currency BDT. VAT % and salary split (basic 50%, house rent 25%, medical 10%) are illustrative, not tax or labour advice.
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
  Sales_Orders | SO ID · 1187
  Sales_Order_Lines | SO ID + Line · 6449
  Invoices | Invoice ID · 1118 → SO ID
  Collections | Receipt ID · 903 → Invoice ID
  Purchase_Orders | PO ID · 140
  Purchase_Order_Lines | PO ID + Line · 337
  Production_Orders | MO ID · 90
  Stock_On_Hand | Location + SKU · 468
  Chart_of_Accounts | Account code · 30
