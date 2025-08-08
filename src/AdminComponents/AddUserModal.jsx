import React, { useState } from 'react';
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
} from 'reactstrap';


const AddUserModal = ({ isOpen, toggle, getAllUsers = () => {} }) => {


  return (
    <Modal isOpen={isOpen} toggle={toggle} className="h-[90vh]">
      <ModalHeader toggle={toggle}>Add New User</ModalHeader>
      <ModalBody>
        {/* <Form onSubmit={handleSubmit}> */}
        <Form>
          <FormGroup>
            <Label for="name">Name</Label>
            <Input
              name="name"
            //   value={formData.name}
            //   onChange={handleInputChange}
              placeholder="Enter Name"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="gender">Gender</Label>
            <Input
              type="select"
              name="gender"
            //   value={formData.gender}
            //   onChange={handleInputChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </Input>
          </FormGroup>

          {/* <FormGroup>
            <Label for="category">Category</Label>
            <Input
              type="select"
              name="category"
            //   value={formData.category}
            //   onChange={handleCategoryChange}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Input>
          </FormGroup> */}
{/* 
          {formData.category && (
            <FormGroup>
              <Label for="subcategory">Sub Category</Label>
              <Input
                type="select"
                name="subcategory"
                // value={formData.subcategory}
                // onChange={handleInputChange}
                required
              >
                <option value="">Select Sub Category</option>
                {subCategories[formData.category].map((subCat) => (
                  <option key={subCat} value={subCat}>
                    {subCat}
                  </option>
                ))}
              </Input>
            </FormGroup>
          )} */}

          <FormGroup>
            <Label for="phone">Phone</Label>
            <Input
              name="phone"
            //   value={formData.phone}
            //   onChange={handleInputChange}
              placeholder="Enter Phone Number"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="email">Email</Label>
            <Input
              type="email"
              name="email"
            //   value={formData.email}
            //   onChange={handleInputChange}
              placeholder="Enter Email"
              required
            />
          </FormGroup>

          <FormGroup>
            <Label for="password">Password</Label>
            <Input
              type="password"
              name="password"
            //   value={formData.password}
            //   onChange={handleInputChange}
              placeholder="Enter Password"
              required
            />
          </FormGroup>
        </Form>
      </ModalBody>
      <ModalFooter>
        {/* <Button color="primary" onClick={handleSubmit}> */}
             <Button color="primary" >
          Submit
        </Button>
        <Button color="secondary" onClick={toggle}>
          Cancel
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default AddUserModal;
