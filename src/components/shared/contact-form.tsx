"use client";

import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { ArrowUpRight, Check } from "@/components/ui/icons";
import { services, sectors } from "@/lib/content";
import { site } from "@/lib/site";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-2xl border-0 bg-canvas px-5 py-3.5 text-[0.9375rem] text-ink ring-1 ring-inset ring-navy-900/10 transition-shadow placeholder:text-graphite-400 focus:ring-2 focus:ring-navy-600 focus:outline-none";

const labelClass = "block text-sm font-medium text-navy-900";

/**
 * Enquiry form. There is no backend yet, so submitting opens the visitor's
 * mail client with a pre-composed message to the company inbox. Swap
 * `handleSubmit` for a server action once an endpoint exists.
 */
export function ContactForm() {
  const params = useSearchParams();
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const get = (key: string) => String(data.get(key) ?? "").trim();

    const body = [
      `Name: ${get("name")}`,
      `Organisation: ${get("organisation")}`,
      `Email: ${get("email")}`,
      `Phone: ${get("phone")}`,
      `Requirement: ${get("requirement") || "Not specified"}`,
      `Sector: ${get("sector") || "Not specified"}`,
      `Location: ${get("city") || "Not specified"}`,
      "",
      "Details:",
      get("message"),
    ].join("\n");

    const subject = `Enquiry: ${get("requirement") || "General"} for ${get("organisation") || get("name")}`;

    window.location.href = `mailto:${site.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-5 sm:grid-cols-2">
      <div className="sm:col-span-1">
        <label htmlFor="name" className={labelClass}>
          Full name <Required />
        </label>
        <input
          id="name"
          name="name"
          required
          autoComplete="name"
          placeholder="Your name"
          className={cn(fieldClass, "mt-2")}
        />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="organisation" className={labelClass}>
          Organisation
        </label>
        <input
          id="organisation"
          name="organisation"
          autoComplete="organization"
          placeholder="Department, ministry or company"
          className={cn(fieldClass, "mt-2")}
        />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="email" className={labelClass}>
          Email <Required />
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          placeholder="you@organisation.gov.pk"
          className={cn(fieldClass, "mt-2")}
        />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="phone" className={labelClass}>
          Phone
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          autoComplete="tel"
          placeholder="+92 300 0000000"
          className={cn(fieldClass, "mt-2")}
        />
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="requirement" className={labelClass}>
          Requirement
        </label>
        <select
          id="requirement"
          name="requirement"
          defaultValue={params.get("requirement") ?? ""}
          className={cn(fieldClass, "mt-2 appearance-none")}
        >
          <option value="">Select a division</option>
          {services.map((service) => (
            <option key={service.id} value={service.title}>
              {service.title}
            </option>
          ))}
          <option value="Other">Something else</option>
        </select>
      </div>

      <div className="sm:col-span-1">
        <label htmlFor="sector" className={labelClass}>
          Sector
        </label>
        <select
          id="sector"
          name="sector"
          defaultValue={params.get("sector") ?? ""}
          className={cn(fieldClass, "mt-2 appearance-none")}
        >
          <option value="">Select a sector</option>
          {sectors.map((sector) => (
            <option key={sector} value={sector}>
              {sector}
            </option>
          ))}
        </select>
      </div>

      <input type="hidden" name="city" value={params.get("city") ?? ""} />

      <div className="sm:col-span-2">
        <label htmlFor="message" className={labelClass}>
          Details of your requirement <Required />
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          placeholder="Quantities, specifications, site location, tender reference and timelines…"
          className={cn(fieldClass, "mt-2 resize-y")}
        />
      </div>

      <div className="flex flex-col gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-graphite-500">
          Your details are used only to respond to this enquiry.
        </p>
        <button
          type="submit"
          className="group inline-flex h-13 shrink-0 items-center justify-center gap-2 rounded-full bg-navy-600 px-8 font-medium text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-navy-700 hover:shadow-lift"
        >
          {sent ? "Opening your mail app" : "Send enquiry"}
          {sent ? (
            <Check className="size-4" />
          ) : (
            <ArrowUpRight className="size-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          )}
        </button>
      </div>

      {sent && (
        <p
          role="status"
          className="sm:col-span-2 rounded-2xl bg-navy-50 px-5 py-4 text-sm text-navy-800 ring-1 ring-navy-600/15"
        >
          We have opened your email client with the enquiry composed. If nothing
          happened, write to{" "}
          <a
            href={`mailto:${site.contact.email}`}
            className="font-medium underline"
          >
            {site.contact.email}
          </a>
          .
        </p>
      )}
    </form>
  );
}

function Required() {
  return (
    <span className="text-navy-500" aria-hidden>
      *
    </span>
  );
}
