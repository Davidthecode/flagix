"use client";

import { Button } from "@flagix/ui/components/button";
import { Check, Copy, Terminal } from "lucide-react";
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { SNIPPETS } from "@/components/environment/setup-snippets";
import { cn } from "@/lib/utils";
import type { FullEnvironment } from "@/types/environment";

type Framework = "nextjs" | "react" | "js";

const frameworkNames: Record<Framework, string> = {
  nextjs: "Next.js",
  react: "React",
  js: "Node.js / JS",
};

export function SetupGuide({ environment }: { environment: FullEnvironment }) {
  const [selectedFramework, setSelectedFramework] =
    useState<Framework>("nextjs");
  const [copiedSection, setCopiedSection] = useState<string | null>(null);

  const handleCopy = (code: string, section: string) => {
    navigator.clipboard.writeText(code);
    setCopiedSection(section);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const withDirective = (code: string) => {
    return selectedFramework === "nextjs" ? `"use client";\n\n${code}` : code;
  };

  const CodeBlock = ({
    code,
    section,
    title,
    language = "typescript",
  }: {
    code: string;
    section: string;
    title: string;
    language?: string;
  }) => {
    const isCopied = copiedSection === section;

    return (
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {section === "install" && (
              <Terminal className="h-4 w-4 text-gray-400" />
            )}
            <p className="font-medium text-gray-700 text-sm">{title}</p>
          </div>
          <Button
            className={cn(
              "h-7 rounded px-2 text-xs transition-all",
              isCopied
                ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
            onClick={() => handleCopy(code, section)}
            variant="ghost"
          >
            {isCopied ? (
              <>
                <Check className="mr-1 h-3 w-3" /> Copied
              </>
            ) : (
              <>
                <Copy className="mr-1 h-3 w-3" /> Copy
              </>
            )}
          </Button>
        </div>

        <div className="relative overflow-hidden rounded-lg border border-gray-200 text-sm shadow-sm">
          <SyntaxHighlighter
            customStyle={{
              margin: 0,
              padding: "1.25rem",
              fontSize: "0.85rem",
              lineHeight: "1.6",
              backgroundColor: "#0d1117",
            }}
            language={language}
            style={vscDarkPlus}
          >
            {code}
          </SyntaxHighlighter>
        </div>
      </div>
    );
  };

  return (
    <div className="w-full">
      <div className="mb-6 flex flex-col space-y-1">
        <h2 className="font-semibold text-gray-900 text-lg">
          Quick Setup Guide
        </h2>
        <p className="text-gray-500 text-sm">
          Integrate Flagix into your {frameworkNames[selectedFramework]}{" "}
          application.
        </p>
      </div>

      <div className="flex items-center space-x-6 border-gray-100 border-b">
        {(["nextjs", "react", "js"] as Framework[]).map((fw) => {
          const isActive = selectedFramework === fw;
          return (
            <Button
              className={cn(
                "relative px-1 py-3 font-medium text-sm transition-colors",
                isActive
                  ? "text-emerald-600"
                  : "text-gray-400 hover:text-gray-600"
              )}
              key={fw}
              onClick={() => setSelectedFramework(fw)}
            >
              {frameworkNames[fw]}
              {isActive && (
                <div className="absolute right-0 bottom-0 left-0 h-0.5 bg-emerald-600" />
              )}
            </Button>
          );
        })}
      </div>

      <div className="mt-8 space-y-10">
        <CodeBlock
          code={SNIPPETS.install(selectedFramework)}
          language="bash"
          section="install"
          title="1. Install the SDK"
        />

        {selectedFramework === "js" ? (
          <CodeBlock
            code={SNIPPETS.vanilla(environment.apiKey)}
            section="vanilla"
            title="2. Initialize & Use (Browser or Node.js)"
          />
        ) : (
          <>
            <CodeBlock
              code={withDirective(SNIPPETS.provider(environment.apiKey))}
              section="provider"
              title={
                selectedFramework === "nextjs"
                  ? "2. Configure the Provider (app/providers.tsx)"
                  : "2. Configure the Provider (main.tsx)"
              }
            />
            <CodeBlock
              code={withDirective(SNIPPETS.usage)}
              section="usage"
              title="3. Use in your Components"
            />
          </>
        )}
      </div>
    </div>
  );
}
