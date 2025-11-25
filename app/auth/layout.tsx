import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication - CanStudy Tracker",
  description: "Sign in or create an account to track your Canadian visa application",
};

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950">
      {children}
    </div>
  );
}
