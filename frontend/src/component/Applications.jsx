import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
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
import Zoom from "react-reveal/Zoom";
import { toast } from "react-hot-toast";

export default function PaymentMethods() {
  const navigate = useNavigate("");

  const [allJobs, setAllJobs] = useState([]);
  const [status, setStatus] = useState(["Pending", "Accepted", "Rejected"]);
  const [sort, setSort] = useState(["All", "Pending", "Accepted", "Rejected"]);
  const [sortBy, setSortBy] = useState("All");

  const [statusValue, setStatusValue] = useState("");
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

  const jobStatusUpdate = async (id, value) => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/update-job-status`,
        {
          method: "PUT",

          headers: {
            Authorization: auth?.token,
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ id, status: value }),
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        toast.success(dataFromResponse?.msg);
        getJobs();
      } else {
        toast.error("something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleSort = async (value) => {
    setSortBy(value);
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/sort-job-by?sortBy=${value}`,
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setAllJobs(dataFromResponse);
        // getJobs();
      } else {
        setAllJobs([]);
        toast.error("something went wrong");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getJobs();
  }, [status]);

  return (
    <section className="h-100 gradient-custom container">
      <LayoutFile />

      <MDBContainer className="py h-100">
        <MDBRow className="justify-content-center my-4">
          <MDBCol md="12">
            {allJobs?.length !== 0 && (
              <p>
                {allJobs?.length}
                {allJobs?.length > 1
                  ? " applications avaliable"
                  : " application avaliable"}{" "}
              </p>
            )}
            <p className="text-danger"> Sort By</p>{" "}
            <select
              className="mb-4 p-2 rounded-3 bg-primary text-white   "
              value={sortBy}
              onChange={(e) => handleSort(e.target.value)}
            >
              {sort?.map((ele, idx) => {
                return (
                  <option key={idx} value={ele}>
                    {ele}
                  </option>
                );
              })}
            </select>
            <MDBCard className="mb-4">
              <MDBCardHeader className="py-3">
                <MDBTypography tag="h5" className="mb-0">
                  Applications
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody className="mt-3">
                {allJobs?.length === 0 && (
                  <>
                    <p>No applications yet</p>
                  </>
                )}
                {allJobs?.map((ele, idx) => {
                  // const isExist = jobId.includes(ele._id); //edit

                  return auth?.user?._id === ele?.publishedBy ? (
                    <>
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
                                  to={`/single-application/${ele?._id}`}
                                >
                                  <img
                                    // src={`${
                                    //   import.meta.env.VITE_BACKEND_URL
                                    // }/user-photo/${ele.photo}`}
                                    src={ele?.photo}
                                    className="border"
                                    style={{
                                      width: "100%",
                                      height: "100%",
                                      cursor: "pointer",
                                    }}
                                  />
                                </NavLink>
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

                              <div className="exploreAndApply d-flex  align-items-center">
                                <div className="">
                                  <NavLink
                                    className={"nav-link"}
                                    to={`/single-application/${ele._id}`}
                                  >
                                    <button className="btn btn-warning">
                                      See More
                                    </button>
                                  </NavLink>
                                </div>
                                <div className="">
                                  {/* <NavLink
                                    className={"nav-link"}
                                    to={`mailto:/${ele.email}`}
                                  >
                                    <button className="btn btn-danger">
                                      Decline
                                    </button>
                                  </NavLink> */}
                                  <select
                                    className=" p-2 rounded-3 bg-primary text-white w-100"
                                    value={ele?.status}
                                    onChange={(e) =>
                                      jobStatusUpdate(ele?._id, e.target.value)
                                    }
                                  >
                                    {status?.map((ele, idx) => {
                                      return (
                                        <option key={idx} value={ele}>
                                          {ele}
                                        </option>
                                      );
                                    })}
                                  </select>
                                </div>
                              </div>
                            </MDBCol>
                            <hr className="my-4" />
                          </>
                        </MDBRow>
                      </Zoom>
                    </>
                  ) : (
                    "no applications yet"
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
