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
  Button
} from "reactstrap";
import { CSCInstance } from "../Instence/ImgInstence";

const AddHouseholdModal = ({
  modalOpen,
  toggle,
  newHouse,
  setNewHouse,
  handleAddHousehold,
  handleUpdateHousehold
}) => {
  const [cities, setCities] = useState("");
  const [state, setState] = useState("");

  useEffect(()=>{
    const fetchState = async() =>{
      try{
        const res = await CSCInstance.get("countries/IN/states")

        const Telangana = res.data.filter((st) => st.name === "Telangana");
        setState(Telangana);
      }catch(err){
        console.error("Error fetching states:", err);
      }
    }
    fetchState();
  }, [])

  useEffect(() => {
    const fetchCities = async () => {
      if (!newHouse.stateIso) return;
      try {
        const res = await CSCInstance.get(
          `/countries/IN/states/${newHouse.stateIso}/cities`
        );
        setCities(res.data);
      } catch (error) {
        console.error("Error fetching cities:", error);
      } finally {
      }
    };
    fetchCities();
  }, [newHouse.stateIso]);

  return (
    <Modal isOpen={modalOpen} toggle={toggle}>
      <ModalHeader toggle={toggle}>
        {newHouse._id ? "Update Household" : "Add Household"}
      </ModalHeader>
      <ModalBody className="custom-scroll" style={{ maxHeight: "400px", overflowY: "auto" }}>
        <Form>
          <FormGroup>
            <Label>QR Code</Label>
            <Input
              type="text"
              value={newHouse.qrCode}
              onChange={(e) => setNewHouse({ ...newHouse, qrCode: e.target.value })}
            />
          </FormGroup>

          <FormGroup>
            <Label>State</Label>
            <Input
              type="select"
              value={newHouse.stateIso || ""}
              onChange={(e) =>
                setNewHouse({ ...newHouse, stateIso: e.target.value, city: "" })
              }
            >
              <option value="">-- Select State --</option>
              {state ? (
                state.map((st) => (
                  <option key={st.iso2} value={st.iso2}>
                    {st.name}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </Input>
          </FormGroup>
          <FormGroup>
            <Label>City</Label>
            <Input
              type="select"
              value={newHouse.city || ""}
              onChange={(e) => setNewHouse({ ...newHouse, city: e.target.value })}
            >
              <option value="">-- Select City --</option>
              {cities ? (
                cities.map((ct) => (
                  <option key={ct.name} value={ct.name}>
                    {ct.name}
                  </option>
                ))
              ) : (
                <option>Loading...</option>
              )}
            </Input>
          </FormGroup>
          
          
          <FormGroup>
            <Label>Mandal</Label>
            <Input
              type="text"
              value={newHouse.mandal}
              onChange={(e) => setNewHouse({ ...newHouse, mandal: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Booth</Label>
            <Input
              type="text"
              value={newHouse.booth}
              onChange={(e) => setNewHouse({ ...newHouse, booth: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Location</Label>
            <Input
              type="text"
              value={newHouse.location}
              onChange={(e) => setNewHouse({ ...newHouse, location: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Phone No</Label>
            <Input
              type="text"
              value={newHouse.phoneNo}
              maxLength={10}
              onChange={(e) => {
                const value = e.target.value;
                if (/^\d*$/.test(value)) {
                  setNewHouse({ ...newHouse, phoneNo: value });
                }
              }}
            />
          </FormGroup>
          <FormGroup>
            <Label>Head of Family</Label>
            <Input
              type="text"
              value={newHouse.headOfFamily}
              onChange={(e) => setNewHouse({ ...newHouse, headOfFamily: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Caste</Label>
            <Input
              type="text"
              value={newHouse.caste}
              onChange={(e) => setNewHouse({ ...newHouse, caste: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>No. of Members</Label>
            <Input
              type="number"
              value={newHouse.noOfMembers}
              onChange={(e) => setNewHouse({ ...newHouse, noOfMembers: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Age/Gender List</Label>
            <Input
              type="text"
              value={newHouse.ageGenderList}
              onChange={(e) => setNewHouse({ ...newHouse, ageGenderList: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Voted Last Time</Label>
            <Input
              type="text"
              value={newHouse.votedLastTime}
              onChange={(e) => setNewHouse({ ...newHouse, votedLastTime: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Preferred Party</Label>
            <Input
              type="text"
              value={newHouse.preferredParty}
              onChange={(e) => setNewHouse({ ...newHouse, preferredParty: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Schemes Received</Label>
            <Input
              type="text"
              value={newHouse.schemesReceived}
              onChange={(e) => setNewHouse({ ...newHouse, schemesReceived: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Migration Info</Label>
            <Input
              type="text"
              value={newHouse.migrationInfo}
              onChange={(e) => setNewHouse({ ...newHouse, migrationInfo: e.target.value })}
            />
          </FormGroup>
          <FormGroup>
            <Label>Complaints</Label>
            <Input
              type="text"
              value={newHouse.complaints}
              onChange={(e) => setNewHouse({ ...newHouse, complaints: e.target.value })}
            />
          </FormGroup>

          <FormGroup check>
            <Label check>
              <Input
                type="checkbox"
                checked={!!newHouse.isWhatsappActive}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, isWhatsappActive: e.target.checked })
                }
              />{" "}
              WhatsApp Active
            </Label>
          </FormGroup>

          <FormGroup>
            <Label>Volunteer Notes</Label>
            <Input
              type="textarea"
              value={newHouse.volunteerNote}
              onChange={(e) => setNewHouse({ ...newHouse, volunteerNote: e.target.value })}
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
