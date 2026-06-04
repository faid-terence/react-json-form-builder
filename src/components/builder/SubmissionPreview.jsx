import React, { useMemo } from "react";
import { Braces, PenLine } from "lucide-react";
import { cn } from "@/lib/utils";

function getSampleValue(field) {
  const to = field.templateOptions || {};
  switch (field.type) {
    case "custom-input":
      if (to.type === "email") return "user@example.com";
      if (to.type === "number") return 3;
      if (to.type === "tel") return "+1 (555) 000-0000";
      return `Sample ${to.label || field.key}`;
    case "custom-select": return to.options?.[0]?.value || "option_1";
    case "custom-radio": return to.options?.[0]?.value || "option_1";
    case "checkbox": return true;
    case "custom-textarea": return "Sample text content...";
    case "custom-date": return new Date().toISOString().split("T")[0];
    case "file-upload": return "file.pdf (File)";
    default: return null;
  }
}

function highlightJson(json) {
  return json.replace(
    /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+-]?\d+)?)/g,
    (match) => {
      let cls = "text-yellow-500";
      if (/^"/.test(match)) {
        cls = /:$/.test(match) ? "text-blue-400 font-medium" : "text-emerald-400";
      } else if (/true|false/.test(match)) cls = "text-purple-400";
      else if (/null/.test(match)) cls = "text-red-400";
      return `<span class="${cls}">${match}</span>`;
    }
  );
}

export default function SubmissionPreview({ formConfig, formData = {} }) {
  const fields = formConfig.fields || [];

  // Merge live typed values with sample fallbacks
  const displayData = useMemo(() => {
    const result = {};
    fields.forEach((field) => {
      const live = formData[field.key];
      // Use live value if the user has typed something; fall back to sample
      result[field.key] = (live !== undefined && live !== "" && live !== false && live !== null)
        ? live
        : getSampleValue(field);
    });
    return result;
  }, [fields, formData]);

  const liveCount = fields.filter((f) => {
    const v = formData[f.key];
    return v !== undefined && v !== "" && v !== false && v !== null;
  }).length;

  const jsonStr = JSON.stringify(displayData, null, 2);

  return (
    <div className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payload Preview</p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Updates live as you fill the form
          </p>
        </div>
        <div className="flex items-center gap-2">
          {liveCount > 0 && (
            <div className="flex items-center gap-1 text-[10px] text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 px-2 py-1 rounded-md">
              <PenLine className="h-3 w-3" />
              {liveCount} filled
            </div>
          )}
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted px-2 py-1 rounded-md">
            <Braces className="h-3 w-3" />
            {fields.length} fields
          </div>
        </div>
      </div>

      <pre
        className="rounded-xl bg-gray-950 dark:bg-gray-900 p-4 text-[11px] font-mono overflow-auto max-h-[calc(100vh-160px)] leading-relaxed border border-border/40"
        dangerouslySetInnerHTML={{ __html: highlightJson(jsonStr) }}
      />

      {liveCount === 0 && fields.length > 0 && (
        <p className="text-[10px] text-muted-foreground text-center pt-1">
          Switch to <span className="font-medium">Live Form</span> and start typing — values will appear here in real time
        </p>
      )}
    </div>
  );
}
