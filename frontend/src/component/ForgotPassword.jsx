import React, { useState } from "react";
import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/context";

import Form from "react-bootstrap/Form";
{
  /* The following line can be included in your src/index.js or App.js file */
}
import "bootstrap/dist/css/bootstrap.min.css";
import Button from "react-bootstrap/Button";

const ForgotPassword = () => {
  const { auth, setAuth } = useGlobalContext();
  const navigate = useNavigate("");
  const location = useLocation("");

  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    setValidated(true);
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/forgot-password`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ email, newPassword, phone }),
        }
      );

      const dataFromResponse = await res.json();
      // console.log(dataFromResponse);
      if (res.ok) {
        toast.success(dataFromResponse?.msg);

        navigate("/login");
      } else {
        toast.error(dataFromResponse.msg);
      }
      // setEmail("");
      // setPhone("");
      // setNewPassword("");
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <div
        className="container mt-5 mb-5 text-white"
        style={{ height: "100vh" }}
      >
        <h3 className="text-center text-danger mb-3 ">Reset Password</h3>
        <Form
          noValidate
          validated={validated}
          // onSubmit={handleSubmit}
          className="mt-4"
        >
          <Form.Group controlId="validationCustom04" className="mb-3 ">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="xyz@gmail.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide an valid email.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="1234535670"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a valid phone number.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="123453"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            onClick={handleSubmit}
            className="btn btn-danger mt-3 rlbtn"
            style={{ width: "100%" }}
          >
            Update
          </Button>

          <p className="mt-3">
            Go Back ?{" "}
            <NavLink to="/login" className={" linkHover"}>
              Login
            </NavLink>
          </p>
        </Form>
      </div>
    </>
  );
};

export default ForgotPassword;
