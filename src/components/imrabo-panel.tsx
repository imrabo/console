"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { X } from "lucide-react";

export function ImraboPanel({
    title,
    children,
    defaultPosition,
    mapDragging,
    followMode,
    motionOffset,
    width,
    onClose,
}: {
    title: string;
    children: ReactNode;
    defaultPosition: { top: number; left: number };
    mapDragging: boolean;
    followMode?: boolean;
    motionOffset?: { dx: number; dy: number };
    width?: number;
    onClose?: () => void;
}) {
    const driftX = followMode ? (motionOffset?.dx ?? 0) * 0.05 : 0;
    const driftY = followMode ? (motionOffset?.dy ?? 0) * 0.05 : 0;

    return (
        <motion.div
            drag

            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: mapDragging ? 0.7 : 0.9, scale: 1, x: driftX, y: driftY }}
            transition={{ duration: 0.25 }}
            className="fixed z-10 rounded-sm border border-blue-500/30 shadow-none p-3 text-blue-100"
            style={{
                top: defaultPosition.top,
                left: defaultPosition.left,
                width: width ?? 340,
                background: "rgba(10,15,25,0.75)",
                borderColor: "rgba(59,130,246,0.35)",
                backdropFilter: "blur(12px)",
                boxShadow: "0 0 30px rgba(59,130,246,0.2)",
            }}
        >
            <div className="mb-2 flex items-center justify-between">
                <p className="text-sm font-semibold tracking-wide">{title}</p>
                {onClose ? (
                    <button type="button" onClick={onClose} className="rounded-full border border-blue-300/30 p-1 hover:bg-blue-500/10">
                        <X className="h-3.5 w-3.5" />
                    </button>
                ) : null}
            </div>
            <div className="text-xs leading-5">{children}</div>
        </motion.div>
    );
}
