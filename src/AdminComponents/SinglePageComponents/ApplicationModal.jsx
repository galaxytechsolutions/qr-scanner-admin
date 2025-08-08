import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Modal, Button, Form as BootstrapForm } from "react-bootstrap";

import { applicationSchema } from "@/lib/schemas";
import { useCreateApplicationMutation, useGetAuthUserQuery } from "@/state/api";

// Replace this with actual fields if CustomFormField is not reusable in JSX
const InputField = ({ label, name, register, type = "text", placeholder, as = "input", errors }) => (
  <BootstrapForm.Group className="mb-3">
    <BootstrapForm.Label>{label}</BootstrapForm.Label>
    <BootstrapForm.Control
      as={as}
      type={type}
      placeholder={placeholder}
      {...register(name)}
      isInvalid={!!errors[name]}
    />
    <BootstrapForm.Control.Feedback type="invalid">
      {errors[name]?.message}
    </BootstrapForm.Control.Feedback>
  </BootstrapForm.Group>
);

const ApplicationModal = ({ isOpen, onClose, propertyId }) => {
  const [createApplication] = useCreateApplicationMutation();
  const { data: authUser } = useGetAuthUserQuery();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(applicationSchema),
    defaultValues: {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  const onSubmit = async (data) => {
    if (!authUser || authUser.userRole !== "tenant") {
      console.error("You must be logged in as a tenant to submit an application");
      return;
    }

    await createApplication({
      ...data,
      applicationDate: new Date().toISOString(),
      status: "Pending",
      propertyId: propertyId,
      tenantCognitoId: authUser.cognitoInfo.userId,
    });
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Submit Application for this Property</Modal.Title>
      </Modal.Header>
      <BootstrapForm onSubmit={handleSubmit(onSubmit)} className="p-3">
        <InputField
          label="Name"
          name="name"
          type="text"
          placeholder="Enter your full name"
          register={register}
          errors={errors}
        />
        <InputField
          label="Email"
          name="email"
          type="email"
          placeholder="Enter your email address"
          register={register}
          errors={errors}
        />
        <InputField
          label="Phone Number"
          name="phoneNumber"
          type="text"
          placeholder="Enter your phone number"
          register={register}
          errors={errors}
        />
        <InputField
          label="Message (Optional)"
          name="message"
          placeholder="Enter any additional information"
          as="textarea"
          register={register}
          errors={errors}
        />
        <div className="d-grid">
          <Button type="submit" variant="primary">
            Submit Application
          </Button>
        </div>
      </BootstrapForm>
    </Modal>
  );
};

export default ApplicationModal;
