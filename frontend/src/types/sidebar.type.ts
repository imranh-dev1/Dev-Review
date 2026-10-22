export type SidebarItem = {
    title: string;
    url: string;
};

export type SidebarGroup = {
    title: string;
    items: SidebarItem[];
};

export type SidebarRoutes = SidebarGroup[];