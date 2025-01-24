"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { HomeIcon, BarChartIcon, SettingsIcon } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="hidden border-r bg-background md:block">
      <div className="flex h-full flex-col gap-2 p-4">
        <Link href="/">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === "/" && "bg-muted"
            )}
          >
            <HomeIcon className="mr-2 h-4 w-4" />
            Home
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === "/dashboard" && "bg-muted"
            )}
          >
            <BarChartIcon className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
        </Link>
        <Link href="/settings">
          <Button
            variant="ghost"
            className={cn(
              "w-full justify-start",
              pathname === "/settings" && "bg-muted"
            )}
          >
            <SettingsIcon className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </div>
  )
}