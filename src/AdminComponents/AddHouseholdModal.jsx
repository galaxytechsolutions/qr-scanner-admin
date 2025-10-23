import { useEffect, useState } from "react";
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
import { CSCInstance, ImgBaseUrl } from "../Instence/ImgInstence";
import ReactSwitch from "react-switch";

const AddHouseholdModal = ({
  modalOpen,
  toggle,
  newHouse,
  setNewHouse,
  handleAddHousehold,
  handleUpdateHousehold,
}) => {
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);

  // Fetch Indian states (keep only Telangana)
  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await CSCInstance.get("countries/IN/states");
        const telangana = res.data.filter((st) => st.name === "Telangana");
        setStates(telangana);
      } catch (err) {
        console.error("Error fetching states:", err);
      }
    };
    fetchStates();
  }, []);

  // Fetch cities based on state ISO code
  const fetchCities = async (stateIso) => {
    if (!stateIso) return;
    try {
      const res = await CSCInstance.get(
        `/countries/IN/states/${stateIso}/cities`
      );
      setCities(res.data);
    } catch (error) {
      console.error("Error fetching cities:", error);
    }
  };

  // Fetch cities whenever state changes
  useEffect(() => {
    fetchCities(newHouse.state);
  }, [newHouse.state]);

  // Prefill cities when modal opens for edit
  useEffect(() => {
    if (modalOpen && newHouse.state) {
      fetchCities(newHouse.state);
    }

    // Set default constituency for new entries
    if (modalOpen && !newHouse._id) {
      const authUser = JSON.parse(localStorage.getItem("authUser"));
      const userConstituency = authUser?.user?.constituency || authUser?.constituency || "";
      if (userConstituency) {
        setNewHouse(prev => ({ ...prev, constituency: userConstituency }));
      }
    }
  }, [modalOpen, newHouse.state]);

  return (
    <Modal isOpen={modalOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {newHouse._id ? "Update Household" : "Add Household"}
      </ModalHeader>
      <ModalBody
        className="custom-scroll"
        style={{ maxHeight: "400px", overflowY: "auto" }}
      >
        <Form>
          {/* QR Code */}
          <FormGroup>
            <Label>QR Code</Label>
            <Input
              type="text"
              value={newHouse.qrCode || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, qrCode: e.target.value })
              }
            />
          </FormGroup>

          {/* State */}
          <FormGroup>
            <Label>State</Label>
            <Input
              type="select"
              value={newHouse.state || ""}
              onChange={(e) => {
                const selectedIso = e.target.value;
                const selectedState = states.find(
                  (st) => st.iso2 === selectedIso
                );
                setNewHouse({
                  ...newHouse,
                  state: selectedIso,
                  stateName: selectedState?.name,
                  city: "",
                });
              }}
            >
              <option value="">-- Select State --</option>
              {states.map((st) => (
                <option key={st.iso2} value={st.iso2}>
                  {st.name}
                </option>
              ))}
            </Input>
          </FormGroup>

          {/* City */}
          <FormGroup>
            <Label>City</Label>
            <Input
              type="select"
              value={newHouse.city || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, city: e.target.value })
              }
            >
              <option value="">-- Select City --</option>
              {cities.length > 0
                ? cities.map((ct) => (
                  <option key={ct.name} value={ct.name}>
                    {ct.name}
                  </option>
                ))
                : null}
            </Input>
          </FormGroup>

          {/* Mandal */}
          <FormGroup>
            <Label>Mandal</Label>
            <Input
              type="text"
              value={newHouse.mandal || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, mandal: e.target.value })
              }
            />
          </FormGroup>

          {/* Booth */}
          <FormGroup>
            <Label>Booth</Label>
            <Input
              type="text"
              value={newHouse.booth || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, booth: e.target.value })
              }
            />
          </FormGroup>

          {/* Location */}
          <FormGroup>
            <Label>Location</Label>
            <Input
              type="text"
              value={newHouse.location || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, location: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup>
            <Label for="constituency">Constituency</Label>
            <Input
              type="text"
              id="constituency"
              value={newHouse.constituency}
              onChange={(e) => setNewHouse({ ...newHouse, constituency: e.target.value })}
              readOnly // Make it read-only as it's auto-filled
            />
          </FormGroup>

          {/* Profile Pic */}
          {/* <FormGroup>
            <Label>Profile Pic</Label>

            {(newHouse.profilePic || newHouse.profilePicFile) && (
              <div
                className="position-relative d-inline-block mb-2"
                style={{ display: "inline-block" }}
              >
                <img
                  src={
                    newHouse.profilePicFile
                      ? URL.createObjectURL(newHouse.profilePicFile) 
                      : `${ImgBaseUrl}${newHouse.profilePic}`        
                  }
                  alt="Profile"
                  style={{
                    width: "100px",
                    height: "100px",
                    objectFit: "cover",
                    borderRadius: "5px",
                  }}
                />
                <button
                  type="button"
                  onClick={() =>
                    setNewHouse({ ...newHouse, profilePic: "", profilePicFile: null })
                  }
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "red",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "22px",
                    height: "22px",
                    fontSize: "14px",
                    lineHeight: "20px",
                    cursor: "pointer",
                  }}
                >
                  ×
                </button>
              </div>
            )}

            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files[0];
                if (file) {
                  setNewHouse({ ...newHouse, profilePicFile: file });
                }
              }}
            />
          </FormGroup> */}


          {/* Phone No */}
          <FormGroup>
            <Label>Phone No</Label>
            <Input
              type="text"
              value={newHouse.phoneNo || ""}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setNewHouse({ ...newHouse, phoneNo: value });
                }
              }}
            />
          </FormGroup>

          {/* Head of Family */}
          <FormGroup>
            <Label>Head of Family</Label>
            <Input
              type="text"
              value={newHouse.headOfFamily || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, headOfFamily: e.target.value })
              }
            />
          </FormGroup>

          {/* Caste */}
          <FormGroup>
            <Label>Caste</Label>
            <Input
              type="text"
              value={newHouse.caste || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, caste: e.target.value })
              }
            />
          </FormGroup>

          {/* No. of Members */}
          <FormGroup>
            <Label>No. of Members</Label>
            <Input
              type="number"
              value={newHouse.noOfMembers || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, noOfMembers: e.target.value })
              }
            />
          </FormGroup>

          {/* Age/Gender List */}
          <FormGroup>
            <Label>Age/Gender List</Label>
            <Input
              type="text"
              value={newHouse.ageGenderList || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, ageGenderList: e.target.value })
              }
            />
          </FormGroup>

          {/* Voted Last Time */}
          <FormGroup>
            <Label>Voted Last Time</Label>
            <Input
              type="text"
              value={newHouse.votedLastTime || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, votedLastTime: e.target.value })
              }
            />
          </FormGroup>

          {/* Preferred Party */}
          <FormGroup>
            <Label>Preferred Party</Label>
            <Input
              type="text"
              value={newHouse.preferredParty || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, preferredParty: e.target.value })
              }
            />
          </FormGroup>

          {/* Schemes Received */}
          <FormGroup>
            <Label>Schemes Received</Label>
            <Input
              type="text"
              value={newHouse.schemesReceived || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, schemesReceived: e.target.value })
              }
            />
          </FormGroup>

          {/* Migration Info */}
          <FormGroup>
            <Label>Migration Info</Label>
            <Input
              type="text"
              value={newHouse.migrationInfo || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, migrationInfo: e.target.value })
              }
            />
          </FormGroup>

          {/* Complaints */}
          <FormGroup>
            <Label>Complaints</Label>
            <Input
              type="text"
              value={newHouse.complaints || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, complaints: e.target.value })
              }
            />
          </FormGroup>

          <FormGroup className="d-flex align-items-center">
            <Label className="me-3 mb-0">WhatsApp Active</Label>
            <ReactSwitch
              checked={!!newHouse.isWhatsappActive}
              onChange={(checked) =>
                setNewHouse({
                  ...newHouse,
                  isWhatsappActive: checked,
                })
              }
              onColor="#0d6efd"
              offColor="#ccc"
              handleDiameter={12}
              height={20}
              width={40}
              uncheckedIcon={false}
              checkedIcon={false}
            />
            <span className="ms-2 fw-bold">
              {newHouse.isWhatsappActive ? "Yes" : "No"}
            </span>
          </FormGroup>


          {/* Volunteer Notes */}
          <FormGroup>
            <Label>Volunteer Notes</Label>
            <Input
              type="textarea"
              value={newHouse.volunteerNote || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, volunteerNote: e.target.value })
              }
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        <Button
          color="primary"
          onClick={() => {
            if (newHouse._id) {
              handleUpdateHousehold(newHouse);
            } else {
              handleAddHousehold();
            }
          }}
        >
          {newHouse._id ? "Update Household" : "Add Household"}
        </Button>{" "}
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddHouseholdModal;
