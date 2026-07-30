import AdminLayout from '@/components/layouts/AdminLayout';
import { TooltipProvider } from '@/components/ui/tooltip';
export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <TooltipProvider>
      <AdminLayout>{children}</AdminLayout>
    </TooltipProvider>
  );
}
