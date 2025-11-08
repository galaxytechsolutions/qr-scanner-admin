import React, { useState, useEffect } from 'react';
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
  Row,
  Col
} from 'reactstrap';
import ReactSwitch from 'react-switch';

const emptyScheme = {
  name: "",
  description: "",
  eligibilityCriteria: "",
  benefits: "",
  requiredDocuments: [],
  category: "",
  startDate: "",
  endDate: "",
  isActive: true,
};

const AddSchemesModal = ({ modalOpen, toggle, isEdit, schemeData, onSave }) => {
  const [scheme, setScheme] = useState(emptyScheme);
  const [documents, setDocuments] = useState("");

  useEffect(() => {
    if (isEdit && schemeData) {
      setScheme({
        ...schemeData,
        startDate: schemeData.startDate ? new Date(schemeData.startDate).toISOString().split('T')[0] : "",
        endDate: schemeData.endDate ? new Date(schemeData.endDate).toISOString().split('T')[0] : "",
      });
      setDocuments(schemeData.requiredDocuments ? schemeData.requiredDocuments.join(', ') : "");
    } else {
      setScheme(emptyScheme);
      setDocuments("");
    }
  }, [isEdit, schemeData, modalOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setScheme(prev => ({ ...prev, [name]: value }));
  };

  const handleDocumentChange = (e) => {
    setDocuments(e.target.value);
  };

  const handleSwitchChange = (checked) => {
    setScheme(prev => ({ ...prev, isActive: checked }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalScheme = {
      ...scheme,
      requiredDocuments: documents.split(',').map(doc => doc.trim()).filter(Boolean)
    };
    onSave(finalScheme);
    toggle(); // Close modal after save
  };

  const categories = [
    "Agriculture, Rural & Environment",
    "Business & Entrepreneurship",
    "Housing & Shelter / Welfare",
    "Skills, Employment & Financial Services",
    "Health & Wellness"
  ];

  return (
    <Modal isOpen={modalOpen} toggle={toggle} centered>
      <ModalHeader toggle={toggle}>
        {isEdit ? 'Edit Scheme' : 'Add New Scheme'}
      </ModalHeader>
      <Form onSubmit={handleSubmit}>
        <ModalBody style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="name">Scheme Name</Label>
                <Input id="name" name="name" value={scheme.name} onChange={handleChange} required />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="category">Category</Label>
                <Input type="select" id="category" name="category" value={scheme.category} onChange={handleChange} required>
                  <option value="" disabled>Select Category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Input>
              </FormGroup>
            </Col>
          </Row>
          <FormGroup>
            <Label for="description">Description</Label>
            <Input type="textarea" id="description" name="description" value={scheme.description} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="eligibilityCriteria">Eligibility Criteria</Label>
            <Input type="textarea" id="eligibilityCriteria" name="eligibilityCriteria" value={scheme.eligibilityCriteria} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="benefits">Benefits</Label>
            <Input type="textarea" id="benefits" name="benefits" value={scheme.benefits} onChange={handleChange} />
          </FormGroup>
          <FormGroup>
            <Label for="requiredDocuments">Required Documents (comma-separated)</Label>
            <Input type="text" id="requiredDocuments" name="requiredDocuments" value={documents} onChange={handleDocumentChange} />
          </FormGroup>
          <Row>
            <Col md={6}>
              <FormGroup>
                <Label for="startDate">Start Date</Label>
                <Input type="date" id="startDate" name="startDate" value={scheme.startDate} onChange={handleChange} />
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup>
                <Label for="endDate">End Date</Label>
                <Input type="date" id="endDate" name="endDate" value={scheme.endDate} onChange={handleChange} />
              </FormGroup>
            </Col>
          </Row>
          <FormGroup className="d-flex align-items-center">
            <Label className="me-3 mb-0">Is Active</Label>
            <ReactSwitch
              checked={!!scheme.isActive}
              onChange={handleSwitchChange}
              onColor="#0d6efd"
              offColor="#ccc"
              handleDiameter={12}
              height={20}
              width={40}
              uncheckedIcon={false}
              checkedIcon={false}
            />
            <span className="ms-2 fw-bold">{scheme.isActive ? "Yes" : "No"}</span>
          </FormGroup>
        </ModalBody>
        <ModalFooter>
          <Button color="primary" type="submit">
            {isEdit ? 'Update' : 'Save'}
          </Button>
          <Button color="secondary" onClick={toggle}>
            Cancel
          </Button>
        </ModalFooter>
      </Form>
    </Modal>
  );
};

export default AddSchemesModal;