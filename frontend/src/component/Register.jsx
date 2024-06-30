import Form from "react-bootstrap/Form";
{
  /* The following line can be included in your src/index.js or App.js file */
}
import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import { NavLink, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { FiTrash } from "react-icons/fi";

function FormFileExample() {
  const navigate = useNavigate("");
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const imageReference = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation(); // Stop the event propagation here
    }

    setValidated(true);

    if (form.checkValidity() === false) {
      return; // Don't proceed if the form is still invalid
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("phone", phone);
    formData.append("photo", photo);
    formData.append("role", role);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: "POST",

        body: formData,
      });

      const dataFromResponse = await res.json();
      if (res.ok) {
        toast.success(dataFromResponse.message);
        navigate("/login");
      } else {
        toast.error(dataFromResponse.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleImageUpload = async (event) => {
    let file = event.target.files;
    // console.log(file[0]);

    let formData = new FormData();
    formData.set("photo", file[0]);

    try {
      let uploadPhotoPromise = new Promise(async (resolve, reject) => {
        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/uploadPhoto`,
          {
            method: "POST",
           
            body: formData,
          }
        );

        let dataFromResponse = await res.json();

        if (res.ok) {
          resolve();
          setPhoto(dataFromResponse);
        } else {
          toast.error("something went wrong");
          reject();
        }
      });

      toast.promise(uploadPhotoPromise, {
        loading: "uploading image...",
        success: "image uploaded",
        error: "something went wrong",
      });
    } catch (err) {
      console.log(err);
    }
  };

  const removeImage = () => {
    setPhoto("");
    if (imageReference.current) {
      imageReference.current.value = "";
    }
  };

  return (
    <>
      <div className="container mt-5 mb-5 text-white">
        <h3 className="text-center text-danger mb-3 ">Register</h3>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="mt-4"
        >
          <Form.Group className="mb-3 " controlid="validationCustom04">
            <Form.Control
              type="file"
              except="/Images/*"
              required
              // onChange={(e) => setPhoto(e.target.files[0])}
              ref={imageReference}
              onChange={handleImageUpload}
            />
            <Form.Control.Feedback type="invalid">
              Please choose profile picture.
            </Form.Control.Feedback>
         
            {photo && (
              <div className=" position-relative">
                <img
                  className="mt-5 mb-3"
                  src={photo}
                  alt="Profile picture"
                  style={{
                    width: "200px",
                    borderRadius: "10px",
                    display: "block",
                    margin: "auto",
                  }}
                ></img>
                <button
                  type="button"
                  onClick={removeImage}
                  className="btn position-absolute  top-0"
                >
                  <FiTrash className="removePhoto  removePhotoIcon" size={20} />
                </button>
              </div>
            )}
          </Form.Group>

          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="xyz"
              required
              value={name}
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a password.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Select
            className="mb-3 mt-4"
            aria-label="Default select example"
            controlid="validationCustom04"
            required
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={{ cursor: "pointer" }}
          >
            <option value={""}>Select Role</option>
            <option value="Student">Student</option>
            <option value="Admin">Admin</option>
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select a role
          </Form.Control.Feedback>

          <Button
            type="submit"
            className="btn btn-danger mt-3 rlbtn"
            style={{ width: "100%" }}
          >
            Submit
          </Button>

          <p className="mt-3">
            Already Registered ?{" "}
            <NavLink to="/login" className={" linkHover"}>
              Login
            </NavLink>
          </p>
        </Form>
      </div>
    </>
  );
}

export default FormFileExample;
