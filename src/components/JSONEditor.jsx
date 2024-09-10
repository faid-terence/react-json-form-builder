import React, { useEffect, useRef } from "react";
import { JSONEditor } from "vanilla-jsoneditor/standalone.js";

const JsonEditorComponent = React.forwardRef((props, ref) => {
  const editorRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    if (!editorRef.current && containerRef.current) {
      editorRef.current = new JSONEditor({
        target: containerRef.current,
        props: {
          content: {
            text: undefined,
            json: {
              fields: [],
            },
          },
        },
      });
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = null;
      }
    };
  }, []);

  React.useImperativeHandle(ref, () => ({
    getContent: () => {
      if (editorRef.current) {
        const content = editorRef.current.get();
        if (content.json) {
          return JSON.stringify(content.json, null, 2);
        }
         else if (content.text) {
          return content.text;
        }
      }
      
      return "";
    },
  }));

  return (
    <div>
      <div ref={containerRef} style={{ width: "100%", height: "400px" }}></div>
    </div>
  );
});

export default JsonEditorComponent;
