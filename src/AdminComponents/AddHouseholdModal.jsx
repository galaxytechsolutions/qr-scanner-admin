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
import { CSCInstance} from "../Instence/ImgInstence";
import ReactSwitch from "react-switch";
import ConstituencyDropdown from "../components/ContituenciesDropdown";
import {SUBCASTES} from "../constants/subcaste.ts"
import { RiWhatsappFill } from "react-icons/ri";

const AddHouseholdModal = ({
  modalOpen,
  toggle,
  newHouse,
  setNewHouse,
  handleAddHousehold,
  handleUpdateHousehold,
  role,
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
  // useEffect(() => {
  //   if (modalOpen && newHouse.state) {
  //     fetchCities(newHouse.state);
  //   }

  //   // Set default constituency for new entries
  //   if (modalOpen && !newHouse._id) {
  //     const authUser = JSON.parse(localStorage.getItem("authUser"));
  //     const userConstituency = authUser?.user?.constituency || authUser?.constituency || "";
  //     if (userConstituency) {
  //       setNewHouse(prev => ({ ...prev, constituency: userConstituency }));
  //     }
  //   }
  // }, [modalOpen, newHouse.state]);


useEffect(() => {
  if (!modalOpen) return;

  const auth = JSON.parse(localStorage.getItem("authUser"));
  const userRole = role?.toLowerCase();
  const adminConstituency =
    auth?.user?.constituency || auth?.constituency || "";

  // 🔹 UPDATE MODE (Admin + SuperAdmin)
  if (newHouse?._id) {
    // constituency already comes from selected row
    return;
  }

  // 🔹 ADD MODE
  if (userRole === "admin" && adminConstituency) {
    // Admin → force constituency
    setNewHouse(prev => ({
      ...prev,
      constituency: adminConstituency
    }));
  }

  if (userRole === "superadmin") {
    // SuperAdmin → DO NOT prefill
    setNewHouse(prev => ({
      ...prev,
      constituency: ""
    }));
  }
}, [modalOpen, role]);





  return (
    <Modal isOpen={modalOpen} toggle={toggle} size="md">
      <ModalHeader toggle={toggle}>
        {newHouse._id ? "Update Household" : "Add Household"}
      </ModalHeader>
      <ModalBody
        className="custom-scroll"
        style={{ maxHeight: "600px", overflowY: "auto" }}
      >
        <Form onSubmit={(e) => e.preventDefault()} noValidate>
          {/* Family Details Section */}
          <div className="mb-4">
            <h5 className="text-primary mb-3">Family Details</h5>

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
             
              <div className="col-md-8 mt-2 mb-2">
                <ConstituencyDropdown
                     value={newHouse.constituency || ""}
                  placeholder="Select Constituency"
                  onChange={(value) => {
                    // SuperAdmin ADD → allow change
                    if (role === "SuperAdmin" && !newHouse._id) {
                      setNewHouse({ ...newHouse, constituency: value });
                    }
                  }}
                  isDisabled={
                    role === "admin" ||           // Admin never edits
                    (role === "SuperAdmin" && newHouse._id) // SuperAdmin update = readonly
                  }
                />
              </div>
            </FormGroup>

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

            {/* House No */}
            <FormGroup>
              <Label>House No</Label>
              <Input
                type="text"
                value={newHouse.houseNo || ""}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, houseNo: e.target.value })
                }
              />
            </FormGroup>

            {/* House Type */}
            <FormGroup>
              <Label>House Type</Label>
              <Input
                type="select"
                value={newHouse.houseType || ""}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, houseType: e.target.value })
                }
              >
                <option value="">-- Select --</option>
                <option value="Rent">Rent</option>
                <option value="Own">Own</option>
              </Input>
            </FormGroup>

            {/* Caste */}
            <FormGroup>
              <Label>Caste</Label>
              <Input
                type="select"
                value={newHouse.caste || ""}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, caste: e.target.value, subCaste:"" })
                }
              >
                <option value="">-- Select Caste --</option>
                <option value="OC">OC</option>
                <option value="BC">BC</option>
                <option value="SC">SC</option>
                <option value="ST">ST</option>
              </Input>
            </FormGroup>

            {/* Sub Caste */}
            {/* <FormGroup>
              <Label>Sub Caste</Label>
              <Input
                type="text"
                value={newHouse.subCaste || ""}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, subCaste: e.target.value })
                }
              />
            </FormGroup> */}
<FormGroup>
  <Label>Sub Caste</Label>
  <Input
    type="select"
    value={newHouse.subCaste || ""}
    onChange={(e) =>
      setNewHouse({ ...newHouse, subCaste: e.target.value })
    }
  >
    <option value="">-- Select Sub Caste --</option>

    {newHouse.caste &&
      SUBCASTES[newHouse.caste]?.map((sc, idx) => (
        <option key={idx} value={sc}>
          {sc}
        </option>
      ))}
  </Input>
</FormGroup>


          </div>

{/* Members & Voting Section */}
<div className="mb-4">
  <h5 className="text-primary mb-3">Members & Voting</h5>

  <FormGroup>
    <Label>No. of Members</Label>
    <Input
      type="select"
      value={newHouse.noOfMembers || ""}
      onChange={(e) => {
        const count = parseInt(e.target.value);
        setNewHouse({
          ...newHouse,
          noOfMembers: count,
          members: Array.from({ length: count }, () => ({
            name: "",
            phoneNo: "",
            age: "",
            gender: "",
            isWhatsapp: false,
          })),
        });
      }}
    >
      <option value="">-- Select --</option>
      {Array.from({ length: 20 }, (_, i) => (
        <option key={i + 1} value={i + 1}>
          {i + 1}
        </option>
      ))}
    </Input>
  </FormGroup>

  {/* {newHouse.members?.map((member, index) => (
    <div key={index} className="d-flex align-items-center mb-2 p-2 border rounded">
      <strong className="me-2">{index + 1}.</strong>
      <Input
        type="text"
        placeholder="Name"
        value={member.name}
        className="me-2"
        onChange={(e) => {
          const updated = [...newHouse.members];
          updated[index].name = e.target.value;
          setNewHouse({ ...newHouse, members: updated });
        }}
      />
      <Input
        type="text"
        placeholder="Phone"
        maxLength={10}
        value={member.phoneNo}
        className="me-2"
        onChange={(e) => {
          if (/^\d*$/.test(e.target.value)) {
            const updated = [...newHouse.members];
            updated[index].phoneNo = e.target.value;
            setNewHouse({ ...newHouse, members: updated });
          }
        }}
      />
      <Input
        type="number"
        placeholder="Age"
        value={member.age}
        className="me-2"
        onChange={(e) => {
          const updated = [...newHouse.members];
          updated[index].age = e.target.value;
          setNewHouse({ ...newHouse, members: updated });
        }}
      />
      <Input
        type="select"
        value={member.gender}
        className="me-2"
        onChange={(e) => {
          const updated = [...newHouse.members];
          updated[index].gender = e.target.value;
          setNewHouse({ ...newHouse, members: updated });
        }}
      >
        <option value="">Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </Input>
      <RiWhatsappFill className="" size={25} style={{ color: "#25D366" }}/>
      <ReactSwitch
        checked={member.isWhatsapp}
        onChange={(checked) => {
          const updated = [...newHouse.members];
          updated[index].isWhatsapp = checked;
          setNewHouse({ ...newHouse, members: updated });
        }}
        onColor="#0d6efd"
        offColor="#ccc"
        handleDiameter={12}
        height={20}
        width={40}
        uncheckedIcon={false}
        checkedIcon={false}
      />
    </div>
  ))} */}

  {/* Auto Render Members */}
{newHouse.members?.map((member, index) => (
  <div
    key={index}
    className="mb-3 p-3 border rounded"
    style={{ background: "#f8f9fa" }}
  >
    <div className="fw-bold mb-2">Member {index + 1}</div>

    {/* Row 1: Name + Phone */}
    <div className="d-flex gap-2 mb-2 flex-wrap">
      <Input
        type="text"
        placeholder="Name"
        value={member.name}
        className="flex-grow-1"
        onChange={(e) => {
          const updated = [...newHouse.members];
          updated[index].name = e.target.value;
          setNewHouse({ ...newHouse, members: updated });
        }}
      />

      <Input
        type="text"
        placeholder="Phone"
        maxLength={10}
        className="flex-grow-1"
        value={member.phoneNo}
        onChange={(e) => {
          if (/^\d*$/.test(e.target.value)) {
            const updated = [...newHouse.members];
            updated[index].phoneNo = e.target.value;
            setNewHouse({ ...newHouse, members: updated });
          }
        }}
      />
    </div>

    {/* Row 2: Age + Gender + WhatsApp */}
    <div className="d-flex align-items-center gap-2 flex-wrap">

      <Input
        type="number"
        placeholder="Age"
        className="flex-grow-1"
        value={member.age}
        onChange={(e) => {
          const updated = [...newHouse.members];
          updated[index].age = e.target.value;
          setNewHouse({ ...newHouse, members: updated });
        }}
      />

      <Input
        type="select"
        className="flex-grow-1"
        value={member.gender}
        onChange={(e) => {
          const updated = [...newHouse.members];
          updated[index].gender = e.target.value;
          setNewHouse({ ...newHouse, members: updated });
        }}
      >
        <option value="">Gender</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </Input>

      {/* WhatsApp Icon + Switch */}
      <div className="d-flex align-items-center gap-2">
        <RiWhatsappFill
          size={28}
          style={{ color: "#25D366",  }}
        />
        <ReactSwitch
          checked={member.isWhatsapp}
          onChange={(checked) => {
            const updated = [...newHouse.members];
            updated[index].isWhatsapp = checked;
            setNewHouse({ ...newHouse, members: updated });
          }}
          onColor="#25D366"
          offColor="#ccc"
          handleDiameter={14}
          height={22}
          width={45}
          uncheckedIcon={false}
          checkedIcon={false}
        />
      </div>

    </div>
  </div>
))}

 
  <FormGroup>
    <Label>Members Outside</Label>
    <Input
      type="select"
      value={newHouse.membersOutside || ""}
      onChange={(e) => {
        const outside = parseInt(e.target.value);
        setNewHouse({
          ...newHouse,
          membersOutside: outside,
          votedLocation: "",
          votedHereNumber: "",
          votedMembers: [],
        });
      }}
    >
      <option value="">-- Select --</option>
      {Array.from(
        { length: parseInt(newHouse.noOfMembers || 0) + 1 },
        (_, i) => (
          <option key={i} value={i}>
            {i}
          </option>
        )
      )}
    </Input>
  </FormGroup>

 
  {parseInt(newHouse.membersOutside) > 0 && (
    <FormGroup>
      <Label>Voted Location</Label>
      <Input
        type="select"
        value={newHouse.votedLocation || ""}
        onChange={(e) => {
          const val = e.target.value;
          setNewHouse({
            ...newHouse,
            votedLocation: val,
            votedHereNumber: "",
            votedMembers: [],
          });
        }}
      >
        <option value="">-- Select --</option>
        <option value="Here">Here</option>
        <option value="Outside">Outside</option>
      </Input>
    </FormGroup>
  )}


  {newHouse.votedLocation === "Here" && (
    <FormGroup>
      <Label>Voted Here Number</Label>
      <Input
        type="select"
        value={newHouse.votedHereNumber || ""}
        onChange={(e) => {
          const count = parseInt(e.target.value);
          setNewHouse({
            ...newHouse,
            votedHereNumber: count,
            votedMembers: Array.from({ length: count }, () => ({
              voterName: "",
              voterNumber: "",
            })),
          });
        }}
      >
        <option value="">-- Select --</option>
        {Array.from(
          { length: parseInt(newHouse.membersOutside || 0) + 1 },
          (_, i) => (
            <option key={i} value={i}>
              {i}
            </option>
          )
        )}
      </Input>
    </FormGroup>
  )}


  {newHouse.votedLocation === "Here" &&
    newHouse.votedMembers?.map((vm, index) => (
      <div key={index} className="d-flex align-items-center mb-2 p-2 border rounded">
        <strong className="me-2">{index + 1}.</strong>
        <Input
          type="text"
          placeholder="Voter Name"
          className="me-2"
          value={vm.voterName}
          onChange={(e) => {
            const updated = [...newHouse.votedMembers];
            updated[index].voterName = e.target.value;
            setNewHouse({ ...newHouse, votedMembers: updated });
          }}
        />
        <Input
          type="text"
          placeholder="Voter Number"
          className="me-2"
          value={vm.voterNumber}
          onChange={(e) => {
            const updated = [...newHouse.votedMembers];
            updated[index].voterNumber = e.target.value;
            setNewHouse({ ...newHouse, votedMembers: updated });
          }}
        />
      </div>
    ))}
</div>






          {/* Schemes & Remarks Section */}
          <div className="mb-4">
            <h5 className="text-primary mb-3">Schemes & Remarks</h5>

            {/* Ration Card Active */}
            <FormGroup>
              <Label>Ration Card Active</Label>
              <Input
                type="select"
                value={newHouse.rationCardActive || "DontKnow"}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, rationCardActive: e.target.value })
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="DontKnow">Don't Know</option>
              </Input>
            </FormGroup>

            {/* Health Card Active */}
            <FormGroup>
              <Label>Health Card Active</Label>
              <Input
                type="select"
                value={newHouse.healthCardActive || "DontKnow"}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, healthCardActive: e.target.value })
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="DontKnow">Don't Know</option>
              </Input>
            </FormGroup>

            {/* Family Pension */}
            <FormGroup>
              <Label>Family Pension</Label>
              <Input
                type="select"
                value={newHouse.familyPension || "DontKnow"}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, familyPension: e.target.value })
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="DontKnow">Don't Know</option>
              </Input>
            </FormGroup>

            {/* Farmer Income Support */}
            <FormGroup>
              <Label>Farmer Income Support</Label>
              <Input
                type="select"
                value={newHouse.farmerIncomeSupport || "NotApplicable"}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, farmerIncomeSupport: e.target.value })
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="NotApplicable">Not Applicable</option>
              </Input>
            </FormGroup>

            {/* Farmer Insurance */}
            <FormGroup>
              <Label>Farmer Insurance</Label>
              <Input
                type="select"
                value={newHouse.farmerInsurance || "NotApplicable"}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, farmerInsurance: e.target.value })
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="NotApplicable">Not Applicable</option>
              </Input>
            </FormGroup>

            {/* LPG Connection */}
            <FormGroup>
              <Label>LPG Connection</Label>
              <Input
                type="select"
                value={newHouse.lpgConnection || "DontKnow"}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, lpgConnection: e.target.value })
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="DontKnow">Don't Know</option>
              </Input>
            </FormGroup>

            {/* Housing Benefit */}
            <FormGroup>
              <Label>Housing Benefit</Label>
              <Input
                type="select"
                value={newHouse.housingBenefit || "DontKnow"}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, housingBenefit: e.target.value })
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="DontKnow">Don't Know</option>
              </Input>
            </FormGroup>

            {/* Electricity Subsidy */}
            <FormGroup>
              <Label>Electricity Subsidy</Label>
              <Input
                type="select"
                value={newHouse.electricitySubsidy || "DontKnow"}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, electricitySubsidy: e.target.value })
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="DontKnow">Don't Know</option>
              </Input>
            </FormGroup>

            {/* Student Scholarship */}
            <FormGroup>
              <Label>Student Scholarship</Label>
              <Input
                type="select"
                value={newHouse.studentScholarship || "NotApplicable"}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, studentScholarship: e.target.value })
                }
              >
                <option value="Yes">Yes</option>
                <option value="No">No</option>
                <option value="NotApplicable">Not Applicable</option>
              </Input>
            </FormGroup>

            {/* Remarks */}
            <FormGroup>
              <Label>Remarks</Label>
              <Input
                type="textarea"
                value={newHouse.remarks || ""}
                onChange={(e) =>
                  setNewHouse({ ...newHouse, remarks: e.target.value })
                }
              />
            </FormGroup>
          </div>
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
