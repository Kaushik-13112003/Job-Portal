import Form from "react-bootstrap/Form";
{
  /* The following line can be included in your src/index.js or App.js file */
}
import "bootstrap/dist/css/bootstrap.min.css";
import { useEffect, useState, useRef } from "react";
import Button from "react-bootstrap/Button";
import LayoutFile from "./LayoutFile";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGlobalContext } from "../context/context";
import { FiTrash } from "react-icons/fi";

function FormFileExample({ prevPath }) {
  const { auth } = useGlobalContext();
  const navigate = useNavigate("");
  const [validated, setValidated] = useState(false);
  const [title, setTitle] = useState("");
  const [photo, setPhoto] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [fixedSalary, setFixedSalary] = useState("");
  const [categoryType, setCategoryType] = useState([
    "Frontend",
    "Backend",
    "Full Stack",
  ]);
  const [salaryType, setSalaryType] = useState([
    "Fixed Salary",
    "Range Salary",
  ]);
  const [from, setFrom] = useState();
  const [to, setTo] = useState();
  const [salary, setSalary] = useState("");
  const [jobRole, setjobRole] = useState("");
  const imageReference = useRef(null);
  const locations = useLocation();

  //get job
  const { id } = useParams();

  const getJob = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/single-job/${id}`,
        {
          method: "GET",
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setTitle(dataFromResponse?.singlejob?.title);
        setCategory(dataFromResponse?.singlejob?.category);
        setLocation(dataFromResponse?.singlejob?.location);
        setPhoto(dataFromResponse?.singlejob?.photo);
        setCity(dataFromResponse?.singlejob?.city);
        setState(dataFromResponse?.singlejob?.state);
        setCountry(dataFromResponse?.singlejob?.country);
        setSalary(dataFromResponse?.singlejob?.salary);
        setjobRole(dataFromResponse?.singlejob?.jobRole);

        if (dataFromResponse?.singlejob?.salary === "Fixed Salary") {
          setFixedSalary(dataFromResponse?.singlejob?.fixedSalary);
          setFrom("");
          setTo("");
        } else {
          setFrom(dataFromResponse?.singlejob?.rangeSalary[0]);
          setTo(dataFromResponse?.singlejob?.rangeSalary[1]);
          setFixedSalary("");
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getJob();
  }, [id]);

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
    formData.append("title", title);
    formData.append("category", category);
    formData.append("location", location);
    formData.append("city", city);
    formData.append("state", state);
    formData.append("country", country);
    photo && formData.append("photo", photo);
    formData.append("salary", salary);
    formData.append("from", from);
    formData.append("to", to);
    formData.append("fixedSalary", fixedSalary);
    formData.append("jobRole", jobRole);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/update-job/${id}`,
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
        // navigate("/manage-job");
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

  return (
    <>
      <LayoutFile />
      <div className="container  mb-5 text-primary">
        <h3 className="text-center text-primary mb-3 ">Update Job</h3>
        <Form
          noValidate
          validated={validated}
          onSubmit={handleSubmit}
          className="mt-4"
        >
          <Form.Label>Job Photo</Form.Label>
          <p style={{ fontSize: "13px", color: "red" }}>
            company logo, job position, or a workplace as a photo
          </p>

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
                alt="Job picture"
                src={`${import.meta.env.VITE_BACKEND_URL}/job-photo/${id}`}
              />
            </>
          ) : (
            <>
              {" "}
              <img
                className="mt-5 mb-3"
                src={URL.createObjectURL(photo)}
                alt="Job picture"
                style={{
                  width: "200px",
                  borderRadius: "10px",
                  display: "block",
                  margin: "auto",
                }}
              ></img>
            </>
          )} */}

          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              placeholder="Node Js Developer"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a title.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlid="validationCustom04" className="mb-3 ">
            <Form.Label>Category</Form.Label>
            <Form.Select
              className="mb-4"
              aria-label="Default select example"
              controlid="validationCustom04"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {" "}
              {/* <option value="">Salary Type</option> */}
              {categoryType.map((ele, idx) => {
                return (
                  <option value={ele} key={idx}>
                    {ele}
                  </option>
                );
              })}
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              Please select a category
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Job Role</Form.Label>
            <Form.Control
              type="text"
              placeholder="manager"
              required
              value={jobRole}
              onChange={(e) => setjobRole(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a job role.
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group controlid="validationCustom04" className="mb-4 ">
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              placeholder="A-32,Mahanagar"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
            <Form.Control.Feedback type="invalid">
              Please provide a location.
            </Form.Control.Feedback>
          </Form.Group>

          <div className="row">
            <div className="col-md-4">
              <Form.Group controlid="validationCustom04" className="mb-4 ">
                <Form.Label>City</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="ahmedabad"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a city.
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group controlid="validationCustom04" className="mb-4 ">
                <Form.Label>State</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="gujrat"
                  required
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a state.
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="col-md-4">
              <Form.Group controlid="validationCustom04" className="mb-4 ">
                <Form.Label>Country</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="india"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a country.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
          </div>

          <Form.Label>Salary</Form.Label>
          <Form.Select
            className="mb-4"
            aria-label="Default select example"
            controlid="validationCustom04"
            required
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
          >
            {" "}
            {/* <option value="">Salary Type</option> */}
            {salaryType.map((ele, idx) => {
              return (
                <option value={ele} key={idx}>
                  {ele}
                </option>
              );
            })}
          </Form.Select>
          <Form.Control.Feedback type="invalid">
            Please select a salary type
          </Form.Control.Feedback>

          {salary === "Fixed Salary" && (
            <>
              <Form.Group controlid="validationCustom04" className="mb-4 ">
                <Form.Label>Fixed Salary</Form.Label>
                <Form.Control
                  type="number"
                  placeholder="125000"
                  required
                  value={fixedSalary}
                  onChange={(e) => setFixedSalary(e.target.value)}
                />
                <Form.Control.Feedback type="invalid">
                  Please provide a salary.
                </Form.Control.Feedback>
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
                      placeholder="125000"
                      required
                      value={from}
                      onChange={(e) => setFrom(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a salary.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>

                <div className="col-md-6">
                  <Form.Group controlid="validationCustom04" className="mb-4 ">
                    <Form.Label>To</Form.Label>
                    <Form.Control
                      type="number"
                      placeholder="200000"
                      required
                      value={to}
                      onChange={(e) => setTo(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a salary.
                    </Form.Control.Feedback>
                  </Form.Group>
                </div>
              </div>
            </>
          )}

          <Button
            type="submit"
            className="btn btn-primary mt-3 rlbtn"
            style={{ width: "100%" }}
          >
            Update Job
          </Button>
        </Form>
      </div>
    </>
  );
}

export default FormFileExample;
