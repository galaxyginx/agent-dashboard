import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { ViewProps } from "@/types"

export function AppSidebar({ masterData, t }: ViewProps) {
  return (
    <Sidebar className="border-none">
      <div className="bg-gray-800 h-full">
        <SidebarContent className="bg-gray-800 text-white">
          <SidebarHeader className="text-4xl">GalaxyX</SidebarHeader>
          <SidebarGroup>
            <div className="flex-1">
            <h1 className="p-4">Conversations</h1>
            <div>
                <p className="p-4">Conversation 1</p>
                <p className="p-4">Conversation 2</p>
                <p className="p-4">Conversation 3</p>
            </div>
        </div>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
        <SidebarFooter />
      </div>
    </Sidebar>
  )
}