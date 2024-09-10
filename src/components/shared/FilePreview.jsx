// import { Label, Input, Sheet, SheetContent, SheetTrigger, Button } from "shadcn";
import { useState } from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";

const FileUploadWithPreview = ({
  uploadKey,
  label,
  placeholder,
  required,
  handleInputChange,
}) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    handleInputChange(uploadKey, file);
  };

  const openPreview = () => setIsOpen(true);
  const closePreview = () => setIsOpen(false);

  return (
    <div className="flex flex-col w-full">
      <Label
        htmlFor={uploadKey}
        className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
      >
        {label}
      </Label>
      <div className="flex items-center gap-2">
        <Input
          type="file"
          id={uploadKey}
          onChange={handleFileChange}
          placeholder={placeholder}
          required={required}
          className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 shadow-sm"
        />
        {selectedFile && (
          <Button variant="outline" onClick={openPreview} className="ml-2">
            Preview
          </Button>
        )}
      </div>

      {/* Preview Modal (Sheet) */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <div></div> {/* Trigger button is handled by Preview button */}
        </SheetTrigger>
        <SheetContent side="bottom" className="p-6">
          <h2 className="text-lg font-bold mb-4">File Preview</h2>
          {selectedFile && (
            <div className="file-preview">
              {selectedFile.type.startsWith("image/") ? (
                <img
                  src={URL.createObjectURL(selectedFile)}
                  alt="Preview"
                  className="w-full h-auto rounded-lg shadow-md"
                />
              ) : (
                <p className="text-sm">
                  Preview not available for this file type.
                </p>
              )}
            </div>
          )}
          <Button variant="ghost" className="mt-4" onClick={closePreview}>
            Close
          </Button>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default FileUploadWithPreview;
