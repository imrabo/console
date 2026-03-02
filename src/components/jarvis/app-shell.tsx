export function JarvisAppShell({ children }: { children: React.ReactNode }) {
    return <main className="h-screen w-full overflow-hidden bg-background text-foreground">{children}</main>;
}
