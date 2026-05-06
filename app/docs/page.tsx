"use client";
import {
  Terminal,
  Layout,
  Lock,
  ChevronDown,
  LucideIcon,
  Check,
  X,
} from "lucide-react";
import React from "react";
import { SidebarProvider } from "@/components/layout/NavBarContext";
import NavBar from "@/components/layout/NavBar";

const faqItems = [
  {
    question: "Done vs. Skipped?",
    answer:
      "Done = completed. Skipped = you decided not to do it. Both count as progress.",
  },
  {
    question: "What's JWT Malformed?",
    answer:
      "Your token is invalid. Generate a new one: Settings → Profile → Generate Token → projex login <new-token>",
  },
  {
    question: "No project linked?",
    answer:
      "Run projex init <project-id> in your project folder. Get ID with 'Copy ID' button.",
  },
  {
    question: "What to add to .gitignore?",
    answer:
      "Add .projex.json to prevent your auth token from being committed to version control.",
  },
];

const cliCommands = [
  {
    cmd: "projex status",
    desc: "Show project progress and all tasks",
  },
  {
    cmd: 'projex step:add "task title"',
    desc: "Add new task (starts in Todo)",
  },
  {
    cmd: "projex step:start <number>",
    desc: "Move task to In Progress",
  },
  {
    cmd: "projex step:done <number>",
    desc: "Mark task as Done (progress advances)",
  },
];

export default function DocsPage() {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarProvider>
        <div className="flex flex-col h-full p-2 shrink-0">
          <NavBar />
        </div>
      </SidebarProvider>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-y-auto">
        <div className=" px-6 py-8 space-y-8">
          {/* Header */}
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold">User Guide</h1>
            <p className="text-muted-foreground">
              Manage projects from web or CLI. Everything syncs in real-time.
            </p>
          </div>

          {/* Quick Overview */}
          <div className="grid md:grid-cols-2 gap-4">
            <BlockColor
              icon={Layout}
              color="#3b82f6"
              title="Web Dashboard"
              text="Visual overview of projects with real-time progress bars anddrag-and-drop Kanban boards."
            />

            <BlockColor
              icon={Terminal}
              color="#3b82f6"
              title="Terminal CLI"
              text="Manage projects without leaving your editor. Add tasks, checkprogress, update status."
            />
          </div>

          {/* Getting Started */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Getting Started</h2>

            <div className="space-y-3">
              <BlockDocs number={1} title="Create Project">
                <p>
                  Click <strong>&quot;New Project&quot;</strong> and enter name
                  and description.
                </p>
              </BlockDocs>

              <BlockDocs number={2} title="Generate CLI Token">
                <p>Settings → Profile → &quot;Generate CLI Token&quot;</p>
                <code className="text-xs bg-muted/50 px-2 py-1 rounded block font-mono">
                  projex login px_...
                </code>
              </BlockDocs>

              <BlockDocs number={3} title="Link Project Folder">
                <code className="text-xs bg-muted/50 px-2 py-1 rounded font-mono">
                  projex init &lt;project-id&gt;
                </code>
                <p className="text-xs text-muted-foreground">
                  Add{" "}
                  <code className="bg-muted/50 px-1 rounded">
                    `.projex.json`
                  </code>{" "}
                  to `.gitignore`
                </p>
              </BlockDocs>
            </div>
          </section>

          {/* Dashboard */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">Dashboard</h2>

            <div className="space-y-3 text-sm">
              <BlockInfos
                title="Progress Bar"
                message={`Shows (Done + Skipped) ÷ Total × 100%. Only "Done" and "Skipped" advance progress.`}
              />

              <BlockInfos
                title="Kanban Board"
                message="4 columns: À faire (Todo) → En cours (In Progress) → Terminé (Done) → Ignoré (Skipped)"
              />

              <BlockInfos
                title="Edit Tasks"
                message="Click the pen icon to change title or status. Drag tasks between columns to reorder."
              />
            </div>
          </section>

          {/* CLI Commands */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">CLI Commands</h2>

            <div className="space-y-2">
              {cliCommands.map((item, i) => (
                <BlockCommand
                  key={i}
                  command={item.cmd}
                  description={item.desc}
                />
              ))}
            </div>
          </section>

          {/* FAQ */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold">FAQ</h2>

            <div className="space-y-2">
              {faqItems.map((item, i) => (
                <BlockFaq key={i} item={item} i={i} />
              ))}
            </div>
          </section>

          {/* Security */}
          <section className="space-y-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <Lock size={18} className="text-sz-1" />
              Security
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <BlockColor icon={Check} color="#00C950" title="Best Practices">
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Keep token safe like a password</li>
                  <li>Add .projex.json to .gitignore</li>
                  <li>Regenerate if compromised</li>
                </ul>
              </BlockColor>

              <BlockColor icon={X} color="#FB2C36" title="Avoid These">
                <ul className="text-xs text-muted-foreground space-y-1 ml-4 list-disc">
                  <li>Commit .projex.json to Git</li>
                  <li>Share token in chat/email</li>
                  <li>Paste in public places</li>
                </ul>
              </BlockColor>
            </div>
          </section>

          {/* Footer */}
          <div className="pt-4 border-t border-border/20 text-xs text-muted-foreground text-center">
            <p>Projex v1.0.0 • Built for developers</p>
            <p className="mt-1">See USER_GUIDE.md for complete documentation</p>
          </div>
        </div>
      </main>
    </div>
  );
}

function BlockColor({
  icon: Icon,
  color,
  title,
  text,
  children,
}: {
  icon?: LucideIcon;
  color: string;
  title: string;
  text?: string;
  children?: React.ReactNode;
}) {
  return (
    <div
      className={`border rounded-sm p-4 flex flex-col gap-3`}
      style={{
        borderColor: `${color}30`,
        backgroundImage: `linear-gradient(to bottom right, ${color}10, transparent)`,
      }}
    >
      <div className="flex items-center gap-2 ">
        {Icon && <Icon size={20} style={{ color: color }} />}
        <h2 className="text-base font-semibold">{title}</h2>
      </div>
      {text && (
        <p className="text-xs text-muted-foreground leading-relaxed">{text}</p>
      )}
      {children && (
        <div className="text-xs text-muted-foreground">{children}</div>
      )}
    </div>
  );
}

function BlockDocs({
  number,
  title,
  children,
}: {
  number: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-border/40 rounded-sm p-4 flex flex-col gap-2">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-sz-1/10 text-sz-1 text-xs font-semibold">
          {number}
        </div>

        <h3 className="text-sm font-semibold">{title}</h3>
      </div>

      <div className="flex flex-col gap-2 text-xs text-muted-foreground ml-9">
        {children}
      </div>
    </div>
  );
}

function BlockInfos({ title, message }: { title: string; message: string }) {
  return (
    <div className="border-l-2 border-sz-1/30 pl-4 py-2">
      <p className="font-semibold mb-1">{title}</p>
      <p className="text-xs text-muted-foreground">{message}</p>
    </div>
  );
}

function BlockCommand({
  command,
  description,
}: {
  command: string;
  description: string;
}) {
  return (
    <div className="border border-border/40 rounded-sm p-3">
      <code className="text-xs font-mono bg-muted/50 px-2 py-1 rounded block mb-1">
        $ {command}
      </code>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

function BlockFaq({
  item,
  i,
}: {
  item: { question: string; answer: string };
  i: number;
}) {
  const [openFaq, setOpenFaq] = React.useState<number | null>(null);
  return (
    <button
      onClick={() => setOpenFaq(openFaq === i ? null : i)}
      className="w-full border border-border/40 rounded p-3 text-left hover:bg-muted/30 transition-colors"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold">{item.question}</p>
        <ChevronDown
          size={16}
          className={`transition-transform ${
            openFaq === i ? "rotate-180" : ""
          }`}
        />
      </div>
      {openFaq === i && (
        <p className="text-xs text-muted-foreground mt-2 pt-2 border-t border-border/20">
          {item.answer}
        </p>
      )}
    </button>
  );
}
