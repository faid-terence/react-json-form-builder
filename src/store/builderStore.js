import { useState, useCallback } from "react";

export const FIELD_TYPES = [
  { type: "custom-input", label: "Text Input", icon: "Type", inputType: "text" },
  { type: "custom-input", label: "Email", icon: "Mail", inputType: "email" },
  { type: "custom-input", label: "Phone", icon: "Phone", inputType: "tel" },
  { type: "custom-input", label: "Number", icon: "Hash", inputType: "number" },
  { type: "custom-input", label: "URL", icon: "Link", inputType: "url" },
  { type: "custom-select", label: "Dropdown", icon: "ChevronDown" },
  { type: "custom-radio", label: "Radio Group", icon: "CircleDot" },
  { type: "checkbox", label: "Checkbox", icon: "CheckSquare" },
  { type: "custom-textarea", label: "Textarea", icon: "AlignLeft" },
  { type: "custom-date", label: "Date Picker", icon: "Calendar" },
  { type: "file-upload", label: "File Upload", icon: "Upload" },
];

export const TEMPLATES = [
  {
    id: "job-application",
    name: "Job Application",
    description: "Collect applicant info, experience, and documents",
    icon: "Briefcase",
    config: {
      title: "Job Application",
      fields: [
        { key: "FULL_NAME", type: "custom-input", className: "col-span-1", templateOptions: { type: "text", label: "Full Name", placeholder: "Enter your full name", required: true } },
        { key: "EMAIL", type: "custom-input", className: "col-span-1", templateOptions: { type: "email", label: "Email Address", placeholder: "you@example.com", required: true } },
        { key: "PHONE", type: "custom-input", className: "col-span-1", templateOptions: { type: "tel", label: "Phone Number", placeholder: "+1 (555) 000-0000", required: false } },
        { key: "POSITION", type: "custom-select", className: "col-span-1", templateOptions: { label: "Position Applied For", placeholder: "Select a position", required: true, options: [{ name: "Software Engineer", value: "SWE" }, { name: "Product Manager", value: "PM" }, { name: "Designer", value: "DESIGN" }] } },
        { key: "EXPERIENCE", type: "custom-input", className: "col-span-1", templateOptions: { type: "number", label: "Years of Experience", placeholder: "e.g. 3", required: true } },
        { key: "EDUCATION", type: "custom-select", className: "col-span-1", templateOptions: { label: "Highest Education", placeholder: "Select level", required: true, options: [{ name: "High School", value: "HS" }, { name: "Bachelor's", value: "BS" }, { name: "Master's", value: "MS" }, { name: "PhD", value: "PHD" }] } },
        { key: "COVER_LETTER", type: "custom-textarea", className: "col-span-2", templateOptions: { label: "Cover Letter", placeholder: "Tell us why you're a great fit...", required: false } },
        { key: "RESUME", type: "file-upload", className: "col-span-1", templateOptions: { label: "Upload Resume", required: true } },
      ],
    },
  },
  {
    id: "contact",
    name: "Contact Form",
    description: "Simple contact form with subject and message",
    icon: "MessageSquare",
    config: {
      title: "Contact Us",
      fields: [
        { key: "NAME", type: "custom-input", className: "col-span-1", templateOptions: { type: "text", label: "Your Name", placeholder: "Full name", required: true } },
        { key: "EMAIL", type: "custom-input", className: "col-span-1", templateOptions: { type: "email", label: "Email", placeholder: "your@email.com", required: true } },
        { key: "SUBJECT", type: "custom-select", className: "col-span-2", templateOptions: { label: "Subject", placeholder: "What is this about?", required: true, options: [{ name: "General Inquiry", value: "general" }, { name: "Support", value: "support" }, { name: "Billing", value: "billing" }, { name: "Feedback", value: "feedback" }] } },
        { key: "MESSAGE", type: "custom-textarea", className: "col-span-2", templateOptions: { label: "Message", placeholder: "Write your message here...", required: true } },
        { key: "AGREE", type: "checkbox", className: "col-span-2", templateOptions: { label: "I agree to the privacy policy", required: true } },
      ],
    },
  },
  {
    id: "survey",
    name: "Feedback Survey",
    description: "Collect satisfaction ratings and open feedback",
    icon: "BarChart2",
    config: {
      title: "Feedback Survey",
      fields: [
        { key: "NAME", type: "custom-input", className: "col-span-1", templateOptions: { type: "text", label: "Name (optional)", placeholder: "Anonymous", required: false } },
        { key: "DATE", type: "custom-date", className: "col-span-1", templateOptions: { label: "Date of Experience", placeholder: "Pick a date", required: true } },
        { key: "RATING", type: "custom-radio", className: "col-span-2", templateOptions: { label: "Overall Satisfaction", required: true, options: [{ name: "Very Satisfied", value: "5" }, { name: "Satisfied", value: "4" }, { name: "Neutral", value: "3" }, { name: "Dissatisfied", value: "2" }, { name: "Very Dissatisfied", value: "1" }] } },
        { key: "CATEGORY", type: "custom-select", className: "col-span-1", templateOptions: { label: "Feedback Category", placeholder: "Select category", required: true, options: [{ name: "Product Quality", value: "quality" }, { name: "Customer Service", value: "service" }, { name: "Delivery", value: "delivery" }, { name: "Website", value: "website" }] } },
        { key: "RECOMMEND", type: "custom-radio", className: "col-span-1", templateOptions: { label: "Would you recommend us?", required: true, options: [{ name: "Yes", value: "yes" }, { name: "No", value: "no" }, { name: "Maybe", value: "maybe" }] } },
        { key: "COMMENTS", type: "custom-textarea", className: "col-span-2", templateOptions: { label: "Additional Comments", placeholder: "Any other feedback...", required: false } },
      ],
    },
  },
];

let _idCounter = 1;
export const generateFieldKey = (type) => `${type.replace("custom-", "").toUpperCase()}_${_idCounter++}`;

export const createDefaultField = (fieldTypeDef) => ({
  key: generateFieldKey(fieldTypeDef.type),
  type: fieldTypeDef.type,
  className: "col-span-1",
  templateOptions: {
    type: fieldTypeDef.inputType || undefined,
    label: fieldTypeDef.label,
    placeholder: `Enter ${fieldTypeDef.label.toLowerCase()}`,
    required: false,
    ...(["custom-select", "custom-radio"].includes(fieldTypeDef.type)
      ? { options: [{ name: "Option 1", value: "option_1" }, { name: "Option 2", value: "option_2" }] }
      : {}),
  },
});

export function useBuilderHistory(initial) {
  const [state, setState] = useState({ history: [initial], cursor: 0 });

  const current = state.history[state.cursor];

  // push is stable — uses functional setState, no captured cursor
  const push = useCallback((next) => {
    setState((s) => {
      const sliced = s.history.slice(0, s.cursor + 1);
      return { history: [...sliced, next], cursor: s.cursor + 1 };
    });
  }, []);

  const undo = useCallback(() => {
    setState((s) => ({ ...s, cursor: Math.max(0, s.cursor - 1) }));
  }, []);

  const redo = useCallback(() => {
    setState((s) => ({ ...s, cursor: Math.min(s.history.length - 1, s.cursor + 1) }));
  }, []);

  const canUndo = state.cursor > 0;
  const canRedo = state.cursor < state.history.length - 1;

  return { current, push, undo, redo, canUndo, canRedo };
}
