"use client"

import * as React from "react"
import {
  BookOpen,
  Frame,
  SquareTerminal,
} from "lucide-react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavLogo } from "@/components/nav-logo"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar"

// This is sample data.
const data = {
  user: {
    name: "user",
    email: "user@example.com",
    avatar: "some.jpg",
  },
  navMain: [
    {
      title: "Playground",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "Webhook",
          url: "#",
        },
        {
          title: "API",
          url: "https://www.humanlayer.dev/docs/introduction",
          newTab: true
        },
        {
          title: "Settings",
          url: "https://github.com/mz-0-1/03-human-review-async/blob/main/readme.md",
          newTab: true
        },
      ],
    },
    {
      title: "Documentation",
      url: "#",
      icon: BookOpen,
      items: [
        {
          title: "Github",
          url: "https://github.com/mz-0-1/03-human-review-async",
          newTab: true
        },
      ],
    },
  ],
  projects: [
    {
      name: "HumanLayer",
      url: "https://www.humanlayer.dev/",
      newTab: true,
      icon: Frame,
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <NavLogo/>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavProjects projects={data.projects} />
      </SidebarContent>
      <SidebarFooter>
        { /* <NavUser user={data.user} /> */ }
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
