import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from 'reactstrap';
import '../styles/style.css';

const AddPropertiesModal = ({ isOpen, toggle, initialData = null, isEditMode = false }) => {
  const [step, setStep] = useState(1);
  const [address, setAddress] = useState('');
  const [anyConstructionDone, setAnyConstructionDone] = useState(null);
  const [city, setCity] = useState('');
  const [subLocation, setSubLocation] = useState('');
  const [state, setState] = useState('');
  const [pincode, setPincode] = useState('');
  const [landmark, setLandmark] = useState('');
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [unique, setUnique] = useState('');

  const [category, setCategory] = useState("");
  const [showSellDetails, setShowSellDetails] = useState(false);
  const [showRentDetails, setShowRentDetails] = useState(false);
  const [propertyType, setPropertyType] = useState("");
  const [Facing, setFacing] = useState("");
  const [propertyState, setPropertyState] = useState("");
  const [propertyage, setPropertyAge] = useState("")
  const [processionStatus, setProcessionStatus] = useState("");
  const [plotPrice, setPlotPrice] = useState(null);
  const [floordetails, setFloorDetails] = useState(null);
  // const [sqftPrice, setSqftPrice] = useState(null);
  const [maintenanceCharge, setMaintenanceCharge] = useState(null);
  const [width, setWidth] = useState("");
  // const [length, setLength] = useState("");
  // const [TotalArea, setTotalArea] = useState("");
  const [bathrooms, setBathrooms] = useState(0);
  const [bedrooms, setBedrooms] = useState(0);
  const [balcoines, setBalconies] = useState(0);
  const [possessionBy, setPossessionBy] = useState("");
  const [SuperBuiltArea, setSuperBiuldArea] = useState("")

  const [covered2WheelParking, setCovered2WheelParking] = useState("");
  // const [covered4WheelParking, setCovered4WheelParking] = useState("");
  const [open2WheelParking, setOpen2WheelParking] = useState("");
  // const [open4WheelParking, setOpen4WheelParking] = useState("");
  const [builtupArea, setBuiltupArea] = useState("");
  const [PlotArea, setPlotArea] = useState("");
  const [carpetArea, setCarpetArea] = useState("");
  // const [plotPriceUnit, setPlotPriceUnit] = useState("K");
  // const [maintenanceChargeUnit, setMaintenanceChargeUnit] = useState("K");
  const [builtupAreaUnit, setBuiltupAreaUnit] = useState("sqft");
  const [carpetAreaUnit, setCarpetAreaUnit] = useState("sqft");
  const [PlotAreaUnit, setPlotAreaUnit] = useState("kanal");

  const [widthUnit, setWidthUnit] = useState("");
  // const [lengthUnit, setLengthUnit] = useState("sqft");
  // const [totalAreaUnit, setTotalAreaUnit] = useState("sqft");
  // const [roadWidthUnit, setRoadWidthUnit] = useState("sqft");
  // const [perSqfthUnit, setperSqfthUnit] = useState("sqft");
  const [superAreaUnit, setSuperAreaUnit] = useState("sqft");
  const [openSides, setOpenSides] = useState("");
  const [parkingtype, setParkingType] = useState("");

  const [brokerageType, setBrokerageType] = useState("");
  const [brokerageValue, setBrokerageValue] = useState("");
  const [isBrokerageNegotiable, setIsBrokerageNegotiable] = useState(false);

  const handlepropertyStateChange = (event) => {
    const selectedpropertyState = event.target.value;
    setPropertyState(selectedpropertyState);
    setShowSellDetails(selectedpropertyState === "Sell");
    setShowRentDetails(selectedpropertyState === "Rent");
  };

  const handlePropertyTypeChange = (event) => {
    const selectedPropertyType = event.target.value;
    setPropertyType(selectedPropertyType);
    if (selectedPropertyType) {
      setStep(2); // Automatically go to listing step
    }
  };

  const cityOptions = [
    {
      name: 'Amaravati',
      subLocations: ['Madhapur', 'Kondapur', 'Gachibowli', 'Jubilee Hills', 'Banjara Hills'],
    },
    { name: 'Bengaluru', subLocations: [] },
    { name: 'Hyderabad', subLocations: [] },
    { name: 'Mumbai', subLocations: [] },
    { name: 'Visakhapatnam', subLocations: [] },
  ];

  const selectedCityObj = cityOptions.find((c) => c.name === city);

  const handlePincodeChange = (e) => {
    const numericValue = e.target.value.replace(/\D/g, '');
    setPincode(numericValue);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const previews = files.map((file) => ({ file, url: URL.createObjectURL(file) }));
    setImages((prev) => [...prev, ...previews]);
  };

  const handleImageDelete = (index) => {
    const updated = [...images];
    updated.splice(index, 1);
    setImages(updated);
  };

  const handleSubmit = () => {
    if (images.length === 0) {
      alert('Please upload at least 1 image.');
      return;
    }
    const data = {
      category,
      propertyType,
      propertyState,
      address,
      city,
      subLocation,
      state,
      pincode,
      landmark,
      images,
      title,
      description,
      builtupArea,
      carpetArea,
      Facing,
      plotPrice,
      processionStatus,
      possessionBy,
      maintenanceCharge,
      bedrooms,
      balcoines,
      floordetails
    };
    console.log(data);
    toggle();
  };

  const getFilteredPropertyTypes = () => {
    const residentialAll = [
      "Apartment",
      "IndependentHouse",
      "Independent/Builder",
      "FarmHouse",
      "Plot/Land",
      "Other",
    ];
    const residentialNoPlot = residentialAll.filter((type) => type !== "Plot/Land");

    const commercialAll = ["Retail", "Plot/Land", "Other"];

    if (category === "Residential" && propertyState === "Sell") {
      return residentialAll;
    }

    if (category === "Residential" && propertyState === "Rent") {
      return residentialNoPlot;
    }

    if (category === "Commercial" && (propertyState === "Sell" || propertyState === "Rent")) {
      return commercialAll;
    }

    return []; // default empty
  };


  const showPropertyKind = category && propertyState;
  const showPropertyType = showPropertyKind && propertyType;

  useEffect(() => {
  if (initialData) {
    setTitle(initialData.name || '');
    setDescription(initialData.description || '');
    setCity(initialData.location?.city || '');
    setPropertyType(initialData.propertyType || '');
    setPropertyState(initialData.propertyState || '');
    setBedrooms(initialData.beds || 0);
    setBathrooms(initialData.baths || 0);
    setBalconies(initialData.balconies || 0);
    setPlotPrice(initialData.pricePerMonth || 0);
    setSuperBiuldArea(initialData.squareFeet || '');
    setProcessionStatus(initialData.processionStatus || '');
    setAddress(initialData.location?.address || '');
    setState(initialData.location?.state || '');
    setPincode(initialData.pincode || '');
    setLandmark(initialData.landmark || '');
    setImages(initialData.images || []);
    setFacing(initialData.Facing || '');
    setSubLocation(initialData.location?.subLocation || '');
    setCovered2WheelParking(initialData.covered2WheelParking || '');
    setOpen2WheelParking(initialData.open2WheelParking || '');
    setFloorDetails(initialData.floordetails || '');
    setParkingType(initialData.parkingtype || '');
    setPossessionBy(initialData.possessionBy || '');
    setPropertyAge(initialData.propertyage || '');
    setBrokerageType(initialData.brokerageType || '');
    setBrokerageValue(initialData.brokerageValue || '');
    setIsBrokerageNegotiable(initialData.isBrokerageNegotiable || false);
    setAnyConstructionDone(initialData.anyConstructionDone ?? null);
  } else {
    // 🧹 reset all fields for fresh Add
    setTitle('');
    setDescription('');
    setCity('');
    setPropertyType('');
    setPropertyState('');
    setBedrooms(0);
    setBathrooms(0);
    setBalconies(0);
    setPlotPrice('');
    setSuperBiuldArea('');
    setProcessionStatus('');
    setAddress('');
    setState('');
    setPincode('');
    setLandmark('');
    setImages([]);
    setFacing('');
    setSubLocation('');
    setCovered2WheelParking('');
    setOpen2WheelParking('');
    setFloorDetails('');
    setParkingType('');
    setPossessionBy('');
    setPropertyAge('');
    setBrokerageType('');
    setBrokerageValue('');
    setIsBrokerageNegotiable(false);
    setAnyConstructionDone(null);
    setStep(1); 
  }
}, [initialData, isOpen]);







  return (
    <Modal isOpen={isOpen} toggle={toggle} className="custom-modal box" size="lg">
      <ModalHeader toggle={toggle}>{isEditMode ? "Edit Property" : "Add Properties"}</ModalHeader>
      <ModalBody className="modal-body-scroll">
        <div className="container">
          <ul className="step-indicator d-flex justify-content-between list-unstyled mb-4">
            <li className={step === 1 ? 'active' : ''}>1. Description</li>
            <li className={step === 2 ? 'active' : ''}>2. Listing</li>
            <li className={step === 3 ? 'active' : ''}>3. Media</li>
            <li className={step === 4 ? 'active' : ''}>4. Location</li>
          </ul>

          {step === 1 && (
            <div className="section-wrapper">
              <h2>1. Property Description</h2>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <div className="input-icon-wrapper">
                  <Input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="*Title (mandatory)"
                  />
                  <i className="fa fa-user input-icon" />
                </div>
              </div>
              <div className="section-wrapper">
                <label className="form-label">Description</label>
                <div className="input-icon-wrapper">
                  <Input
                    type="textarea"
                    rows={5}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Description"
                  />
                </div>


              </div>

              <div className="section-wrapper">
                <label className="form-label">What makes your property unique</label>
                <p className="text-muted small">Adding a description will increase your listing visibility</p>
                <div className="input-icon-wrapper">
                  <Input
                    type="textarea"
                    rows={5}
                    value={unique}
                    onChange={(e) => setUnique(e.target.value)}
                    placeholder=" share some details about your property like spacious rooms,weell maintained facilities..."
                  />
                </div>



              </div>

              <div className="row mt-4">
                <div className="col-md-6">
                  <label>Category</label>
                  <Input type="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <option value="">Select Category</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                  </Input>
                </div>
                <div className="col-md-6">
                  <label>Looking to</label>
                  <Input type="select" value={propertyState} onChange={handlepropertyStateChange}>
                    <option value="">Select</option>
                    <option value="Sell">Sell</option>
                    <option value="Rent">Rent</option>
                  </Input>
                </div>
              </div>
              {showPropertyKind && (
                <div className="row mt-3">
                  <div className="col-md-6">
                    <label>Property Kind</label>
                    <Input
                      type="select"
                      value={propertyType}
                      onChange={handlePropertyTypeChange}
                    >
                      <option value="">Select Kind</option>
                      {getFilteredPropertyTypes().map((type) => (
                        <option key={type} value={type}>
                          {type.replace("/", " / ")}
                        </option>
                      ))}
                    </Input>
                  </div>
                </div>
              )}

            </div>
          )}
          {step === 2 && showPropertyType && (
            <div className="section-wrapper">

              {propertyState === "Sell" && showSellDetails && (
                <>
                  <h4>Sell</h4>
                  <h6>Listing Details</h6>
                  <div className="mt-3">
                    {category === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "IndependentHouse" ||
                        propertyType === "Independent/Builder" ||
                        propertyType === "Farmhouse") &&
                      propertyState === "Sell" && (
                        <div className="row">
                          <div className="col-md-6">
                            <label className='mt-3'>Possession Status</label>
                            <select
                              value={processionStatus}
                              onChange={(e) => setProcessionStatus(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Property Status</option>
                              <option value="ready to move">Ready to Move</option>
                              <option value="Under Construction">Under Construction</option>
                            </select>
                            {processionStatus === "Under Construction" && (
                              <div className="row">
                                <div className="col-12">
                                  <label className="mt-3">Possession By</label>
                                  <Input type="select"
                                    value={possessionBy}
                                    onChange={(e) => setPossessionBy(e.target.value)}
                                    className="form-control"
                                  >
                                    <option value="">Select Possession By</option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="Within 1 Year">Within 1 Year</option>
                                    <option value="Within 2 Years">Within 2 Years</option>
                                    <option value="More than 2 Years">More than 2 Years</option>
                                  </Input>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* <div className="col-md-6">
                <label className='mt-3'>BHK</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select BHK</option>
                  <option value="1Rk">1RK</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="3+BHK">3+BHK</option>
                </select>
              </div> */}

                          <div className="col-md-6">
                            <label className='mt-3'>Bedrooms</label>
                            <select
                              value={bedrooms}
                              onChange={(e) => setBedrooms(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Bedrooms</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>

                          </div>

                          <div className="col-md-6">
                            <label className='mt-3'>Bathrooms</label>
                            <select
                              value={bathrooms}
                              onChange={(e) => setBathrooms(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Bathrooms</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className='mt-3'>Balconies</label>
                            <select
                              value={balcoines}
                              onChange={(e) => setBalconies(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Balconies</option>
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>


                          <div className="col-md-6">
                            <label className='mt-3'>Covered Parking</label>
                            <select
                              value={covered2WheelParking}
                              onChange={(e) => setCovered2WheelParking(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select </option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className='mt-3'>Open Parking</label>
                            <select
                              value={open2WheelParking}
                              onChange={(e) => setOpen2WheelParking(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select </option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>
                          {/* 
              <div className="col-md-6">
                <label className='mt-3'>Furnishing</label>
                <select
                  value={furnishType}
                  onChange={(e) => setFurnishType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Furnish Type</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div> */}

                          {/* <div className="col-md-6">
                <label>Facing</label>
                <select
                  value={Facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Facing</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="North">North</option>
                  <option value="North East">North East</option>
                  <option value="South East">South East</option>
                  <option value="North West">North West</option>
                  <option value="South West">South West</option>
                  <option value="East West">East West</option>
                  <option value="North South">North South</option>
                </select>
              </div> */}
                          <div className="col-md-6">
                            <label className='mt-3'>Floor Details</label>
                            <input
                              type="text"
                              value={floordetails}
                              onChange={(e) =>
                                setFloorDetails(e.target.value)
                              }
                              placeholder="Floor Details"
                              className="form-control"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={builtupArea}
                                onChange={(e) =>
                                  setBuiltupArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Built-up Area"
                              />
                              <select
                                value={builtupAreaUnit}
                                onChange={(e) => setBuiltupAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Super Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={carpetArea}
                                onChange={(e) =>
                                  setCarpetArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Carpet-Area"
                              />
                              <select
                                value={carpetAreaUnit}
                                onChange={(e) => setCarpetAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label mt-3">Super Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={SuperBuiltArea}
                                onChange={(e) =>
                                  setSuperBiuldArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Super built-up Area"
                              />
                              <select
                                value={superAreaUnit}
                                onChange={(e) => setSuperAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="mt-3">
                    {category === "Residential" &&
                      (propertyType === "Plot/Land"
                      ) &&
                      propertyState === "Sell" && (
                        <div className="row">


                          {/* <div className="col-md-6">
                <label className='mt-3'>BHK</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select BHK</option>
                  <option value="1Rk">1RK</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="3+BHK">3+BHK</option>
                </select>
              </div> */}

                          {/* 
              <div className="col-md-6">
                <label className='mt-3'>Furnishing</label>
                <select
                  value={furnishType}
                  onChange={(e) => setFurnishType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Furnish Type</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div> */}

                          {/* <div className="col-md-6">
                <label>Facing</label>
                <select
                  value={Facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Facing</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="North">North</option>
                  <option value="North East">North East</option>
                  <option value="South East">South East</option>
                  <option value="North West">North West</option>
                  <option value="South West">South West</option>
                  <option value="East West">East West</option>
                  <option value="North South">North South</option>
                </select>
              </div> */}
                          <div className="col-md-6">
                            <label className='mt-3'>Floor Allowed For Construction</label>
                            <input
                              type="text"
                              value={floordetails}
                              onChange={(e) =>
                                setFloorDetails(e.target.value)
                              }
                              placeholder="no.of floors"
                              className="form-control"
                            />
                          </div>


                          <div className="col-md-6">
                            <label className="form-label mt-3">Plot Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={SuperBuiltArea}
                                onChange={(e) =>
                                  setSuperBiuldArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Plot Area"
                              />
                              <select
                                value={superAreaUnit}
                                onChange={(e) => setSuperAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6 mt-3">
                            <label className="form-label">Open Sides</label>
                            <div className="radio-number-group">
                              {[1, 2, 3, 4].map((num) => (
                                <label className="custom-radio" key={num}>
                                  <input
                                    type="radio"
                                    name="openSides"
                                    value={num}
                                    checked={openSides === String(num)}
                                    onChange={(e) => setOpenSides(e.target.value)}
                                  />
                                  <span className="radio-circle">{num}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="col-md-6 mt-3">
                            <label className="form-label d-block">Any Construction Done in this Property</label>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="constructionDone"
                                id="constructionYes"
                                value="true"
                                checked={anyConstructionDone === true}
                                onChange={(e) => setAnyConstructionDone(e.target.value === "true")}
                              />
                              <label className="form-check-label" htmlFor="constructionYes">Yes</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="constructionDone"
                                id="constructionNo"
                                value="false"
                                checked={anyConstructionDone === false}
                                onChange={(e) => setAnyConstructionDone(e.target.value === "false")}
                              />
                              <label className="form-check-label" htmlFor="constructionNo">No</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className='mt-3'>Possession Status</label>
                            <select
                              value={processionStatus}
                              onChange={(e) => setProcessionStatus(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Property Status</option>
                              <option value="ready to move">Ready to Move</option>
                              <option value="Under Construction">Under Construction</option>
                            </select>
                            {processionStatus === "Under Construction" && (
                              <div className="row">
                                <div className="col-12">
                                  <label className="mt-3">Possession By</label>
                                  <Input type="select"
                                    value={possessionBy}
                                    onChange={(e) => setPossessionBy(e.target.value)}
                                    className="form-control"
                                  >
                                    <option value="">Select Possession By</option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="Within 1 Year">Within 1 Year</option>
                                    <option value="Within 2 Years">Within 2 Years</option>
                                    <option value="More than 2 Years">More than 2 Years</option>
                                  </Input>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                  </div>

                  <div className="mt-3">

                    {category === "Residential" &&
                      (propertyType === "Other"
                      ) &&
                      propertyState === "Sell" && (
                        <div className="row">


                          {/* <div className="col-md-6">
                <label className='mt-3'>BHK</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select BHK</option>
                  <option value="1Rk">1RK</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="3+BHK">3+BHK</option>
                </select>
              </div> */}

                          {/* 
              <div className="col-md-6">
                <label className='mt-3'>Furnishing</label>
                <select
                  value={furnishType}
                  onChange={(e) => setFurnishType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Furnish Type</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div> */}

                          {/* <div className="col-md-6">
                <label>Facing</label>
                <select
                  value={Facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Facing</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="North">North</option>
                  <option value="North East">North East</option>
                  <option value="South East">South East</option>
                  <option value="North West">North West</option>
                  <option value="South West">South West</option>
                  <option value="East West">East West</option>
                  <option value="North South">North South</option>
                </select>
              </div> */}


                          <div className="col-md-6">
                            <label className='mt-3'>Bedrooms</label>
                            <select
                              value={bedrooms}
                              onChange={(e) => setBedrooms(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Bedrooms</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>

                          </div>

                          <div className="col-md-6">
                            <label className='mt-3'>Bathrooms</label>
                            <select
                              value={bathrooms}
                              onChange={(e) => setBathrooms(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Bathrooms</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className='mt-3'>Balconies</label>
                            <select
                              value={balcoines}
                              onChange={(e) => setBalconies(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Balconies</option>
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Plot Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={SuperBuiltArea}
                                onChange={(e) =>
                                  setSuperBiuldArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Plot Area"
                              />
                              <select
                                value={superAreaUnit}
                                onChange={(e) => setSuperAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className='mt-3'>Floor Details</label>
                            <input
                              type="text"
                              value={floordetails}
                              onChange={(e) =>
                                setFloorDetails(e.target.value)
                              }
                              placeholder="Floor Details"
                              className="form-control"
                            />
                          </div>


                          <div className="col-md-6">
                            <label className='mt-3'>Possession Status</label>
                            <select
                              value={processionStatus}
                              onChange={(e) => setProcessionStatus(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Property Status</option>
                              <option value="ready to move">Ready to Move</option>
                              <option value="Under Construction">Under Construction</option>
                            </select>
                            {processionStatus === "Under Construction" && (
                              <div className="row">
                                <div className="col-12">
                                  <label className="mt-3">Possession By</label>
                                  <Input type="select"
                                    value={possessionBy}
                                    onChange={(e) => setPossessionBy(e.target.value)}
                                    className="form-control"
                                  >
                                    <option value="">Select Possession By</option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="Within 1 Year">Within 1 Year</option>
                                    <option value="Within 2 Years">Within 2 Years</option>
                                    <option value="More than 2 Years">More than 2 Years</option>
                                  </Input>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                  </div>
                </>
              )}


              {propertyState === "Rent" && showRentDetails && (
                <>

                  <h4>Rent</h4>
                  <h6>Listing Details</h6>
                  <div className="mt-3">
                    {
                      category === "Residential" &&
                      (propertyType === "Apartment" ||
                        propertyType === "IndependentHouse" ||
                        propertyType === "Independent/Builder" ||
                        propertyType === "Farmhouse" || propertyType === "Other") &&
                      (
                        <div className="row">

                          {/* <div className="col-md-6">
                <label className='mt-3'>BHK</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select BHK</option>
                  <option value="1Rk">1RK</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="3+BHK">3+BHK</option>
                </select>
              </div> */}

                          <div className="col-md-6">
                            <label className='mt-3'>Bedrooms</label>
                            <select
                              value={bedrooms}
                              onChange={(e) => setBedrooms(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Bedrooms</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>

                          </div>

                          <div className="col-md-6">
                            <label className='mt-3'>Bathrooms</label>
                            <select
                              value={bathrooms}
                              onChange={(e) => setBathrooms(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Bathrooms</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className='mt-3'>Balconies</label>
                            <select
                              value={balcoines}
                              onChange={(e) => setBalconies(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Balconies</option>
                              <option value="0">0</option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>


                          <div className="col-md-6">
                            <label className='mt-3'>Covered Parking</label>
                            <select
                              value={covered2WheelParking}
                              onChange={(e) => setCovered2WheelParking(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select </option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className='mt-3'>Open Parking</label>
                            <select
                              value={open2WheelParking}
                              onChange={(e) => setOpen2WheelParking(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select </option>
                              <option value="1">1</option>
                              <option value="2">2</option>
                              <option value="3">3</option>
                              <option value="4">4</option>
                              <option value="5">5</option>

                            </select>
                          </div>
                          {/* 
              <div className="col-md-6">
                <label className='mt-3'>Furnishing</label>
                <select
                  value={furnishType}
                  onChange={(e) => setFurnishType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Furnish Type</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div> */}

                          {/* <div className="col-md-6">
                <label>Facing</label>
                <select
                  value={Facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Facing</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="North">North</option>
                  <option value="North East">North East</option>
                  <option value="South East">South East</option>
                  <option value="North West">North West</option>
                  <option value="South West">South West</option>
                  <option value="East West">East West</option>
                  <option value="North South">North South</option>
                </select>
              </div> */}
                          <div className="col-md-6">
                            <label className='mt-3'>Floor Details</label>
                            <input
                              type="text"
                              value={floordetails}
                              onChange={(e) =>
                                setFloorDetails(e.target.value)
                              }
                              placeholder="Floor Details"
                              className="form-control"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={builtupArea}
                                onChange={(e) =>
                                  setBuiltupArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Built-up Area"
                              />
                              <select
                                value={builtupAreaUnit}
                                onChange={(e) => setBuiltupAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Super Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={carpetArea}
                                onChange={(e) =>
                                  setCarpetArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Carpet-Area"
                              />
                              <select
                                value={carpetAreaUnit}
                                onChange={(e) => setCarpetAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label mt-3">Super Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={SuperBuiltArea}
                                onChange={(e) =>
                                  setSuperBiuldArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Super built-up Area"
                              />
                              <select
                                value={superAreaUnit}
                                onChange={(e) => setSuperAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className='mt-3'>Property Age</label>
                            <select
                              value={propertyage}
                              onChange={(e) => setPropertyAge(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select property Age</option>
                              <option value="0-1 years">0-1 years</option>
                              <option value="1-5 years">1-5 years</option>
                              <option value="5-10 years">5-10 years</option>
                              <option value="10+ years">10+ years</option>


                            </select>

                          </div>

                        </div>
                      )}
                  </div>


                </>

              )
              }

              {(propertyState === "Rent" || propertyState === "Sell") && (

                <>

                  <div className="mt-3">
                    {category === "Commercial" &&
                      (propertyType === "Retail") &&
                      (
                        <div className="row">
                          <div className="col-md-6">
                            <label className='mt-3'>Possession Status</label>
                            <select
                              value={processionStatus}
                              onChange={(e) => setProcessionStatus(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Property Status</option>
                              <option value="ready to move">Ready to Move</option>
                              <option value="Under Construction">Under Construction</option>
                            </select>
                            {processionStatus === "Under Construction" && (
                              <div className="row">
                                <div className="col-12">
                                  <label className="mt-3">Possession By</label>
                                  <Input type="select"
                                    value={possessionBy}
                                    onChange={(e) => setPossessionBy(e.target.value)}
                                    className="form-control"
                                  >
                                    <option value="">Select Possession By</option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="Within 1 Year">Within 1 Year</option>
                                    <option value="Within 2 Years">Within 2 Years</option>
                                    <option value="More than 2 Years">More than 2 Years</option>
                                  </Input>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* <div className="col-md-6">
                <label className='mt-3'>BHK</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select BHK</option>
                  <option value="1Rk">1RK</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="3+BHK">3+BHK</option>
                </select>
              </div> */}


                          {/* 
              <div className="col-md-6">
                <label className='mt-3'>Furnishing</label>
                <select
                  value={furnishType}
                  onChange={(e) => setFurnishType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Furnish Type</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div> */}

                          {/* <div className="col-md-6">
                <label>Facing</label>
                <select
                  value={Facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Facing</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="North">North</option>
                  <option value="North East">North East</option>
                  <option value="South East">South East</option>
                  <option value="North West">North West</option>
                  <option value="South West">South West</option>
                  <option value="East West">East West</option>
                  <option value="North South">North South</option>
                </select>
              </div> */}
                          <div className="col-md-6">
                            <label className='mt-3'>Floor Details</label>
                            <input
                              type="text"
                              value={floordetails}
                              onChange={(e) =>
                                setFloorDetails(e.target.value)
                              }
                              placeholder="Floor Details"
                              className="form-control"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={builtupArea}
                                onChange={(e) =>
                                  setBuiltupArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Built-up Area"
                              />
                              <select
                                value={builtupAreaUnit}
                                onChange={(e) => setBuiltupAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Carpet Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={carpetArea}
                                onChange={(e) =>
                                  setCarpetArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Carpet-Area"
                              />
                              <select
                                value={carpetAreaUnit}
                                onChange={(e) => setCarpetAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label mt-3">Super Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={SuperBuiltArea}
                                onChange={(e) =>
                                  setSuperBiuldArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Super built-up Area"
                              />
                              <select
                                value={superAreaUnit}
                                onChange={(e) => setSuperAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>


                          <div className="col-md-6">
                            <label className='mt-3'>Parking Type</label>
                            <select
                              value={parkingtype}
                              onChange={(e) => setParkingType(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select ParkingType</option>
                              <option value="Private Parking">Private Parking</option>
                              <option value="Public Parking">Public Parking</option>
                              <option value="Multilevel Parking">Multilevel Parking</option>
                              <option value="Not Availaible">Not Availaible</option>


                            </select>

                          </div>

                        </div>
                      )}
                  </div>


                  <div className="mt-3">
                    {category === "Commercial" &&
                      (propertyType === "Plot/Land") &&
                      (
                        <div className="row">


                          <div className="col-md-6">
                            <label className='mt-3'>Facing</label>
                            <select
                              value={Facing}
                              onChange={(e) => setFacing(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Facing</option>
                              <option value="East">East</option>
                              <option value="West">West</option>
                              <option value="South">South</option>
                              <option value="North">North</option>
                              <option value="North East">North East</option>
                              <option value="South East">South East</option>
                              <option value="North West">North West</option>
                              <option value="South West">South West</option>
                              <option value="East West">East West</option>
                              <option value="North South">North South</option>
                            </select>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label mt-3">Plot Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={PlotArea}
                                onChange={(e) =>
                                  setPlotArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Plot Area"
                              />
                              <select
                                value={PlotAreaUnit}
                                onChange={(e) => setPlotAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="cent">sqmt</option>
                                <option value="kanal">kanal</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Width of facing Road</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={width}
                                onChange={(e) =>
                                  setWidth(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Enter the width"
                              />
                              <select
                                value={widthUnit}
                                onChange={(e) => setWidthUnit(e.target.value)}
                              >
                                <option value="">Unit</option>
                                <option value="Feet">Feet</option>
                                <option value="Meter">Meter</option>

                              </select>
                            </div>
                          </div>

                          <div className="col-md-6 mt-3">
                            <label className="form-label">Open Sides</label>
                            <div className="radio-number-group">
                              {[1, 2, 3, 4].map((num) => (
                                <label className="custom-radio" key={num}>
                                  <input
                                    type="radio"
                                    name="openSides"
                                    value={num}
                                    checked={openSides === String(num)}
                                    onChange={(e) => setOpenSides(e.target.value)}
                                  />
                                  <span className="radio-circle">{num}</span>
                                </label>
                              ))}
                            </div>
                          </div>


                          <div className="col-md-6 mt-3">
                            <label className="form-label d-block">Any Construction Done in this Property</label>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="constructionDone"
                                id="constructionYes"
                                value="Yes"
                                checked={anyConstructionDone === "Yes"}
                                onChange={(e) => setAnyConstructionDone(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="constructionYes">Yes</label>
                            </div>
                            <div className="form-check form-check-inline">
                              <input
                                className="form-check-input"
                                type="radio"
                                name="constructionDone"
                                id="constructionNo"
                                value="No"
                                checked={anyConstructionDone === "No"}
                                onChange={(e) => setAnyConstructionDone(e.target.value)}
                              />
                              <label className="form-check-label" htmlFor="constructionNo">No</label>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className='mt-3'>Possession Status</label>
                            <select
                              value={processionStatus}
                              onChange={(e) => setProcessionStatus(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Property Status</option>
                              <option value="ready to move">Ready to Move</option>
                              <option value="Under Construction">Under Construction</option>
                            </select>
                            {processionStatus === "Under Construction" && (
                              <div className="row">
                                <div className="col-12">
                                  <label className="mt-3">Possession By</label>
                                  <Input type="select"
                                    value={possessionBy}
                                    onChange={(e) => setPossessionBy(e.target.value)}
                                    className="form-control"
                                  >
                                    <option value="">Select Possession By</option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="Within 1 Year">Within 1 Year</option>
                                    <option value="Within 2 Years">Within 2 Years</option>
                                    <option value="More than 2 Years">More than 2 Years</option>
                                  </Input>
                                </div>
                              </div>
                            )}
                          </div>

                        </div>
                      )}
                  </div>



                  <div className="mt-3">
                    {category === "Commercial" &&
                      (propertyType === "Other") && (
                        <div className="row">
                          <div className="col-md-6">
                            <label className='mt-3'>Possession Status</label>
                            <select
                              value={processionStatus}
                              onChange={(e) => setProcessionStatus(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select Property Status</option>
                              <option value="ready to move">Ready to Move</option>
                              <option value="Under Construction">Under Construction</option>
                            </select>
                            {processionStatus === "Under Construction" && (
                              <div className="row">
                                <div className="col-12">
                                  <label className="mt-3">Possession By</label>
                                  <Input type="select"
                                    value={possessionBy}
                                    onChange={(e) => setPossessionBy(e.target.value)}
                                    className="form-control"
                                  >
                                    <option value="">Select Possession By</option>
                                    <option value="Immediate">Immediate</option>
                                    <option value="Within 1 Year">Within 1 Year</option>
                                    <option value="Within 2 Years">Within 2 Years</option>
                                    <option value="More than 2 Years">More than 2 Years</option>
                                  </Input>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* <div className="col-md-6">
                <label className='mt-3'>BHK</label>
                <select
                  value={bhk}
                  onChange={(e) => setBhk(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select BHK</option>
                  <option value="1Rk">1RK</option>
                  <option value="1BHK">1BHK</option>
                  <option value="2BHK">2BHK</option>
                  <option value="3BHK">3BHK</option>
                  <option value="3+BHK">3+BHK</option>
                </select>
              </div> */}


                          {/* 
              <div className="col-md-6">
                <label className='mt-3'>Furnishing</label>
                <select
                  value={furnishType}
                  onChange={(e) => setFurnishType(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Furnish Type</option>
                  <option value="Furnished">Furnished</option>
                  <option value="Semi-Furnished">Semi-Furnished</option>
                  <option value="Unfurnished">Unfurnished</option>
                </select>
              </div> */}

                          {/* <div className="col-md-6">
                <label>Facing</label>
                <select
                  value={Facing}
                  onChange={(e) => setFacing(e.target.value)}
                  className="form-control"
                >
                  <option value="">Select Facing</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                  <option value="South">South</option>
                  <option value="North">North</option>
                  <option value="North East">North East</option>
                  <option value="South East">South East</option>
                  <option value="North West">North West</option>
                  <option value="South West">South West</option>
                  <option value="East West">East West</option>
                  <option value="North South">North South</option>
                </select>
              </div> */}
                          <div className="col-md-6">
                            <label className='mt-3'>Floor Details</label>
                            <input
                              type="text"
                              value={floordetails}
                              onChange={(e) =>
                                setFloorDetails(e.target.value)
                              }
                              placeholder="Floor Details"
                              className="form-control"
                            />
                          </div>





                          <div className="col-md-6">
                            <label className='mt-3'>Parking Type</label>
                            <select
                              value={parkingtype}
                              onChange={(e) => setParkingType(e.target.value)}
                              className="form-control"
                            >
                              <option value="">Select ParkingType</option>
                              <option value="Private Parking">Private Parking</option>
                              <option value="Public Parking">Public Parking</option>
                              <option value="Multilevel Parking">Multilevel Parking</option>
                              <option value="Not Availaible">Not Availaible</option>


                            </select>

                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={builtupArea}
                                onChange={(e) =>
                                  setBuiltupArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Built-up Area"
                              />
                              <select
                                value={builtupAreaUnit}
                                onChange={(e) => setBuiltupAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>

                          <div className="col-md-6">
                            <label className="form-label mt-3">Super Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={carpetArea}
                                onChange={(e) =>
                                  setCarpetArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Carpet-Area"
                              />
                              <select
                                value={carpetAreaUnit}
                                onChange={(e) => setCarpetAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>
                          <div className="col-md-6">
                            <label className="form-label mt-3">Super Built-up Area</label>
                            <div className="flex-input-select">
                              <input
                                type="text"
                                value={SuperBuiltArea}
                                onChange={(e) =>
                                  setSuperBiuldArea(e.target.value.replace(/[^\d.]/g, ''))
                                }
                                placeholder="Super built-up Area"
                              />
                              <select
                                value={superAreaUnit}
                                onChange={(e) => setSuperAreaUnit(e.target.value)}
                              >
                                <option value="sqft">sqft</option>
                                <option value="sqmt">sqmt</option>
                                <option value="acre">acre</option>
                              </select>
                            </div>
                          </div>

                        </div>

                      )}
                  </div>

                </>
              )
              }

              <div className='row mt-4'>

                <div className="col-md-6">
                  <label className='mt-3'>Price</label>
                  <input
                    type="text"
                    value={plotPrice}
                    onChange={(e) =>
                      setPlotPrice(e.target.value.replace(/[^\d.]/g, ''))
                    }
                    placeholder="Price"
                    className="form-control"
                  />

                  <div>
                    <div className="form-check mt-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="allInclusive"
                      />
                      <label className="form-check-label" htmlFor="allInclusive">
                        All Inclusive Price
                      </label>
                    </div>
                    <div className="form-check ">
                      <input
                        className="form-check-input "
                        type="checkbox"
                        id="priceNegotiable"
                      />
                      <label className="form-check-label" htmlFor="priceNegotiable">
                        Price Negotiable
                      </label>
                    </div>
                    <div className="form-check mb-3">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="taxGovtCharges"
                      />
                      <label className="form-check-label" htmlFor="taxGovtCharges">
                        Taxes & Govt charges Excluded
                      </label>
                    </div>
                  </div>
                </div>

                <div className="col-md-6">
                  <label className="mt-3">Do you charge brokerage?</label>

                  {/* Radio Buttons */}
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="brokerage"
                      id="brokerageFixed"
                      value="fixed"
                      checked={brokerageType === "fixed"}
                      onChange={(e) => setBrokerageType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="brokerageFixed">
                      Fixed
                    </label>
                  </div>

                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="brokerage"
                      id="brokeragePercentage"
                      value="percentage"
                      checked={brokerageType === "percentage"}
                      onChange={(e) => setBrokerageType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="brokeragePercentage">
                      % of Price
                    </label>
                  </div>

                  <div className="form-check mb-2">
                    <input
                      className="form-check-input"
                      type="radio"
                      name="brokerage"
                      id="brokerageNone"
                      value="none"
                      checked={brokerageType === "none"}
                      onChange={(e) => setBrokerageType(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor="brokerageNone">
                      None
                    </label>
                  </div>

                  {/* Conditional Input + Checkbox */}
                  {(brokerageType !== "none") && (
                    <>
                      <label className="form-label">
                        Please specify the brokerage amount
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={brokerageValue}
                        onChange={(e) =>
                          setBrokerageValue(e.target.value.replace(/[^\d.]/g, ""))
                        }
                        placeholder="Please specify the brokerage amount"
                      />

                      <div className="form-check mt-2">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="brokerageNegotiable"
                          checked={isBrokerageNegotiable}
                          onChange={() =>
                            setIsBrokerageNegotiable(!isBrokerageNegotiable)
                          }
                        />
                        <label
                          className="form-check-label"
                          htmlFor="brokerageNegotiable"
                        >
                          Brokerage Negotiable
                        </label>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>




          )}

          {step === 3 && (
            <div className="section-wrapper">
              <h2>3. Media</h2>
              <h6>Listing Media</h6>
              <Input type="file" multiple onChange={handleImageChange} />
              <div className="image-container mt-3">
                {images.map((image, index) => (
                  <div key={index} id="image-preview">
                    <img src={image.url} alt={`Preview ${index}`} />
                    <button className="rajesh" onClick={() => handleImageDelete(index)}>×</button>
                  </div>
                ))}
              </div>
              <small>* At least 1 image is required for a valid submission.</small><br />
              <small>* If Multiple Images, select all images at once.</small>
              <br />
              <small>* Images might take longer to be processed.</small>

            </div>
          )}

          {step === 4 && (
            <div className="row g-4">
              <div className="col-md-6">
                <label className="form-label">*Address</label>
                <div className="input-icon-wrapper">
                  <Input value={address} onChange={(e) => setAddress(e.target.value)} className="form-control pe-5" />
                  <i className="fa fa-user input-icon" />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Select City</label>
                <Input type="select" value={city} onChange={(e) => { setCity(e.target.value); setSubLocation(''); }}>
                  <option value="">Select City</option>
                  {cityOptions.map((c, idx) => (
                    <option key={idx} value={c.name}>{c.name}</option>
                  ))}
                </Input>
              </div>
              <div className="col-md-6">
                <label className="form-label">State</label>
                <div className="input-icon-wrapper">
                  <Input value={state} onChange={(e) => setState(e.target.value)} className="form-control pe-5" />
                  <i className="fa fa-user input-icon" />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Sub-location</label>
                <Input type="select" value={subLocation} onChange={(e) => setSubLocation(e.target.value)} disabled={!selectedCityObj}>
                  <option value="">Sub-location</option>
                  {selectedCityObj?.subLocations.map((loc, i) => (
                    <option key={i} value={loc}>{loc}</option>
                  ))}
                </Input>
              </div>
              <div className="col-md-6">
                <label className="form-label">Landmark</label>
                <div className="input-icon-wrapper">
                  <Input value={landmark} onChange={(e) => setLandmark(e.target.value)} className="form-control pe-5" />
                  <i className="fa fa-user input-icon" />
                </div>
              </div>
              <div className="col-md-6">
                <label className="form-label">Pincode</label>
                <div className="input-icon-wrapper">
                  <Input value={pincode} onChange={handlePincodeChange} maxLength={6} className="form-control pe-5" />
                  <i className="fa fa-user input-icon" />
                </div>
              </div>
            </div>
          )}
        </div>
      </ModalBody>
      <ModalFooter>
        {step > 1 && <Button color="secondary" onClick={() => setStep(step - 1)}>Back</Button>}
        {step < 4 ? (
          <Button color="primary" onClick={() => setStep(step + 1)}>Next</Button>
        ) : (
          <Button color="success" onClick={handleSubmit}>Submit</Button>
        )}
      </ModalFooter>
    </Modal>
  );
};

export default AddPropertiesModal;
