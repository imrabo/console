"use client";

import { TooltipProvider } from "@/components/ui/tooltip";

import { Outlet } from "react-router-dom";

export function ToolTipProvider() {
  return (
    <TooltipProvider>
      <Outlet />
    </TooltipProvider>
  );
}
