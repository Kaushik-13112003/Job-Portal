import React, { useEffect, useState } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBBreadcrumb,
  MDBBreadcrumbItem,
} from "mdb-react-ui-kit";
import LayoutFile from "./LayoutFile";
import { NavLink, useLocation, useNavigate, useParams } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { CiSaveDown1 } from "react-icons/ci";
import { useSaveContext } from "../context/SaveContext";
import { MdEmail } from "react-icons/md";

import { FaCloudDownloadAlt, FaMobile } from "react-icons/fa";

export default function ProfilePage() {
  const navigate = useNavigate("");
  const location = useLocation();
  const { auth } = useGlobalContext();
  const [singleJob, setSingleJob] = useState("");
  const { id } = useParams();
  const { saveJobFunction, jobId } = useSaveContext();

  const handleDownload = async () => {
    try {
      // Get the image URL
      const imageUrl = `${
        import.meta.env.VITE_BACKEND_URL
      }/applied-job-resume/${singleJob?._id}`;

      // Fetch the image data as a blob
      const response = await fetch(imageUrl);
      const blob = await response.blob();

      // Create a temporary URL for the blob
      const url = window.URL.createObjectURL(new Blob([blob]));

      // Create an anchor element and trigger the download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "resume.png");
      document.body.appendChild(link);
      link.click();

      // Cleanup
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
    } catch (error) {
      console.error("Error downloading image:", error);
    }
  };

  const getSingleJob = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/single-application/${id}`,
        {
          method: "GET",
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setSingleJob(dataFromResponse?.singlejob);
        // console.log(singleJob);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const isExist = jobId.includes(singleJob?._id); //edit
  const handleEdit = (sid) => {
    navigate(`/update-job/${sid}`);
  };

  //delete
  //delete
  const handleDelete = async (sid) => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-job/${sid}`,
        {
          method: "DELETE",

          headers: {
            Authorization: auth?.token,
          },
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        toast.success(dataFromResponse?.message);
        navigate("/manage-job");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSingleJob();
    window.scrollTo(0, 0);
  }, [id, navigate]);
  return (
    <section style={{ backgroundColor: "#eee" }}>
      <LayoutFile />

      <MDBContainer className="py-5">
        <MDBRow>
          <MDBCol>
            <MDBBreadcrumb className="bg-light rounded-3 p-3 mb-4">
              <MDBBreadcrumbItem>
                <NavLink to="/applications">All Applications</NavLink>
              </MDBBreadcrumbItem>
              <MDBBreadcrumbItem active>Single Application</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  // src={`${import.meta.env.VITE_BACKEND_URL}/user-photo/${
                  //   singleJob?.photo
                  // }`}
                  src={singleJob?.photo}
                  alt="avatar"
                  className="rounded-circle mb-3 mt-3"
                  style={{ width: "190px", height: "190px" }}
                  fluid
                />
                <p className="text-muted mb-1">Application from </p>
                <p className=" mb-1 text-dark fs-3">{singleJob?.name}</p>
                <NavLink
                  className={"nav-link contactInfo"}
                  to={`mailto:${singleJob?.email}`}
                >
                  <p className=" mb-1 ">
                    <span>
                      <MdEmail className="mx-2" size={20} />
                    </span>
                    {singleJob?.email}
                  </p>
                </NavLink>

                <NavLink
                  className={"nav-link contactInfo"}
                  to={`tel:${singleJob?.phone}`}
                >
                  <p className=" mb-1 ">
                    <span>
                      <FaMobile className="mx-2" size={20} />
                    </span>
                    {singleJob?.phone}
                  </p>
                </NavLink>
                <p className="text-muted mb-4">
                  {singleJob?.publishedBy?.name}
                </p>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol lg="8">
            <MDBCard className="mb-4">
              <MDBCardBody>
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Job Title</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {singleJob?.title}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Category</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {singleJob?.category}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Salary</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {singleJob.salary === "Fixed Salary" &&
                        singleJob.fixedSalary + " ₹"}

                      {singleJob.salary === "Range Salary" &&
                        ` From ${singleJob.rangeSalary[0]} to ${singleJob.rangeSalary[1]} ₹`}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Job Role</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {singleJob.jobRole}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>

                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>Location</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {singleJob.location}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
                <hr />
                <MDBRow>
                  <MDBCol sm="3">
                    <MDBCardText>City-State-Country</MDBCardText>
                  </MDBCol>
                  <MDBCol sm="9">
                    <MDBCardText className="text-muted">
                      {singleJob.city}-{singleJob.state}-{singleJob.country}
                    </MDBCardText>
                  </MDBCol>
                </MDBRow>
              </MDBCardBody>
            </MDBCard>

            <MDBRow className="mt-4">
              {" "}
              <h5 className="text-center"> Job Description</h5>
              <MDBCol md="12">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <p dangerouslySetInnerHTML={{ __html: singleJob?.des }}></p>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>

            <MDBRow className="mt-4">
              {" "}
              <h5 className="text-center"> Resume</h5>
              <MDBCol md="12">
                <MDBCard className="mb-4 mb-md-0">
                  <MDBCardBody>
                    <img
                      // src={`${
                      //   import.meta.env.VITE_BACKEND_URL
                      // }/applied-job-resume/${singleJob?._id}`}
                      src={singleJob?.resume}
                      className="border"
                      style={{
                        width: "100%",
                        height: "100%",
                        cursor: "pointer",
                      }}
                    />{" "}
                    <a
                      download
                      target="_blank"
                      href={singleJob?.resume}
                      className="btn btn-primary w-100 mt-3"
                      // onClick={handleDownload}
                    >
                      {/* <FaCloudDownloadAlt size={25} className="mx-3" /> */}
                      Check Resume
                    </a>
                  </MDBCardBody>
                </MDBCard>
              </MDBCol>
            </MDBRow>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
