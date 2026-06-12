// Outer admin layout – minimal passthrough.
// Auth check is in app/admin/(protected)/layout.jsx.
// This layer only sets global noindex metadata for ALL /admin/** routes.

export const metadata = {
  robots: {
    index:     false,
    follow:    false,
    noarchive: true,
    nosnippet: true,
  },
};

export default function AdminRootLayout({ children }) {
  return <>{children}</>;
}
