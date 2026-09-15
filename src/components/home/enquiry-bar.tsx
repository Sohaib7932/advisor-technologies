"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, ChevronDown } from "@/components/ui/icons";
import { services, sectors } from "@/lib/content";

const cities = ["Islamabad", "Rawalpindi", "Karachi", "Lahore", "Other / nationwide"];

/**
 * Hero quick-enquiry bar. Selections are carried to the contact page as query
 * params so the full enquiry form arrives pre-filled.
 */
export function EnquiryBar() {
  const router = useRouter();
  const [requirement, setRequirement] = useState("");
  const [sector, setSector] = useState("");
  const [city, setCity] = useState("");

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (requirement) params.set("requirement", requirement);
    if (sector) params.set("sector", sector);
    if (city) params.set("city", city);
    const query = params.toString();
    router.push(`/contact${query ? `?${query}` : ""}#enquiry`);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full max-w-3xl flex-col gap-1.5 rounded-panel bg-white/90 p-2 shadow-float ring-1 ring-white/40 backdrop-blur-xl sm:flex-row sm:items-center sm:gap-0 sm:rounded-full sm:p-2"
    >
      <Field
        label="Requirement"
        value={requirement}
        onChange={setRequirement}
        options={services.map((s) => s.title)}
      />
      <Divider />
      <Field
        label="Sector"
        value={sector}
        onChange={setSector}
        options={[...sectors]}
      />
      <Divider />
      <Field label="Location" value={city} onChange={setCity} options={cities} />

      <button
        type="submit"
        className="group mt-1 inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-navy-900 px-7 font-medium text-white transition-colors duration-300 hover:bg-navy-800 sm:mt-0 sm:ml-1"
      >
        Get a quote
        <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </button>
    </form>
  );
}

function Divider() {
  return <span aria-hidden className="hidden h-8 w-px bg-navy-900/10 sm:block" />;
}

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="group relative flex min-w-0 flex-1 cursor-pointer items-center rounded-full px-5 py-2.5 transition-colors hover:bg-white/50">
      <span className="min-w-0 flex-1">
        <span className="block text-[0.6875rem] font-semibold tracking-[0.12em] text-graphite-500 uppercase">
          {label}
        </span>
        <span className="mt-0.5 block truncate text-sm font-medium text-navy-900">
          {value || "Any"}
        </span>
      </span>
      <ChevronDown className="ml-2 size-4 shrink-0 text-graphite-400" />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="absolute inset-0 cursor-pointer opacity-0"
      >
        <option value="">Any</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}
