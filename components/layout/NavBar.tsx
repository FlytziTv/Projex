"use client";

import Link from "next/link";
import {
  ChevronLeft,
  CircleQuestionMark,
  LayoutDashboard,
  UserCircle,
  BookOpen,
} from "lucide-react";

import { useSidebar, SidebarProvider } from "./NavBarContext";
import { Logo } from "../icons/logo";

export default function NavBar() {
  const { collapsed } = useSidebar();

  return (
    <div
      data-slot="nav"
      className={`group h-full bg-sidebar flex flex-col border border-sidebar-border rounded-lg text-foreground text-lg relative transition-all duration-500 ${
        collapsed ? "w-12.5" : "w-60"
      }`}
    >
      <NavSize />
      <SideBarHeader>
        <ItemSidebar
          Icon={Logo}
          href="/dashboard"
          label="Projex"
          ClassName="font-semibold"
        />
      </SideBarHeader>

      <SideBarContent>
        <ItemSidebar Icon={LayoutDashboard} href="/" label="Dashboard" />
        <ItemSidebar Icon={BookOpen} href="/docs" label="Docs" />
      </SideBarContent>

      <SideBarFooter>
        <ItemSidebar
          Icon={CircleQuestionMark}
          href="/logs"
          label="Aide & Support"
          ClassName="text-muted-foreground text-xs"
        />
        <ItemSidebar
          Icon={UserCircle}
          href="/profile"
          label="Profil"
          ClassName="text-muted-foreground text-xs"
        />
      </SideBarFooter>
    </div>
  );
}

function NavSize() {
  const { toggle, collapsed } = useSidebar();

  return (
    <button
      data-slot="nav-button-size"
      onClick={toggle}
      className="absolute opacity-0 group-hover:opacity-100 bg-sidebar hover:bg-accent border border-sidebar-border rounded-full text-foreground/80 hover:text-foreground p-1 -right-3 top-1/2 -translate-y-1/2 transition-all duration-300"
    >
      <ChevronLeft
        size={16}
        className={`transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`}
      />
    </button>
  );
}

function SideBarHeader({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start p-2 pb-0 gap-1 w-full">
      {children}
    </div>
  );
}

function SideBarContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col p-2 gap-1 w-full h-full">{children}</div>
  );
}

function SideBarFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-end p-2 gap-1 w-full">{children}</div>
  );
}

function ItemSidebar({
  Icon,
  href,
  label,
  ClassName,
}: {
  Icon: React.ElementType;
  href: string;
  label?: string;
  ClassName?: string;
}) {
  const { collapsed } = useSidebar();

  return (
    <Link
      href={href}
      className={`group flex items-center text-sm gap-2 p-2 w-full rounded-lg hover:bg-sidebar-accent group-hover:transition-all group-hover:duration-500 ${ClassName || "hover:text-foreground"}`}
    >
      <Icon size={16} className="shrink-0" />
      {!collapsed && label && <span className="truncate">{label}</span>}
    </Link>
  );
}

export { SidebarProvider };
