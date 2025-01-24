"use client";

import React, { useEffect, useState } from "react";

interface TerminalJSONProps {
  data: any;
  typingSpeed?: number; // ms delay between chars (optional)
}

export function TerminalJSON({ data, typingSpeed = 40 }: TerminalJSONProps) {
  // Convert `data` to a formatted JSON string
  const jsonString = JSON.stringify(data, null, 2) || "No data";
  const [typedText, setTypedText] = useState("");

  // Basic success/fail logic
  const isSuccess =
    (data?.status && data.status.toLowerCase().includes("success")) ||
    (!data?.error && !data?.status?.toLowerCase().includes("fail"));

  const isError =
    data?.error ||
    (data?.status && data.status.toLowerCase().includes("fail"));

  // Typewriter effect: increment index, set typed substring
  useEffect(() => {
    let index = 0;
    setTypedText(""); // reset typedText each render

    const intervalId = setInterval(() => {
      setTypedText((prev) => prev + jsonString[index]);
      index++;
      if (index >= jsonString.length) {
        clearInterval(intervalId);
      }
    }, typingSpeed);

    return () => {
      clearInterval(intervalId);
    };
  }, [jsonString, typingSpeed]);

  // Classes for old console feel
  // If success => green text, if error => red text, else white
  const textColorClass = isSuccess
    ? "text-lime-400"
    : isError
    ? "text-red-400"
    : "text-white";

  return (
    <div className="rounded-md bg-black p-4 font-mono text-sm">
      <pre className={`whitespace-pre-wrap ${textColorClass}`}>
        {typedText}
        {/* Blinking cursor if still typing */}
        {typedText.length < jsonString.length && (
          <span className="animate-pulse">_</span>
        )}
      </pre>
    </div>
  );
}
