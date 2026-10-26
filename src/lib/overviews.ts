// Overview dashboards for every workspace app. Each one is composed from widgets
// that fit what that app actually tracks, using the same sample company as the rest of the demo.

import { shapla } from "./shapla-seed";

type Kpi = { label: string; value: string; delta?: string; note?: string; downIsGood?: boolean };
type W = { w?: 3 | 4 | 5 | 6 | 7 | 8 | 12 };

export type Widget = W &
  (
    | { type: "kpis"; items: Kpi[] }
    | { type: "insight"; text: string }
    | { type: "line"; title: string; sub?: string; labels: string[]; series: { name: string; data: number[] }[] }
    | { type: "bars"; title: string; sub?: string; horizontal?: boolean; items: { label: string; value: number; display?: string }[] }
    | { type: "stacked"; title: string; sub?: string; keys: string[]; rows: { label: string; values: number[] }[] }
    | { type: "donut"; title: string; sub?: string; center?: string; centerLabel?: string; slices: { label: string; value: number; display?: string }[] }
    | { type: "funnel"; title: string; sub?: string; stages: { label: string; value: number; display?: string }[] }
    | { type: "progress"; title: string; sub?: string; goal?: number; warnBelow?: number; items: { label: string; value: number; right?: string }[] }
    | { type: "gauge"; title: string; sub?: string; value: number; display?: string; caption: string }
    | { type: "leaders"; title: string; sub?: string; avatars?: boolean; rows: { name: string; sub?: string; value: string }[] }
    | { type: "timeline"; title: string; sub?: string; items: { time: string; title: string; sub?: string }[] }
    | { type: "heatmap"; title: string; sub?: string; rows: string[]; cols: string[]; values: number[][]; unit?: string }
    | { type: "table"; title: string; cols: string[]; rows: string[][] }
    | { type: "list"; title: string; sub?: string; status?: boolean; rows: { label: string; sub?: string; value: string }[] }
  );

const MONTHS = ["May", "Jun", "Jul", "Aug", "Sep", "Oct"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const overviews: Record<string, Widget[]> = {
  // ─────────────── General ───────────────
  announcements: [
    { type: "kpis", items: [{ label: "Published this month", value: "24", delta: "+6" }, { label: "Average read rate", value: "87%", delta: "+4%" }, { label: "Acknowledged", value: "1,912", note: "of 2,196 required" }, { label: "Scheduled", value: "2", note: "next: 1 Nov, 09:00" }] },
    { w: 7, type: "progress", title: "Read rate by announcement", sub: "Staff who opened it", goal: 90, items: [{ label: "Fire drill: Gazipur plant", value: 95 }, { label: "Durga Puja schedule", value: 92 }, { label: "Line 3 back to capacity", value: 88 }, { label: "New expense policy", value: 78 }, { label: "Q4 town hall", value: 95 }] },
    { w: 5, type: "donut", title: "Reach by location", center: "412", centerLabel: "staff", slices: [{ label: "Gazipur plant", value: 214 }, { label: "Head office", value: 96 }, { label: "Depots", value: 64 }, { label: "Tongi warehouse", value: 38 }] },
    { w: 12, type: "insight", text: "18 people at Gazipur haven't opened the expense policy. Most work night shift. Schedule a repost at 22:15 when the shift starts." },
  ],
  discuss: [
    { type: "kpis", items: [{ label: "Messages today", value: "1,284", delta: "+12%" }, { label: "Active channels", value: "18" }, { label: "Avg. reply time", value: "6 min", delta: "-2 min", downIsGood: true }, { label: "Your mentions", value: "4", note: "2 unanswered" }] },
    { w: 8, type: "heatmap", title: "When the team talks", sub: "Messages per hour, this week", rows: DAYS.slice(0, 6), cols: ["8", "10", "12", "14", "16", "18", "20"], values: [[22, 64, 48, 52, 70, 38, 12], [18, 58, 51, 49, 66, 41, 10], [25, 71, 55, 60, 74, 36, 14], [20, 62, 47, 58, 69, 40, 9], [15, 40, 30, 22, 35, 18, 6], [8, 21, 18, 16, 20, 10, 4]] },
    { w: 4, type: "bars", horizontal: true, title: "Busiest channels", items: [{ label: "#sales-north", value: 312 }, { label: "#factory-floor", value: 248 }, { label: "#procurement", value: 186 }, { label: "#finance", value: 94 }, { label: "#general", value: 61 }] },
  ],
  calendar: [
    { type: "kpis", items: [{ label: "Meetings today", value: "5" }, { label: "Hours in meetings", value: "17.5 h", note: "this week" }, { label: "Focus time left", value: "3.5 h", note: "today" }, { label: "Pending invites", value: "2" }] },
    { w: 5, type: "timeline", title: "Today", items: [{ time: "09:30 · Room 2", title: "Daily stand-up" }, { time: "11:00 · Online", title: "Supplier review: Akij Packaging" }, { time: "14:00 · Board room", title: "Budget sign-off", sub: "Sadia, Farhana, CEO" }, { time: "16:30 · Room 1", title: "1:1 with Sadia" }] },
    { w: 7, type: "bars", title: "Meeting hours by day", sub: "This week", items: DAYS.slice(0, 5).map((d, i) => ({ label: d, value: [4.5, 3, 5, 3.5, 1.5][i], display: `${[4.5, 3, 5, 3.5, 1.5][i]}h` })) },
    { w: 12, type: "insight", text: "Wednesday is already 5 hours of meetings. Moving the 1:1 with Sadia to Friday gives you a 2-hour focus block before the plant visit." },
  ],
  todo: [
    { type: "kpis", items: [{ label: "Open tasks", value: "14" }, { label: "Due today", value: "4" }, { label: "Overdue", value: "1", downIsGood: true, delta: "-2" }, { label: "Done this week", value: "22", delta: "+5" }] },
    { w: 4, type: "donut", title: "By priority", slices: [{ label: "High", value: 4 }, { label: "Medium", value: 6 }, { label: "Low", value: 4 }] },
    { w: 8, type: "line", title: "Completed vs created", sub: "Last 6 weeks", labels: ["W38", "W39", "W40", "W41", "W42", "W43"], series: [{ name: "Completed", data: [14, 18, 16, 21, 19, 22] }, { name: "Created", data: [17, 16, 19, 18, 20, 17] }] },
    { w: 12, type: "list", status: true, title: "Due today", rows: [{ label: "Approve October payroll", sub: "HR · assigned by Farhana", value: "Pending" }, { label: "Review PO-2291", sub: "Procurement", value: "Pending" }, { label: "Sign Gazipur expansion change order", sub: "Projects", value: "Pending" }, { label: "Reply to Shwapno proposal questions", sub: "Sales", value: "Done" }] },
  ],
  contacts: [
    { type: "kpis", items: [{ label: "Contacts", value: "2,148", delta: "+64" }, { label: "Companies", value: "386" }, { label: "Suppliers", value: "142" }, { label: "Missing phone/email", value: "37", downIsGood: true, delta: "-12" }] },
    { w: 5, type: "donut", title: "Contact types", center: "2,148", centerLabel: "contacts", slices: [{ label: "Customers", value: 1460 }, { label: "Suppliers", value: 412 }, { label: "Vendors", value: 188 }, { label: "Other", value: 88 }] },
    { w: 7, type: "bars", horizontal: true, title: "Contacts by division", items: [{ label: "Dhaka", value: 982 }, { label: "Chattogram", value: 421 }, { label: "Rajshahi", value: 214 }, { label: "Rangpur", value: 198 }, { label: "Khulna", value: 176 }, { label: "Sylhet", value: 157 }] },
    { w: 12, type: "table", title: "Most active companies", cols: ["Company", "Type", "Contacts", "Last activity", "Status"], rows: [["Shwapno", "Customer", "14", "Today", "Active"], ["Akij Packaging", "Supplier", "9", "Today", "Active"], ["Meghna Flour Mills", "Supplier", "6", "Yesterday", "Active"], ["Agora", "Customer", "11", "3 days ago", "Active"]] },
  ],
  crm: [
    { type: "kpis", items: [{ label: "Pipeline value", value: "৳ 3.2 Cr", delta: "+18%" }, { label: "Open deals", value: "47" }, { label: "Win rate", value: "34%", delta: "+3%" }, { label: "Avg. deal cycle", value: "38 days", delta: "-5 days", downIsGood: true }] },
    { w: 7, type: "funnel", title: "Sales funnel", sub: "Last 90 days", stages: [{ label: "Leads", value: 420 }, { label: "Qualified", value: 168 }, { label: "Demo", value: 74 }, { label: "Proposal", value: 38 }, { label: "Won", value: 13 }] },
    { w: 5, type: "leaders", title: "Top reps", sub: "Won this quarter", rows: [{ name: "Rafiq Uddin", sub: "6 deals", value: "৳ 1.1 Cr" }, { name: "Sadia Islam", sub: "3 deals", value: "৳ 86 L" }, { name: "Tanim Roy", sub: "4 deals", value: "৳ 52 L" }, { name: "Nadia Akter", sub: "2 deals", value: "৳ 31 L" }] },
    { w: 12, type: "line", title: "Revenue won", sub: "৳ lakh per month", labels: MONTHS, series: [{ name: "Won", data: [42, 55, 48, 71, 64, 86] }, { name: "Target", data: [50, 55, 60, 65, 70, 75] }] },
  ],
  project: [
    { type: "kpis", items: [{ label: "Active projects", value: "8" }, { label: "On track", value: "6" }, { label: "Budget used", value: "৳ 4.1 Cr", note: "of ৳ 6.8 Cr" }, { label: "Hours this week", value: "312", delta: "+8%" }] },
    { w: 7, type: "progress", title: "Project progress", sub: "Work done vs plan", warnBelow: 50, items: [{ label: "Payroll migration", value: 95, right: "95% · due Oct" }, { label: "Dealer portal", value: 82, right: "82% · due Nov" }, { label: "Gazipur plant expansion", value: 64, right: "64% · due Dec" }, { label: "New warehouse WMS", value: 41, right: "41% · 2 weeks late" }, { label: "Chattogram depot automation", value: 12, right: "12% · scoping" }] },
    { w: 5, type: "donut", title: "Budget by project", center: "৳ 6.8 Cr", centerLabel: "approved", slices: [{ label: "Plant expansion", value: 3.6, display: "৳ 3.6 Cr" }, { label: "WMS", value: 1.4, display: "৳ 1.4 Cr" }, { label: "Dealer portal", value: 0.9, display: "৳ 90 L" }, { label: "Other", value: 0.9, display: "৳ 90 L" }] },
    { w: 12, type: "timeline", title: "Upcoming milestones", items: [{ time: "31 Oct", title: "Payroll migration: go-live sign-off", sub: "Farhana Hoque" }, { time: "12 Nov", title: "Dealer portal: pilot with 40 dealers", sub: "Tanim Roy" }, { time: "30 Nov", title: "WMS: Tongi cutover (at risk)", sub: "Nadia Akter" }, { time: "15 Dec", title: "Line 4 commissioning", sub: "Kamal Hasan" }] },
  ],
  website: [
    { type: "kpis", items: [{ label: "Visitors today", value: "1,284", delta: "+9%" }, { label: "Leads", value: "23", delta: "+4" }, { label: "Conversion", value: "1.8%", delta: "+0.3%" }, { label: "Bounce rate", value: "41%", delta: "-3%", downIsGood: true }] },
    { w: 8, type: "line", title: "Traffic", sub: "Visitors per month", labels: MONTHS, series: [{ name: "Visitors", data: [21400, 24800, 23100, 28900, 31200, 34600] }, { name: "Last year", data: [16200, 17800, 18100, 20400, 21900, 23300] }] },
    { w: 4, type: "donut", title: "Traffic sources", slices: [{ label: "Google", value: 48 }, { label: "Facebook", value: 27 }, { label: "Direct", value: 15 }, { label: "LinkedIn", value: 10 }] },
    { w: 6, type: "bars", horizontal: true, title: "Top pages", items: [{ label: "/products", value: 3410 }, { label: "/pricing", value: 2086 }, { label: "/industries/garments", value: 1240 }, { label: "/contact", value: 940 }, { label: "/blog/vat-guide", value: 812 }] },
    { w: 6, type: "funnel", title: "Visitor to lead", stages: [{ label: "Visitors", value: 34600, display: "34.6k" }, { label: "Pricing page", value: 6100, display: "6.1k" }, { label: "Started form", value: 1180, display: "1,180" }, { label: "Lead", value: 623 }] },
  ],
  events: [
    { type: "kpis", items: [{ label: "Upcoming events", value: "4" }, { label: "Registrations", value: "318", delta: "+46" }, { label: "Check-in rate", value: "76%" }, { label: "Event budget used", value: "৳ 8.4 L", note: "of ৳ 14 L" }] },
    { w: 7, type: "progress", title: "Registrations vs capacity", goal: 100, items: [{ label: "Dealer meet 2026 · 2 Nov", value: 79, right: "142 / 180" }, { label: "Safety training · 5 Nov", value: 100, right: "60 / 60" }, { label: "Annual sports day · 14 Nov", value: 38, right: "96 / 250" }, { label: "Year-end party · 28 Dec", value: 5, right: "20 / 400" }] },
    { w: 5, type: "line", title: "Dealer meet sign-ups", sub: "Daily, last 2 weeks", labels: ["12", "14", "16", "18", "20", "22", "24"], series: [{ name: "Sign-ups", data: [8, 22, 41, 63, 88, 117, 142] }] },
  ],
  apps: [
    { type: "kpis", items: [{ label: "Installed apps", value: "36" }, { label: "Updates available", value: "2" }, { label: "Integrations", value: "7", note: "all healthy" }, { label: "API calls today", value: "48,210", delta: "+11%" }] },
    { w: 7, type: "bars", horizontal: true, title: "Most used apps", sub: "Daily active users", items: [{ label: "Attendance", value: 386 }, { label: "Sales", value: 92 }, { label: "Inventory", value: 64 }, { label: "CRM", value: 41 }, { label: "Payroll", value: 18 }] },
    { w: 5, type: "list", status: true, title: "Integration health", rows: [{ label: "bKash", sub: "Last sync 2 min ago", value: "Active" }, { label: "NBR e-VAT", sub: "Mushak 6.3 filed 15 Oct", value: "Active" }, { label: "City Bank BEFTN", sub: "Salary file ready", value: "Active" }, { label: "ChatGPT & Claude (MCP)", sub: "1,204 questions today", value: "Active" }] },
  ],
  settings: [
    { type: "kpis", items: [{ label: "Users", value: "412" }, { label: "Two-factor coverage", value: "94%", delta: "+6%" }, { label: "Active sessions", value: "96" }, { label: "Failed sign-ins today", value: "3", downIsGood: true }] },
    { w: 4, type: "gauge", title: "Security score", value: 86, caption: "Turn on 2FA for 24 more users to reach 95" },
    { w: 8, type: "timeline", title: "Audit log", items: [{ time: "Today 10:12 · Admin", title: "VAT rate for bakery set to 5%" }, { time: "Yesterday 16:40 · Jubair", title: "New role created: Store manager" }, { time: "20 Oct · Admin", title: "Fiscal year 2026/27 opened" }, { time: "18 Oct · Admin", title: "Two-factor made mandatory for Finance" }] },
  ],

  // ─────────────── HRMS ───────────────
  "hr-dashboard": [
    { type: "kpis", items: [{ label: "Headcount", value: "412", delta: "+8" }, { label: "Present today", value: "386", note: "94% attendance" }, { label: "Attrition (12 m)", value: "8.4%", delta: "-1.2%", downIsGood: true }, { label: "Open positions", value: "9" }] },
    { w: 7, type: "stacked", title: "Headcount by department", keys: ["Permanent", "Contract", "Intern"], rows: [{ label: "Production", values: [168, 42, 4] }, { label: "Sales", values: [74, 10, 2] }, { label: "Warehouse", values: [44, 14, 0] }, { label: "Finance", values: [22, 0, 2] }, { label: "HR & Admin", values: [26, 2, 2] }] },
    { w: 5, type: "donut", title: "Gender mix", center: "412", centerLabel: "people", slices: [{ label: "Men", value: 268 }, { label: "Women", value: 144 }] },
    { w: 7, type: "line", title: "Joiners and leavers", labels: MONTHS, series: [{ name: "Joined", data: [9, 14, 6, 11, 8, 12] }, { name: "Left", data: [4, 6, 5, 3, 7, 4] }] },
    { w: 5, type: "bars", title: "Age bands", items: [{ label: "18 to 24", value: 62 }, { label: "25 to 34", value: 178 }, { label: "35 to 44", value: 112 }, { label: "45 to 54", value: 46 }, { label: "55+", value: 14 }] },
  ],
  users: [
    { type: "kpis", items: [{ label: "System users", value: "412" }, { label: "Signed in today", value: "298" }, { label: "Admins", value: "6" }, { label: "Pending invites", value: "8" }] },
    { w: 5, type: "donut", title: "Users by role", slices: [{ label: "Staff", value: 352 }, { label: "Managers", value: 48 }, { label: "Finance", value: 6 }, { label: "Admins", value: 6 }] },
    { w: 7, type: "bars", title: "Sign-ins this week", items: DAYS.map((d, i) => ({ label: d, value: [312, 305, 318, 296, 288, 104, 61][i] })) },
    { w: 12, type: "list", status: true, title: "Needs attention", rows: [{ label: "Arif Khan", sub: "Invite not accepted for 3 days", value: "Pending" }, { label: "11 disabled accounts", sub: "Leavers since August", value: "Draft" }, { label: "24 users without 2FA", sub: "Mostly Gazipur supervisors", value: "At risk" }] },
  ],
  movement: [
    { type: "kpis", items: [{ label: "Out on duty now", value: "23" }, { label: "Requests today", value: "11" }, { label: "Awaiting approval", value: "4" }, { label: "Distance this month", value: "18,420 km", delta: "+6%" }] },
    { w: 7, type: "bars", horizontal: true, title: "Trips by purpose", sub: "This month", items: [{ label: "Dealer visits & collection", value: 142 }, { label: "Supplier meetings", value: 58 }, { label: "Bank work", value: 34 }, { label: "Government offices", value: 21 }, { label: "Training", value: 12 }] },
    { w: 5, type: "leaders", title: "Most time in the field", rows: [{ name: "Rafiq Uddin", sub: "Rangpur division", value: "64 h" }, { name: "Tanim Roy", sub: "Dinajpur", value: "58 h" }, { name: "Shuvo Das", sub: "Chattogram port", value: "41 h" }, { name: "Nadia Akter", sub: "Dhaka", value: "22 h" }] },
  ],
  shift: [
    { type: "kpis", items: [{ label: "Staff on shift now", value: "112", note: "Morning · Gazipur" }, { label: "Shift coverage", value: "97%", delta: "+2%" }, { label: "Swap requests", value: "5" }, { label: "Overtime this week", value: "96 h", delta: "+14 h", downIsGood: true }] },
    { w: 8, type: "heatmap", title: "Coverage by shift", sub: "% of required staff present", rows: ["Morning", "Evening", "Night"], cols: DAYS, values: [[98, 100, 97, 99, 96, 92, 88], [95, 97, 99, 94, 98, 90, 86], [91, 93, 90, 95, 92, 84, 80]], unit: "%" },
    { w: 4, type: "donut", title: "Who's rostered", center: "296", centerLabel: "staff", slices: [{ label: "Morning", value: 112 }, { label: "Evening", value: 100 }, { label: "Night", value: 84 }] },
    { w: 12, type: "insight", text: "Night shift coverage drops to 80% on Sundays. Three operators have asked to swap into Sunday nights. Approving them closes the gap without overtime." },
  ],
  elearning: [
    { type: "kpis", items: [{ label: "Active learners", value: "264", delta: "+38" }, { label: "Completion rate", value: "71%", delta: "+5%" }, { label: "Certificates issued", value: "183" }, { label: "Learning hours", value: "1,420 h", note: "this quarter" }] },
    { w: 7, type: "progress", title: "Completion by course", goal: 85, warnBelow: 50, items: [{ label: "Workplace safety", value: 88 }, { label: "Customer service", value: 74 }, { label: "Using Business Brain", value: 69 }, { label: "VAT basics for managers", value: 62 }, { label: "Food hygiene (HACCP)", value: 41 }] },
    { w: 5, type: "leaders", title: "Top learners", rows: [{ name: "Mim Sultana", sub: "6 courses", value: "18 h" }, { name: "Rina Begum", sub: "5 courses", value: "15 h" }, { name: "Tanim Roy", sub: "4 courses", value: "12 h" }, { name: "Shuvo Das", sub: "4 courses", value: "11 h" }] },
  ],
  surveys: [
    { type: "kpis", items: [{ label: "Employee NPS", value: "+32", delta: "+6" }, { label: "Response rate", value: "77%" }, { label: "Open surveys", value: "3" }, { label: "Comments to review", value: "41" }] },
    { w: 5, type: "gauge", title: "Engagement score", value: 74, display: "74", caption: "Engagement 2026 · 248 responses so far" },
    { w: 7, type: "stacked", title: "How people answered", sub: "Engagement 2026", keys: ["Agree", "Neutral", "Disagree"], rows: [{ label: "Proud to work here", values: [182, 44, 22] }, { label: "Fairly paid", values: [118, 76, 54] }, { label: "Clear goals", values: [164, 58, 26] }, { label: "Manager support", values: [171, 49, 28] }, { label: "Would recommend", values: [149, 61, 38] }] },
    { w: 12, type: "insight", text: "‘Fairly paid’ scores lowest at Gazipur night shift (31% agree vs 48% company-wide). Night allowance hasn't changed since 2023." },
  ],
  employees: shapla.employees.overview as Widget[],
  payroll: shapla.payroll.overview as Widget[],
  attendance: [
    { type: "kpis", items: [{ label: "Present", value: "386", note: "of 412" }, { label: "Late", value: "17", delta: "-4", downIsGood: true }, { label: "Absent", value: "12" }, { label: "On leave", value: "14" }] },
    { w: 4, type: "donut", title: "Today", center: "94%", centerLabel: "present", slices: [{ label: "On time", value: 369 }, { label: "Late", value: 17 }, { label: "On leave", value: 14 }, { label: "Absent", value: 12 }] },
    { w: 8, type: "heatmap", title: "Attendance this week", sub: "% present by site", rows: ["Gazipur plant", "Head office", "Tongi warehouse", "Depots"], cols: DAYS.slice(0, 6), values: [[96, 95, 97, 94, 93, 88], [98, 97, 99, 96, 95, 0], [92, 94, 90, 93, 91, 85], [95, 93, 96, 94, 92, 90]], unit: "%" },
    { w: 7, type: "bars", title: "Late arrivals by hour", items: [{ label: "8:00", value: 2 }, { label: "8:15", value: 3 }, { label: "8:30", value: 5 }, { label: "8:45", value: 4 }, { label: "9:00+", value: 3 }] },
    { w: 5, type: "insight", text: "Most late arrivals are Tongi staff on the 8:30 bus. The route has been 15+ minutes late four days running." },
  ],
  recruitment: [
    { type: "kpis", items: [{ label: "Open positions", value: "9" }, { label: "Applicants", value: "214", delta: "+62" }, { label: "Time to hire", value: "24 days", delta: "-3", downIsGood: true }, { label: "Offer acceptance", value: "82%" }] },
    { w: 7, type: "funnel", title: "Hiring funnel", sub: "All open roles", stages: [{ label: "Applied", value: 214 }, { label: "Screened", value: 96 }, { label: "Interviewed", value: 34 }, { label: "Offered", value: 7 }, { label: "Hired", value: 5 }] },
    { w: 5, type: "donut", title: "Where applicants come from", slices: [{ label: "Bdjobs", value: 112 }, { label: "LinkedIn", value: 48 }, { label: "Referrals", value: 36 }, { label: "Walk-in", value: 18 }] },
    { w: 12, type: "table", title: "Open positions", cols: ["Role", "Location", "Applicants", "Days open", "Status"], rows: [["Area sales manager", "Rangpur", "48", "18", "Open"], ["Accountant", "Head office", "62", "12", "Open"], ["Machine operator × 3", "Gazipur", "71", "9", "Open"], ["Warehouse lead", "Tongi", "33", "21", "At risk"]] },
  ],
  leave: [
    { type: "kpis", items: [{ label: "On leave today", value: "14" }, { label: "Requests pending", value: "6" }, { label: "Your balance", value: "11 days", note: "annual" }, { label: "Leave liability", value: "৳ 38 L", note: "unused annual leave" }] },
    { w: 5, type: "donut", title: "Leave taken by type", sub: "This year", center: "1,840", centerLabel: "days", slices: [{ label: "Annual", value: 920 }, { label: "Sick", value: 512 }, { label: "Casual", value: 318 }, { label: "Maternity", value: 90 }] },
    { w: 7, type: "line", title: "Leave days per month", labels: MONTHS, series: [{ name: "2026", data: [210, 340, 180, 160, 220, 290] }, { name: "2025", data: [190, 310, 170, 150, 205, 260] }] },
    { w: 12, type: "progress", title: "Your balance", items: [{ label: "Annual", value: 55, right: "11 of 20 days left" }, { label: "Casual", value: 60, right: "6 of 10 days left" }, { label: "Sick", value: 86, right: "12 of 14 days left" }] },
  ],
  expenses: [
    { type: "kpis", items: [{ label: "Claims this month", value: "৳ 4.2 L", delta: "+9%" }, { label: "Awaiting approval", value: "9" }, { label: "Avg. time to reimburse", value: "3.2 days" }, { label: "Policy breaches", value: "2", downIsGood: true }] },
    { w: 5, type: "donut", title: "Spend by category", center: "৳ 4.2 L", centerLabel: "this month", slices: [{ label: "Travel", value: 168, display: "৳ 1.68 L" }, { label: "Fuel", value: 96, display: "৳ 96k" }, { label: "Meals", value: 64, display: "৳ 64k" }, { label: "Training", value: 54, display: "৳ 54k" }, { label: "Other", value: 38, display: "৳ 38k" }] },
    { w: 7, type: "bars", horizontal: true, title: "Top claimants", items: [{ label: "Rafiq Uddin", value: 48, display: "৳ 48,200" }, { label: "Tanim Roy", value: 31, display: "৳ 31,400" }, { label: "Shuvo Das", value: 27, display: "৳ 27,800" }, { label: "Sadia Islam", value: 18, display: "৳ 18,000" }] },
    { w: 12, type: "line", title: "Claims per month", sub: "৳ thousand", labels: MONTHS, series: [{ name: "Claimed", data: [312, 340, 298, 365, 386, 420] }, { name: "Budget", data: [400, 400, 400, 400, 400, 400] }] },
  ],

  // ─────────────── Operational ───────────────
  "purchase-requisition": [
    { type: "kpis", items: [{ label: "Open requisitions", value: "18" }, { label: "Waiting on you", value: "4" }, { label: "Value open", value: "৳ 26 L" }, { label: "Avg. approval time", value: "1.6 days", delta: "-0.4", downIsGood: true }] },
    { w: 7, type: "stacked", title: "Requisitions by department", keys: ["Approved", "Pending", "Rejected"], rows: [{ label: "Production", values: [22, 6, 1] }, { label: "Warehouse", values: [14, 4, 2] }, { label: "Maintenance", values: [11, 5, 0] }, { label: "Admin", values: [8, 2, 1] }, { label: "Sales", values: [5, 1, 0] }] },
    { w: 5, type: "list", status: true, title: "Waiting on you", rows: [{ label: "PR-1184 · Packaging film", sub: "Kamal Hasan · ৳ 4.6 L", value: "Pending" }, { label: "PR-1181 · Safety boots × 40", sub: "Rina Begum · ৳ 86,000", value: "Pending" }, { label: "PR-1180 · Pallet racks", sub: "Shuvo Das · ৳ 3.2 L", value: "Pending" }, { label: "PR-1177 · Printer toner", sub: "Admin · ৳ 18,000", value: "Pending" }] },
  ],
  demand: [
    { type: "kpis", items: [{ label: "November forecast", value: "৳ 4.8 Cr", delta: "+8%" }, { label: "Forecast accuracy", value: "91%", delta: "+2%" }, { label: "Items at stock-out risk", value: "6", downIsGood: true }, { label: "Season", value: "Winter", note: "snacks up, juice down" }] },
    { w: 8, type: "line", title: "Biscuits 200g: demand", sub: "Cartons per month, with forecast", labels: ["Jun", "Jul", "Aug", "Sep", "Oct", "Nov*", "Dec*"], series: [{ name: "Actual / forecast", data: [36000, 38500, 40200, 41000, 42000, 46500, 49000] }, { name: "Last year", data: [33000, 34800, 36100, 37500, 38900, 41200, 43800] }] },
    { w: 4, type: "list", title: "Biggest changes next month", rows: [{ label: "Noodles 4-pack", value: "+11%" }, { label: "Biscuits 200g", value: "+11%" }, { label: "Chips 50g", value: "+4%" }, { label: "Juice 1L", value: "Down 7%" }] },
    { w: 12, type: "insight", text: "Noodles 4-pack is already out of stock at Rangpur and demand rises 11% next month. Plan 2,000 cartons from Gazipur this week." },
  ],
  sales: shapla.sales.overview as Widget[],
  dashboards: [
    { type: "kpis", items: [{ label: "Revenue (MTD)", value: "৳ 9.2 Cr", delta: "+7%" }, { label: "Gross margin", value: "28.4%", delta: "+0.6%" }, { label: "Cash in bank", value: "৳ 6.1 Cr" }, { label: "Receivables", value: "৳ 2.4 Cr", note: "৳ 38 L overdue" }] },
    { w: 6, type: "line", title: "Revenue vs cost", sub: "৳ crore", labels: MONTHS, series: [{ name: "Revenue", data: [8.1, 9.4, 8.8, 9.6, 10.2, 9.2] }, { name: "Cost", data: [6.0, 6.8, 6.4, 6.9, 7.3, 6.6] }] },
    { w: 6, type: "line", title: "Cash in vs cash out", sub: "৳ crore", labels: MONTHS, series: [{ name: "Cash in", data: [7.8, 8.9, 8.6, 9.1, 9.8, 9.0] }, { name: "Cash out", data: [7.1, 8.2, 7.9, 8.4, 9.0, 8.1] }] },
    { w: 4, type: "gauge", title: "Collection rate", value: 82, caption: "৳ 4.2 Cr collected of ৳ 5.1 Cr invoiced this month" },
    { w: 8, type: "list", status: true, title: "Finance alerts", rows: [{ label: "INV-10418 · Meena Bazar · ৳ 6.1 L", sub: "Receivable, 5 days past due", value: "Overdue" }, { label: "INV-10411 · Sky Distribution · ৳ 2.7 L", sub: "Receivable, 9 days past due", value: "Overdue" }, { label: "BILL-882 · Meghna Flour Mills · ৳ 42.0 L", sub: "Payable due 27 Oct", value: "Pending" }] },
  ],
  campaigns: [
    { type: "kpis", items: [{ label: "Reach", value: "1.2 M", delta: "+22%" }, { label: "Leads", value: "842" }, { label: "Cost per lead", value: "৳ 76", delta: "-৳ 9", downIsGood: true }, { label: "Spend", value: "৳ 6.4 L", note: "of ৳ 9 L budget" }] },
    { w: 7, type: "table", title: "Campaign results", cols: ["Campaign", "Channel", "Leads", "Cost / lead", "Status"], rows: [["Winter snacks", "Facebook", "312", "৳ 67", "Running"], ["Dealer bonus Q4", "SMS", "128", "৳ 30", "Running"], ["Eid offer", "TV + Digital", "402", "৳ 104", "Completed"], ["New juice launch", "YouTube", "Not yet", "Not yet", "Scheduled"]] },
    { w: 5, type: "donut", title: "Leads by channel", slices: [{ label: "Facebook", value: 412 }, { label: "TV", value: 214 }, { label: "SMS", value: 128 }, { label: "YouTube", value: 88 }] },
    { w: 12, type: "funnel", title: "Winter snacks funnel", stages: [{ label: "Reached", value: 640000, display: "640k" }, { label: "Engaged", value: 38400, display: "38.4k" }, { label: "Clicked", value: 6200, display: "6.2k" }, { label: "Lead", value: 312 }] },
  ],
  "gate-pass": [
    { type: "kpis", items: [{ label: "Passes today", value: "38" }, { label: "Vehicles inside", value: "7" }, { label: "Visitors on site", value: "15" }, { label: "Avg. gate time", value: "11 min", delta: "-3 min", downIsGood: true }] },
    { w: 8, type: "bars", title: "Gate traffic by hour", sub: "Today, all gates", items: ["6", "8", "10", "12", "14", "16", "18", "20"].map((h, i) => ({ label: `${h}:00`, value: [4, 9, 7, 5, 6, 8, 3, 1][i] })) },
    { w: 4, type: "donut", title: "Pass types", slices: [{ label: "Goods out", value: 16 }, { label: "Goods in", value: 9 }, { label: "Visitors", value: 8 }, { label: "Returnable", value: 5 }] },
    { w: 12, type: "list", status: true, title: "Inside now", rows: [{ label: "Chatta Metro-Ma 14-8890", sub: "Goods in · Gate 2 · since 10:05", value: "Pending" }, { label: "Akij Packaging: 2 visitors", sub: "Meeting with Nadia · since 09:40", value: "Pending" }, { label: "Pallet jack × 2", sub: "Returnable · due back 17:00", value: "Approved" }] },
  ],
  procurement: shapla.procurement.overview as Widget[],
  timesheets: [
    { type: "kpis", items: [{ label: "Hours logged", value: "1,842", note: "this week" }, { label: "Billable", value: "64%", delta: "+3%" }, { label: "To approve", value: "12" }, { label: "Overtime", value: "96 h", downIsGood: true, delta: "+14 h" }] },
    { w: 7, type: "stacked", title: "Hours by project", keys: ["Billable", "Internal", "Overtime"], rows: [{ label: "Plant expansion", values: [420, 60, 38] }, { label: "Dealer portal", values: [260, 40, 22] }, { label: "WMS rollout", values: [210, 50, 30] }, { label: "Support", values: [80, 120, 6] }] },
    { w: 5, type: "leaders", title: "Most hours this week", rows: [{ name: "Shuvo Das", sub: "Warehouse", value: "52 h" }, { name: "Tanim Roy", sub: "Dealer portal", value: "46 h" }, { name: "Arif Khan", sub: "Dealer portal", value: "42 h" }, { name: "Nadia Akter", sub: "WMS rollout", value: "40 h" }] },
  ],
  purchase: [
    { type: "kpis", items: [{ label: "Bills to pay", value: "14" }, { label: "Due this week", value: "৳ 32 L" }, { label: "Paid this month", value: "৳ 1.1 Cr" }, { label: "Early-pay discounts", value: "৳ 84,000", note: "available" }] },
    { w: 7, type: "bars", title: "Payables ageing", sub: "৳ lakh", items: [{ label: "Not due", value: 48, display: "৳ 48 L" }, { label: "0 to 30", value: 32, display: "৳ 32 L" }, { label: "31 to 60", value: 9, display: "৳ 9 L" }, { label: "61 to 90", value: 3, display: "৳ 3 L" }, { label: "90+", value: 1, display: "৳ 1 L" }] },
    { w: 5, type: "timeline", title: "Payment schedule", items: [{ time: "27 Oct", title: "Meghna Flour Mills", sub: "BILL-882 · ৳ 42.0 L" }, { time: "29 Oct", title: "Akij Packaging", sub: "BILL-879 · ৳ 18.6 L" }, { time: "30 Oct", title: "Titas Gas", sub: "BILL-874 · ৳ 3.4 L" }, { time: "2 Nov", title: "City Sugar", sub: "BILL-871 · ৳ 9.8 L" }] },
  ],
  inventory: shapla.inventory.overview as Widget[],

  // ─────────────── Other ───────────────
  onboarding: [
    { type: "kpis", items: [{ label: "Joining this month", value: "12" }, { label: "Leaving this month", value: "4" }, { label: "Checklists open", value: "9" }, { label: "Assets to collect", value: "6", note: "laptops, ID cards" }] },
    { w: 7, type: "progress", title: "Checklist progress", warnBelow: 30, items: [{ label: "Arif Khan · IT admin · joined 27 Oct", value: 60, right: "6 / 10" }, { label: "Habib Rahman · leaving 31 Oct", value: 63, right: "5 / 8" }, { label: "Mim Sultana · joins 1 Nov", value: 20, right: "2 / 10" }, { label: "Lina Das · joins 3 Nov", value: 10, right: "1 / 10" }] },
    { w: 5, type: "list", title: "Day-one ready?", status: true, rows: [{ label: "Laptop for Mim Sultana", sub: "IT", value: "Pending" }, { label: "ID card for Lina Das", sub: "Admin", value: "Pending" }, { label: "Payroll setup for Arif Khan", sub: "HR", value: "Done" }, { label: "Exit interview: Habib", sub: "Booked 30 Oct", value: "Scheduled" }] },
  ],
  invoicing: shapla.invoicing.overview as Widget[],
  "hr-reporting": [
    { type: "kpis", items: [{ label: "Attrition (12 m)", value: "8.4%", delta: "-1.2%", downIsGood: true }, { label: "Cost per hire", value: "৳ 18,500" }, { label: "Absenteeism", value: "2.9%" }, { label: "Training hours / head", value: "3.4 h" }] },
    { w: 7, type: "line", title: "Attrition rate", sub: "Rolling 12 months, %", labels: MONTHS, series: [{ name: "Company", data: [9.8, 9.6, 9.2, 8.9, 8.6, 8.4] }, { name: "Industry", data: [11, 11, 10.8, 10.9, 10.7, 10.6] }] },
    { w: 5, type: "bars", horizontal: true, title: "Why people left", sub: "Exit interviews, 12 months", items: [{ label: "Better pay elsewhere", value: 14 }, { label: "Relocation", value: 8 }, { label: "Career growth", value: 7 }, { label: "Shift timings", value: 5 }, { label: "Other", value: 3 }] },
    { w: 12, type: "table", title: "Scheduled reports", cols: ["Report", "Frequency", "Next run", "Recipients", "Status"], rows: [["Monthly headcount", "Monthly", "1 Nov", "4", "Scheduled"], ["Overtime by department", "Weekly", "28 Oct", "6", "Scheduled"], ["Leave liability", "Monthly", "1 Nov", "2", "Scheduled"], ["Attrition analysis", "Quarterly", "1 Jan", "3", "Scheduled"]] },
  ],
};
