import { JarvisAppShell } from "@/components/jarvis/app-shell";

export default function JarvisLayout({ children }: { children: React.ReactNode }) {
    return <JarvisAppShell>{children}</JarvisAppShell>;
}
