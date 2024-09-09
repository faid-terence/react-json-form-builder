# JSON Form Generator

## Description

This project is a React-based application that allows users to create and preview dynamic forms using a JSON editor. It consists of two main components: a JSON editor for defining the form structure, and a dynamic form renderer that displays the form based on the JSON configuration.

## Features

- JSON editor with syntax highlighting and error checking
- Real-time form preview
- Dynamic form generation based on JSON configuration
- User-friendly interface with a preview button

## Installation

To set up this project locally, follow these steps:

1. Clone the repository:

   ```
   git clone https://github.com/faid-terence/json-form-generator.git
   ```

2. Navigate to the project directory:

   ```
   cd json-form-generator
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Start the development server:
   ```
   npm run dev
   ```

## Usage

1. **Editing the JSON**:

   - Use the JSON editor component to define your form structure.
   - The editor provides syntax highlighting and error checking to help you write valid JSON.

2. **Previewing the Form**:

   - After editing the JSON, click the "Preview Form" button to see how your form looks.
   - If there are any errors in your JSON, you'll see an alert.

3. **Form Structure**:

   - The JSON should follow a specific structure to generate the form correctly.
   - Here's a basic example of the JSON structure:
  
   ```

    { "fields": [
      {
        "key": "APPLICANT_FULL_NAME",
        "type": "custom-input",
        "className": "col-span-1",
        "templateOptions": {
          "type": "text",
          "required": true,
          "label": "Full Name",
          "placeholder": "Enter your full name",
          "summarySection": "PERSONAL_DETAILS"
        }
      },
      {
        "key": "POSITION_APPLIED",
        "type": "custom-select",
        "className": "col-span-1",
        "templateOptions": {
          "label": "Position Applied For",
          "options": [
            { "name": "Software Engineer", "value": "SOFTWARE_ENGINEER" },
            { "name": "Product Manager", "value": "PRODUCT_MANAGER" },
            { "name": "UI/UX Designer", "value": "UI_UX_DESIGNER" }
          ],
          "required": true,
          "placeholder": "Select the position",
          "summarySection": "JOB_DETAILS"
        }
      },
      {
        "key": "YEARS_OF_EXPERIENCE",
        "type": "custom-input",
        "className": "col-span-1",
        "templateOptions": {
          "type": "number",
          "required": true,
          "label": "Years of Experience",
          "placeholder": "Enter years of experience",
          "summarySection": "JOB_DETAILS"
        }
      },
      {
        "key": "HIGHEST_EDUCATION",
        "type": "custom-select",
        "className": "col-span-1",
        "templateOptions": {
          "label": "Highest Level of Education",
          "options": [
            { "name": "High School", "value": "HIGH_SCHOOL" },
            { "name": "Bachelor's Degree", "value": "BACHELORS" },
            { "name": "Master's Degree", "value": "MASTERS" },
            { "name": "Ph.D.", "value": "PHD" }
          ],
          "required": true,
          "placeholder": "Select your education level",
          "summarySection": "EDUCATION_DETAILS"
        }
      },
      {
        "key": "LINKEDIN_PROFILE",
        "type": "custom-input",
        "className": "col-span-1",
        "templateOptions": {
          "type": "url",
          "label": "LinkedIn Profile",
          "placeholder": "Enter LinkedIn profile URL",
          "summarySection": "CONTACT_DETAILS"
        }
      },
      {
        "key": "PORTFOLIO_LINK",
        "type": "custom-input",
        "className": "col-span-1",
        "templateOptions": {
          "type": "url",
          "label": "Portfolio Website",
          "placeholder": "Enter portfolio website URL",
          "summarySection": "CONTACT_DETAILS"
        }
      },
      {
        "key": "COVER_LETTER",
        "type": "custom-input",
        "className": "col-span-2",
        "templateOptions": {
          "label": "Cover Letter",
          "placeholder": "Write a short cover letter",
          "rows": 5,
          "required": true,
          "summarySection": "JOB_APPLICATION_DETAILS"
        }
      },
      {
        "key": "AVAILABILITY_DATE",
        "type": "custom-date",
        "className": "col-span-1",
        "templateOptions": {
          "label": "Available Start Date",
          "required": true,
          "placeholder": "Select availability date",
          "summarySection": "JOB_APPLICATION_DETAILS",
          "summaryFormatting": {
            "dateFormat": "MM/DD/YYYY",
            "formatType": "DATE"
          }
        }
      },
      {
        "key": "GENDER",
        "type": "custom-radio",
        "className": "col-span-1",
        "templateOptions": {
          "label": "Gender",
          "options": [
            { "name": "Male", "value": "MALE" },
            { "name": "Female", "value": "FEMALE" },
            { "name": "Other", "value": "OTHER" }
          ],
          "required": true,
          "summarySection": "PERSONAL_DETAILS"
        }
      }
    ]

## Components

### JsonEditorComponent

This component uses the `vanilla-jsoneditor` library to provide a rich JSON editing experience.

Props:

- None

Methods:

- `getContent()`: Returns the current content of the JSON editor.

Usage:

```jsx
import React, { useRef } from "react";
import JsonEditorComponent from "./components/JsonEditorComponent";

function MyComponent() {
  const editorRef = useRef(null);

  const handleGetContent = () => {
    const content = editorRef.current.getContent();
    console.log(content);
  };

  return (
    <div>
      <JsonEditorComponent ref={editorRef} />
      <button onClick={handleGetContent}>Get Content</button>
    </div>
  );
}
```

### DynamicJsonForm

This component renders a form based on the provided JSON configuration.

Props:

- `formConfig`: An object containing the form configuration.

Usage:

```jsx
import React from "react";
import DynamicJsonForm from "./components/DynamicJsonForm";

function MyForm() {
  const formConfig = {
    fields: [
      {
        key: "APPLICANT_LAST_NAME",
        type: "custom-input",
        className: "col-span-1",
        templateOptions: {
          type: "text",
          required: true,
          label: "Applicant's last name",
          placeholder: "Enter last name",
          summarySection: "APPLICANT_DETAILS",
        },
      },
      {
        key: "APPLICANT_FIRST_NAME",
        type: "custom-input",
        className: "col-span-1",
        templateOptions: {
          type: "text",
          required: true,
          label: "Other names",
          placeholder: "Enter other names",
          summarySection: "APPLICANT_DETAILS",
        },
      },
      {
        key: "EMAIL",
        type: "custom-input",
        className: "col-span-1",
        templateOptions: {
          type: "email",
          required: true,
          label: "Email Address",
          placeholder: "Enter email",
          summarySection: "CONTACT_DETAILS",
        },
      },
      {
        key: "PHONE_NUMBER",
        type: "custom-input",
        className: "col-span-1",
        templateOptions: {
          type: "tel",
          required: true,
          label: "Phone Number",
          placeholder: "Enter phone number",
          summarySection: "CONTACT_DETAILS",
        },
      },
      {
        key: "DATE_OF_BIRTH",
        type: "custom-date",
        className: "col-span-1",
        templateOptions: {
          label: "Date of Birth",
          required: true,
          placeholder: "Select birth date",
          summarySection: "NEW_IDENTIFICATION_NUMBER",
          summaryFormatting: {
            dateFormat: "DD/MM/YYYY",
            formatType: "DATE",
          },
        },
      },
      {
        key: "GENDER",
        type: "custom-radio",
        className: "col-span-1",
        templateOptions: {
          label: "Gender",
          options: [
            {
              name: "Male",
              value: "MALE",
            },
            {
              name: "Female",
              value: "FEMALE",
            },
          ],
          required: true,
          summarySection: "NEW_IDENTIFICATION_NUMBER",
        },
      },
      {
        key: "DOCUMENT_TYPE",
        type: "custom-select",
        className: "col-span-1",
        templateOptions: {
          label: "Identification document type",
          options: [
            {
              name: "Rwanda National ID",
              value: "RWANDA_NATIONAL_ID",
            },
            {
              name: "Passport",
              value: "PASSPORT",
            },
            {
              name: "NPR Application Number",
              value: "NPR_APPLICATION_NUMBER",
            },
          ],
          required: true,
          placeholder: "Select document type",
          summarySection: "NEW_IDENTIFICATION_NUMBER",
          summaryFormatting: {
            useLabel: "Identification document type",
            formatType: "STANDARD_OPTIONS",
          },
        },
      },
    ],
  };
  return <DynamicJsonForm formConfig={formConfig} />;
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.
