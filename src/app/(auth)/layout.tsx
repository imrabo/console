import AuthLayout from '@/components/layouts/AuthLayout';

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return <AuthLayout>{children}</AuthLayout>;
}
