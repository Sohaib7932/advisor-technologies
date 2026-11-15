"use client";

import { useSyncExternalStore } from "react";

/**
 * Open/closed state of the mobile menu, shared by every menu button (the one
 * in the notched header and the one in the floating pill) and the menu panel.
 */
let open = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

export const menu = {
  set(next: boolean) {
    if (open === next) return;
    open = next;
    document.documentElement.toggleAttribute("data-menu-open", next);
    document.body.style.overflow = next ? "hidden" : "";
    emit();
  },
  toggle() {
    menu.set(!open);
  },
};

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useMenuOpen() {
  return useSyncExternalStore(
    subscribe,
    () => open,
    () => false,
  );
}
