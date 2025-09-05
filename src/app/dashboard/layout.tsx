import type { ReactNode, SuspenseProps } from "react";
import { Suspense } from "react";
import Link from "next/link";
import {
  Book,
  Home,
  Settings,
  Users,
  PanelLeft,
  Search,
  BarChart2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Logo from "@/components/logo";
import { ThemeToggle } from "@/components/theme-toggle";
import type { UserRole } from "@/lib/types";
import { users } from "@/lib/data";

type NavLink = {
  href: string;
  icon: React.ElementType;
  label: string;
  roles: UserRole[];
};

const navLinks: NavLink[] = [
  { href: "/dashboard", icon: Home, label: "Dashboard", roles: ["admin", "student", "parent"] },
  { href: "/dashboard/students", icon: Users, label: "Students", roles: ["admin"] },
  { href: "/dashboard/analytics", icon: BarChart2, label: "Analytics", roles: ["admin", "student"] },
  { href: "/dashboard/settings", icon: Settings, label: "Settings", roles: ["admin", "student", "parent"] },
];

function NavContent({ role }: { role: UserRole }) {
  return (
    <TooltipProvider>
      <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
        <Link
          href="#"
          className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
        >
          <Book className="h-4 w-4 transition-all group-hover:scale-110" />
          <span className="sr-only">EduClarity</span>
        </Link>
        {navLinks
          .filter(link => link.roles.includes(role))
          .map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href + `?role=${role}`}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8"
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.label}</span>
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          ))}
      </nav>
    </TooltipProvider>
  );
}

function Header({ role }: { role: UserRole }) {
    const user = users[`${role}@educlarity.com`];
    const userInitial = user ? user.name.charAt(0).toUpperCase() : role.charAt(0).toUpperCase();

    return (
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
            <Sheet>
                <SheetTrigger asChild>
                    <Button size="icon" variant="outline" className="sm:hidden">
                        <PanelLeft className="h-5 w-5" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="sm:max-w-xs">
                    <nav className="grid gap-6 text-lg font-medium">
                        <Logo />
                        {navLinks
                            .filter(link => link.roles.includes(role))
                            .map((link) => (
                                <Link
                                    key={link.href}
                                    href={link.href + `?role=${role}`}
                                    className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
                                >
                                    <link.icon className="h-5 w-5" />
                                    {link.label}
                                </Link>
                            ))}
                    </nav>
                </SheetContent>
            </Sheet>
            <div className="relative ml-auto flex-1 md:grow-0">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                />
            </div>
            <ThemeToggle />
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="outline"
                        size="icon"
                        className="overflow-hidden rounded-full"
                    >
                        <Avatar>
                            <AvatarImage src={`https://picsum.photos/id/${role === 'admin' ? 1027 : role === 'student' ? 1005 : 1025}/100`} alt="User avatar" />
                            <AvatarFallback>{userInitial}</AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                    <DropdownMenuItem>Support</DropdownMenuItem>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild><Link href="/">Logout</Link></DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    )
}

function DashboardLayout({
  children,
  params,
  searchParams,
}: {
  children: ReactNode;
  params: {};
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const role = (searchParams?.role as UserRole) || "student";

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
        <NavContent role={role} />
      </aside>
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <Header role={role} />
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            {children}
        </main>
      </div>
    </div>
  );
}

export default function SuspendedDashboardLayout(props: any) {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <DashboardLayout {...props} />
        </Suspense>
    )
}
