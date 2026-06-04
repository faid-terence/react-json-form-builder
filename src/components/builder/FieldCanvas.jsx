import React from "react";
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import {
  Type, Mail, Phone, Hash, Link, ChevronDown, CircleDot,
  CheckSquare, AlignLeft, Calendar, Upload, GripVertical,
  Trash2, Copy, LayoutGrid,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ICONS = { Type, Mail, Phone, Hash, Link, ChevronDown, CircleDot, CheckSquare, AlignLeft, Calendar, Upload };

const TYPE_META = {
  "custom-input": { label: "Input", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  "custom-select": { label: "Select", color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300" },
  "custom-radio": { label: "Radio", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300" },
  "checkbox": { label: "Checkbox", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" },
  "custom-textarea": { label: "Textarea", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300" },
  "custom-date": { label: "Date", color: "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-300" },
  "file-upload": { label: "File", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
};

function getIconForField(field) {
  const to = field.templateOptions || {};
  if (field.type === "custom-input") {
    if (to.type === "email") return Mail;
    if (to.type === "tel") return Phone;
    if (to.type === "number") return Hash;
    if (to.type === "url") return Link;
    return Type;
  }
  const map = {
    "custom-select": ChevronDown,
    "custom-radio": CircleDot,
    "checkbox": CheckSquare,
    "custom-textarea": AlignLeft,
    "custom-date": Calendar,
    "file-upload": Upload,
  };
  return map[field.type] || Type;
}

function SortableFieldCard({ field, isSelected, onSelect, onDelete, onDuplicate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: field.key,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const Icon = getIconForField(field);
  const meta = TYPE_META[field.type] || { label: field.type, color: "bg-gray-100 text-gray-700" };
  const label = field.templateOptions?.label || field.key;
  const required = field.templateOptions?.required;
  const hasOptions = field.templateOptions?.options?.length > 0;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        field.className === "col-span-2" ? "col-span-2" : "col-span-1"
      )}
    >
      <motion.div
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.15 }}
        onClick={() => onSelect(field.key)}
        className={cn(
          "group relative rounded-xl border-2 bg-background p-3.5 cursor-pointer transition-all duration-150",
          isSelected
            ? "border-primary shadow-md shadow-primary/10 ring-2 ring-primary/20"
            : "border-border hover:border-primary/40 hover:shadow-sm",
          isDragging && "shadow-2xl scale-105 border-primary"
        )}
      >
        {/* drag handle */}
        <div
          {...listeners}
          {...attributes}
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-40 cursor-grab active:cursor-grabbing transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <GripVertical className="h-4 w-4 text-muted-foreground" />
        </div>

        <div className="pl-5 flex items-start gap-3">
          <div className={cn("mt-0.5 rounded-lg p-2 shrink-0", meta.color)}>
            <Icon className="h-4 w-4" strokeWidth={2} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-sm font-semibold truncate">{label}</span>
              {required && <span className="text-red-500 text-sm font-bold">*</span>}
            </div>
            <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
              <span className={cn("text-xs font-semibold px-2 py-0.5 rounded-full", meta.color)}>{meta.label}</span>
              {field.className === "col-span-2" && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400 flex items-center gap-1">
                  <LayoutGrid className="h-3 w-3" /> Full width
                </span>
              )}
              {hasOptions && (
                <span className="text-xs text-muted-foreground">{field.templateOptions.options.length} options</span>
              )}
              {field.hideExpression && (
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300">Conditional</span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1 font-mono">{field.key}</p>
          </div>
        </div>

        {/* action buttons */}
        <div
          className="absolute right-2 top-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={() => onDuplicate(field.key)}
            className="p-1 rounded-md hover:bg-muted transition-colors"
            title="Duplicate"
          >
            <Copy className="h-3.5 w-3.5 text-muted-foreground" />
          </button>
          <button
            onClick={() => onDelete(field.key)}
            className="p-1 rounded-md hover:bg-red-50 hover:text-red-500 transition-colors"
            title="Delete"
          >
            <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-red-500" />
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function EmptyCanvas() {
  const { isOver, setNodeRef } = useDroppable({ id: "canvas-empty" });
  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 flex flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed m-4 transition-all duration-200",
        isOver ? "border-primary bg-primary/5 scale-[1.01]" : "border-muted-foreground/20"
      )}
    >
      <div className="text-center space-y-2">
        <div className="mx-auto w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
          <LayoutGrid className="h-6 w-6 text-muted-foreground" />
        </div>
        <p className="text-sm font-medium text-muted-foreground">Drop fields here</p>
        <p className="text-xs text-muted-foreground/60">Drag from the palette on the left,<br />or start from a template</p>
      </div>
    </div>
  );
}

export default function FieldCanvas({ fields, selectedKey, onSelect, onDelete, onDuplicate }) {
  const { isOver, setNodeRef } = useDroppable({ id: "canvas" });

  if (!fields || fields.length === 0) {
    return <EmptyCanvas />;
  }

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex-1 overflow-y-auto p-4 transition-colors duration-150",
        isOver && "bg-primary/3"
      )}
    >
      <SortableContext items={fields.map((f) => f.key)} strategy={verticalListSortingStrategy}>
        <div className="grid grid-cols-2 gap-3 auto-rows-min">
          <AnimatePresence>
            {fields.map((field) => (
              <SortableFieldCard
                key={field.key}
                field={field}
                isSelected={selectedKey === field.key}
                onSelect={onSelect}
                onDelete={onDelete}
                onDuplicate={onDuplicate}
              />
            ))}
          </AnimatePresence>
        </div>
      </SortableContext>

      {isOver && (
        <div className="mt-3 rounded-xl border-2 border-dashed border-primary/50 bg-primary/5 h-16 flex items-center justify-center">
          <p className="text-xs text-primary font-medium">Drop here to add</p>
        </div>
      )}
    </div>
  );
}
