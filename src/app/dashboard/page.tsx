"use client";

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
import { useState } from "react";
import SSEDataDisplay from "@/components/SSEClient"; 
import { startProcess } from "@/client-api/api";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import { TerminalJSON } from "@/components/ui/TerminalJSON";

interface StartProcessResponse {
  status: string;
}

interface StartProcessError {
  error: string;
}

type StartProcessResult = StartProcessResponse | StartProcessError;

export default function Page() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<StartProcessResult | null>(null);

  const handleStartProcess = async () => {
    setLoading(true);
    try {
      const data = await startProcess();
      setResult(data);
    } catch (error) {
      console.error("Process error:", error);
      setResult({ error: "Failed to start process" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">
                    Building Your Application
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Data Fetching</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="pr-4 flex items-center gap-4">
            {/* ShadCN Mode Toggle */}
            <ModeToggle />
            {/* ShadCN Button */}
            <Button 
              onClick={handleStartProcess} 
              disabled={loading}
            >
              {loading ? "Testing..." : "Test Webhook"}
            </Button>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="mb-0">
          <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* If `result` is present, show the console JSON */}
          {result && (
            <TerminalJSON data={result} typingSpeed={30} />
          )}
          </div>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min p-4">
            <SSEDataDisplay />
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
