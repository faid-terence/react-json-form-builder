import React, { useState, useCallback, useEffect, useRef } from "react";
import {
  DndContext,
  DragOverlay,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { motion, AnimatePresence } from "framer-motion";
import {
  Moon, Sun, Undo2, Redo2, Eye, Download, Code2,
  Layers, Settings2, Braces, Sparkles, FileJson,
  PanelLeftClose, PanelLeftOpen,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

import FieldPalette from "@/components/builder/FieldPalette";
import FieldCanvas from "@/components/builder/FieldCanvas";
import FieldPropertyEditor from "@/components/builder/FieldPropertyEditor";
import TemplateGallery from "@/components/builder/TemplateGallery";
import ExportPanel from "@/components/builder/ExportPanel";
import SubmissionPreview from "@/components/builder/SubmissionPreview";
import DynamicJsonForm from "@/components/shared/RJSFFormComponent";
import JsonEditorComponent from "@/components/JSONEditor";

import { createDefaultField, useBuilderHistory } from "@/store/builderStore";

const INITIAL_CONFIG = { title: "Untitled Form", fields: [] };

export default function App() {
  const { current: formConfig, push, undo, redo, canUndo, canRedo } = useBuilderHistory(INITIAL_CONFIG);
  const [selectedKey, setSelectedKey] = useState(null);
  const [darkMode, setDarkMode] = useState(() => window.matchMedia("(prefers-color-scheme: dark)").matches);
  const [showPalette, setShowPalette] = useState(true);
  const [showGallery, setShowGallery] = useState(true);
  const [activeTab, setActiveTab] = useState("builder"); // builder | preview
  const [rightTab, setRightTab] = useState("preview"); // preview | json | export | payload
  const [activeDragData, setActiveDragData] = useState(null);
  const [previewFormData, setPreviewFormData] = useState({});
  const [jsonError, setJsonError] = useState(null);
  const editorRef = useRef(null);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const handleJsonApply = () => {
    if (!editorRef.current) return;
    try {
      const parsed = JSON.parse(editorRef.current.getContent());
      push(parsed);
      setJsonError(null);
    } catch (e) {
      setJsonError(e.message);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  const fields = formConfig.fields || [];
  const selectedField = fields.find((f) => f.key === selectedKey) || null;

  // Reset live preview data when schema changes
  useEffect(() => { setPreviewFormData({}); }, [formConfig]);

  // Always-current ref so event handlers never close over stale formConfig
  const formConfigRef = useRef(formConfig);
  useEffect(() => { formConfigRef.current = formConfig; }, [formConfig]);

  const handleDragStart = (event) => {
    setActiveDragData(event.active.data.current);
  };

  const handleDragEnd = (event) => {
    const dragData = activeDragData ?? event.active.data.current;
    setActiveDragData(null);
    const { active, over } = event;
    if (!over) return;

    const cfg = formConfigRef.current;
    const currentFields = cfg.fields || [];
    const CANVAS_IDS = new Set(["canvas", "canvas-empty"]);

    if (dragData?.fromPalette) {
      const isCanvasDrop = CANVAS_IDS.has(String(over.id)) || currentFields.some((f) => f.key === over.id);
      if (!isCanvasDrop) return;
      const newField = createDefaultField(dragData.fieldTypeDef);
      const overIndex = currentFields.findIndex((f) => f.key === over.id);
      const nextFields = overIndex !== -1
        ? [...currentFields.slice(0, overIndex + 1), newField, ...currentFields.slice(overIndex + 1)]
        : [...currentFields, newField];
      push({ ...cfg, fields: nextFields });
      setSelectedKey(newField.key);
    } else {
      const oldIndex = currentFields.findIndex((f) => f.key === active.id);
      const newIndex = currentFields.findIndex((f) => f.key === over.id);
      if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
        push({ ...cfg, fields: arrayMove(currentFields, oldIndex, newIndex) });
      }
    }
  };

  const handleFieldUpdate = (updated) => {
    const cfg = formConfigRef.current;
    push({ ...cfg, fields: (cfg.fields || []).map((f) => (f.key === updated.key ? updated : f)) });
    setSelectedKey(updated.key);
  };

  const handleFieldDelete = (key) => {
    const cfg = formConfigRef.current;
    push({ ...cfg, fields: (cfg.fields || []).filter((f) => f.key !== key) });
    setSelectedKey(null);
  };

  const handleFieldDuplicate = (key) => {
    const cfg = formConfigRef.current;
    const currentFields = cfg.fields || [];
    const field = currentFields.find((f) => f.key === key);
    if (!field) return;
    const copy = { ...field, key: `${field.key}_COPY_${Date.now().toString(36).toUpperCase()}` };
    const idx = currentFields.findIndex((f) => f.key === key);
    push({ ...cfg, fields: [...currentFields.slice(0, idx + 1), copy, ...currentFields.slice(idx + 1)] });
    setSelectedKey(copy.key);
  };

  const handleTemplateSelect = (template) => {
    push(template.config);
    setShowGallery(false);
    setSelectedKey(null);
  };

  const handleTitleChange = (e) => {
    push({ ...formConfigRef.current, title: e.target.value });
  };

  return (
    <TooltipProvider>
      <div className={cn("h-screen flex flex-col overflow-hidden bg-background text-foreground")}>
        {/* ── Header ── */}
        <header className="h-14 shrink-0 border-b flex items-center px-5 gap-4 bg-background/95 backdrop-blur supports-backdrop-blur:bg-background/60 z-10">
          {/* Logo */}
          <div className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
              <Layers className="h-4.5 w-4.5 text-primary-foreground" />
            </div>
            <span className="font-bold text-base hidden sm:block">FormCraft</span>
          </div>

          <div className="w-px h-6 bg-border mx-1 shrink-0" />

          {/* Editable title */}
          <input
            value={formConfig.title || ""}
            onChange={handleTitleChange}
            className="text-sm font-semibold bg-transparent border-0 outline-none focus:ring-2 focus:ring-primary/30 rounded-md px-2 py-1 min-w-0 max-w-[220px] truncate"
            placeholder="Form title"
          />

          <div className="flex-1" />

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={undo} disabled={!canUndo}>
                  <Undo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Undo</TooltipContent>
            </Tooltip>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={redo} disabled={!canRedo}>
                  <Redo2 className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>Redo</TooltipContent>
            </Tooltip>
          </div>

          <div className="w-px h-6 bg-border mx-1 shrink-0" />

          {/* View tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="h-8">
              <TabsTrigger value="builder" className="text-sm px-4 h-7 gap-1.5">
                <Settings2 className="h-3.5 w-3.5" /> Builder
              </TabsTrigger>
              <TabsTrigger value="preview" className="text-sm px-4 h-7 gap-1.5">
                <Eye className="h-3.5 w-3.5" /> Preview
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="w-px h-6 bg-border mx-1 shrink-0" />

          {/* Dark mode */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDarkMode((d) => !d)}>
                {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{darkMode ? "Light mode" : "Dark mode"}</TooltipContent>
          </Tooltip>
        </header>

        {/* ── Body ── */}
        <div className="flex-1 flex overflow-hidden">
          <AnimatePresence>
            {activeTab === "builder" ? (
              <motion.div
                key="builder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-1 overflow-hidden"
              >
                {/* DndContext wraps everything so palette → canvas dragging works */}
                <DndContext
                  sensors={sensors}
                  collisionDetection={closestCenter}
                  onDragStart={handleDragStart}
                  onDragEnd={handleDragEnd}
                >
                  {/* Left: palette */}
                  <AnimatePresence>
                    {showPalette && (
                      <motion.div
                        initial={{ width: 0, opacity: 0 }}
                        animate={{ width: 208, opacity: 1 }}
                        exit={{ width: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden shrink-0"
                      >
                        <FieldPalette />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Center: canvas */}
                  <div className="flex-1 flex flex-col overflow-hidden">
                    {/* Canvas toolbar */}
                    <div className="h-11 shrink-0 border-b flex items-center px-4 gap-3 bg-muted/30">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setShowPalette((p) => !p)}>
                            {showPalette ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>{showPalette ? "Hide palette" : "Show palette"}</TooltipContent>
                      </Tooltip>

                      <span className="text-sm font-medium text-muted-foreground">
                        {fields.length} {fields.length === 1 ? "field" : "fields"}
                      </span>

                      {fields.length === 0 && (
                        <button
                          onClick={() => setShowGallery(true)}
                          className="ml-auto flex items-center gap-1.5 text-sm text-primary hover:underline"
                        >
                          <Sparkles className="h-3.5 w-3.5" /> Use a template
                        </button>
                      )}
                    </div>

                    {/* Canvas content */}
                    <div className="flex-1 overflow-hidden relative">
                      <AnimatePresence>
                        {showGallery && fields.length === 0 ? (
                          <motion.div
                            key="gallery"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 overflow-y-auto bg-background z-10"
                          >
                            <TemplateGallery
                              onSelect={handleTemplateSelect}
                              onDismiss={() => setShowGallery(false)}
                            />
                          </motion.div>
                        ) : (
                          <FieldCanvas
                            fields={fields}
                            selectedKey={selectedKey}
                            onSelect={setSelectedKey}
                            onDelete={handleFieldDelete}
                            onDuplicate={handleFieldDuplicate}
                          />
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <DragOverlay dropAnimation={null}>
                    {activeDragData?.fromPalette && (
                      <div className="px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium shadow-xl opacity-90 pointer-events-none">
                        + {activeDragData.fieldTypeDef.label}
                      </div>
                    )}
                  </DragOverlay>
                </DndContext>

                {/* Right: property editor (outside DndContext — not a drop target) */}
                <FieldPropertyEditor
                  field={selectedField}
                  onUpdate={handleFieldUpdate}
                  onDelete={handleFieldDelete}
                />
              </motion.div>
            ) : (
              /* ── Preview pane ── */
              <motion.div
                key="preview"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex-1 flex overflow-hidden"
              >
                {/* Right side tabs: live preview / json / export / payload */}
                <div className="flex-1 flex flex-col overflow-hidden border-l">
                  <div className="h-11 shrink-0 border-b flex items-center px-4 gap-1 bg-muted/30">
                    {[
                      { value: "preview", icon: Eye, label: "Live Form" },
                      { value: "json", icon: FileJson, label: "JSON" },
                      { value: "export", icon: Download, label: "Export" },
                      { value: "payload", icon: Braces, label: "Payload" },
                    ].map(({ value, icon: Icon, label }) => (
                      <button
                        key={value}
                        onClick={() => setRightTab(value)}
                        className={cn(
                          "flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-colors",
                          rightTab === value
                            ? "bg-background shadow-sm text-foreground"
                            : "text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-3.5 w-3.5" /> {label}
                      </button>
                    ))}
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                      {rightTab === "preview" && (
                        <motion.div
                          key="live"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="p-6 max-w-3xl mx-auto"
                        >
                          {fields.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-64 gap-3 text-center">
                              <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
                                <Eye className="h-6 w-6 text-muted-foreground" />
                              </div>
                              <p className="text-sm font-medium text-muted-foreground">No fields yet</p>
                              <p className="text-xs text-muted-foreground/60">Add fields in the Builder tab to see a live preview</p>
                            </div>
                          ) : (
                            <>
                              {formConfig.title && (
                                <h2 className="text-xl font-bold mb-6">{formConfig.title}</h2>
                              )}
                              <div className="bg-background rounded-2xl border shadow-sm p-6">
                                <DynamicJsonForm
                                  formConfig={formConfig}
                                  isPreview
                                  onFormDataChange={setPreviewFormData}
                                />
                              </div>
                            </>
                          )}
                        </motion.div>
                      )}

                      {rightTab === "json" && (
                        <motion.div
                          key="json"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="p-4 flex flex-col gap-3"
                          style={{ height: "calc(100vh - 90px)" }}
                        >
                          <div className="flex items-center justify-between shrink-0">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">JSON Editor</p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">Edit directly — click Apply to sync to the builder</p>
                            </div>
                            <div className="flex items-center gap-2">
                              {jsonError && (
                                <span className="text-xs text-red-500 max-w-48 truncate" title={jsonError}>{jsonError}</span>
                              )}
                              <Button size="sm" onClick={handleJsonApply} className="h-7 text-xs gap-1.5">
                                <Code2 className="h-3 w-3" /> Apply changes
                              </Button>
                            </div>
                          </div>
                          <div className="flex-1 min-h-0 rounded-xl overflow-hidden border">
                            <JsonEditorComponent
                              ref={editorRef}
                              initialContent={JSON.stringify(formConfig, null, 2)}
                            />
                          </div>
                        </motion.div>
                      )}

                      {rightTab === "export" && (
                        <motion.div
                          key="export"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <ExportPanel formConfig={formConfig} />
                        </motion.div>
                      )}

                      {rightTab === "payload" && (
                        <motion.div
                          key="payload"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          transition={{ duration: 0.15 }}
                        >
                          <SubmissionPreview formConfig={formConfig} formData={previewFormData} />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </TooltipProvider>
  );
}
