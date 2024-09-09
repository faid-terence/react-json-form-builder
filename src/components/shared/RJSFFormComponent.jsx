import React, { useState } from "react";
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



const DynamicJsonForm = ({ formConfig }) => {
  const [formData, setFormData] = useState({});

  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const renderField = (field) => {
    const { key, type, className, templateOptions } = field;
    const { label, required, placeholder, options } = templateOptions || field;

    const fieldContent = () => {
      switch (type) {
        case "custom-input":
          return (
            <>
              <Label htmlFor={key}>{label}</Label>
              <Input
                type="text"
                id={key}
                value={formData[key] || ""}
                onChange={(e) => handleInputChange(key, e.target.value)}
                placeholder={placeholder}
                required={required}
              />
            </>
          );
        case "select":
        case "custom-select":
          return (
            <>
              <Label htmlFor={key}>{label}</Label>
              <Select
                onValueChange={(value) => handleInputChange(key, value)}
                value={formData[key] || ""}
              >
                <SelectTrigger>
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
            </>
          );
        case "checkbox":
          return (
            <div className="flex items-center">
              <Checkbox
                id={key}
                checked={formData[key] || false}
                onCheckedChange={(checked) => handleInputChange(key, checked)}
              />
              <Label htmlFor={key} className="ml-2">
                {label}
              </Label>
            </div>
          );
        case "custom-radio":
          return (
            <>
              <Label>{label}</Label>
              <RadioGroup
                onValueChange={(value) => handleInputChange(key, value)}
                value={formData[key] || ""}
              >
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="flex items-center space-x-2"
                  >
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label htmlFor={option.value}>{option.name}</Label>
                  </div>
                ))}
              </RadioGroup>
            </>
          );
        case "custom-date":
          return (
            <>
              <Label htmlFor={key}>{label}</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData[key] && "text-muted-foreground",
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
                  />
                </PopoverContent>
              </Popover>
            </>
          );
        default:
          return null;
      }
    };

    return (
      <div key={key} className={`${className} mb-4`}>
        {fieldContent()}
      </div>
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
    <form onSubmit={handleSubmit} className="space-y-4">
      {groupedFields.map((pair, index) => (
        <div key={index} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {pair.map(renderField)}
        </div>
      ))}
      <Button type="submit" className="mt-4">
        Submit
      </Button>
    </form>
  );
};

export default DynamicJsonForm;