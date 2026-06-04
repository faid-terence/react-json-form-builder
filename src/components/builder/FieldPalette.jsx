import React from "react";
import { useDraggable } from "@dnd-kit/core";
import {
  Type, Mail, Phone, Hash, Link, ChevronDown, CircleDot,
  CheckSquare, AlignLeft, Calendar, Upload,
} from "lucide-react";
import { FIELD_TYPES } from "@/store/builderStore";
import { cn } from "@/lib/utils";

const ICONS = { Type, Mail, Phone, Hash, Link, ChevronDown, CircleDot, CheckSquare, AlignLeft, Calendar, Upload };

const PALETTE_GROUPS = [
  { label: "Text", types: ["Type", "Mail", "Phone", "Hash", "Link"] },
  { label: "Choice", types: ["ChevronDown", "CircleDot", "CheckSquare"] },
  { label: "Other", types: ["AlignLeft", "Calendar", "Upload"] },
];

function DraggablePaletteItem({ fieldTypeDef, index }) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: `palette-${index}`,
    data: { fromPalette: true, fieldTypeDef },
  });

  const Icon = ICONS[fieldTypeDef.icon] || Type;

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl border cursor-grab",
        "bg-background hover:bg-primary/5 hover:border-primary/40 transition-all duration-150",
        "text-muted-foreground hover:text-primary select-none",
        isDragging && "opacity-40 scale-95 cursor-grabbing"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.8} />
      <span className="text-sm font-medium">{fieldTypeDef.label}</span>
    </div>
  );
}

export default function FieldPalette() {
  return (
    <aside className="w-56 shrink-0 flex flex-col border-r bg-muted/30 overflow-y-auto">
      <div className="px-4 py-3 border-b">
        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Field Types</p>
        <p className="text-xs text-muted-foreground mt-0.5">Drag onto canvas</p>
      </div>
      <div className="flex-1 px-3 pr-2 py-3 space-y-4 overflow-y-auto">
        {PALETTE_GROUPS.map((group) => {
          const items = FIELD_TYPES.filter((f) => group.types.includes(f.icon));
          return (
            <div key={group.label}>
              <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 px-1">{group.label}</p>
              <div className="flex flex-col gap-1.5 pr-2">
                {items.map((fieldTypeDef) => (
                  <DraggablePaletteItem
                    key={`${fieldTypeDef.type}-${fieldTypeDef.icon}`}
                    fieldTypeDef={fieldTypeDef}
                    index={FIELD_TYPES.indexOf(fieldTypeDef)}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </aside>
  );
}
