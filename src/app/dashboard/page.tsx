"use client";

import { useState } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import SSEDataDisplay from "@/components/SSEClient";

interface ProcessResult {
  status: string;
  error?: string;  

}

async function startProcess() {
  const response = await fetch("https://54.67.120.86.nip.io/process", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  return response.json();
}

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);

  async function handleStartProcess() {
    setLoading(true);
    try {
      const data = await startProcess();
      setResult(data);
    } catch (err) { 
      console.error(err);  
      setResult({status: "failed", error: err instanceof Error ? err.message : "Failed to start process" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Playground
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Webhook</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="pr-4">
            <ModeToggle />
          </div>
        </header>

        <div className="flex flex-1 flex-col p-4 pt-0">
          <SSEDataDisplay
            onStartProcess={handleStartProcess}
            loading={loading}
            result={result}
          />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
