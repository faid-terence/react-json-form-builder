import React from "react";
import { motion } from "framer-motion";
import { Briefcase, MessageSquare, BarChart2, ArrowRight, Sparkles } from "lucide-react";
import { TEMPLATES } from "@/store/builderStore";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TEMPLATE_ICONS = { Briefcase, MessageSquare, BarChart2 };

const TEMPLATE_COLORS = [
  "from-blue-500/10 to-indigo-500/10 border-blue-200 dark:border-blue-800",
  "from-emerald-500/10 to-teal-500/10 border-emerald-200 dark:border-emerald-800",
  "from-orange-500/10 to-amber-500/10 border-orange-200 dark:border-orange-800",
];

const ICON_COLORS = [
  "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400",
  "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/40 dark:text-emerald-400",
  "bg-orange-100 text-orange-600 dark:bg-orange-900/40 dark:text-orange-400",
];

export default function TemplateGallery({ onSelect, onDismiss }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col h-full p-8 max-w-2xl mx-auto"
    >
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/10 mb-4">
          <Sparkles className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Start building</h2>
        <p className="text-muted-foreground mt-2 text-sm">Pick a template to get started, or build from scratch</p>
      </div>

      <div className="grid grid-cols-1 gap-3 mb-6">
        {TEMPLATES.map((template, i) => {
          const Icon = TEMPLATE_ICONS[template.icon] || Briefcase;
          return (
            <motion.button
              key={template.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              onClick={() => onSelect(template)}
              className={cn(
                "group text-left rounded-xl border bg-gradient-to-r p-4 flex items-center gap-4 hover:shadow-md transition-all duration-200",
                TEMPLATE_COLORS[i]
              )}
            >
              <div className={cn("rounded-xl p-3 shrink-0", ICON_COLORS[i])}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{template.name}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{template.description}</div>
                <div className="text-[10px] text-muted-foreground mt-1">{template.config.fields.length} fields</div>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-0.5 transition-all shrink-0" />
            </motion.button>
          );
        })}
      </div>

      <div className="mt-auto">
        <button
          onClick={onDismiss}
          className="w-full py-2.5 rounded-xl border-2 border-dashed border-muted-foreground/20 text-sm text-muted-foreground hover:border-muted-foreground/40 hover:text-foreground transition-all duration-150"
        >
          Start with blank form
        </button>
      </div>
    </motion.div>
  );
}
