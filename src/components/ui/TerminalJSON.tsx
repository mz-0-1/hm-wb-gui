"use client";

import React, { useEffect, useState, useRef } from "react";
import { ProcessResult } from "@/types";

interface TerminalJSONProps {
  data: ProcessResult | Record<string, unknown>;
  typingSpeed?: number;
  color?: "green" | "red";
  signature?: string | null;
}

function SignatureWriter({ text, speed }: { text: string; speed: number }) {
  const [displayed, setDisplayed] = useState("");
  const spanRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!spanRef.current) return;
    
    spanRef.current.style.width = "0";
    const textLength = text.length;
    let currentPosition = 0;

    const interval = setInterval(() => {
      if (currentPosition < textLength) {
        setDisplayed(text.slice(0, currentPosition + 1));
        currentPosition += 1;
      } else {
        clearInterval(interval);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, speed]);

  return (
    <span 
      ref={spanRef}
      className="inline-block border-r-2 border-transparent"
      style={{
        backgroundImage: `linear-gradient(transparent calc(100% - 1px), currentColor 1px)`,
        backgroundSize: '100% 100%',
        backgroundRepeat: 'no-repeat'
      }}
    >
      {displayed}
    </span>
  );
}

export function TerminalJSON({
  data,
  typingSpeed = 30,
  color,
  signature = null,
}: TerminalJSONProps) {
  const jsonString = JSON.stringify(data, null, 2);
  const [typedText, setTypedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  const getColorClass = () => {
    if (color) return color === "red" ? "text-red-400" : "text-lime-400";
    if (data.status === "pending") return "text-yellow-400";
    if (data.status === "completed") return "text-lime-400";
    return "text-red-400";
  };

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let currentIndex = 0;
    setTypedText("");
    setIsComplete(false);

    function typeNextChar() {
      if (currentIndex < jsonString.length) {
        setTypedText(jsonString.slice(0, currentIndex + 1));
        currentIndex++;
        timeoutId = setTimeout(typeNextChar, typingSpeed);
      } else {
        setIsComplete(true);
      }
    }

    timeoutId = setTimeout(typeNextChar, typingSpeed);
    return () => clearTimeout(timeoutId);
  }, [jsonString, typingSpeed]);

  return (
    <div className="rounded-md bg-black p-4 font-mono text-sm relative overflow-auto">
      <pre className={`whitespace-pre-wrap ${getColorClass()}`}>
        {typedText}
        {!isComplete && <span className="animate-pulse">_</span>}
      </pre>
      {signature && isComplete && (
        <div 
        className="absolute bottom-4 right-40 text-lime-300 italic flex justify-end whitespace-nowrap" 
        style={{ 
            fontFamily: "'Dancing Script', cursive, system-ui",
            fontSize: "1.2rem",
            transform: "translateX(0)"
          }}
        >
          ~ <SignatureWriter text={signature} speed={typingSpeed * 2} />
        </div>
      )}
    </div>
  );
}