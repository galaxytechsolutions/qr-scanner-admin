import React from "react";
// import { useGetAuthUserQuery } from "@/state/api";
// import { useRouter } from "next/navigation";
import { Button, Card } from "react-bootstrap";
import { BsTelephoneFill } from "react-icons/bs"; // Using react-icons as Bootstrap lacks an official icon package

const ContactWidget = ({ onOpenModal }) => {
  // const { data: authUser } = useGetAuthUserQuery();
  // const router = useRouter()

  // const handleButtonClick = () => {
  //   if (authUser) {
  //     onOpenModal();
  //   } else {
  //     router.push("/signin");
  //   }
  // };

  return (
    <Card style={{ minWidth: "300px" }} className="p-4 border-primary">
      {/* Contact Property */}
      <div className="d-flex align-items-center gap-3 mb-3 border border-primary p-3 rounded">
        <div className="d-flex align-items-center justify-content-center bg-primary text-white rounded-circle p-3">
          <BsTelephoneFill size={16} />
        </div>
        <div>
          <p className="mb-0">Contact This Property</p>
          <div className="fw-bold text-primary fs-5">(424) 340-5574</div>
        </div>
      </div>

      <div className="d-grid">
        {/* <Button
          variant="primary"
          onClick={handleButtonClick}
        >
          {authUser ? "Submit Application" : "Sign In to Apply"}
        </Button> */}
      </div>

      <hr className="my-4" />
      <div className="text-muted small">
        <div className="mb-1">Language: Telugu, English, Hindi.</div>
        <div>Open by appointment on Monday - Sunday</div>
      </div>
    </Card>
  );
};

export default ContactWidget;
