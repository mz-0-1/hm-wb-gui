"use client";

import React, { useEffect, useState } from "react";
import { ProcessResult } from "@/types";

interface TerminalJSONProps {
  data: ProcessResult | Record<string, unknown>;
  typingSpeed?: number;
  color?: "green" | "red";
}

export function TerminalJSON({
    data,
    typingSpeed = 30,
    color,
   }: TerminalJSONProps) {
    const jsonString = JSON.stringify(data, null, 2);
    const [typedText, setTypedText] = useState("");
    const [isComplete, setIsComplete] = useState(false);
   
    // Determine color based on status
    const getColorClass = () => {
      if (color) return color === "red" ? "text-red-400" : "text-lime-400";
      if (data.status === "pending") return "text-yellow-400";
      if (data.status === "completed") return "text-lime-400"; 
      return "text-red-400"; // error/default case
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
      </div>
    );
   }