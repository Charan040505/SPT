import { BookOpenCheck } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2", className)}>
      <BookOpenCheck className="h-6 w-6 text-primary" />
      <span className="text-lg font-semibold">EduClarity</span>
    </Link>
  );
}
