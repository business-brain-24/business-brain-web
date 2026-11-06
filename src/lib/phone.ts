// Phone numbers for every form on the site, and for the lead API (functions/api/lead.ts).
//
// Forms show a country picker beside the number. It starts on the visitor's country, read from
// Cloudflare (/cdn-cgi/trace), and on Bangladesh when that is unknown.
//   - Bangladesh: an 11-digit mobile, 013 to 019 (01712345678), or the same without its 0.
//   - Other countries: the local number, with or without its leading 0.
//   - A number typed with + or 00 is read as international, whatever the picker says.
// Every form sends the number in E.164 (+8801712345678). The API checks it again, and reads a number
// without a country code as Bangladeshi. The CRM refuses Bangladesh numbers with other prefixes
// (such as 012), so the visitor is asked here instead.
// Joya runs the same rule (public/js/phone.js and shared/leads.ts normPhone).

const BD_MOBILE = /^1[3-9]\d{8}$/;
// Countries whose local numbers keep the leading 0 after the country code.
const KEEP_ZERO = new Set(["IT", "SM", "VA", "CI"]);

/** Country calling codes by ISO 3166 code. */
export const DIAL: Record<string, string> = Object.fromEntries(
  (
    "AF93 AL355 DZ213 AS1 AD376 AO244 AI1 AG1 AR54 AM374 AW297 AU61 AT43 AZ994 BS1 BH973 BD880 BB1 BY375 BE32 BZ501 BJ229 BM1 BT975 " +
    "BO591 BA387 BW267 BR55 VG1 BN673 BG359 BF226 BI257 KH855 CM237 CA1 CV238 KY1 CF236 TD235 CL56 CN86 CO57 KM269 CG242 CD243 CK682 " +
    "CR506 CI225 HR385 CU53 CW599 CY357 CZ420 DK45 DJ253 DM1 DO1 EC593 EG20 SV503 GQ240 ER291 EE372 SZ268 ET251 FK500 FO298 FJ679 FI358 " +
    "FR33 GF594 PF689 GA241 GM220 GE995 DE49 GH233 GI350 GR30 GL299 GD1 GP590 GU1 GT502 GG44 GN224 GW245 GY592 HT509 HN504 HK852 HU36 " +
    "IS354 IN91 ID62 IR98 IQ964 IE353 IM44 IL972 IT39 JM1 JP81 JE44 JO962 KZ7 KE254 KI686 XK383 KW965 KG996 LA856 LV371 LB961 LS266 " +
    "LR231 LY218 LI423 LT370 LU352 MO853 MG261 MW265 MY60 MV960 ML223 MT356 MH692 MQ596 MR222 MU230 YT262 MX52 FM691 MD373 MC377 MN976 " +
    "ME382 MS1 MA212 MZ258 MM95 NA264 NR674 NP977 NL31 NC687 NZ64 NI505 NE227 NG234 NU683 KP850 MK389 MP1 NO47 OM968 PK92 PW680 PS970 " +
    "PA507 PG675 PY595 PE51 PH63 PL48 PT351 PR1 QA974 RE262 RO40 RU7 RW250 KN1 LC1 VC1 WS685 SM378 ST239 SA966 SN221 RS381 SC248 SL232 " +
    "SG65 SX1 SK421 SI386 SB677 SO252 ZA27 KR82 SS211 ES34 LK94 SD249 SR597 SE46 CH41 SY963 TW886 TJ992 TZ255 TH66 TL670 TG228 TO676 " +
    "TT1 TN216 TR90 TM993 TC1 TV688 UG256 UA380 AE971 GB44 US1 UY598 UZ998 VU678 VA39 VE58 VN84 VI1 YE967 ZM260 ZW263"
  )
    .split(" ")
    .map((c) => [c.slice(0, 2), c.slice(2)]),
);

/** Listed first in the picker: home, then where most of our visitors from abroad are. */
export const TOP = ["BD", "IN", "AE", "SA", "QA", "KW", "OM", "BH", "MY", "SG", "GB", "US", "CA", "AU"];

function intl(p: string): string | null {
  if (p.startsWith("+880")) {
    const local = p.slice(4).replace(/^0/, ""); // +880 01712… is common too
    return BD_MOBILE.test(local) ? "+880" + local : null;
  }
  return /^\+[1-9]\d{7,14}$/.test(p) ? p : null;
}

/** The number in E.164 (+8801712345678), or null when it does not fit. `country` is the picker's choice. */
export function normPhone(raw: string, country = "BD"): string | null {
  let p = String(raw).replace(/[\s\-().]/g, "");
  if (p.startsWith("00")) p = "+" + p.slice(2);
  if (p.startsWith("+")) return intl(p);
  if (!/^\d+$/.test(p)) return null;
  const dial = DIAL[country] ?? "880";
  if (dial === "880") {
    if (/^0\d{10}$/.test(p)) p = p.slice(1);
    else if (/^880\d{10,11}$/.test(p)) p = p.slice(3).replace(/^0/, "");
    return BD_MOBILE.test(p) ? "+880" + p : null;
  }
  if (p.startsWith(dial) && p.length - dial.length >= 9) p = p.slice(dial.length); // typed the code without +
  if (!KEEP_ZERO.has(country)) p = p.replace(/^0/, "");
  if (dial === "1" && !/^[2-9]\d{9}$/.test(p)) return null;
  if (p.length < 6) return null;
  return intl("+" + dial + p);
}

export function countryName(code: string): string {
  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export const flag = (code: string) => String.fromCodePoint(...[...code].map((c) => 0x1f1a5 + c.charCodeAt(0)));

/** The hint under the field. */
export function phoneHint(country = "BD"): string {
  return country === "BD" ? "Enter an 11-digit mobile, for example 01712 345678." : `Check the number for ${countryName(country)}.`;
}

/** What the API answers when a number gets past the form. */
export const PHONE_HINT = "Enter a mobile number with its country code, for example +880 1712 345678.";

let guess: Promise<string> | null = null;
/** The visitor's country from Cloudflare, or BD. Asked once per page load. */
export function detectCountry(): Promise<string> {
  guess ??= fetch("/cdn-cgi/trace")
    .then((r) => (r.ok ? r.text() : ""))
    .then((t) => {
      const loc = /^loc=([A-Z]{2})$/m.exec(t)?.[1] ?? "";
      return DIAL[loc] ? loc : "BD";
    })
    .catch(() => "BD");
  return guess;
}
