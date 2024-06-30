import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../context/context";
import accordionData from "./data";
import Accordion from "react-bootstrap/Accordion";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import LogoutIcon from "@mui/icons-material/Logout";
import Typewriter from "typewriter-effect";
import "bootstrap/dist/css/bootstrap.min.css";
import Footer from "./Footer";

const HomePage = () => {
  const navigate = useNavigate("");
  const [data, setData] = useState(accordionData);
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [text, setText] = useState("");

  const { auth, setAuth } = useGlobalContext();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (name === "") {
      toast.error("Please provide a name");
      return;
    }
    if (email === "") {
      toast.error("Please provide an email");
      return;
    }
    if (text === "") {
      toast.error("Please provide a message");
      return;
    }

    const form = document.getElementById("form");
    form.setAttribute("action", "https://formspree.io/f/xdoqzvez");
    form.setAttribute("method", "POST");

    // Submit the form
    form.submit();
  };

  const handleLogout = async () => {
    setAuth({
      token: "",
      user: "",
    });
    localStorage.removeItem("job-auth");
    navigate("/login");
    toast.success("Logout Successfully");
  };

  useEffect(() => {
    document.body.style.background = "rgb(24, 17, 19)";
  }, []);

  return (
    <>
      <div id="logout" onClick={handleLogout}>
        <LogoutIcon />
        <span className="ml-2">Logout</span>
      </div>

      <div className="container home text-white mb-5">
        <div className="intro mt-5 mb-5">
          <div className="">
            <h1>Job Portal</h1>
            <p className="text-warning">
              <Typewriter
                options={{
                  strings: [
                    "Explore jobs...",
                    "Find your match...",
                    "Get succeeded !! ",
                  ],
                  autoStart: true,
                  loop: true,
                }}
              />
            </p>
            <NavLink to="/jobs">
              <button className="btn btn-danger">
                {auth?.user?.role === "Admin" ? "Manage Jobs" : "Explore Jobs"}
              </button>
            </NavLink>
          </div>
          <div></div>
        </div>

        {/* Accordian */}
        <h4 className=" text-danger mt-5">Quick Answers</h4>

        {data.map((ele, idx) => {
          return (
            <Accordion defaultActiveKey={["0"]} alwaysOpen className="mt-4">
              <Accordion.Item eventKey={idx}>
                <Accordion.Header>{ele.question}</Accordion.Header>
                <Accordion.Body>{ele.answer}</Accordion.Body>
              </Accordion.Item>
            </Accordion>
          );
        })}

        {/* contact form */}
        <h4 className=" text-danger mt-5">Contact Us</h4>
        <Form
          action=""
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          method=""
          id="form"
          className=" mb-5"
        >
          {" "}
          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="xyz"
              required
              value={name}
              name="name"
              onChange={(e) => setName(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a name.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="xyz@gmail.com"
              required
              value={email}
              name="email"
              onChange={(e) => setEmail(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide an valid email.
            </Form.Control.Feedback>
          </Form.Group>{" "}
          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Message</Form.Label>
            <Form.Control
              as="textarea"
              placeholder="hello !!"
              required
              value={text}
              name="message"
              onChange={(e) => setText(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a message.
            </Form.Control.Feedback>
          </Form.Group>{" "}
          <Button
            type="submit"
            className="btn btn-danger mt-3 rlbtn"
            style={{ width: "100%" }}
          >
            Contact
          </Button>
        </Form>
      </div>

      <Footer />
    </>
  );
};

export default HomePage;
