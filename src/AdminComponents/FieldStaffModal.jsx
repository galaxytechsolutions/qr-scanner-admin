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
import ConstituencyDropdown from "../components/ContituenciesDropdown";

const FieldStaffModal = ({
  modalOpen,
  setModalOpen,
  handleSave,
  editMode,
  existingData,
  constituency,
  constituencies,
  role,
  setSelectedConstituency

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
    status: true,  
  });
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    if (editMode && existingData) {
      setNewField({
        ...existingData,
        totalHousesAssigned: existingData.assignedHouses?.length || 0,
        profilePic: existingData.profilePic || null, // Ensure profilePic is not undefined
         status: existingData.status ?? true,
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
        <div>
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

          {/* <FormGroup>
            <Label for="constituency">Constituency</Label>
            <Input
              type="text"
              id="constituency"
              value={newField.constituency}
              onChange={(e) => handleChange("constituency", e.target.value)}
              readOnly={!editMode} 
            />
          </FormGroup> */}

          <FormGroup>
  <Label for="constituency">Constituency</Label>

  {role === "SuperAdmin" ? (
   
   <div onClick={(e) => e.stopPropagation()}>
  <ConstituencyDropdown
    value={newField.constituency}
    onChange={(value) => handleChange("constituency", value)}
    placeholder="Select Constituency"
  />
</div>

  ) : (
    <Input
      type="text"
      id="constituency"
      value={newField.constituency}
      readOnly
    />
  )}
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
              readOnly={editMode}
               maxLength={10}
              onChange={(e) => {
                if(!editMode){
                  // Allow digits only
                  let v = e.target.value.replace(/\D/g, "");
                  // Limit to 10 digits
                  if (v.length > 10) v = v.slice(0, 10);
                  handleChange("phoneNo", v);
                }
              }}
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

          {/* <FormGroup>
            <Label for="totalHousesCovered">Total Houses Assigned</Label>
            <Input
              type="number"
              id="totalHousesCovered"
              value={newField.totalHousesCovered}
              onChange={(e) => handleChange("totalHousesCovered", e.target.value)}
            />
          </FormGroup> */}

<FormGroup className="d-flex align-items-center mt-3">
  <Label className="me-3 mb-0">Status</Label>
  <ReactSwitch
    checked={!!newField.status}
    onChange={(checked) => handleChange("status", checked)}
    onColor="#28a745"
    offColor="#dc3545"
    handleDiameter={12}
    height={20}
    width={40}
    uncheckedIcon={false}
    checkedIcon={false}
  />
  <span className="ms-2 fw-bold">
    {newField.status ? "Active" : "Inactive"}
  </span>
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
        </div>
      </ModalBody>
      <ModalFooter>
        <Button color="primary" 
          onClick={() =>
      handleSave({
        ...newField,
        phoneNo: editMode ? newField.phoneNo : "91" + newField.phoneNo,
      })
    }
        // onClick={() => handleSave(newField)}
        >
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
