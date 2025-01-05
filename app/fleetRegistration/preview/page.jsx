"use client"
import React from "react";
import { FormProvider } from "../../context/FormContext";
import PreviewPage from "../../components/forms/Preview";
import FleetDetailsForm from "../../components/forms/FleetDetailsForm";

export default function FleetDetailsPage() {
  return (
    <FormProvider>
      <PreviewPage />
    </FormProvider>
  );
}
