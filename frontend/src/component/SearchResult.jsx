import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBRipple,
  MDBRow,
  MDBTooltip,
  MDBTypography,
} from "mdb-react-ui-kit";
import React, { useEffect, useState } from "react";
import LayoutFile from "./LayoutFile";
import Search from "antd/es/input/Search";
import { NavLink, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchContext } from "../context/SearchContext";
import Zoom from "react-reveal/Zoom";

export default function PaymentMethods() {
  const navigate = useNavigate("");
  const { search } = useSearchContext();

  const [allJobs, setAllJobs] = useState([]);
  const { auth } = useGlobalContext();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  //edit
  const handleEdit = (id) => {
    navigate(`/update-job/${id}`);
  };

  return (
    <section className="h-100 gradient-custom container">
      <LayoutFile />

      <MDBContainer className="py-5 h-100">
        <div className="d-flex justify-content-around">
          {search?.data?.length + " results found"}
          <button onClick={() => navigate(-1)} className="btn btn-warning ">
            Go Back
          </button>
        </div>

        <MDBRow className="justify-content-center my-4">
          <MDBCol md="12">
            <MDBCard className="mb-4">
              <MDBCardHeader className="py-3">
                <MDBTypography tag="h5" className="mb-0">
                  All Jobs
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody className="mt-3">
                {search?.data?.length === 0 && <p>No match found</p>}

                {search?.data?.map((ele, idx) => {
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
                                to={`/single-job/${ele?._id}`}
                              >
                                <img
                                  // src={`${
                                  //   import.meta.env.VITE_BACKEND_URL
                                  // }/job-photo/${ele?._id}`}
                                  src={ele?.photo}
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

                            <div className="exploreAndApply">
                              <div className="">
                                <NavLink
                                  className={"nav-link"}
                                  to={`/single-job/${ele._id}`}
                                >
                                  <button className="btn btn-primary">
                                    Explore More
                                  </button>
                                </NavLink>
                              </div>
                              <div className="">
                                <NavLink
                                  className={"nav-link"}
                                  to={`/apply-for-job/${ele._id}`}
                                >
                                  {auth?.user?.role === "Student" && (
                                    <button className="btn btn-warning">
                                      Apply Now
                                    </button>
                                  )}
                                </NavLink>
                              </div>
                            </div>
                          </MDBCol>
                          <hr className="my-4" />
                        </>
                      </MDBRow>
                    </Zoom>
                  );
                })}
                {/* </InfiniteScroll> */}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
