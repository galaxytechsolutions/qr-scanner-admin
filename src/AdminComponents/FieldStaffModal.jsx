import React, { useEffect, useState } from "react";
import ReactSwitch from "react-switch";
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  FormGroup,
  Label,
  Input,
  Button,
} from "reactstrap";
import { ImgBaseUrl } from "../Instence/ImgInstence";

const FieldStaffModal = ({
  modalOpen,
  setModalOpen,
  handleSave,
  editMode,
  existingData,
  constituency,
}) => {
  const [newField, setNewField] = useState({
    name: "",
    role: "staff",
    locationCode: "",
    assignedRegion: "",
    constituency: "",
    phoneNo: "",
    email: "",
    whatsappActive: false,
    totalHousesAssigned: "",
    totalHousesCovered: "",
    notes: "",
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editMode && existingData) {
      setNewField({
        ...existingData,
        // Map array length → number
        totalHousesAssigned: existingData.assignedHouses?.length || 0,
        profilePic: existingData.profilePic || null, // Ensure profilePic is not undefined
      });
    } else if (!editMode && modalOpen) {
      setNewField({
        name: "",
        role: "staff",
        locationCode: "",
        constituency: constituency || "",
        assignedRegion: "",
        profilePic: "",
        phoneNo: "",
        email: "",
        whatsappActive: false,
        totalHousesAssigned: "",
        totalHousesCovered: "",
        notes: "",
      });
    }

    // Handle image preview
    if (editMode && existingData?.profilePic) {
      setImagePreview(`${ImgBaseUrl}${existingData.profilePic}`);
    } else {
      setImagePreview(null);
    }

    // Cleanup on modal close
    if (!modalOpen) {
      setImagePreview(null);
    }
  }, [editMode, existingData, modalOpen, constituency]);

  const handleChange = (field, value) => {
    if (field === "profilePic") {
      const file = value;
      setNewField({ ...newField, profilePic: file });
      if (file) {
        setImagePreview(URL.createObjectURL(file));
      } else {
        setImagePreview(null);
      }
    } else {
      setNewField({ ...newField, [field]: value });
    }
  };

  return (
    <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}>
      <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
        {editMode ? "Edit Field Staff" : "Add Field Staff"}
      </ModalHeader>
      <ModalBody style={{ height: "65vh", overflowY: "auto" }}>
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              type="text"
              id="name"
              value={newField.name}
              onChange={(e) => handleChange("name", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label for="role">Role</Label>
            <Input type="text" id="role" value={newField.role} readOnly />
          </FormGroup>

          <FormGroup>
            <Label for="constituency">Constituency</Label>
            <Input
              type="text"
              id="constituency"
              value={newField.constituency}
              onChange={(e) => handleChange("constituency", e.target.value)}
              readOnly={!editMode} // Or based on user role
            />
          </FormGroup>

          <FormGroup>
            <Label for="profilePic">Profile Picture</Label>
            <Input
              type="file"
              id="profilePic"
              onChange={(e) => handleChange("profilePic", e.target.files[0])}
            />
            {imagePreview && (
              <div className="mt-2">
                <img
                  src={imagePreview}
                  alt="Profile Preview"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                  }}
                />
              </div>
            )}
          </FormGroup>

          <FormGroup>
            <Label for="phoneNo">Phone Number</Label>
            <Input
              type="text"
              id="phoneNo"
              value={newField.phoneNo}
              onChange={(e) => handleChange("phoneNo", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              id="email"
              value={newField.email}
              onChange={(e) => handleChange("email", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label for="locationCode">Location</Label>
            <Input
              type="text"
              id="locationCode"
              value={newField.locationCode}
              onChange={(e) => handleChange("locationCode", e.target.value)}
            />
          </FormGroup>
          

          

          <FormGroup>
            <Label for="assignedRegion">Assigned Region</Label>
            <Input
              type="text"
              id="assignedRegion"
              value={newField.assignedRegion}
              onChange={(e) => handleChange("assignedRegion", e.target.value)}
            />
          </FormGroup>

          <FormGroup className="d-flex align-items-center">
            <Label className="me-3 mb-0">WhatsApp Active</Label>
            <ReactSwitch
              checked={!!newField.whatsappActive}
              onChange={(checked) => handleChange("whatsappActive", checked)}
              onColor="#0d6efd"
              offColor="#ccc"
              handleDiameter={12}
              height={20}
              width={40}
              uncheckedIcon={false}
              checkedIcon={false}
            />
            <span className="ms-2 fw-bold">
              {newField.whatsappActive ? "Yes" : "No"}
            </span>
          </FormGroup>

          <FormGroup>
            <Label for="totalHousesCovered">Total Houses Assigned</Label>
            <Input
              type="number"
              id="totalHousesCovered"
              value={newField.totalHousesCovered}
              onChange={(e) => handleChange("totalHousesCovered", e.target.value)}
            />
          </FormGroup>


          <FormGroup>
            <Label for="notes">Notes</Label>
            <Input
              type="textarea"
              id="notes"
              value={newField.notes}
              onChange={(e) => handleChange("notes", e.target.value)}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => handleSave(newField)}>
          {editMode ? "Update" : "Save"}
        </Button>

        <Button color="secondary" onClick={() => setModalOpen(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FieldStaffModal;
