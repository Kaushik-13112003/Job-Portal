import Form from "react-bootstrap/Form";
{
  /* The following line can be included in your src/index.js or App.js file */
}
import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import Button from "react-bootstrap/Button";

import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useGlobalContext } from "../context/context";

function FormFileExample() {
  const navigate = useNavigate("");
  const { auth, setAuth } = useGlobalContext();

  const [validated, setValidated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    setValidated(true);

    const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({ email, password }),
    });

    const dataFromResponse = await res.json();
    // console.log(dataFromResponse);
    if (res.ok) {
      toast.success(dataFromResponse?.message);
      setAuth({
        token: dataFromResponse?.token,
        user: dataFromResponse?.loginData,
      });
      localStorage.setItem("job-auth", JSON.stringify(dataFromResponse));
      navigate("/");
    } else {
      toast.error(dataFromResponse?.message);
    }
  };
  return (
    <>
      <div
        className="container mt-5 mb-5 text-white"
        style={{ height: "100vh" }}
      >
        <h3 className="text-center text-danger mb-3 ">Login</h3>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
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

          <Form.Group controlId="validationCustom04" className="mb-4 ">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="123453"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>

          <Button
            type="submit"
            className="btn btn-danger mt-3 rlbtn"
            style={{ width: "100%" }}
          >
            Submit
          </Button>

          <p className="mt-3">
            Not Registered ?{" "}
            <NavLink to="/register" className={" linkHover"}>
              Register
            </NavLink>
          </p>
          <p className="mt-3">
            Forgot Password ?{" "}
            <NavLink to="/forgot-password" className={" linkHover"}>
              {" "}
              Reset Now
            </NavLink>
          </p>
        </Form>
      </div>
    </>
  );
}

export default FormFileExample;
