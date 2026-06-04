import React, { useState, useEffect } from "react";
import { Trash2, Plus, GripVertical, X, ChevronDown, ChevronRight, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

const SECTION = ({ title, children, defaultOpen = true }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b last:border-b-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-4 py-3 text-xs font-bold text-muted-foreground uppercase tracking-wider hover:bg-muted/50 transition-colors"
      >
        {title}
        {open ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 space-y-3">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Field = ({ label, children, hint }) => (
  <div className="space-y-1.5">
    <Label className="text-sm font-medium">{label}</Label>
    {children}
    {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
  </div>
);

function OptionsEditor({ options = [], onChange }) {
  const addOption = () => {
    const n = options.length + 1;
    onChange([...options, { name: `Option ${n}`, value: `option_${n}` }]);
  };

  const removeOption = (i) => onChange(options.filter((_, idx) => idx !== i));

  const updateOption = (i, key, val) => {
    const next = options.map((o, idx) => (idx === i ? { ...o, [key]: val } : o));
    onChange(next);
  };

  return (
    <div className="space-y-2">
      <AnimatePresence>
        {options.map((opt, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.1 }}
            className="flex items-center gap-1.5"
          >
            <GripVertical className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
            <Input
              value={opt.name}
              onChange={(e) => updateOption(i, "name", e.target.value)}
              placeholder="Label"
              className="h-8 text-sm flex-1"
            />
            <Input
              value={opt.value}
              onChange={(e) => updateOption(i, "value", e.target.value)}
              placeholder="Value"
              className="h-8 text-sm flex-1 font-mono"
            />
            <button
              onClick={() => removeOption(i)}
              className="p-1 rounded hover:bg-red-50 hover:text-red-500 transition-colors shrink-0"
            >
              <X className="h-3 w-3" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <Button variant="outline" size="sm" onClick={addOption} className="w-full h-8 text-sm gap-1.5">
        <Plus className="h-3 w-3" /> Add Option
      </Button>
    </div>
  );
}

export default function FieldPropertyEditor({ field, onUpdate, onDelete }) {
  const [local, setLocal] = useState(field ?? null);

  useEffect(() => {
    setLocal(field ?? null);
  }, [field]);

  if (!field || !local) {
    return (
      <aside className="w-72 shrink-0 border-l bg-muted/20 flex flex-col">
        <div className="flex-1 flex flex-col items-center justify-center gap-3 p-6 text-center">
          <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center">
            <AlertCircle className="h-6 w-6 text-muted-foreground" />
          </div>
          <div>
            <p className="text-sm font-semibold text-muted-foreground">No field selected</p>
            <p className="text-sm text-muted-foreground/60 mt-1">Click a field on the canvas to edit its properties</p>
          </div>
        </div>
      </aside>
    );
  }

  const to = local.templateOptions || {};

  const update = (path, value) => {
    let next;
    if (path.startsWith("templateOptions.")) {
      const key = path.replace("templateOptions.", "");
      next = { ...local, templateOptions: { ...to, [key]: value } };
    } else {
      next = { ...local, [path]: value };
    }
    setLocal(next);
    onUpdate(next);
  };

  const hasOptions = ["custom-select", "custom-radio"].includes(local.type);

  return (
    <aside className="w-72 shrink-0 border-l bg-background flex flex-col overflow-hidden">
      <div className="px-4 py-3.5 border-b flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Field Properties</p>
          <p className="text-xs text-muted-foreground font-mono mt-0.5">{local.key}</p>
        </div>
        <button
          onClick={() => onDelete(local.key)}
          className="p-2 rounded-lg hover:bg-red-50 hover:text-red-500 transition-colors"
          title="Delete field"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <SECTION title="Basic">
          <Field label="Label">
            <Input
              value={to.label || ""}
              onChange={(e) => update("templateOptions.label", e.target.value)}
              className="h-9 text-sm"
              placeholder="Field label"
            />
          </Field>
          <Field label="Placeholder">
            <Input
              value={to.placeholder || ""}
              onChange={(e) => update("templateOptions.placeholder", e.target.value)}
              className="h-9 text-sm"
              placeholder="Placeholder text"
            />
          </Field>
          {local.type === "custom-input" && (
            <Field label="Input Type">
              <Select value={to.type || "text"} onValueChange={(v) => update("templateOptions.type", v)}>
                <SelectTrigger className="h-9 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {["text", "email", "tel", "number", "url", "password"].map((t) => (
                    <SelectItem key={t} value={t} className="text-sm">{t}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          )}
          <Field label="Width">
            <Select value={local.className || "col-span-1"} onValueChange={(v) => update("className", v)}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="col-span-1" className="text-sm">Half width</SelectItem>
                <SelectItem value="col-span-2" className="text-sm">Full width</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex items-center justify-between py-0.5">
            <Label className="text-sm font-medium">Required</Label>
            <Switch
              checked={!!to.required}
              onCheckedChange={(v) => update("templateOptions.required", v)}
            />
          </div>
        </SECTION>

        {hasOptions && (
          <SECTION title="Options">
            <OptionsEditor
              options={to.options || []}
              onChange={(opts) => update("templateOptions.options", opts)}
            />
          </SECTION>
        )}

        <SECTION title="Validation" defaultOpen={false}>
          <Field label="Min Length" hint="For text inputs">
            <Input
              type="number"
              value={to.minLength || ""}
              onChange={(e) => update("templateOptions.minLength", e.target.value ? Number(e.target.value) : undefined)}
              className="h-9 text-sm"
              placeholder="e.g. 3"
            />
          </Field>
          <Field label="Max Length">
            <Input
              type="number"
              value={to.maxLength || ""}
              onChange={(e) => update("templateOptions.maxLength", e.target.value ? Number(e.target.value) : undefined)}
              className="h-9 text-sm"
              placeholder="e.g. 100"
            />
          </Field>
          <Field label="Pattern (regex)" hint="e.g. ^[A-Z]+$">
            <Input
              value={to.pattern || ""}
              onChange={(e) => update("templateOptions.pattern", e.target.value)}
              className="h-9 text-sm font-mono"
              placeholder="^[a-zA-Z]+$"
            />
          </Field>
          <Field label="Custom Error Message">
            <Input
              value={to.errorMessage || ""}
              onChange={(e) => update("templateOptions.errorMessage", e.target.value)}
              className="h-9 text-sm"
              placeholder="This field is invalid"
            />
          </Field>
        </SECTION>

        <SECTION title="Conditional Logic" defaultOpen={false}>
          <Field
            label="Hide Expression"
            hint="JS expression using formData. e.g. formData.TYPE === 'A'"
          >
            <Textarea
              value={local.hideExpression || ""}
              onChange={(e) => update("hideExpression", e.target.value)}
              className="text-sm font-mono min-h-[80px] resize-none"
              placeholder={"formData.FIELD_KEY === 'value'"}
            />
          </Field>
        </SECTION>

        <SECTION title="Advanced" defaultOpen={false}>
          <Field label="Field Key" hint="Unique identifier for this field">
            <Input
              value={local.key}
              onChange={(e) => update("key", e.target.value.toUpperCase().replace(/\s/g, "_"))}
              className="h-9 text-sm font-mono"
            />
          </Field>
        </SECTION>
      </div>
    </aside>
  );
}
