/**
 * Remounts on every navigation (unlike layout.tsx), so its `page-enter`
 * animation plays as each new page arrives. See globals.css.
 */
export default function Template({ children }: { children: React.ReactNode }) {
  return <div className="page-enter">{children}</div>;
}
