import React, { useState } from "react";
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

const FieldStaffModal = ({ modalOpen, setModalOpen, handleSave }) => {
  const [newField, setNewField] = useState({
    qrCode: "",
    locationCode: "",
    booth: "",
    mandal: "",
    headOfFamily: "",
    caste: "",
    noOfMembers: "",
    ageGenderList: "",
    votedLastTime: "",
    preferredParty: "",
    schemesReceived: "",
    migrationInfo: "",
    complaints: "",
    isWhatsappActive: false,
    volunteerNotes: "",
  });

  const handleChange = (field, value) => {
    setNewField({ ...newField, [field]: value });
  };

  return (
    <Modal isOpen={modalOpen} toggle={() => setModalOpen(!modalOpen)}  >
      <ModalHeader toggle={() => setModalOpen(!modalOpen)}>
        Add Field Staff
      </ModalHeader>
      <ModalBody style={{height:"65vh", overflowY:"auto"}}>
        <Form>
          <FormGroup>
            <Label>QR Code</Label>
            <Input
              type="text"
              value={newField.qrCode}
              onChange={(e) => handleChange("qrCode", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Location Code</Label>
            <Input
              type="text"
              value={newField.locationCode}
              onChange={(e) => handleChange("locationCode", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Booth</Label>
            <Input
              type="text"
              value={newField.booth}
              onChange={(e) => handleChange("booth", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Mandal</Label>
            <Input
              type="text"
              value={newField.mandal}
              onChange={(e) => handleChange("mandal", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Head of Family</Label>
            <Input
              type="text"
              value={newField.headOfFamily}
              onChange={(e) => handleChange("headOfFamily", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Caste</Label>
            <Input
              type="text"
              value={newField.caste}
              onChange={(e) => handleChange("caste", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>No. of Members</Label>
            <Input
              type="number"
              value={newField.noOfMembers}
              onChange={(e) => handleChange("noOfMembers", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Age / Gender List</Label>
            <Input
              type="text"
              value={newField.ageGenderList}
              onChange={(e) => handleChange("ageGenderList", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Voted Last Time</Label>
            <Input
              type="text"
              value={newField.votedLastTime}
              onChange={(e) => handleChange("votedLastTime", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Preferred Party</Label>
            <Input
              type="text"
              value={newField.preferredParty}
              onChange={(e) => handleChange("preferredParty", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Schemes Received</Label>
            <Input
              type="text"
              value={newField.schemesReceived}
              onChange={(e) => handleChange("schemesReceived", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Migration Info</Label>
            <Input
              type="text"
              value={newField.migrationInfo}
              onChange={(e) => handleChange("migrationInfo", e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label>Complaints</Label>
            <Input
              type="text"
              value={newField.complaints}
              onChange={(e) => handleChange("complaints", e.target.value)}
            />
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={newField.isWhatsappActive}
                onChange={(e) =>
                  handleChange("isWhatsappActive", e.target.checked)
                }
              />{" "}
              WhatsApp Active
            </Label>
          </FormGroup>

          <FormGroup>
            <Label>Volunteer Notes</Label>
            <Input
              type="textarea"
              value={newField.volunteerNotes}
              onChange={(e) => handleChange("volunteerNotes", e.target.value)}
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" onClick={() => handleSave(newField)}>
          Save
        </Button>
        <Button color="secondary" onClick={() => setModalOpen(false)}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default FieldStaffModal;
