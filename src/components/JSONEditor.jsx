import React, { useEffect, useRef } from "react";
import { JSONEditor } from "vanilla-jsoneditor/standalone.js";

const JsonEditorComponent = React.forwardRef(({ initialContent }, ref) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current && containerRef.current) {
      const startJson = initialContent
        ? (() => { try { return JSON.parse(initialContent); } catch { return { fields: [] }; } })()
        : { title: "Untitled Form", fields: [] };

      editorRef.current = new JSONEditor({
        target: containerRef.current,
        props: { content: { text: undefined, json: startJson } },
      });
    }
    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []); // intentionally runs once — initialContent seeds the mount

  React.useImperativeHandle(ref, () => ({
    getContent: () => {
      if (!editorRef.current) return "";
      const content = editorRef.current.get();
      if (content.json !== undefined) return JSON.stringify(content.json, null, 2);
      return content.text || "";
    },
    setContent: (jsonString) => {
      if (!editorRef.current) return;
      try {
        editorRef.current.set({ json: JSON.parse(jsonString) });
      } catch {
        editorRef.current.set({ text: jsonString });
      }
    },
  }));

  return (
    <div style={{ display: "flex", flexDirection: "column", width: "100%", height: "100%" }}>
      <div ref={containerRef} style={{ flex: 1, minHeight: 0 }} />
    </div>
  );
});

JsonEditorComponent.displayName = "JsonEditorComponent";

export default JsonEditorComponent;
