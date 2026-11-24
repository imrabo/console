import type React from "react";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-12 md:px-6 lg:py-16">
        <div className="w-full max-w-md">{children}</div>
      </main>
    </div>
  );
}
