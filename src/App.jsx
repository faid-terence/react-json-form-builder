import React, { useRef, useState } from "react";
import DynamicJsonForm from "./components/shared/RJSFFormComponent";
import JsonEditorComponent from "./components/JSONEditor";
import { Button } from "./components/ui/button";
import { Popover } from "./components/ui/popover";

const App = () => {
  const [formConfig, setFormConfig] = useState({ fields: [] });
  const [error, setError] = useState(null);
  const editorRef = useRef(null);

  const handlePreview = () => {
    if (editorRef.current) {
      const jsonContent = editorRef.current.getContent();
      try {
        const parsedJson = JSON.parse(jsonContent);
        setFormConfig(parsedJson);
        setError(null); // Clear the error if JSON is valid
      } catch (error) {
        console.error("Invalid JSON:", error);
        setError(error.message); // Set error message
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Application form</h1>
      <JsonEditorComponent ref={editorRef} />

      <button
        onClick={handlePreview}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors "
      >
        Preview Form
      </button>

      {error && <HandleError error={error} />}

      {formConfig.fields.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Form Preview:
          </h2>
          <DynamicJsonForm formConfig={formConfig} />
        </div>
      )}
    </div>
  );
};

function HandleError({ error }) {
  return (
    <Popover>
      <Popover.Button>
        <Button className="bg-red-500 text-white">Show Error</Button>
      </Popover.Button>
      <Popover.Panel>
        <div className="p-4 bg-red-500 text-white">
          <h3 className="font-semibold">Error</h3>
          <pre>{error}</pre>
        </div>
      </Popover.Panel>
    </Popover>
  );
}

export default App;
