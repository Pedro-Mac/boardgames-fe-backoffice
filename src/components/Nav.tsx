"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { logoutAction } from "@/app/backoffice/actions";

const NAV_LINKS = [
  { href: "/backoffice", label: "Dashboard" },
  { href: "/backoffice/games", label: "Games" },
  { href: "/backoffice/permissions", label: "Permissions" },
  { href: "/backoffice/roles", label: "Roles" },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className='flex h-screen w-56 shrink-0 flex-col border-r border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950'>
      <div className='px-6 py-5'>
        <span className='text-sm font-semibold tracking-widest text-zinc-400 uppercase dark:text-zinc-500'>
          Backoffice
        </span>
      </div>

      <ul className='flex flex-col gap-1 px-3'>
        {NAV_LINKS.map(({ href, label }) => {
          const isActive =
            href === "/backoffice"
              ? pathname === "/backoffice"
              : pathname.startsWith(href);

          return (
            <li key={href}>
              <Link
                href={href}
                className={`flex h-9 items-center rounded-md px-3 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-50"
                    : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
                }`}
              >
                {label}
              </Link>
            </li>
          );
        })}
      </ul>

      <div className='mt-auto px-3 py-4'>
        <form action={logoutAction}>
          <button
            type='submit'
            className='flex h-9 w-full items-center rounded-md px-3 text-sm font-medium text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-50'
          >
            Logout
          </button>
        </form>
      </div>
    </nav>
  );
}
