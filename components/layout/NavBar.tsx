"use client";

import { CircleUserRound, LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Logo } from "../icons/logo";
import { cn } from "@/lib/utils";

interface SZNavPagesProps {
  top: boolean;
  NavPages: NavPage[];
}

interface NavPage {
  id: number;
  name: string;
  url: string;
  icon: LucideIcon;
}

function SZNav({ top, NavPages }: SZNavPagesProps) {
  return (
    <nav
      className={`p-3 bg-[#0A0A0A] border border-[#242424] rounded-full w-fit z-900 fixed flex flex-row items-center justify-center gap-3 left-1/2 -translate-x-1/2 ${top ? "top-4" : "bottom-4"}`}
    >
      <NavLogo />
      <NavSeparator className="hidden sm:flex" />
      <NavMenuContainer gap="4px">
        {NavPages.map((item) => (
          <NavItem key={item.id} Icon={item.icon} link={item.url} />
        ))}
      </NavMenuContainer>
      <NavSeparator />
      <UserAccount />
    </nav>
  );
}

function NavMenuContainer({
  children,
  gap,
}: {
  children: React.ReactNode;
  gap: string;
}) {
  return (
    <div
      data-slot="NavContainer"
      className="hidden sm:flex flex-row items-center justify-center"
      style={{ gap: gap }}
    >
      {children}
    </div>
  );
}

function NavLogo() {
  return (
    <Link
      data-slot="NavLogo"
      href="/"
      className="aspect-square h-7 flex items-center justify-center hover:opacity-60 transition-opacity duration-300 cursor-pointer"
    >
      <Logo size={16} />
    </Link>
  );
}

function NavSeparator({ className }: { className?: string }) {
  return (
    <div
      data-slot="NavSeparator"
      className={cn(`w-px h-5 bg-[#2D2D2D] rounded-2xl`, className)}
    />
  );
}

function NavItem({ Icon, link }: { Icon: LucideIcon; link: string }) {
  const pathname = usePathname();

  return (
    <Link
      data-slot="NavItem"
      href={link}
      className={`aspect-square h-7 flex items-center justify-center transition-colors duration-300 cursor-pointer ${
        pathname === link
          ? "text-[#eeeef0]"
          : "text-[#A1A1A1] hover:text-[#eeeef0]"
      }`}
    >
      <Icon size={16} />
    </Link>
  );
}

function UserAccount() {
  return (
    <Link
      data-slot="UserAccount"
      href="/"
      className="aspect-square h-7 flex items-center justify-center hover:opacity-60 transition-opacity duration-300 cursor-pointer"
    >
      <CircleUserRound size={16} />
    </Link>
  );
}

export { SZNav, NavLogo, NavSeparator, NavItem, UserAccount };
