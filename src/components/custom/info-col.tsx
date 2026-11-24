interface InfoColProps {
  label: string;
  value?: React.ReactNode;
}

export function InfoCol({ label, value }: InfoColProps) {
  return (
    <div className="flex w-full min-w-0 flex-col items-start gap-2 rounded-lg border p-3">
      <span className="text-muted-foreground text-sm">{label}</span>

      <div className="w-full min-w-0 font-medium [overflow-wrap:anywhere] break-words">
        {value === undefined || value === null || value === '' ? '-' : value}
      </div>
    </div>
  );
}
