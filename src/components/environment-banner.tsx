import { AlertTriangle, FlaskConical } from "lucide-react";

type Environment = "development" | "staging" | "production";

const environmentConfig: Record<
  Exclude<Environment, "production">,
  {
    label: string;
    description: string;
    className: string;
    icon: typeof AlertTriangle;
  }
> = {
  development: {
    label: "DEVELOPMENT ENVIRONMENT",
    description: "Changes and data may be temporary.",
    className:
      "border-blue-300 bg-blue-50 text-blue-900 dark:border-blue-900 dark:bg-blue-950 dark:text-blue-200",
    icon: FlaskConical,
  },
  staging: {
    label: "STAGING ENVIRONMENT",
    description: "Pre-production environment. Verify before release.",
    className:
      "border-amber-300 bg-amber-50 text-amber-950 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-200",
    icon: AlertTriangle,
  },
};

export function EnvironmentBanner() {
  const environment = (import.meta.env.NEXT_ENV ??
    import.meta.env.NODE_ENV) as Environment;

  if (environment === "production") {
    return null;
  }

  if (environment !== "development" && environment !== "staging") {
    return null;
  }

  const config = environmentConfig[environment];
  const Icon = config.icon;

  return (
    <div
      role="status"
      aria-label={`${environment} environment`}
      className={`relative z-50 flex min-h-9 items-center justify-center gap-2 border-b px-4 py-2 text-center text-xs font-semibold sm:text-sm ${config.className}`}
    >
      <Icon className="size-4 shrink-0" aria-hidden="true" />

      <span>{config.label}</span>

      <span className="hidden font-normal sm:inline">
        — {config.description}
      </span>
    </div>
  );
}
