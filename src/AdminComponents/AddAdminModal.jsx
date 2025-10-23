import React, { useState, useEffect } from "react";
import {
    Modal,
    ModalHeader,
    ModalBody,
    ModalFooter,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Spinner,
} from "reactstrap";
import Swal from "sweetalert2";
import { Instance } from "../Instence/Instence";
import ConstituencyDropdown from "../components/ContituenciesDropdown";

const AddAdminModal = ({ isOpen, toggle, onAdminAdded, adminData, isEdit = false}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phoneNo: "",
        password: "",
        constituency: "",
        profilePic: null,
    });
    const [loading, setLoading] = useState(false);
    const isEditing = !!adminData;

    useEffect(() => {
        if (isEditing) {
            setFormData({
                name: adminData.name || "",
                email: adminData.email || "",
                phoneNo: adminData.phoneNo || "",
                password: adminData.password || "",
                constituency: adminData.constituency || "",
                profilePic: null,
            });
        } else {
            resetForm();
        }
    }, [adminData, isOpen]);


    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        setFormData((prev) => ({ ...prev, profilePic: e.target.files[0] }));
    };

    const resetForm = () => {
        setFormData({
            name: "",
            email: "",
            phoneNo: "",
            password: "",
            constituency: "",
            profilePic: null,
        });
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        const adminFormData = new FormData();
        // Only append fields that have a value. For edits, this prevents overwriting with empty strings.
        for (const key in formData) {
            if (formData[key]) {
                adminFormData.append(key, formData[key]);
            }
        }

        try {
            let response;
            if (isEditing) {
                response = await Instance.put(`/admin/${adminData._id}`, adminFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            } else {
                response = await Instance.post("/admin", adminFormData, {
                    headers: { "Content-Type": "multipart/form-data" },
                });
            }

            if (response.status === 200 || response.status === 201) {
                Swal.fire(
                    "Success!",
                    isEditing ? "Admin updated successfully." : "Admin added successfully.",
                    "success"
                );
                // The backend might return the updated/created object under different keys
                const newOrUpdatedAdmin = response.data.admin || response.data.updatedAdmin || response.data.newAdmin;
                onAdminAdded(newOrUpdatedAdmin);
                resetForm();
                toggle();
            }
        } catch (error) {
            const errorMessage = error.response?.data?.error || "An unexpected error occurred.";
            Swal.fire("Error", errorMessage, "error");
            console.error("Error adding/updating admin:", error);
        } finally {
            setLoading(false);
        }
    };


    return (
        <Modal isOpen={isOpen} toggle={toggle} centered>
            <ModalHeader toggle={toggle}>{isEditing ? "Edit Admin" : "Add New Admin"}</ModalHeader>
            <Form onSubmit={handleSubmit}>
                <ModalBody style={{ maxHeight: "70vh", overflowY: "auto" }}>
                    <FormGroup>
                        <Label for="name">Name</Label>
                        <Input
                            id="name"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            placeholder="Enter Name"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            placeholder="Enter Email"
                            required
                        />
                    </FormGroup>

                    <FormGroup>
                        <Label for="phoneNo">Phone Number</Label>
                        <Input
                            id="phoneNo"
                            name="phoneNo"
                            value={formData.phoneNo}
                            onChange={handleInputChange}
                            placeholder="Enter Phone Number"
                            required
                        />
                    </FormGroup>

                    {isEdit ? (
                        <FormGroup>
                            <Label for="password">Password (leave blank to keep current)</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter new Password"
                            />
                        </FormGroup>
                    ) : (
                        <FormGroup>
                            <Label for="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                placeholder="Enter Password"
                                required
                            />
                        </FormGroup>
                    )}


                    <FormGroup>
                        <Label for="profilePic">Profile Picture (Optional)</Label>
                        <Input
                            id="profilePic"
                            type="file"
                            name="profilePic"
                            onChange={handleFileChange}
                            accept="image/*"
                        />

                    </FormGroup>

                    <FormGroup>
                        <Label for="constituency">Constituency</Label>
                        <div>
                            <ConstituencyDropdown
                                value={formData.constituency}
                                onChange={(selectedValue) =>
                                    setFormData((prev) => ({ ...prev, constituency: selectedValue }))
                                }
                            />
                        </div>
                    </FormGroup>




                </ModalBody>

                <ModalFooter>
                    <Button color="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner size="sm" /> : (isEditing ? "Update" : "Submit")}
                    </Button>
                    <Button color="secondary" onClick={toggle}>
                        Cancel
                    </Button>
                </ModalFooter>
            </Form>
        </Modal>
    );
};

export default AddAdminModal;
