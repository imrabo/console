"use client";

import { FormEvent, useState } from "react";
import { Mic, SendHorizontal } from "lucide-react";

export function ImraboConsole({
    onCommand,
    onVoice,
}: {
    onCommand: (command: string) => Promise<void> | void;
    onVoice: () => void;
}) {
    const [value, setValue] = useState("");

    const submit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const text = value.trim();
        if (!text) return;
        setValue("");
        await onCommand(text);
    };

    return (
        <form
            onSubmit={submit}
            className="fixed bottom-5 left-1/2 z-20 flex w-[500px] max-w-[90%] items-center gap-2 rounded-full border px-4 py-2"
            style={{
                transform: "translateX(-50%)",
                background: "rgba(10,15,25,0.8)",
                borderColor: "rgba(0,255,255,0.3)",
            }}
        >
            <input
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Type a command for ImRabo..."
                className="h-9 flex-1 bg-transparent text-sm text-blue-100 outline-none placeholder:text-blue-300/60"
            />
            <button
                type="button"
                onClick={onVoice}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/30 text-blue-100 hover:bg-blue-500/10"
            >
                <Mic className="h-4 w-4" />
            </button>
            <button
                type="submit"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-blue-300/30 text-blue-100 hover:bg-blue-500/10"
            >
                <SendHorizontal className="h-4 w-4" />
            </button>
        </form>
    );
}
