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

const FieldStaffModal = ({ modalOpen, setModalOpen, handleSave, editMode, existingData }) => {
  const [newField, setNewField] = useState({
    name: "",
    role: "staff",
    locationCode: "",
    assignedRegion: "",
    phoneNo: "",
    email: "",
    whatsappActive: false,
    totalHousesAssigned: "",
    totalHousesCovered: "",
    notes: "",
  });

  useEffect(() => {
    if (editMode && existingData) {
      setNewField({
        ...existingData,
        // Map array length → number
        totalHousesAssigned: existingData.assignedHouses?.length || 0,
      });
    } else if (!editMode && modalOpen) {
      setNewField({
        name: "",
        role: "staff",
        locationCode: "",
        assignedRegion: "",
        phoneNo: "",
        email: "",
        whatsappActive: false,
        totalHousesAssigned: "",
        totalHousesCovered: "",
        notes: "",
      });
    }
  }, [editMode, existingData, modalOpen]);

  const handleChange = (field, value) => {
    setNewField({ ...newField, [field]: value });
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
            <Label for="locationCode">Location Code</Label>
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
            <Label for="totalHousesAssigned">Total Houses Covered</Label>
            <Input
              type="number"
              id="totalHousesAssigned"
              value={newField.totalHousesAssigned}
              onChange={(e) => handleChange("totalHousesAssigned", e.target.value)}
            />
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
