import Link from "next/link";
import { FileCodeCorner } from "lucide-react";

export default function DocsButton() {
  return (
    <Link
      href="/docs"
      className="flex items-center justify-center bg-transparent hover:bg-muted/50 border border-transparent w-8 h-8 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200 cursor-pointer"
      title="Documentation CLI"
    >
      <FileCodeCorner size={16} />
    </Link>
  );
}
