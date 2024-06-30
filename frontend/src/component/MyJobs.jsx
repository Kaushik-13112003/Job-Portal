import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBRipple,
  MDBRow,
  MDBTooltip,
  MDBTypography,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import LayoutFile from "./LayoutFile";
import { NavLink, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

import Zoom from "react-reveal/Zoom";

export default function PaymentMethods() {
  const navigate = useNavigate("");

  const [allJobs, setAllJobs] = useState([]);
  const { auth } = useGlobalContext();

  const getJobs = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/all-applied-job`,
        {
          method: "GET",
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setAllJobs(dataFromResponse?.allAppliedJobs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getJobs();
  }, []);

  return (
    <section className="h-100 gradient-custom container">
      <LayoutFile />

      <MDBContainer className="py h-100">
        {allJobs?.length !== 0 && (
          <>
            <p>
              You have applied for {allJobs?.length}{" "}
              {allJobs?.length > 1 ? " jobs" : "job"}{" "}
            </p>
          </>
        )}

        <MDBRow className="justify-content-center my-4">
          <MDBCol md="12">
            <MDBCard className="mb-4">
              <MDBCardHeader className="py-3">
                <MDBTypography tag="h5" className="mb-0">
                  Applied Jobs
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody className="mt-3">
                {allJobs?.length === 0 && (
                  <>
                    <p>No applied jobs yet</p>
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate("/jobs")}
                    >
                      Explore Now
                    </button>
                  </>
                )}

                {allJobs.map((ele, idx) => {
                  // const isExist = jobId.includes(ele._id); //edit

                  return (
                    <Zoom>
                      <MDBRow>
                        <>
                          <MDBCol
                            lg="3"
                            md="12"
                            className="mb-4 mb-lg-0"
                            key={idx}
                          >
                            <MDBRipple
                              rippleTag="div"
                              rippleColor="light"
                              className="bg-image rounded hover-zoom hover-overlay"
                            >
                              <NavLink
                                className={"nav-link"}
                                to={`/single-job/${ele?.jobId}`}
                              >
                                <img
                                  // src={`${
                                  //   import.meta.env.VITE_BACKEND_URL
                                  // }/job-photo/${ele?.jobPhoto}`}
                                  src={ele?.resume}
                                  className="border"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    cursor: "pointer",
                                  }}
                                />
                              </NavLink>
                              <a href="#!">
                                <div
                                  className="mask"
                                  style={{
                                    backgroundColor: "rgba(251, 251, 251, 0.2)",
                                  }}
                                ></div>
                              </a>

                              {/* {auth?.user?.role === "Admin" && (
                                <>
                                  <div className=" text-center mt-4">
                                    <EditOutlined
                                      key="edit"
                                      // id="edit"
                                      className="icon text-primary mx-2 editAndDelte"
                                      onClick={() => handleEdit(ele._id)}
                                    />

                                    <DeleteOutlined
                                      // id="edit"
                                      style={{ cursor: "pointer" }}
                                      className="icon text-danger editAndDelte "
                                      key="delete"
                                      onClick={() => handleDelete(ele._id)}
                                    />
                                  </div>
                                </>
                              )} */}
                            </MDBRipple>
                          </MDBCol>

                          <MDBCol lg="5" md="6" className=" mb-4 mb-lg-0">
                            <p>
                              Job Title :{" "}
                              <strong style={{ fontSize: "20px" }}>
                                {ele.title.substring(0, 1).toUpperCase() +
                                  ele.title.substring(1)}
                              </strong>
                            </p>
                            <p>
                              Category : <span>{ele.category}</span>
                            </p>
                            <p>
                              Salary :
                              <span style={{ marginLeft: "4px" }}>
                                {ele.salary === "Fixed Salary"
                                  ? ele.fixedSalary + "₹"
                                  : ` From ${ele.rangeSalary[0]} to ${ele.rangeSalary[1]}₹ `}
                              </span>
                            </p>

                            <div className="exploreAndApply flex align-items-center">
                              <div className="">
                                <NavLink
                                  className={"nav-link"}
                                  to={`/single-job/${ele.jobId}`}
                                >
                                  <button className="btn btn-warning">
                                    See More
                                  </button>
                                </NavLink>
                              </div>
                              <p className="text-primary mt-3 text-center ">
                                {ele?.status}
                              </p>
                            </div>
                          </MDBCol>
                          <hr className="my-4" />
                        </>
                      </MDBRow>
                    </Zoom>
                  );
                })}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
