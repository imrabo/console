interface InfoRowProps {
  label: string;
  value?: React.ReactNode;
}

export function InfoRow({ label, value }: InfoRowProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-1.5 rounded-lg border p-3">
      <span className="text-muted-foreground text-sm">{label}</span>

      <span className="w-full min-w-0 text-left font-medium [overflow-wrap:anywhere] break-words">
        {value === undefined || value === null || value === '' ? '-' : value}
      </span>
    </div>
  );
}
