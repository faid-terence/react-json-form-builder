
import DynamicJsonForm from "./components/shared/RJSFFormComponent";

const formConfig = {
  fields: [
    {
      key: "APPLICANT_LAST_NAME",
      type: "custom-input",
      className: "col-span-1",
      templateOptions: {
        type: "text",
        required: true,
        label: "Tetstinfgagg",
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

const App = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Irembo Applications</h1>
      <DynamicJsonForm formConfig={formConfig} />
    </div>
  );
};

export default App;
