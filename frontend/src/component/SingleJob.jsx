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

export default function ProfilePage() {
  const navigate = useNavigate("");
  const location = useLocation();
  const { auth } = useGlobalContext();
  const [singleJob, setSingleJob] = useState("");
  const { id } = useParams();
  const { saveJobFunction, jobId } = useSaveContext();

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
                <NavLink to="/jobs">All Jobs</NavLink>
              </MDBBreadcrumbItem>
              <MDBBreadcrumbItem active>Single Job</MDBBreadcrumbItem>
            </MDBBreadcrumb>
          </MDBCol>
        </MDBRow>

        <MDBRow>
          <MDBCol lg="4">
            <MDBCard className="mb-4">
              <MDBCardBody className="text-center">
                <MDBCardImage
                  // src={`${import.meta.env.VITE_BACKEND_URL}/job-photo/${id}`}
                  src={singleJob?.photo}
                  alt="avatar"
                  className="rounded-circle mb-3 mt-3"
                  style={{ width: "190px", height: "190px" }}
                  fluid
                />
                <p className="text-muted mb-1">Published by </p>
                <p className="text-muted mb-4">
                  {singleJob?.publishedBy?.name}
                </p>
                <div className="d-flex justify-content-center  align-items-center mb-2">
                  {auth?.user?.role === "Student" && (
                    <>
                      <CiSaveDown1
                        size={20}
                        key="save"
                        id="edit"
                        className={`${
                          isExist
                            ? "icon text-danger mx-3  editAndDelte"
                            : "icon text-primary mx-3 editAndDelte"
                        }`}
                        onClick={() => saveJobFunction(singleJob)}
                      />
                      <button
                        className="btn btn-warning"
                        onClick={() =>
                          navigate(`/apply-for-job/${singleJob?._id}`)
                        }
                      >
                        Apply Now
                      </button>
                    </>
                  )}{" "}
                  {auth?.user?.role === "Admin" &&
                    singleJob?.publishedBy?._id === auth?.user?._id && (
                      <>
                        <div className=" text-center mt-4">
                          <NavLink to={`/update-job/${id}`}>
                            <EditOutlined
                              key="edit"
                              // id="edit"

                              className="icon text-primary mx-2 editAndDelte"
                            />
                          </NavLink>
                        </div>
                      </>
                    )}
                </div>
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
                      {singleJob?.jobRole}
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
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
