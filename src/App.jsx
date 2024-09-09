import React, { useRef, useState } from "react";
import DynamicJsonForm from "./components/shared/RJSFFormComponent";
import JsonEditorComponent from "./components/json-editor";

const App = () => {
  const [formConfig, setFormConfig] = useState({ fields: [] });
  const editorRef = useRef(null);

  const handlePreview = () => {
    if (editorRef.current) {
      const jsonContent = editorRef.current.getContent();
      try {
        const parsedJson = JSON.parse(jsonContent);
        setFormConfig(parsedJson);
      } catch (error) {
        console.error("Invalid JSON:", error);
        alert("Invalid JSON. Please check your input.");
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Application form</h1>
      <JsonEditorComponent ref={editorRef} />
      <button
        onClick={handlePreview}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
      >
        Preview Form
      </button>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Form Preview:</h2>
        <DynamicJsonForm formConfig={formConfig} />
      </div>
    </div>
  );
};

export default App;
