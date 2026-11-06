"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import clsx from "clsx";
import { countryName, detectCountry, DIAL, flag, TOP } from "@/lib/phone";

/**
 * A phone field with a small country picker in front. The picker is a native select laid over the
 * flag and code, so phones open their own list. It posts as `<name>_country`; read the two together
 * with normPhone(number, country).
 */
export default function PhoneInput({
  name,
  className,
  placeholder,
  invalid,
  inputRef,
}: {
  name: string;
  className: string;
  placeholder?: string;
  invalid?: boolean;
  inputRef?: React.Ref<HTMLInputElement>;
}) {
  const [country, setCountry] = useState("BD");
  const touched = useRef(false);

  useEffect(() => {
    detectCountry().then((c) => {
      if (!touched.current) setCountry(c);
    });
  }, []);

  const options = useMemo(() => {
    const rest = Object.keys(DIAL)
      .filter((c) => !TOP.includes(c))
      .map((c) => [c, countryName(c)] as const)
      .sort((a, b) => a[1].localeCompare(b[1]));
    return { top: TOP.map((c) => [c, countryName(c)] as const), rest };
  }, []);

  // The wrapper wears the input's look; its focus ring follows whichever part has focus. The rewritten
  // classes must appear literally somewhere for Tailwind to build them:
  // focus-within:border-orange focus-within:shadow-[0_0_0_4px_rgba(241,98,34,0.14)] focus-within:border-[#262D6C]
  const shell = clsx(className.replace(/\bfocus:/g, "focus-within:").replace(/\bpx-[\d.]+\b/g, ""), "flex items-stretch p-0");

  return (
    <span className={shell}>
      {/* The number comes first in the markup so a wrapping <label> names it, not the picker. */}
      <input
        ref={inputRef}
        name={name}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={country === "BD" ? placeholder : ""}
        aria-invalid={invalid}
        className="min-w-0 flex-1 bg-transparent px-3"
        style={{ outline: "none" }} // the shell shows focus; the global :focus-visible ring would draw a box inside it
      />
      <span className="relative order-first flex shrink-0 items-center gap-1 border-r border-line pl-3 pr-2 text-[15px] text-ink">
        <span aria-hidden>{flag(country)}</span>
        <span className="tabular-nums">+{DIAL[country]}</span>
        <ChevronDown size={14} aria-hidden className="text-muted" />
        <select
          name={`${name}_country`}
          value={country}
          aria-label="Country code"
          onChange={(e) => {
            touched.current = true;
            setCountry(e.target.value);
          }}
          className="absolute inset-0 cursor-pointer opacity-0"
        >
          <optgroup label="Common">
            {options.top.map(([c, n]) => (
              <option key={c} value={c}>{`${n} +${DIAL[c]}`}</option>
            ))}
          </optgroup>
          <optgroup label="All countries">
            {options.rest.map(([c, n]) => (
              <option key={c} value={c}>{`${n} +${DIAL[c]}`}</option>
            ))}
          </optgroup>
        </select>
      </span>
    </span>
  );
}
