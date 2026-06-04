import React, { useState } from "react";
import { Copy, Download, Check, Code2, FileJson, Braces } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

function generateTsInterface(fields) {
  const lines = ["export interface FormData {"];
  for (const field of fields) {
    const key = field.key;
    const to = field.templateOptions || {};
    let tsType = "string";
    if (field.type === "checkbox") tsType = "boolean";
    else if (to.type === "number") tsType = "number";
    else if (field.type === "custom-date") tsType = "Date";
    else if (field.type === "file-upload") tsType = "File";
    const optional = !to.required ? "?" : "";
    lines.push(`  ${key}${optional}: ${tsType};`);
  }
  lines.push("}");
  return lines.join("\n");
}

function CopyButton({ text, label, icon: Icon }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleCopy}
      className={cn(
        "gap-2 transition-all",
        copied && "border-green-500 text-green-600 bg-green-50 dark:bg-green-900/20"
      )}
    >
      {copied ? <Check className="h-3.5 w-3.5" /> : <Icon className="h-3.5 w-3.5" />}
      {copied ? "Copied!" : label}
    </Button>
  );
}

export default function ExportPanel({ formConfig }) {
  const jsonStr = JSON.stringify(formConfig, null, 2);
  const tsInterface = generateTsInterface(formConfig.fields || []);

  const downloadJson = () => {
    const blob = new Blob([jsonStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(formConfig.title || "form").toLowerCase().replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-4 space-y-4">
      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">JSON Schema</p>
          <div className="flex gap-2">
            <CopyButton text={jsonStr} label="Copy JSON" icon={FileJson} />
            <Button variant="outline" size="sm" onClick={downloadJson} className="gap-2">
              <Download className="h-3.5 w-3.5" /> Download
            </Button>
          </div>
        </div>
        <pre className="rounded-lg bg-muted p-3 text-[11px] font-mono overflow-auto max-h-48 text-foreground/80 leading-relaxed">
          {jsonStr}
        </pre>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">TypeScript Interface</p>
          <CopyButton text={tsInterface} label="Copy TS" icon={Code2} />
        </div>
        <pre className="rounded-lg bg-muted p-3 text-[11px] font-mono overflow-auto max-h-36 text-foreground/80 leading-relaxed">
          {tsInterface}
        </pre>
      </div>
    </div>
  );
}
