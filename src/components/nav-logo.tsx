"use client"

import * as React from "react"
import Link from "next/link"
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

export function NavLogo() {
  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <Link href="/dashboard">
          <SidebarMenuButton
            size="lg"
            className="data-[state=open]:bg-transparent hover:bg-transparent active:bg-transparent"
          >
            <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-teal-900 bg-sidebar-primary text-sidebar-primary-foreground">
              <svg 
                height="24" 
                viewBox="0 0 360 331" 
                fill="currentColor" 
                xmlns="http://www.w3.org/2000/svg"
                className="size-4"
              >
                <path d="M326.887 178.272C326.887 178.272 324.962 193.288 318.416 193.288C318.416 189.438 308.405 184.433 286.843 179.812C264.126 231.792 244.489 285.312 244.489 317.655C237.173 324.971 211.761 304.564 211.761 282.617C211.761 260.285 227.162 218.316 247.184 174.037C225.622 172.111 198.67 170.571 166.327 170.186C137.449 230.252 111.651 293.783 111.651 328.821C104.336 336.137 79.3083 315.73 79.3083 293.783C79.3083 270.296 98.5601 222.551 123.202 172.111C46.5802 179.812 41.5747 211.77 41.5747 211.77C41.5747 211.77 10.3868 142.078 140.529 137.073C159.011 102.035 177.878 67.7664 192.894 42.354C149 66.9963 88.1642 98.9544 50.8156 98.9544C-1.54937 98.9544 -2.70448 49.6697 1.53093 30.0328C1.91596 27.7226 4.99626 26.9526 6.5364 29.2628C12.697 37.7336 27.7134 53.135 56.9762 53.135C132.828 53.135 211.761 0 221.002 0C231.013 0 237.173 6.54561 240.639 12.7062C242.949 15.4014 244.104 18.0967 244.489 21.562V21.9471C244.489 23.4872 214.456 75.0821 182.883 137.073C215.226 138.228 240.639 142.079 260.276 146.314C293.389 77.3924 332.277 11.1661 336.513 11.1661C336.513 11.1661 360 18.8668 360 32.7281C360 34.2682 327.272 92.0237 296.854 157.865C320.726 168.261 326.887 178.272 326.887 178.272Z" />
              </svg>
            </div>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-semibold">
                HumanLayer
              </span>
              <span className="truncate text-xs text-muted-foreground">
                WebHook Test
              </span>
            </div>
          </SidebarMenuButton>
        </Link>
      </SidebarMenuItem>
    </SidebarMenu>
  )
}