
// This layout's logic is now handled by the root app-layout.tsx
// to prevent conflicting layout components. This component now
// simply passes its children through.
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
