import type { ReactNode } from "react";
import { TooltipProvider } from "@/components/ui/tooltip";

interface ToolTipProviderProps {
  children: ReactNode;
}

export function ToolTipProvider({ children }: ToolTipProviderProps) {
  return <TooltipProvider delayDuration={200}>{children}</TooltipProvider>;
}
