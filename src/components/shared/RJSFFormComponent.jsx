import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";

const DynamicJsonForm = ({ formConfig }) => {
  const [formData, setFormData] = useState({});
  const [visibleFields, setVisibleFields] = useState({});

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  useEffect(() => {
    const evaluateHideExpressions = () => {
      const newVisibleFields = {};
      formConfig.fields.forEach((field) => {
        if (field.hideExpression) {
          try {
            const hideFunc = new Function(
              "formData",
              `return ${field.hideExpression}`
            );
            newVisibleFields[field.key] = !hideFunc(formData);
          } catch (error) {
            console.error(
              `Error evaluating hideExpression for field ${field.key}:`,
              error
            );
            newVisibleFields[field.key] = true;
          }
        } else {
          newVisibleFields[field.key] = true;
        }
      });
      setVisibleFields(newVisibleFields);
    };

    evaluateHideExpressions();
  }, [formData, formConfig.fields]);

  const renderField = (field) => {
    const { key, type, className, templateOptions } = field;
    const { label, required, placeholder, options } = templateOptions || field;

    if (!visibleFields[key]) {
      return null;
    }

    const fieldContent = () => {
      switch (type) {
        case "custom-input":
          return (
            <div className="flex flex-col w-full">
              <Label
                htmlFor={key}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {label}
              </Label>
              <Input
                type="text"
                id={key}
                value={formData[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={placeholder}
                required={required}
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
          );
        case "select":
        case "custom-select":
          return (
            <div className="flex flex-col w-full">
              <Label
                htmlFor={key}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {label}
              </Label>
              <Select
                onValueChange={(value) => handleInputChange(key, value)}
                value={formData[key] || ""}
              >
                <SelectTrigger className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 shadow-sm">
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.name || option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          );
        case "checkbox":
          return (
            <div className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={formData[key] || false}
                onCheckedChange={(checked) => handleInputChange(key, checked)}
                className="rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label
                htmlFor={key}
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {label}
              </Label>
            </div>
          );
        case "custom-radio":
          return (
            <div className="flex flex-col w-full">
              <Label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {label}
              </Label>
              <RadioGroup
                onValueChange={(value) => handleInputChange(key, value)}
                value={formData[key] || ""}
                className="space-y-2"
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={option.value}
                      className="text-blue-600"
                    />
                    <Label
                      htmlFor={option.value}
                      className="text-sm text-gray-600 dark:text-gray-400"
                    >
                      {option.name}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>
          );
        case "custom-date":
          return (
            <div className="flex flex-col w-full">
              <Label
                htmlFor={key}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {label}
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 shadow-sm",
                      !formData[key] && "text-gray-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData[key] ? (
                      format(formData[key], "PPP")
                    ) : (
                      <span>{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData[key]}
                    onSelect={(date) => handleInputChange(key, date)}
                    initialFocus
                    className="rounded-md border border-gray-200 shadow-lg"
                  />
                </PopoverContent>
              </Popover>
            </div>
          );
        case "custom-textarea":
          return (
            <div className="flex flex-col w-full">
              <Label
                htmlFor={key}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {label}
              </Label>
              <Textarea
                id={key}
                value={formData[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={placeholder}
                required={required}
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
          );
        case "file-upload":
          return (
            <div className="flex flex-col w-full">
              <Label
                htmlFor={key}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
              >
                {label}
              </Label>
              <Input
                type="file"
                id={key}
                onChange={(e) => handleInputChange(key, e.target.files[0])}
                required={required}
                className="rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
          );
        default:
          return null;
      }
    };

    return (
      <motion.div
        key={key}
        className={`${className} mb-6 w-full`}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {fieldContent()}
      </motion.div>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setFormData({});
  };

  const groupedFields = formConfig.fields.reduce((result, field, index) => {
    if (index % 2 === 0) {
      result.push([field]);
    } else {
      result[result.length - 1].push(field);
    }
    return result;
  }, []);

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-6 bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-4xl mx-auto"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {groupedFields.map((pair, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {pair.map(renderField)}
        </div>
      ))}
      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
        <Button
          type="submit"
          className="mt-6 bg-primary text-white rounded-md shadow-md w-full py-3 text-lg font-semibold transition-all duration-200"
        >
          Submit
        </Button>
      </motion.div>
    </motion.form>
  );
};

export default DynamicJsonForm;
