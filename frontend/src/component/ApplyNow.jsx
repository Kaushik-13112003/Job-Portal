import Form from "react-bootstrap/Form";
{
  /* The following line can be included in your src/index.js or App.js file */
}
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import LayoutFile from "./LayoutFile";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "../context/context";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { FiTrash } from "react-icons/fi";

function FormFileExample() {
  const { id } = useParams();

  const { auth } = useGlobalContext();
  const navigate = useNavigate("");
  const [validated, setValidated] = useState(false);
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [jobPhoto, setJobPhoto] = useState("");
  const [singleJob, setSingleJob] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [des, setDes] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [salary, setSalary] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [resume, setResume] = useState("");
  const [jobRole, setjobRole] = useState("");
  const [publishedBy, setPublishedBy] = useState("");
  const quillRef = useRef(null); // Ref for the ReactQuill component

  const imageReference = useRef(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const form = event.currentTarget;
    if (!quillRef.current?.getEditor().getText().trim()) {
      // If ReactQuill content is empty, set validation state and prevent submission
      setValidated(true);
      return;
    }

    setValidated(true);

    if (form.checkValidity() === false) {
      return; // Don't proceed if the form is still invalid
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    formData.append("photo", photo);
    formData.append("jobPhoto", jobPhoto);
    formData.append("resume", resume);
    formData.append("salary", salary);
    formData.append("from", from);
    formData.append("to", to);
    formData.append("fixedSalary", fixedSalary);
    formData.append("des", des);
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("jobRole", jobRole);
    formData.append("publishedBy", publishedBy);
    formData.append("jobId", id);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/apply-for-job`,
        {
          method: "POST",

          headers: {
            Authorization: auth?.token,
          },

          body: formData,
        }
      );

      const dataFromResponse = await res.json();
      if (res.ok) {
        toast.success(dataFromResponse.message);
        navigate("/my-jobs");
      } else {
        toast.error(dataFromResponse.message);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //reqct-quill

  const modules = {
    toolbar: [
      [{ header: [1, 2, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [
        { list: "ordered" },
        { list: "bullet" },
        { indent: "-1" },
        { indent: "+1" },
      ],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
  ];

  //getSingleJob
  const getSingleJob = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/single-job/${id}`,
        {
          method: "GET",
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setSingleJob(dataFromResponse?.singlejob);
        setTitle(dataFromResponse?.singlejob?.title);
        setCategory(dataFromResponse?.singlejob?.category);
        setDes(dataFromResponse?.singlejob?.des);
        setLocation(dataFromResponse?.singlejob?.location);
        setCity(dataFromResponse?.singlejob?.city);
        setState(dataFromResponse?.singlejob?.state);
        setSalary(dataFromResponse?.singlejob?.salary);
        setJobPhoto(dataFromResponse?.singlejob?.photo);
        setCountry(dataFromResponse?.singlejob?.country);
        setFixedSalary(dataFromResponse?.singlejob?.fixedSalary);
        setPublishedBy(dataFromResponse?.singlejob?.publishedBy?._id);
        setFrom(dataFromResponse?.singlejob?.rangeSalary[0]);
        setTo(dataFromResponse?.singlejob?.rangeSalary[1]);
        // setJobPhoto(id);
        setPhoto(auth?.user?.photo);
        setName(auth?.user?.name);
        setPhone(auth?.user?.phone);
        setEmail(auth?.user?.email);
        setjobRole(dataFromResponse?.singlejob?.jobRole);
        // console.log(singleJob);
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
          setResume(dataFromResponse);
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
    setResume("");
    if (imageReference.current) {
      imageReference.current.value = "";
    }
  };

  useEffect(() => {
    getSingleJob();
  }, [id]);

  return (
    <>
      <LayoutFile />
      <div className="container  mb-5 text-primary">
        <h3 className="text-center text-primary mb-3 ">
          Applying for <span className="text-danger"> {title}</span> job...
        </h3>
        <div className=" mt-5 d-flex justify-content-between">
          <div className="">
            <h2 className="text-dark ">Job Details</h2>
          </div>
          <div className="">
            <button className="btn btn-warning" onClick={() => navigate(-1)}>
              Go Back
            </button>
          </div>
        </div>
        <hr />
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="mt-4"
        >
          <Form.Label>Photo</Form.Label>
          <Form.Group
            className="mb-3 text-center "
            controlid="validationCustom04"
          >
            <img
              className="mt-3 mb-3"
              style={{ width: "200px", borderRadius: "20px" }}
              disabled
              alt="Profile picture"
              // src={`${import.meta.env.VITE_BACKEND_URL}/job-photo/${
              //   singleJob?._id
              // }`}
              src={singleJob?.photo}
            />
            <Form.Control.Feedback type="invalid">
              Please choose job picture.
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Job Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Node Js Developer"
              required
              value={title}
              disabled
            />
          </Form.Group>
          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              placeholder="Node Js Developer"
              required
              value={category}
              disabled
            />
          </Form.Group>
          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Job Description</Form.Label>
            <ReactQuill
              value={des}
              required
              disabled
              readOnly
              ref={quillRef} // Assigning the ref
            />
          </Form.Group>
          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Job Role</Form.Label>
            <Form.Control type="text" required value={jobRole} disabled />
          </Form.Group>
          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Location</Form.Label>
            <Form.Control type="text" required value={location} disabled />
          </Form.Group>
          <div className="row">
            <div className="col-md-4">
              <Form.Group controlid="validationCustom04" className="mb-4 ">
                <Form.Label>City</Form.Label>
                <Form.Control type="text" required value={city} disabled />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group controlid="validationCustom04" className="mb-4 ">
                <Form.Label>State</Form.Label>
                <Form.Control type="text" required value={state} disabled />
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group controlid="validationCustom04" className="mb-4 ">
                <Form.Label>Country</Form.Label>
                <Form.Control type="text" required value={country} disabled />
              </Form.Group>
            </div>
          </div>
          <Form.Label>Salary</Form.Label>
          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Control type="text" required value={salary} disabled />
          </Form.Group>
          {salary === "Fixed Salary" && (
            <>
              <Form.Group controlid="validationCustom04" className="mb-4 ">
                <Form.Label>Fixed Salary</Form.Label>
                <Form.Control
                  type="number"
                  required
                  value={fixedSalary}
                  disabled
                />
              </Form.Group>
            </>
          )}
          {salary === "Range Salary" && (
            <>
              <div className="row">
                <div className="col-md-6">
                  <Form.Group controlid="validationCustom04" className="mb-4 ">
                    <Form.Label>From</Form.Label>
                    <Form.Control
                      type="number"
                      required
                      value={from}
                      disabled
                    />
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlid="validationCustom04" className="mb-4 ">
                    <Form.Label>To</Form.Label>
                    <Form.Control type="number" required value={to} disabled />
                  </Form.Group>
                </div>
              </div>
            </>
          )}
          <div className=" mt-5 d-flex justify-content-between">
            <div className="">
              <h2 className="text-dark ">Applicant Details</h2>
            </div>
            <div className="">
              <button
                className="btn btn-warning"
                onClick={() => navigate(`/update-user/${auth?.user?._id}`)}
              >
                Update Profile
              </button>
            </div>
          </div>{" "}
          <hr />
          <Form.Label>Applicant Photo</Form.Label>
          <img
            className="mt-5 mb-3"
            style={{
              width: "200px",
              borderRadius: "10px",
              display: "block",
              margin: "auto",
            }}
            alt="Profile picture"
            // src={`${import.meta.env.VITE_BACKEND_URL}/user-photo/${
            //   auth?.user?._id
            // }`}
            src={auth?.user?.photo}
          />
          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              required
              value={auth?.user?.name}
              disabled
            />
          </Form.Group>
          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Email</Form.Label>
            <Form.Control type="email" required value={auth?.user?.email} />
          </Form.Group>
          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Mobile Number</Form.Label>
            <Form.Control
              type="text"
              required
              value={auth?.user?.phone}
              disabled
            />
          </Form.Group>
          <Form.Group className="mb-3 " controlid="validationCustom04">
            <Form.Label>Resume</Form.Label>

            <Form.Control
              type="file"
              except="/Images/*"
              required
              // onChange={(e) => setResume(e.target.files[0])}
              onChange={handleImageUpload}
              ref={imageReference}
            />
            <div className=" mt-5">
              {resume && (
                <div className=" position-relative">
                  <img
                    className="mt-5 mb-3"
                    src={resume}
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
              {/* {resume && (
                <img
                  src={URL.createObjectURL(resume)}
                  alt=""
                  style={{ width: "200px", borderRadius: "20px" }}
                />
              )} */}
            </div>
            <Form.Control.Feedback
              type="invalid"
              style={{ marginTop: "-38px" }}
            >
              Please upload your resume.
            </Form.Control.Feedback>
          </Form.Group>
          <Button
            type="submit"
            className="btn btn-primary mt-3 rlbtn"
            style={{ width: "100%" }}
          >
            Apply
          </Button>
        </Form>
      </div>
    </>
  );
}

export default FormFileExample;
