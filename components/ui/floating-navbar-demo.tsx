"use client";
import React from "react";
import { FloatingNav } from "@/components/ui/floating-navbar";
import {
  IconHome,
  IconMessage,
  IconUser,
  IconCurrencyDollar,
} from "@tabler/icons-react";
import { useAuth } from "@/hooks/useAuth";

export default function FloatingNavDemo() {
  const { user, signOut } = useAuth();
  const navItems = [
    {
      name: "Home",
      link: "/",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About",
      link: "/about",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Pricing",
      link: "/pricing",
      icon: (
        <IconCurrencyDollar className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    {
      name: "Contact",
      link: "/contact",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
    ...(user
      ? [
          {
            name: "Chat",
            link: "/chat",
            icon: (
              <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
            ),
          },
        ]
      : []),
  ];
  return (
    <div className="relative w-full">
      {/*
        To prevent the floating navbar from blocking page content,
        add top padding or margin to your main content area, e.g.:
        <main className="pt-24">...</main>
      */}
      <FloatingNav
        navItems={navItems}
        alwaysVisible
        user={user}
        onLogout={signOut}
      />
    </div>
  );
}
