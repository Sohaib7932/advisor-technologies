import type { IconName } from "@/lib/content";
import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * A single stroked icon set so every card, list and badge shares one visual
 * weight. All icons draw on a 24x24 grid with a 1.5 stroke.
 */
function Base({ children, ...props }: IconProps & { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  );
}

const icons: Record<IconName, (props: IconProps) => React.ReactElement> = {
  machinery: (p) => (
    <Base {...p}>
      <path d="M3 20h18" />
      <path d="M5 20v-6l4-2 4 3 6-4v9" />
      <circle cx="9" cy="6" r="2.5" />
      <path d="M9 8.5V12" />
    </Base>
  ),
  network: (p) => (
    <Base {...p}>
      <rect x="9" y="3" width="6" height="5" rx="1.5" />
      <rect x="2" y="16" width="6" height="5" rx="1.5" />
      <rect x="16" y="16" width="6" height="5" rx="1.5" />
      <path d="M12 8v4M5 16v-2h14v2" />
    </Base>
  ),
  computer: (p) => (
    <Base {...p}>
      <rect x="2.5" y="4" width="19" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </Base>
  ),
  security: (p) => (
    <Base {...p}>
      <path d="M3 8.5 14.5 5l1.5 4.5L4.5 13z" />
      <path d="M16 9.5 21 8v4l-5-1.5" />
      <path d="M7 13v3a2 2 0 0 0 2 2h1" />
      <circle cx="10" cy="20" r="1.5" />
    </Base>
  ),
  print: (p) => (
    <Base {...p}>
      <path d="M7 9V3h10v6" />
      <rect x="3" y="9" width="18" height="7" rx="2" />
      <path d="M7 14h10v7H7z" />
    </Base>
  ),
  wrench: (p) => (
    <Base {...p}>
      <path d="M15.5 3.5a5 5 0 0 0-6.2 6.2L3.6 15.4a2 2 0 0 0 0 2.8l2.2 2.2a2 2 0 0 0 2.8 0l5.7-5.7a5 5 0 0 0 6.2-6.2l-3 3-2.8-2.8z" />
    </Base>
  ),
  server: (p) => (
    <Base {...p}>
      <rect x="3" y="3.5" width="18" height="7" rx="2" />
      <rect x="3" y="13.5" width="18" height="7" rx="2" />
      <path d="M7 7h.01M7 17h.01M11 7h4M11 17h4" />
    </Base>
  ),
  satellite: (p) => (
    <Base {...p}>
      <path d="M4 20a9 9 0 0 1 9-9" />
      <path d="M4 20a5 5 0 0 1 5-5" />
      <circle cx="4.5" cy="19.5" r="1.2" />
      <path d="m14 10 6-6M16 3h5v5" />
      <path d="M13.5 6.5 17.5 10.5" />
    </Base>
  ),
  web: (p) => (
    <Base {...p}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a15 15 0 0 1 0 18 15 15 0 0 1 0-18z" />
    </Base>
  ),
  monitor: (p) => (
    <Base {...p}>
      <rect x="2.5" y="3.5" width="19" height="13" rx="2" />
      <path d="M8.5 20.5h7M12 16.5v4" />
    </Base>
  ),
  package: (p) => (
    <Base {...p}>
      <path d="M12 2.8 20.5 7v10L12 21.2 3.5 17V7z" />
      <path d="M3.5 7 12 11.5 20.5 7M12 11.5v9.7" />
    </Base>
  ),
  office: (p) => (
    <Base {...p}>
      <path d="M3 21h18" />
      <path d="M5 21V5a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v16" />
      <path d="M15 21V10h3a2 2 0 0 1 2 2v9" />
      <path d="M8.5 7h3M8.5 11h3M8.5 15h3" />
    </Base>
  ),
  imaging: (p) => (
    <Base {...p}>
      <rect x="2.5" y="6" width="19" height="14" rx="2.5" />
      <circle cx="12" cy="13" r="3.5" />
      <path d="M8 6l1.2-2h5.6L16 6" />
    </Base>
  ),
  notebook: (p) => (
    <Base {...p}>
      <rect x="4" y="4" width="16" height="11" rx="2" />
      <path d="M2 18.5h20" />
    </Base>
  ),
  shield: (p) => (
    <Base {...p}>
      <path d="M12 2.8 20 6v6c0 4.6-3.3 8.2-8 9.2C7.3 20.2 4 16.6 4 12V6z" />
      <path d="m8.8 12 2.2 2.2 4.2-4.4" />
    </Base>
  ),
  spark: (p) => (
    <Base {...p}>
      <path d="M12 2.5 14.2 9 20.5 11 14.2 13 12 19.5 9.8 13 3.5 11 9.8 9z" />
    </Base>
  ),
  gauge: (p) => (
    <Base {...p}>
      <path d="M3.5 18a9 9 0 1 1 17 0" />
      <path d="M12 18l4-5" />
      <circle cx="12" cy="18" r="1.4" />
    </Base>
  ),
  handshake: (p) => (
    <Base {...p}>
      <path d="m3 11 4-4h3l2 2 2-2h3l4 4" />
      <path d="m7.5 12.5 3.5 3.5 1.5-1.5 2 2 1.5-1.5 2 2" />
      <path d="M3 11v3.5L7.5 19" />
      <path d="M21 11v3.5" />
    </Base>
  ),
};

export function Icon({
  name,
  ...props
}: IconProps & { name: IconName }) {
  const Component = icons[name];
  return <Component {...props} />;
}

/* --- Standalone UI icons (navigation, actions) --------------------------- */

export function ArrowUpRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Base>
  );
}

export function ArrowRight(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </Base>
  );
}

export function Menu(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4 7h16M4 12h16M4 17h16" />
    </Base>
  );
}

export function Close(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Base>
  );
}

export function Check(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Base>
  );
}

export function ChevronDown(props: IconProps) {
  return (
    <Base {...props}>
      <path d="m6 9.5 6 6 6-6" />
    </Base>
  );
}

export function MapPin(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M12 21.5s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11z" />
      <circle cx="12" cy="10.5" r="2.5" />
    </Base>
  );
}

export function Mail(props: IconProps) {
  return (
    <Base {...props}>
      <rect x="2.5" y="5" width="19" height="14" rx="2.5" />
      <path d="m3.5 7 8.5 6 8.5-6" />
    </Base>
  );
}

export function Phone(props: IconProps) {
  return (
    <Base {...props}>
      <path d="M4.5 4.5h4l1.5 4-2 1.5a12 12 0 0 0 6 6l1.5-2 4 1.5v4a1.5 1.5 0 0 1-1.7 1.5C10.5 20.2 3.8 13.5 3 6.2A1.5 1.5 0 0 1 4.5 4.5z" />
    </Base>
  );
}

export function Clock(props: IconProps) {
  return (
    <Base {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 2" />
    </Base>
  );
}
