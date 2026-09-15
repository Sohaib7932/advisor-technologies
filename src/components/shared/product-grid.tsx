"use client";

import { useMemo, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { productCategories, products } from "@/lib/content";
import { cn } from "@/lib/utils";

/**
 * Filterable catalogue. The grid is a bento: the first tile of each view spans
 * two columns so the layout never reads as a flat table of equal boxes.
 */
export function ProductGrid() {
  const [active, setActive] =
    useState<(typeof productCategories)[number]>("All");

  const visible = useMemo(
    () =>
      active === "All"
        ? products
        : products.filter((product) => product.category === active),
    [active],
  );

  return (
    <div>
      {/* Filters */}
      <div
        role="tablist"
        aria-label="Filter products by category"
        className="flex flex-wrap gap-2"
      >
        {productCategories.map((category) => {
          const isActive = category === active;
          const count =
            category === "All"
              ? products.length
              : products.filter((p) => p.category === category).length;

          return (
            <button
              key={category}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActive(category)}
              className={cn(
                "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-300",
                isActive
                  ? "bg-navy-600 text-white shadow-soft"
                  : "bg-surface text-graphite-600 ring-1 ring-navy-900/8 hover:bg-navy-50 hover:text-navy-900",
              )}
            >
              {category}
              <span
                className={cn(
                  "text-xs tabular-nums",
                  isActive ? "text-navy-200" : "text-graphite-400",
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <ul className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {visible.map((product, index) => (
          <li
            key={product.id}
            className={cn(
              "group flex flex-col rounded-card bg-surface p-7 shadow-soft ring-1 ring-navy-900/6 transition-all duration-500 ease-out-soft hover:-translate-y-1 hover:shadow-lift",
              index === 0 &&
                "justify-center sm:col-span-2 lg:col-span-2 lg:flex-row lg:items-center lg:gap-7",
            )}
          >
            <span
              className={cn(
                "flex size-12 shrink-0 items-center justify-center rounded-xl bg-navy-600/10 text-navy-600 transition-colors duration-300 group-hover:bg-navy-600 group-hover:text-white",
                index === 0 && "lg:size-14",
              )}
            >
              <Icon
                name={product.icon}
                className={cn("size-5.5", index === 0 && "lg:size-6.5")}
              />
            </span>

            <div className={cn(index !== 0 && "mt-6")}>
              <span className="eyebrow text-graphite-400">
                {product.category}
              </span>
              <h3
                className={cn(
                  "mt-2 font-display font-semibold text-ink",
                  index === 0 ? "text-2xl" : "text-lg",
                )}
              >
                {product.title}
              </h3>
              <p className="mt-2.5 text-sm leading-relaxed text-graphite-600">
                {product.body}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
