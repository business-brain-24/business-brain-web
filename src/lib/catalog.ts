// Full module catalogue shown on /products: every module and sub-module in the
// Betopia ERP and in the Akboria rollout, each with a short description.

export type SubModule = { name: string; desc: string; status?: "Live" | "In progress"; href?: string };
export type Module = { name: string; desc: string; subs: SubModule[] };
export type Catalogue = { id: string; name: string; tagline: string; modules: Module[] };

const betopia: Catalogue = {
  id: "betopia",
  name: "Betopia ERP",
  tagline: "The full Business Brain 24 suite as Betopia runs it: 55 apps across operations, people, everyday collaboration and specialised work.",
  modules: [
    {
      name: "Operational",
      desc: "The daily run of the business — selling, buying, stock, money and the dashboards that tie them together. Every transaction posts once and shows up everywhere it matters.",
      subs: [
        { name: "B2B Sales", href: "/products/sales", desc: "Quotations, orders and invoices for distributors and corporate buyers, with credit limits and price lists per customer." },
        { name: "Sales", href: "/products/sales", desc: "Orders, delivery and invoicing across every channel, with targets and achievement tracked by rep and region." },
        { name: "Pre Sale", desc: "Track enquiries, samples and site visits before an order exists, so nothing falls between marketing and sales." },
        { name: "Purchase Requisition", href: "/products/procurement", desc: "Departments raise requests, managers approve by budget and amount, and approved lines turn into purchase orders." },
        { name: "Purchase", href: "/products/procurement", desc: "Purchase orders, goods receipt and supplier bills matched three ways before anything is paid." },
        { name: "Inventory", href: "/products/inventory", desc: "Stock by warehouse, batch and expiry, with transfers, reorder levels and valuation that feeds accounting." },
        { name: "Accounting", href: "/products/accounting", desc: "General ledger, VAT and TDS, bank reconciliation and live profit and loss by branch or cost centre." },
        { name: "Operation", desc: "Day-to-day operational tasks and checklists for each site, with owners, due times and escalation." },
        { name: "Product Lab", desc: "Develop new products: recipes, specifications, trial batches and costing before launch." },
        { name: "Frontdesk", desc: "Visitor check-in, badges and host notifications at reception." },
        { name: "Gate Pass", desc: "Goods in, goods out, returnable items and visitor passes logged at the gate with approvals." },
        { name: "Timesheets", desc: "Hours logged against projects and tasks, approved weekly and ready for billing or costing." },
        { name: "KPI & Bonus", desc: "Set KPIs per role, track them from live data and calculate bonuses automatically." },
        { name: "Campaign Management", desc: "Plan marketing and trade campaigns, track spend, leads and return on each channel." },
        { name: "Nexus Partner", desc: "Manage channel partners — onboarding, agreements, orders and commissions in one place." },
        { name: "Analytics Dashboard", desc: "Drill-down analytics on sales, stock and margin, built from the same live record." },
        { name: "Dashboards", desc: "Role-based management dashboards that refresh live, from CEO overview to plant output." },
      ],
    },
    {
      name: "HRMS",
      desc: "Everything about your people, from hiring to payslip. Attendance, leave and expenses flow straight into payroll, and payroll posts straight to the ledger.",
      subs: [
        { name: "Dashboard", desc: "Headcount, attendance, attrition and open roles at a glance for HR and managers." },
        { name: "Employees", href: "/products/hrms", desc: "Employee records, documents, contracts, reporting lines and full job history." },
        { name: "Users", desc: "System accounts, roles and permissions, with two-factor sign-in and access reviews." },
        { name: "Recruitment", desc: "Job openings, applicants, interviews and offers, from Bdjobs posting to first day." },
        { name: "Attendances", href: "/products/attendance", desc: "Check-in from devices, mobile GPS or biometric machines, with late and absent tracking." },
        { name: "Shift", desc: "Rosters for morning, evening and night shifts, with swap requests and coverage alerts." },
        { name: "Leave", href: "/products/attendance", desc: "Leave requests, approvals and balances by type, following your leave policy." },
        { name: "Movement", desc: "Out-of-office duty requests and approvals, so managers know who is in the field and why." },
        { name: "Payroll", href: "/products/payroll", desc: "Salary, allowances, overtime, tax and bank transfer files, run in hours instead of days." },
        { name: "Advance Salary", desc: "Employees request advances; approved amounts are recovered from future salaries automatically." },
        { name: "Expenses", desc: "Expense claims with receipt photos, policy checks, approvals and reimbursement." },
        { name: "eLearning", desc: "Courses, quizzes and certificates for onboarding, safety and compliance training." },
        { name: "Surveys", desc: "Engagement and pulse surveys, anonymous where needed, with results by team." },
      ],
    },
    {
      name: "General",
      desc: "Shared tools every team uses every day — communication, planning, documents and records — all connected to the same people and data.",
      subs: [
        { name: "Discuss", desc: "Team channels and direct messages, with records and documents linked into the conversation." },
        { name: "To-do", desc: "Personal and assigned tasks with due dates, priorities and reminders." },
        { name: "Calendar", desc: "Meetings, rooms and schedules shared across the company." },
        { name: "Contacts", desc: "One address book for customers, suppliers, vendors and partners." },
        { name: "CRM", href: "/products/crm", desc: "Leads, deals and pipeline stages, with follow-ups and win rates by rep." },
        { name: "Project", href: "/products/projects", desc: "Projects, tasks, milestones and budgets, with progress and hours tracked live." },
        { name: "Documents", desc: "Store, share and approve documents with version history and access control." },
        { name: "Spreadsheets", desc: "Spreadsheets that pull live ERP data, for analysis without exporting." },
        { name: "Query Deluxe", desc: "Run saved queries on your data and share the results as tables or charts." },
        { name: "Profile", desc: "Each employee's personal profile, preferences and self-service details." },
        { name: "Profile Database", desc: "A searchable database of people and profiles across the organisation." },
        { name: "Website", desc: "Company website pages, forms and lead capture connected to CRM." },
        { name: "Announcements", desc: "Company-wide notices with read tracking and acknowledgement." },
        { name: "Events", desc: "Internal and external events with registration, capacity and check-in." },
        { name: "Apps", desc: "Install, update and manage apps and integrations such as bKash, NBR e-VAT and banks." },
        { name: "Settings", desc: "Company details, fiscal year, security, notifications and system preferences." },
      ],
    },
    {
      name: "Other apps",
      desc: "Specialised apps for service, partners, sales desks and the shop floor — added when a team needs them, already connected to everything else.",
      subs: [
        { name: "Manufacturing", href: "/products/manufacturing", desc: "Bills of materials, production orders, batches and shop-floor output with costing." },
        { name: "Helpdesk", desc: "Customer and internal support tickets with SLAs, assignment and history." },
        { name: "Security Center", desc: "Security alerts, access logs and policy checks across the system." },
        { name: "PMO Leads", desc: "Project management office pipeline: incoming project leads, scoping and approval." },
        { name: "Partner Portal Sales", desc: "A portal where partners place orders, track deliveries and see statements." },
        { name: "Betopia Sales Desk", desc: "A focused desk for the inside sales team to quote, follow up and close." },
        { name: "Betopia Voice", desc: "Call logging and voice notes tied to customers and deals." },
        { name: "Level Bonus", desc: "Tiered bonus schemes by level or slab, calculated from achievement data." },
        { name: "Meeting Rooms", desc: "Book meeting rooms and equipment, with availability shown live." },
      ],
    },
  ],
};

const akboria: Catalogue = {
  id: "akboria",
  name: "Akboria ERP",
  tagline: "Built for Akboria, a sweets and food brand since 1911: field sales, showrooms, central store, production and procurement on one system.",
  modules: [
    {
      name: "Sales Demand and SR Field Management",
      desc: "Runs the field force from head office to every shop. Sales reps take orders on mobile, managers plan beats and targets, and collections settle invoices automatically.",
      subs: [
        { name: "Customer, shop, dealer and partner management", status: "Live", desc: "One record for every shop, dealer and partner, with territory, credit terms and history." },
        { name: "Sales force hierarchy and role management", status: "Live", desc: "NSM, ASM and SR structure with territories, so every order and target rolls up correctly." },
        { name: "Field sales and order management", status: "Live", desc: "SRs take orders in the shop on mobile; orders reach the dealer and store instantly." },
        { name: "Multi-unit order processing", status: "Live", desc: "Order in pieces, boxes or cartons; units convert automatically for stock and pricing." },
        { name: "Credit exception approval", status: "Live", desc: "Orders above a shop's credit limit go to the right manager for approval before dispatch." },
        { name: "SR shop visit tracking with GPS", status: "Live", desc: "Every shop visit is logged with GPS and time, so managers see real coverage." },
        { name: "Daily beat and route planning", status: "Live", desc: "Plan which shops each SR visits each day and track the route against the plan." },
        { name: "ASM–SR instruction messaging", status: "Live", desc: "Area managers send instructions to their SRs and see when they are read." },
        { name: "Sales targets and achievement tracking", status: "Live", desc: "Targets by SR, product and territory, with achievement updated as orders come in." },
        { name: "Sales policy engine", status: "Live", desc: "Pricing, discount and eligibility rules applied automatically to every order." },
        { name: "Trade offers and product flags", status: "Live", desc: "Run trade offers and flag focus or new products so SRs push the right items." },
        { name: "Cash and online collection", status: "Live", desc: "Collect payments in cash or online in the field, with receipts issued on the spot." },
        { name: "FIFO invoice settlement", status: "Live", desc: "Collections settle the oldest invoices first, keeping dealer ledgers clean." },
        { name: "Cash-carry controls", status: "Live", desc: "Limits and checks on how much cash an SR can carry before depositing." },
        { name: "SR GPS attendance", status: "In progress", desc: "Field staff check in from the first shop with GPS instead of an office device." },
        { name: "SR expense claims", status: "In progress", desc: "Travel and field expenses claimed from mobile and approved by the ASM." },
        { name: "Leave request workflow", status: "In progress", desc: "Field staff request leave on mobile; managers approve and cover the beat." },
      ],
    },
    {
      name: "Showroom Demand and POS Management",
      desc: "Connects Akboria's showrooms to the central system. Sales at the counter update stock immediately, and showroom demand flows back to the central store.",
      subs: [
        { name: "Outlet POS integration", status: "Live", desc: "Showroom POS terminals post every sale to the ERP in real time." },
        { name: "POS APIs", status: "Live", desc: "Secure APIs that let any POS system exchange products, prices and sales with the ERP." },
        { name: "Walk-in / direct sales", status: "Live", desc: "Counter sales to walk-in customers, invoiced and stock-adjusted instantly." },
        { name: "Stock issue and walking sales", status: "Live", desc: "Issue stock to sales staff for direct selling and reconcile what comes back." },
      ],
    },
    {
      name: "Central Store and Dispatch Management",
      desc: "Manages the central store, dealer stock and every delivery leaving the building, with returns and damage handled through clear workflows.",
      subs: [
        { name: "Central distribution and goods receipt", status: "Live", desc: "Receive goods from production and suppliers, and distribute them to dealers and showrooms." },
        { name: "Automated demand fulfillment", status: "Live", desc: "Field and showroom demand is consolidated and turned into dispatch plans automatically." },
        { name: "Dealer inventory management", status: "Live", desc: "See each dealer's stock in real time, so orders and offers match what is on the shelf." },
        { name: "Delivery challan hand-over workflow", status: "Live", desc: "Challans are created, handed to the delivery man and confirmed on receipt." },
        { name: "Product returns and damage management", status: "Live", desc: "Returns and damaged goods are recorded, approved and adjusted in stock and accounts." },
        { name: "Shop damage claim workflow", status: "Live", desc: "Shops raise damage claims that are verified and settled against their ledger." },
        { name: "Auto-invoicing", status: "Live", desc: "Invoices are generated automatically when goods are delivered." },
      ],
    },
    {
      name: "Manufacturing and Production Management",
      desc: "Plans and tracks production at the factory, from floors and shifts to batches and packaging, with reports for management.",
      subs: [
        { name: "Manufacturing operations", status: "In progress", desc: "Production orders, material issue and output recording for each product." },
        { name: "Factory, floor, shift and worker management", status: "In progress", desc: "Set up factories, floors and shifts, and assign workers to each line." },
        { name: "Batch planning and packaging manufacturing", status: "In progress", desc: "Plan batches by demand and track packaging runs separately from production." },
        { name: "Manufacturing reports", status: "In progress", desc: "Output, wastage and efficiency reports by product, floor and shift." },
      ],
    },
    {
      name: "Procurement and Vendor Management",
      desc: "Brings governance to buying: vendors, approvals, tenders and audits, with AI help to compare bids and spot risk.",
      subs: [
        { name: "Purchase order approval workflow", status: "Live", desc: "Purchase orders route to the right approvers by amount and category." },
        { name: "Procurement vendor management", status: "In progress", desc: "Vendor registration, documents, categories and contacts in one place." },
        { name: "Procurement routing and approval workflows", status: "In progress", desc: "Requests move through configurable approval paths before anything is ordered." },
        { name: "Tender and bid management", status: "In progress", desc: "Publish tenders, collect bids and keep every response on record." },
        { name: "Comparative statements and award process", status: "In progress", desc: "Bids compared side by side, with the award decision documented." },
        { name: "Vendor performance and governance", status: "In progress", desc: "Score vendors on delivery, quality and price over time." },
        { name: "Conflict of interest and procurement audit", status: "In progress", desc: "Declarations and audit trails that keep buying transparent." },
        { name: "Procurement AI assistance and insights", status: "In progress", desc: "Brain AI flags unusual prices, suggests vendors and summarises bids." },
      ],
    },
    {
      name: "Management Dashboard and Reporting",
      desc: "Gives every role the numbers it needs — management KPIs at the top, and focused dashboards for SRs, dealers, delivery staff and area managers.",
      subs: [
        { name: "Management KPI dashboard", status: "Live", desc: "Sales, collection, stock and target KPIs for leadership, updated live." },
        { name: "Role-based dashboards", status: "Live", desc: "Separate dashboards for SR, Dealer, Delivery Man and ASM, showing only what each role needs." },
        { name: "Primary and secondary sales reporting", status: "Live", desc: "Sales into dealers and sales out to shops, reported side by side." },
      ],
    },
    {
      name: "Platform and Mobile",
      desc: "The foundation underneath every module: branding, security, territory hierarchy and the mobile apps the field team uses every day.",
      subs: [
        { name: "Core ERP foundation", status: "Live", desc: "Company setup, branding, security and the territory hierarchy every module relies on." },
        { name: "Mobile REST API platform", status: "Live", desc: "The API layer that powers the SR, dealer and delivery mobile apps." },
        { name: "Business APIs", status: "Live", desc: "Authentication, product, shop, order, collection and challan APIs for mobile and partners." },
        { name: "API token security", status: "Live", desc: "Token-based access with expiry and revocation for every app and integration." },
        { name: "In-app notifications", status: "Live", desc: "Orders, approvals and instructions pushed to the right person instantly." },
        { name: "UI customisation and login experience", status: "Live", desc: "Akboria-branded screens and a simple, secure sign-in." },
      ],
    },
  ],
};

export const catalogues: Catalogue[] = [betopia, akboria];
