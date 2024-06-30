import Form from "react-bootstrap/Form";
{
  /* The following line can be included in your src/index.js or App.js file */
}
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import LayoutFile from "./LayoutFile";

import { NavLink, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "../context/context";
import { FiTrash } from "react-icons/fi";

function FormFileExample() {
  const { auth, setAuth } = useGlobalContext();
  const navigate = useNavigate("");
  const [validated, setValidated] = useState(false);
  const [name, setName] = useState("");
  const [photo, setPhoto] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("");
  const [initialPhoto, setInitialPhoto] = useState("");
  const imageReference = useRef(null);

  const { id } = useParams();

  const getUser = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/single-user/${id}`,
        {
          method: "GET",
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setName(dataFromResponse?.findUser?.name);
        setEmail(dataFromResponse?.findUser?.email);
        setPhone(dataFromResponse?.findUser?.phone);
        setPhoto(dataFromResponse?.findUser?.photo);
      }
    } catch (err) {
      console.log(err);
    }
  };

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
    formData.append("phone", phone);
    photo && formData.append("photo", photo);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/update-user/${id}`,
        {
          method: "PUT",

          headers: {
            Authorization: auth?.token,
          },

          body: formData,
        }
      );

      const dataFromResponse = await res.json();
      if (res.ok) {
        toast.success(dataFromResponse.message);
        localStorage.setItem(
          "job-auth",
          JSON.stringify({
            ...JSON.parse(localStorage.getItem("job-auth")),
            loginData: dataFromResponse?.loginData,
          })
        );
        setAuth({
          ...auth,
          user: dataFromResponse?.updateUser,
        });
        navigate(-1);
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
            headers: {
              Authorization: auth?.token,
            },
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

  useEffect(() => {
    getUser();
  }, [id]);

  return (
    <>
      <LayoutFile />

      <div className="container mt-5 mb-5 text-white">
        <h3 className="text-center text-danger mb-3 ">Update Profile</h3>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="mt-4  text-primary"
        >
          <Form.Group className="mb-3 " controlid="validationCustom04">
            <label
              id="photo"
              className="btn btn-info text-white"
              style={{ width: "100%" }}
            >
              {photo ? "Upload New Photo" : "Upload photo"}
              <input
                type="file"
                className="form-control"
                id="photo"
                except="/Images/*"
                onChange={handleImageUpload}
                ref={imageReference}
                // onChange={(e) => setPhoto(e.target.files[0])}
                hidden
              />
            </label>

            <Form.Control.Feedback type="invalid">
              Please choose a job picture.
            </Form.Control.Feedback>
          </Form.Group>

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
                <FiTrash className="removePhoto" size={20} />
              </button>
            </div>
          )}
          {/* {!photo ? (
            <>
              <img
                className="mt-5 mb-3"
                style={{
                  width: "200px",
                  borderRadius: "10px",
                  display: "block",
                  margin: "auto",
                }}
                alt="Profile picture"
                src={`${import.meta.env.VITE_BACKEND_URL}/user-photo/${id}`}
              />
            </>
          ) : (
            <>
              {" "}
              <img
                className="mt-5 mb-3"
                src={URL.createObjectURL(photo)}
                alt="Profile picture"
                style={{
                  width: "200px",
                  borderRadius: "10px",
                  display: "block",
                  margin: "auto",
                }}
              ></img>
            </>
          )} */}

          <Form.Group controlid="validationCustom04" className="mb-4 ">
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

          <Form.Group controlid="validationCustom04" className="mb-4 ">
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

          <Button
            type="submit"
            className="btn btn-danger mt-3 rlbtn"
            style={{ width: "100%" }}
          >
            Save Changes
          </Button>

          <p className="mt-3 text-primary">
            Go Back ?{" "}
            <NavLink to="/profile" className={" linkHover"}>
              Profile
            </NavLink>
          </p>
        </Form>
      </div>
    </>
  );
}

export default FormFileExample;
