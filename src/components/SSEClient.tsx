"use client";

import { useEffect, useState, useCallback } from "react";
import { TerminalJSON } from "@/components/ui/TerminalJSON";
import { RainbowButton } from "@/components/ui/rainbow-button";
import { ProcessResult } from '@/types/index';

type EmailRecord = {
  created_at: string | number | Date;
  id: string;
  subject: string;
  body: string;
  to: string;
  from: string;
  classification: string;
  humanClassification?: string;
  humanComment?: string;
  hasHumanReview: boolean;
  status: string;
  updated_at: string;
};

interface SSEDataDisplayProps {
  onStartProcess: () => void;
  loading: boolean;
  result: ProcessResult | null;  
}

export default function SSEDataDisplay({
  onStartProcess,
  loading,
  result,
}: SSEDataDisplayProps) {
  const [records, setRecords] = useState<EmailRecord[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);

  // --- SSE setup ---
  const setupSSE = useCallback(() => {
    setConnectionStatus("connecting");

    const eventSource = new EventSource("https://54.67.120.86.nip.io/sse");

    eventSource.onopen = () => {
      setConnectionStatus("connected");
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);

        if (data.initialData) {
          setRecords(data.initialData);
        }
        else if (data.type === "newRecord") {
          setRecords((prevRecords) => [...prevRecords, data.record]);
        }
        else if (data.type === "update") {
          setRecords((prevRecords) => {
            const existingIndex = prevRecords.findIndex(
              (rec) => rec.id === data.callId
            );

            if (existingIndex === -1) {
              // If the record isn't found:
              console.warn(`Record not found for callId: ${data.callId}`);
              return prevRecords;
            } else {
              // Otherwise, update the existing record
              const updatedRecords = [...prevRecords];
              updatedRecords[existingIndex] = {
                ...prevRecords[existingIndex],
                status: "completed", 
                humanClassification: data.humanClassification,
                humanComment: data.humanComment
              };
              return updatedRecords;
            }
          });
        }
      } catch (err) {
        console.error("Error processing SSE message:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      setError("SSE error.");
      setConnectionStatus("disconnected");
    };

    return () => {
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = setupSSE();
    return () => {
      cleanup();
    };
  }, [setupSSE]);

  // --- Sort by created_at descending (most recent first) ---
  const sortedRecords = [...records].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  // --- Transform record for TerminalJSON ---
  function makeRecordJSON(record: EmailRecord) {
    return {
      subject: record.subject,
      from: record.from,
      to: record.to,
      classification: record.classification,
      humanClassification: record.humanClassification || null,
      humanComment: record.humanComment || null,
      status: record.status,
      id: record.id,
      created: new Date(record.created_at).toLocaleString(),
      updated: new Date(record.updated_at).toLocaleString(),
    };
  }

  return (
    <section className="p-4">
      {/* Title + Button + Connection Status */}
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-4">
          <h1 className="text-2xl font-bold">Human-Layer-Async Webhook Tests</h1>
          <RainbowButton onClick={onStartProcess} disabled={loading}>
            {loading ? "Testing..." : "Test Webhook"}
          </RainbowButton>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Webhook Status:</span>
          <span
            className={`px-2 py-1 rounded-full text-sm ${
              connectionStatus === "connected"
                ? "bg-green-100 text-green-800"
                : connectionStatus === "connecting"
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {connectionStatus}
          </span>
        </div>
      </div>

      {/* If SSE error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Show webhook response for "Test Webhook" if you want */}
      {result && (
        <div className="mb-4">
          <TerminalJSON
            data={result}
            color={result.status?.includes("successfully") ? "green" : "red"}
          />
        </div>
      )}

      {/* Records */}
      {sortedRecords.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-zinc-900 rounded-lg">
          <p className="text-gray-500">No data available.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedRecords.map((record) => (
            <TerminalJSON
              key={record.id}
              data={makeRecordJSON(record)}
              typingSpeed={20}
              signature={
                record.hasHumanReview && record.humanClassification 
                  ? `Approved by Human`
                  : null
              }
            />
          ))}
        </div>
      )}
    </section>
  );
}
