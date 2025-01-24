"use client";

import { useEffect, useState, useCallback } from "react";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

// Types
type EmailRecord = {
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
  created_at: string;
  updated_at: string;
};

export default function SSEDataDisplay() {
  const [records, setRecords] = useState<EmailRecord[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<
    "connecting" | "connected" | "disconnected"
  >("disconnected");
  const [error, setError] = useState<string | null>(null);

  const setupSSE = useCallback(() => {
    console.log("Setting up SSE connection...");
    setConnectionStatus("connecting");

    const eventSource = new EventSource("https://54.67.120.86.nip.io/sse");

    eventSource.onopen = () => {
      console.log("SSE connection established successfully");
      setConnectionStatus("connected");
    };

    eventSource.onmessage = (event) => {
      console.log("Raw SSE message received of length:", event.data.length);
      try {
        const data = JSON.parse(event.data);
        if (data.initialData) {
          setRecords(data.initialData);
        } else if (data.type === "update") {
          setRecords((prevRecords) =>
            prevRecords.map((record) =>
              record.id === data.callId
                ? {
                    ...record,
                    humanClassification: data.humanClassification,
                    humanComment: data.humanComment,
                    status: "completed",
                    updated_at: data.timestamp,
                  }
                : record
            )
          );
        }
      } catch (err) {
        console.error("Error processing SSE message:", err);
        console.error("Raw message that failed:", event.data);
      }
    };

    eventSource.onerror = (err) => {
      console.error("SSE error:", err);
      setError("SSE error.");
      setConnectionStatus("disconnected");
    };

    return () => {
      console.log("Cleaning up SSE connection");
      eventSource.close();
    };
  }, []);

  useEffect(() => {
    const cleanup = setupSSE();
    return () => {
      cleanup();
    };
  }, [setupSSE]);

  // Example function you might attach to a Button
  async function handleStartProcess() {
    try {
      const response = await fetch("https://54.67.120.86.nip.io/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Error starting process");
      }
      const data = await response.json();
      console.log("Process started successfully:", data);
    } catch (err) {
      console.error(err);
      setError((err as Error).message);
    }
  }

  return (
    <section className="p-4">
      {/* Header + Connection Status */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="scroll-m-20 text-2xl font-bold tracking-tight lg:text-2xl">
          Real-Time Email Classification Data
        </h1>

        <div className="flex items-center gap-2">
          <span className="text-sm">Webhook Status:</span>
          <Badge
            variant={
              connectionStatus === "connected"
                ? "secondary"
                : connectionStatus === "connecting"
                ? "outline"
                : "destructive"
            }
          >
            {connectionStatus}
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert variant="destructive" className="mb-4">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Records or Empty State */}
      {records.length === 0 ? (
        <div className="text-center py-8 rounded-lg">
          <p className="text-muted-foreground">No data available.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {records.map((record) => (
            <Card key={record.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <CardTitle>{record.subject}</CardTitle>
                <CardDescription>
                  Email ID: {record.id}
                </CardDescription>
              </CardHeader>

              <CardContent className="grid gap-2 text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <p>
                    <strong>From:</strong> {record.from}
                  </p>
                  <p>
                    <strong>To:</strong> {record.to}
                  </p>
                </div>
                <p>
                  <strong>Classification:</strong> {record.classification}
                </p>

                {record.humanClassification && (
                  <>
                    <p>
                      <strong>Human Classification:</strong>{" "}
                      {record.humanClassification}
                    </p>
                    <p>
                      <strong>Human Comment:</strong> {record.humanComment}
                    </p>
                  </>
                )}

                <div className="mt-2 pt-2 border-t grid grid-cols-2 gap-4 text-muted-foreground">
                  <p>
                    <small>Status: {record.status}</small>
                  </p>
                  <p>
                    <small>Created: {new Date(record.created_at).toLocaleString()}</small>
                  </p>
                  <p>
                    <small>Updated: {new Date(record.updated_at).toLocaleString()}</small>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
