import {
  BarChart3, Boxes, CalendarDays, Car, ClipboardCheck, ClipboardList, Clock, Contact, DoorOpen, Fingerprint, FileText, FolderKanban,
  Globe, GraduationCap, Handshake, LayoutDashboard, LayoutGrid, LineChart, ListTodo, Megaphone, MessageCircle, Package, PartyPopper,
  PieChart, Radio, Receipt, Settings, ShoppingCart, Timer, TrendingUp, Umbrella, UserCheck, UserSearch, Users, UsersRound, Wallet,
  type LucideIcon,
} from "lucide-react";

export type Category = "general" | "hrms" | "operational" | "other";

export type App = {
  slug: string;
  name: string;
  icon: LucideIcon;
  /** Gradient for the icon tile. */
  tint: [string, string];
  category: Category;
  kpis: [string, string][];
  table: { title: string; cols: string[]; rows: string[][] };
};

export const categories: { id: Category; name: string; color: string }[] = [
  { id: "general", name: "General", color: "#6366F1" },
  { id: "hrms", name: "HRMS", color: "#14B8A6" },
  { id: "operational", name: "Operational", color: "#F59E0B" },
  { id: "other", name: "Other Apps", color: "#64748B" },
];

const t = (title: string, cols: string[], rows: string[][]) => ({ title, cols, rows });

export const apps: App[] = [
  // General
  { slug: "announcements", name: "Announcements", icon: Megaphone, tint: ["#818CF8", "#4F46E5"], category: "general",
    kpis: [["Published", "24"], ["Unread by you", "3"], ["Avg. read rate", "87%"], ["Scheduled", "2"]],
    table: t("Latest announcements", ["Title", "Audience", "Date", "Read"], [["Eid holiday schedule", "All staff", "21 Oct", "92%"], ["New expense policy", "Managers", "18 Oct", "78%"], ["Q4 town hall", "All staff", "15 Oct", "95%"], ["Fire drill: Gazipur plant", "Factory", "12 Oct", "88%"]]) },
  { slug: "discuss", name: "Discuss", icon: MessageCircle, tint: ["#FB923C", "#EA580C"], category: "general",
    kpis: [["Unread messages", "12"], ["Channels", "18"], ["Direct chats", "34"], ["Mentions", "4"]],
    table: t("Recent conversations", ["Channel", "Last message", "From", "Time"], [["#sales-north", "Target closed for Rangpur", "Rafiq", "10:42"], ["#procurement", "PO-2291 approved", "Nadia", "10:15"], ["#factory-floor", "Line 3 back online", "Kamal", "09:58"], ["Direct", "Can you review the budget?", "Sadia", "09:30"]]) },
  { slug: "calendar", name: "Calendar", icon: CalendarDays, tint: ["#F472B6", "#DB2777"], category: "general",
    kpis: [["Meetings today", "5"], ["This week", "17"], ["Pending invites", "2"], ["Free hours today", "3.5"]],
    table: t("Today", ["Time", "Event", "Location", "Attendees"], [["09:30", "Daily stand-up", "Room 2", "8"], ["11:00", "Supplier review: Akij", "Online", "4"], ["14:00", "Budget sign-off", "Board room", "6"], ["16:30", "1:1 with Sadia", "Room 1", "2"]]) },
  { slug: "todo", name: "To-do", icon: ListTodo, tint: ["#2DD4BF", "#0F766E"], category: "general",
    kpis: [["Open tasks", "14"], ["Due today", "4"], ["Overdue", "1"], ["Done this week", "22"]],
    table: t("My tasks", ["Task", "Project", "Due", "Priority"], [["Approve October payroll", "HR", "Today", "High"], ["Review PO-2291", "Procurement", "Today", "Medium"], ["Send Q3 report to board", "Finance", "Tomorrow", "High"], ["Update price list", "Sales", "28 Oct", "Low"]]) },
  { slug: "contacts", name: "Contacts", icon: Contact, tint: ["#34D399", "#047857"], category: "general",
    kpis: [["Contacts", "2,148"], ["Companies", "386"], ["Added this month", "64"], ["Suppliers", "142"]],
    table: t("Recently added", ["Name", "Company", "Type", "Phone"], [["Tanvir Ahmed", "Akij Group", "Supplier", "+880 1711-203344"], ["Farzana Haque", "Shwapno", "Customer", "+880 1819-552210"], ["Imran Hossain", "Pran-RFL", "Customer", "+880 1713-889012"], ["Nusrat Jahan", "Meghna Logistics", "Vendor", "+880 1922-410098"]]) },
  { slug: "crm", name: "CRM", icon: Handshake, tint: ["#22D3EE", "#0E7490"], category: "general",
    kpis: [["Open deals", "47"], ["Pipeline value", "৳ 3.2 Cr"], ["Won this month", "9"], ["Win rate", "34%"]],
    table: t("Top opportunities", ["Deal", "Stage", "Value", "Owner"], [["Shwapno: 40 outlets", "Proposal", "৳ 48 L", "Rafiq"], ["Akij Food ERP", "Negotiation", "৳ 72 L", "Sadia"], ["Meghna Logistics", "Qualified", "৳ 21 L", "Nadia"], ["Apex Footwear", "Demo", "৳ 35 L", "Kamal"]]) },
  { slug: "project", name: "Project", icon: FolderKanban, tint: ["#A78BFA", "#6D28D9"], category: "general",
    kpis: [["Active projects", "8"], ["On track", "6"], ["At risk", "2"], ["Hours this week", "312"]],
    table: t("Projects", ["Project", "Progress", "Due", "Status"], [["Gazipur plant expansion", "64%", "Dec 2026", "On track"], ["New warehouse WMS", "41%", "Nov 2026", "At risk"], ["Dealer portal", "82%", "Nov 2026", "On track"], ["Payroll migration", "95%", "Oct 2026", "On track"]]) },
  { slug: "website", name: "Website", icon: Globe, tint: ["#38BDF8", "#0369A1"], category: "general",
    kpis: [["Visitors today", "1,284"], ["Leads", "23"], ["Bounce rate", "41%"], ["Pages", "36"]],
    table: t("Top pages", ["Page", "Views", "Avg. time", "Leads"], [["/products", "3,410", "1m 52s", "8"], ["/pricing", "2,086", "2m 10s", "11"], ["/contact", "940", "0m 48s", "4"], ["/blog/vat-guide", "812", "3m 05s", "0"]]) },
  { slug: "events", name: "Events", icon: PartyPopper, tint: ["#FB7185", "#E11D48"], category: "general",
    kpis: [["Upcoming", "4"], ["Registrations", "318"], ["Check-in rate", "76%"], ["Past events", "21"]],
    table: t("Upcoming events", ["Event", "Date", "Venue", "Registered"], [["Dealer meet 2026", "02 Nov", "Radisson Dhaka", "142"], ["Safety training", "05 Nov", "Gazipur plant", "60"], ["Annual sports day", "14 Nov", "Army Stadium", "96"], ["Year-end party", "28 Dec", "Head office", "20"]]) },
  { slug: "apps", name: "Apps", icon: LayoutGrid, tint: ["#F472B6", "#7C3AED"], category: "general",
    kpis: [["Installed", "36"], ["Updates available", "2"], ["Integrations", "7"], ["Users with access", "412"]],
    table: t("Installed apps", ["App", "Version", "Users", "Status"], [["Payroll", "4.2", "18", "Up to date"], ["Inventory", "3.9", "64", "Update available"], ["CRM", "5.1", "41", "Up to date"], ["Gate Pass", "1.4", "22", "Update available"]]) },
  { slug: "settings", name: "Settings", icon: Settings, tint: ["#FBBF24", "#EA580C"], category: "general",
    kpis: [["Users", "412"], ["Companies", "3"], ["Branches", "14"], ["Active sessions", "96"]],
    table: t("Recent changes", ["Setting", "Changed by", "When", "Area"], [["VAT rate for bakery", "Admin", "Today", "Accounting"], ["New role: Store manager", "Jubair", "Yesterday", "Access"], ["Fiscal year 2026/27", "Admin", "20 Oct", "Company"], ["Two-factor required", "Admin", "18 Oct", "Security"]]) },

  // HRMS
  { slug: "hr-dashboard", name: "Dashboard", icon: LayoutDashboard, tint: ["#60A5FA", "#1D4ED8"], category: "hrms",
    kpis: [["Headcount", "412"], ["Present today", "386"], ["On leave", "14"], ["Open positions", "9"]],
    table: t("Department overview", ["Department", "Headcount", "Present", "Attrition"], [["Production", "214", "203", "2.1%"], ["Sales", "86", "79", "4.8%"], ["Finance", "24", "24", "0%"], ["Warehouse", "58", "52", "3.2%"]]) },
  { slug: "users", name: "Users", icon: Users, tint: ["#38BDF8", "#0F172A"], category: "hrms",
    kpis: [["System users", "412"], ["Admins", "6"], ["Invited", "8"], ["Disabled", "11"]],
    table: t("Users", ["Name", "Role", "Branch", "Last active"], [["Jubair", "Operations manager", "Head office", "Now"], ["Sadia Islam", "Finance lead", "Head office", "5m ago"], ["Rafiq Uddin", "Sales manager", "Rangpur", "1h ago"], ["Kamal Hasan", "Plant supervisor", "Gazipur", "Today"]]) },
  { slug: "movement", name: "Movement", icon: Car, tint: ["#F87171", "#B91C1C"], category: "hrms",
    kpis: [["Out on duty", "23"], ["Requests today", "11"], ["Pending approval", "4"], ["Km logged", "1,240"]],
    table: t("Movement log", ["Employee", "Destination", "Out", "Status"], [["Rafiq Uddin", "Rangpur dealers", "08:30", "Approved"], ["Nadia Akter", "Akij office", "10:00", "Approved"], ["Tanim Roy", "Bank: Motijheel", "11:15", "Pending"], ["Shuvo Das", "Port, Chattogram", "07:00", "Approved"]]) },
  { slug: "shift", name: "Shift", icon: Clock, tint: ["#FCD34D", "#B45309"], category: "hrms",
    kpis: [["Shifts today", "3"], ["Staff rostered", "296"], ["Swaps requested", "5"], ["Night shift", "84"]],
    table: t("Today's shifts", ["Shift", "Time", "Staff", "Supervisor"], [["Morning", "06:00 to 14:00", "112", "Kamal"], ["Evening", "14:00 to 22:00", "100", "Rina"], ["Night", "22:00 to 06:00", "84", "Selim"], ["Office", "09:00 to 18:00", "96", "Sadia"]]) },
  { slug: "elearning", name: "eLearning", icon: GraduationCap, tint: ["#C084FC", "#7E22CE"], category: "hrms",
    kpis: [["Courses", "28"], ["Enrolled", "264"], ["Completion", "71%"], ["Certificates", "183"]],
    table: t("Popular courses", ["Course", "Enrolled", "Completion", "Length"], [["Workplace safety", "212", "88%", "45 min"], ["VAT basics", "64", "62%", "1h 20m"], ["Customer service", "96", "74%", "1h"], ["Using Business Brain", "180", "69%", "50 min"]]) },
  { slug: "surveys", name: "Surveys", icon: ClipboardList, tint: ["#3B82F6", "#EF4444"], category: "hrms",
    kpis: [["Active surveys", "3"], ["Responses", "318"], ["Response rate", "77%"], ["eNPS", "+32"]],
    table: t("Surveys", ["Survey", "Responses", "Closes", "Status"], [["Employee engagement 2026", "248", "31 Oct", "Open"], ["Canteen feedback", "52", "26 Oct", "Open"], ["Training needs", "18", "05 Nov", "Open"], ["Pulse: September", "301", "30 Sep", "Closed"]]) },
  { slug: "employees", name: "Employees", icon: UsersRound, tint: ["#A855F7", "#14B8A6"], category: "hrms",
    kpis: [["Employees", "412"], ["Joined this month", "12"], ["Left this month", "4"], ["Avg. tenure", "3.4 yrs"]],
    table: t("Employees", ["Name", "Designation", "Department", "Joined"], [["Sadia Islam", "Finance lead", "Finance", "2019"], ["Rafiq Uddin", "Sales manager", "Sales", "2020"], ["Kamal Hasan", "Plant supervisor", "Production", "2017"], ["Nadia Akter", "Procurement officer", "Procurement", "2022"]]) },
  { slug: "payroll", name: "Payroll", icon: Wallet, tint: ["#F43F5E", "#9D174D"], category: "hrms",
    kpis: [["October payroll", "৳ 1.84 Cr"], ["Employees paid", "406"], ["Pending approval", "1 run"], ["Tax withheld", "৳ 9.6 L"]],
    table: t("Payroll runs", ["Run", "Employees", "Net pay", "Status"], [["October 2026", "406", "৳ 1.84 Cr", "Awaiting approval"], ["September 2026", "402", "৳ 1.81 Cr", "Paid"], ["Festival bonus", "398", "৳ 92 L", "Paid"], ["August 2026", "399", "৳ 1.79 Cr", "Paid"]]) },
  { slug: "attendance", name: "Attendances", icon: Fingerprint, tint: ["#FBBF24", "#C2410C"], category: "hrms",
    kpis: [["Present", "386"], ["Late", "17"], ["Absent", "12"], ["On time rate", "93%"]],
    table: t("Today", ["Employee", "In", "Out", "Status"], [["Kamal Hasan", "05:52", "Not yet", "On time"], ["Sadia Islam", "09:04", "Not yet", "On time"], ["Tanim Roy", "09:41", "Not yet", "Late"], ["Rina Begum", "None", "None", "Absent"]]) },
  { slug: "recruitment", name: "Recruitment", icon: UserSearch, tint: ["#2DD4BF", "#9333EA"], category: "hrms",
    kpis: [["Open positions", "9"], ["Applicants", "214"], ["Interviews this week", "16"], ["Offers out", "3"]],
    table: t("Open positions", ["Role", "Applicants", "Stage", "Hiring manager"], [["Area sales manager", "48", "Interviewing", "Rafiq"], ["Accountant", "62", "Screening", "Sadia"], ["Machine operator", "71", "Offer", "Kamal"], ["Warehouse lead", "33", "Interviewing", "Shuvo"]]) },
  { slug: "leave", name: "Leave", icon: Umbrella, tint: ["#FB923C", "#2563EB"], category: "hrms",
    kpis: [["On leave today", "14"], ["Requests pending", "6"], ["Your balance", "11 days"], ["Approved this month", "38"]],
    table: t("Leave requests", ["Employee", "Type", "Dates", "Status"], [["Nadia Akter", "Casual", "27 to 28 Oct", "Pending"], ["Shuvo Das", "Sick", "25 Oct", "Approved"], ["Tanim Roy", "Annual", "02 to 06 Nov", "Pending"], ["Rina Begum", "Sick", "25 Oct", "Approved"]]) },
  { slug: "expenses", name: "Expenses", icon: Receipt, tint: ["#38BDF8", "#1E3A8A"], category: "hrms",
    kpis: [["Claims this month", "৳ 4.2 L"], ["Pending approval", "9"], ["Reimbursed", "৳ 3.1 L"], ["Rejected", "2"]],
    table: t("Expense claims", ["Employee", "Category", "Amount", "Status"], [["Rafiq Uddin", "Travel", "৳ 12,400", "Pending"], ["Nadia Akter", "Meals", "৳ 2,150", "Approved"], ["Shuvo Das", "Fuel", "৳ 6,800", "Pending"], ["Sadia Islam", "Training", "৳ 18,000", "Reimbursed"]]) },

  // Operational
  { slug: "purchase-requisition", name: "Purchase Requisition", icon: ClipboardCheck, tint: ["#FBBF24", "#92400E"], category: "operational",
    kpis: [["Open requisitions", "18"], ["Awaiting you", "4"], ["Converted to PO", "42"], ["Value open", "৳ 26 L"]],
    table: t("Requisitions", ["PR", "Requested by", "Value", "Status"], [["PR-1184", "Kamal Hasan", "৳ 4.6 L", "Awaiting approval"], ["PR-1183", "Shuvo Das", "৳ 1.2 L", "Approved"], ["PR-1181", "Rina Begum", "৳ 86,000", "Awaiting approval"], ["PR-1179", "Kamal Hasan", "৳ 9.4 L", "Converted to PO"]]) },
  { slug: "demand", name: "Demand", icon: TrendingUp, tint: ["#4ADE80", "#15803D"], category: "operational",
    kpis: [["Forecast (Nov)", "৳ 4.8 Cr"], ["Accuracy", "91%"], ["Items at risk", "6"], ["Trend vs Oct", "+8%"]],
    table: t("Demand forecast", ["Product", "Oct actual", "Nov forecast", "Change"], [["Biscuits 200g", "42,000", "46,500", "+11%"], ["Juice 1L", "18,200", "16,900", "−7%"], ["Noodles 4-pack", "31,400", "35,000", "+11%"], ["Chips 50g", "56,000", "58,200", "+4%"]]) },
  { slug: "sales", name: "Sales", icon: BarChart3, tint: ["#F97316", "#9D174D"], category: "operational",
    kpis: [["Sales today", "৳ 48.2 L"], ["Orders", "612"], ["Target achieved", "87%"], ["Returns", "1.2%"]],
    table: t("Sales by region", ["Region", "Today", "MTD", "Target"], [["Dhaka", "৳ 18.4 L", "৳ 4.1 Cr", "92%"], ["Chattogram", "৳ 11.2 L", "৳ 2.6 Cr", "88%"], ["Rangpur", "৳ 6.8 L", "৳ 1.4 Cr", "74%"], ["Sylhet", "৳ 5.1 L", "৳ 1.1 Cr", "81%"]]) },
  { slug: "dashboards", name: "Dashboards", icon: PieChart, tint: ["#EC4899", "#0EA5E9"], category: "operational",
    kpis: [["Dashboards", "14"], ["Shared with you", "6"], ["Alerts firing", "3"], ["Refreshed", "2m ago"]],
    table: t("Your dashboards", ["Dashboard", "Owner", "Viewers", "Updated"], [["CEO overview", "Admin", "4", "2m ago"], ["Plant output", "Kamal", "12", "5m ago"], ["Cash position", "Sadia", "3", "1h ago"], ["Field sales", "Rafiq", "28", "Live"]]) },
  { slug: "campaigns", name: "Campaign Management", icon: Radio, tint: ["#67E8F9", "#7C3AED"], category: "operational",
    kpis: [["Active campaigns", "5"], ["Reach", "1.2 M"], ["Leads", "842"], ["Spend", "৳ 6.4 L"]],
    table: t("Campaigns", ["Campaign", "Channel", "Leads", "Status"], [["Winter snacks", "Facebook", "312", "Running"], ["Dealer bonus Q4", "SMS", "128", "Running"], ["Eid offer", "TV + Digital", "402", "Ended"], ["New juice launch", "YouTube", "0", "Scheduled"]]) },
  { slug: "gate-pass", name: "Gate Pass", icon: DoorOpen, tint: ["#60A5FA", "#1D4ED8"], category: "operational",
    kpis: [["Passes today", "38"], ["Vehicles inside", "7"], ["Pending", "3"], ["Visitors", "15"]],
    table: t("Today's passes", ["Pass", "Type", "Vehicle / visitor", "Status"], [["GP-5521", "Goods out", "Dhaka Metro-Ta 11-2034", "Exited"], ["GP-5522", "Visitor", "Akij: 2 persons", "Inside"], ["GP-5523", "Goods in", "Chatta Metro-Ma 14-8890", "Pending"], ["GP-5524", "Returnable", "Pallet jack × 2", "Inside"]]) },
  { slug: "procurement", name: "Procurement", icon: Package, tint: ["#A78BFA", "#581C87"], category: "operational",
    kpis: [["Open POs", "26"], ["Spend this month", "৳ 1.4 Cr"], ["Late deliveries", "3"], ["Suppliers", "142"]],
    table: t("Purchase orders", ["PO", "Supplier", "Value", "Status"], [["PO-2291", "Akij Packaging", "৳ 18.6 L", "Approved"], ["PO-2290", "Meghna Flour", "৳ 42.0 L", "In transit"], ["PO-2288", "City Sugar", "৳ 9.8 L", "Late"], ["PO-2285", "Bashundhara Paper", "৳ 6.2 L", "Received"]]) },
  { slug: "timesheets", name: "Timesheets", icon: Timer, tint: ["#F87171", "#1E40AF"], category: "operational",
    kpis: [["Hours this week", "1,842"], ["Billable", "64%"], ["To approve", "12"], ["Overtime", "96 h"]],
    table: t("Pending timesheets", ["Employee", "Week", "Hours", "Project"], [["Tanim Roy", "43", "46", "Dealer portal"], ["Nadia Akter", "43", "40", "WMS rollout"], ["Shuvo Das", "43", "52", "Warehouse"], ["Rina Begum", "43", "38", "Plant expansion"]]) },
  { slug: "purchase", name: "Purchase", icon: ShoppingCart, tint: ["#2DD4BF", "#86198F"], category: "operational",
    kpis: [["Bills to pay", "14"], ["Due this week", "৳ 32 L"], ["Paid this month", "৳ 1.1 Cr"], ["Avg. lead time", "6 days"]],
    table: t("Supplier bills", ["Bill", "Supplier", "Due", "Amount"], [["BILL-882", "Meghna Flour", "27 Oct", "৳ 42.0 L"], ["BILL-879", "Akij Packaging", "29 Oct", "৳ 18.6 L"], ["BILL-874", "Titas Gas", "30 Oct", "৳ 3.4 L"], ["BILL-871", "City Sugar", "02 Nov", "৳ 9.8 L"]]) },
  { slug: "inventory", name: "Inventory", icon: Boxes, tint: ["#FB923C", "#7E22CE"], category: "operational",
    kpis: [["Stock value", "৳ 6.8 Cr"], ["SKUs", "1,284"], ["Low stock", "17"], ["Expiring in 30 days", "9"]],
    table: t("Low stock", ["Item", "Warehouse", "On hand", "Reorder at"], [["Flour 50kg", "Gazipur", "120", "300"], ["Sugar 50kg", "Gazipur", "85", "200"], ["Carton 12×", "Tongi", "1,400", "5,000"], ["Juice 1L", "Chattogram", "640", "1,000"]]) },

  // Other apps
  { slug: "onboarding", name: "Onboarding/Offboarding", icon: UserCheck, tint: ["#818CF8", "#10B981"], category: "other",
    kpis: [["Joining this month", "12"], ["Leaving", "4"], ["Checklists open", "9"], ["Assets to collect", "6"]],
    table: t("In progress", ["Employee", "Type", "Date", "Progress"], [["Arif Khan", "Onboarding", "27 Oct", "6/10"], ["Mim Sultana", "Onboarding", "01 Nov", "2/10"], ["Habib Rahman", "Offboarding", "31 Oct", "5/8"], ["Lina Das", "Onboarding", "03 Nov", "1/10"]]) },
  { slug: "invoicing", name: "Invoicing", icon: FileText, tint: ["#38BDF8", "#1E40AF"], category: "other",
    kpis: [["Outstanding", "৳ 2.4 Cr"], ["Overdue", "৳ 38 L"], ["Invoiced this month", "৳ 5.1 Cr"], ["Collected", "82%"]],
    table: t("Recent invoices", ["Invoice", "Customer", "Amount", "Status"], [["INV-10422", "Shwapno", "৳ 12.4 L", "Paid"], ["INV-10421", "Agora", "৳ 8.6 L", "Sent"], ["INV-10418", "Meena Bazar", "৳ 6.1 L", "Overdue"], ["INV-10415", "Unimart", "৳ 4.9 L", "Paid"]]) },
  { slug: "hr-reporting", name: "HR Reporting", icon: LineChart, tint: ["#FDBA74", "#C2410C"], category: "other",
    kpis: [["Reports", "22"], ["Scheduled", "5"], ["Attrition (12m)", "8.4%"], ["Cost per hire", "৳ 18,500"]],
    table: t("Reports", ["Report", "Frequency", "Last run", "Recipients"], [["Monthly headcount", "Monthly", "01 Oct", "4"], ["Overtime by department", "Weekly", "21 Oct", "6"], ["Leave liability", "Monthly", "01 Oct", "2"], ["Attrition analysis", "Quarterly", "01 Oct", "3"]]) },
];
