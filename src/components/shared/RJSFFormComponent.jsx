import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, ChevronRight, ChevronLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Textarea } from "@/components/ui/textarea";
import FileUploadWithPreview from "./FilePreview";

function validateField(field, value) {
  const to = field.templateOptions || {};
  if (to.required && (value === undefined || value === null || value === "" || value === false)) {
    return to.errorMessage || `${to.label || field.key} is required`;
  }
  if (value && typeof value === "string") {
    if (to.minLength && value.length < to.minLength)
      return to.errorMessage || `Minimum ${to.minLength} characters required`;
    if (to.maxLength && value.length > to.maxLength)
      return to.errorMessage || `Maximum ${to.maxLength} characters allowed`;
    if (to.pattern) {
      try { if (!new RegExp(to.pattern).test(value)) return to.errorMessage || "Invalid format"; }
      catch {}
    }
  }
  return null;
}

function FieldError({ msg }) {
  if (!msg) return null;
  return (
    <p className="text-xs text-red-500 mt-1 flex items-center gap-1">
      <AlertCircle className="h-3 w-3 shrink-0" />{msg}
    </p>
  );
}

function FormField({ field, formData, errors, touched, submitted, onChange, onBlur }) {
  const { key, type, templateOptions = {} } = field;
  const { label, required, placeholder, options } = templateOptions;
  const value = formData[key];
  const showError = (touched[key] || submitted) && errors[key];
  const errMsg = showError ? errors[key] : null;

  switch (type) {
    case "custom-input":
      return (
        <div className="flex flex-col w-full">
          <Label htmlFor={key} className="text-sm font-medium mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <Input
            type={templateOptions.type || "text"}
            id={key}
            value={value || ""}
            onChange={(e) => onChange(key, e.target.value)}
            onBlur={() => onBlur(key)}
            placeholder={placeholder}
            className={cn(errMsg && "border-red-400 focus-visible:ring-red-400")}
          />
          <FieldError msg={errMsg} />
        </div>
      );

    case "select":
    case "custom-select":
      return (
        <div className="flex flex-col w-full">
          <Label className="text-sm font-medium mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <Select onValueChange={(v) => onChange(key, v)} value={value || ""}>
            <SelectTrigger className={cn(errMsg && "border-red-400")}>
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {(options || []).map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>{opt.name || opt.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldError msg={errMsg} />
        </div>
      );

    case "checkbox":
      return (
        <div className="flex items-start gap-2.5 pt-1">
          <Checkbox
            id={key}
            checked={value || false}
            onCheckedChange={(c) => onChange(key, c)}
            className={cn("mt-0.5", errMsg && "border-red-400")}
          />
          <div>
            <Label htmlFor={key} className="text-sm font-medium cursor-pointer leading-snug">
              {label}{required && <span className="text-red-500 ml-0.5">*</span>}
            </Label>
            <FieldError msg={errMsg} />
          </div>
        </div>
      );

    case "custom-radio":
      return (
        <div className="flex flex-col w-full">
          <Label className="text-sm font-medium mb-2">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <RadioGroup onValueChange={(v) => onChange(key, v)} value={value || ""} className="space-y-2">
            {(options || []).map((opt) => (
              <div key={opt.value} className="flex items-center gap-2">
                <RadioGroupItem value={opt.value} id={`${key}-${opt.value}`} />
                <Label htmlFor={`${key}-${opt.value}`} className="text-sm font-normal cursor-pointer">{opt.name}</Label>
              </div>
            ))}
          </RadioGroup>
          <FieldError msg={errMsg} />
        </div>
      );

    case "custom-date":
      return (
        <div className="flex flex-col w-full">
          <Label className="text-sm font-medium mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className={cn(
                  "w-full justify-start text-left font-normal",
                  !value && "text-muted-foreground",
                  errMsg && "border-red-400"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {value ? format(value, "PPP") : (placeholder || "Pick a date")}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar mode="single" selected={value} onSelect={(d) => onChange(key, d)} initialFocus />
            </PopoverContent>
          </Popover>
          <FieldError msg={errMsg} />
        </div>
      );

    case "custom-textarea":
      return (
        <div className="flex flex-col w-full">
          <Label htmlFor={key} className="text-sm font-medium mb-1.5">
            {label}{required && <span className="text-red-500 ml-0.5">*</span>}
          </Label>
          <Textarea
            id={key}
            value={value || ""}
            onChange={(e) => onChange(key, e.target.value)}
            onBlur={() => onBlur(key)}
            placeholder={placeholder}
            className={cn("min-h-[100px]", errMsg && "border-red-400 focus-visible:ring-red-400")}
          />
          <div className="flex justify-between mt-1">
            <FieldError msg={errMsg} />
            {templateOptions.maxLength && (
              <p className={cn("text-xs ml-auto", (value || "").length > templateOptions.maxLength ? "text-red-500" : "text-muted-foreground")}>
                {(value || "").length}/{templateOptions.maxLength}
              </p>
            )}
          </div>
        </div>
      );

    case "file-upload":
      return (
        <FileUploadWithPreview
          uploadKey={key}
          label={label}
          placeholder={placeholder}
          required={required}
          handleInputChange={onChange}
        />
      );

    default:
      return null;
  }
}

const DynamicJsonForm = ({ formConfig, isPreview = false, onFormDataChange }) => {
  const [formData, setFormData] = useState({});
  const [visibleFields, setVisibleFields] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const fields = formConfig.fields || [];
  const steps = formConfig.steps;
  const isMultiStep = Array.isArray(steps) && steps.length > 0;

  const handleChange = (fieldName, value) => {
    setFormData((prev) => {
      const next = { ...prev, [fieldName]: value };
      onFormDataChange?.(next);
      return next;
    });
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  const handleBlur = (fieldName) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
  };

  // Evaluate hide expressions
  useEffect(() => {
    const newVisible = {};
    fields.forEach((field) => {
      if (field.hideExpression) {
        try {
          const fn = new Function("formData", `return ${field.hideExpression}`);
          newVisible[field.key] = !fn(formData);
        } catch {
          newVisible[field.key] = true;
        }
      } else {
        newVisible[field.key] = true;
      }
    });
    setVisibleFields(newVisible);
  }, [formData, fields]);

  // Validate visible fields
  useEffect(() => {
    const newErrors = {};
    fields.forEach((field) => {
      if (!visibleFields[field.key]) return;
      const err = validateField(field, formData[field.key]);
      if (err) newErrors[field.key] = err;
    });
    setErrors(newErrors);
  }, [formData, visibleFields, fields]);

  const visibleFieldList = fields.filter((f) => visibleFields[f.key] !== false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    const hasErrors = visibleFieldList.some((f) => errors[f.key]);
    if (hasErrors) return;
    setSubmitted(false);
    setFormData({});
    setTouched({});
    if (isPreview) alert("Form submitted!\n\n" + JSON.stringify(formData, null, 2));
  };

  const handleNext = () => {
    setSubmitted(true);
    const stepFields = (steps[currentStep].fieldKeys || [])
      .map((k) => fields.find((f) => f.key === k))
      .filter(Boolean)
      .filter((f) => visibleFields[f.key] !== false);
    const hasErrors = stepFields.some((f) => errors[f.key]);
    if (!hasErrors) { setSubmitted(false); setCurrentStep((s) => s + 1); }
  };

  const renderFieldWrapper = (field, idx) => {
    if (visibleFields[field.key] === false) return null;
    return (
      <motion.div
        key={field.key}
        className={cn(field.className === "col-span-2" ? "col-span-2" : "col-span-1", "w-full")}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2, delay: idx * 0.03 }}
      >
        <FormField
          field={field}
          formData={formData}
          errors={errors}
          touched={touched}
          submitted={submitted}
          onChange={handleChange}
          onBlur={handleBlur}
        />
      </motion.div>
    );
  };

  if (isMultiStep) {
    const step = steps[currentStep];
    const stepFields = (step.fieldKeys || [])
      .map((k) => fields.find((f) => f.key === k))
      .filter(Boolean);

    return (
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center gap-2 mb-6">
          {steps.map((s, i) => (
            <React.Fragment key={i}>
              <div className={cn(
                "flex items-center justify-center w-7 h-7 rounded-full text-xs font-semibold shrink-0 transition-all",
                i < currentStep ? "bg-primary text-primary-foreground" :
                i === currentStep ? "bg-primary text-primary-foreground ring-4 ring-primary/20" :
                "bg-muted text-muted-foreground"
              )}>
                {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span className="flex-1 text-xs text-muted-foreground truncate">{s.title}</span>
              {i < steps.length - 1 && <div className={cn("h-px w-8", i < currentStep ? "bg-primary" : "bg-border")} />}
            </React.Fragment>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-5">
          {stepFields.map((f, i) => renderFieldWrapper(f, i))}
        </div>

        <div className="flex gap-3 pt-2">
          {currentStep > 0 && (
            <Button type="button" variant="outline" onClick={() => setCurrentStep((s) => s - 1)} className="gap-2">
              <ChevronLeft className="h-4 w-4" /> Back
            </Button>
          )}
          {currentStep < steps.length - 1 ? (
            <Button type="button" onClick={handleNext} className="ml-auto gap-2">
              Next <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" className="ml-auto">Submit</Button>
          )}
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-5">
        {fields.map((f, i) => renderFieldWrapper(f, i))}
      </div>
      <motion.div whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} className="mt-6">
        <Button type="submit" className="w-full py-5 text-base font-semibold">
          Submit
        </Button>
      </motion.div>
    </form>
  );
};

export default DynamicJsonForm;
