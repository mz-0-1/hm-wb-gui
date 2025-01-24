"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { MenuIcon } from "lucide-react"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex h-16 items-center px-4">
        <Button variant="ghost" size="icon" className="md:hidden">
          <MenuIcon className="h-5 w-5" />
        </Button>
        <div className="ml-auto flex items-center space-x-4">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}