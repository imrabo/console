"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";

export type ImraboScopeMode = "cursor" | "fixed" | "target";

export function ImraboScope({
    active,
    mode,
    target,
    fixedPoint,
    radius = 180,
    darkness = 0.75,
    showPulse = true,
}: {
    active: boolean;
    mode: ImraboScopeMode;
    target?: { x: number; y: number } | null;
    fixedPoint?: { x: number; y: number } | null;
    radius?: number;
    darkness?: number;
    showPulse?: boolean;
}) {
    const [cursor, setCursor] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!active || mode !== "cursor") return;

        const initialize = () => {
            setCursor({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
        };

        const onMove = (event: MouseEvent) => {
            setCursor({ x: event.clientX, y: event.clientY });
        };

        initialize();
        window.addEventListener("mousemove", onMove);
        return () => window.removeEventListener("mousemove", onMove);
    }, [active, mode]);

    const point = useMemo(() => {
        if (mode === "target" && target) return target;
        if (mode === "fixed" && fixedPoint) return fixedPoint;
        return cursor;
    }, [cursor, fixedPoint, mode, target]);

    if (!active) return null;

    const background = `radial-gradient(circle ${radius}px at ${point.x}px ${point.y}px, rgba(0,0,0,0) 0%, rgba(0,0,0,0) 45%, rgba(0,0,0,${darkness}) 70%)`;

    return (
        <>
            <motion.div
                className="pointer-events-none fixed inset-0 z-[25]"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, background }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{ boxShadow: "inset 0 0 40px rgba(59,130,246,0.2)" }}
            />

            <motion.div
                className="pointer-events-none fixed z-[26] rounded-full border"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{
                    opacity: 1,
                    left: point.x,
                    top: point.y,
                    width: radius * 2,
                    height: radius * 2,
                    x: "-50%",
                    y: "-50%",
                }}
                transition={{ duration: 0.15, ease: "easeOut" }}
                style={{
                    borderColor: "rgba(59,130,246,0.75)",
                    filter: "blur(0.3px)",
                    boxShadow: "0 0 20px rgba(59,130,246,0.8)",
                }}
            />

            {showPulse ? (
                <motion.div
                    className="pointer-events-none fixed z-[26] rounded-full border"
                    animate={{
                        left: point.x,
                        top: point.y,
                        width: radius * 2,
                        height: radius * 2,
                        x: "-50%",
                        y: "-50%",
                        scale: [1, 1.12, 1],
                        opacity: [0.55, 0.15, 0.55],
                    }}
                    transition={{ duration: 2.2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                    style={{ borderColor: "rgba(59,130,246,0.55)" }}
                />
            ) : null}
        </>
    );
}
