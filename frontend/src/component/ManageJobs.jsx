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
import { toast } from "react-toastify";
import Zoom from "react-reveal/Zoom";

export default function PaymentMethods() {
  const navigate = useNavigate("");
  const { search, setSearch } = useSearchContext();
  const [frontend, setFrontend] = useState(0);
  const [backtend, setBackend] = useState(0);
  const [fullStack, setFullStack] = useState(0);

  const handleSearch = async (event) => {
    event.preventDefault();

    if (search.keyword === "") {
      toast.error("Enter something to search");
      return;
    }

    try {
      const res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/search/${search.keyword}`,
        {
          method: "GET",
        }
      );

      const dataFromResponse = await res.json();
      if (res.ok) {
        setSearch({
          ...search,
          data: dataFromResponse?.searchData,
          keyword: "",
        });
        navigate("/search-result");
      } else {
        toast.error(dataFromResponse.message);
      }
    } catch (err) {
      console.log(err);
    }
  };
  const [allJobs, setAllJobs] = useState([]);
  const { auth } = useGlobalContext();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const getJobs = async () => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/admin-jobs/${auth?.user?._id}`,
        {
          method: "GET",

          headers: {
            Authorization: auth?.token,
            "Content-Type": "application/json",
          },
        }
      );

      const dataFromResponse = await res.json();

      if (res.ok) {
        setAllJobs(dataFromResponse?.findJobs);
        setFrontend(dataFromResponse?.frontend);
        setBackend(dataFromResponse?.backend);
        setFullStack(dataFromResponse?.fullStack);
        // setAllJobs((prevJob) => [...prevJob, ...dataFromResponse?.allJob]);
        // setHasMore(dataFromResponse?.allJob?.length > 0);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //edit
  const handleEdit = (id) => {
    navigate(`/update-job/${id}`);
  };

  //delete
  const handleDelete = async (id) => {
    try {
      let res = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/delete-job/${id}`,
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
        getJobs();
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getJobs();
  }, [frontend, backtend, fullStack]);
  return (
    <section className="h-100 gradient-custom container">
      <LayoutFile />

      <MDBContainer className="py h-100">
        <MDBRow className="justify-content-center my-4">
          <MDBCol md="4" className="left-part">
            <MDBCard className="mb-4">
              <MDBCardHeader>
                <MDBTypography tag="h5" className="mb-0">
                  Summary
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody>
                <MDBListGroup flush>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Frontend jobs
                    <span>{frontend}</span>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Backend jobs
                    <span>{backtend}</span>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 pb-0">
                    Full Stack jobs jobs
                    <span>{fullStack}</span>
                  </MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center px-0"></MDBListGroupItem>
                  <MDBListGroupItem className="d-flex justify-content-between align-items-center border-0 px-0 mb-3">
                    <div>
                      <strong>Total Jobs</strong>
                      <strong>
                        <p className="mb-0"></p>
                      </strong>
                    </div>
                    <span>
                      <strong>{allJobs?.length}</strong>
                    </span>
                  </MDBListGroupItem>
                </MDBListGroup>
              </MDBCardBody>
            </MDBCard>
          </MDBCol>

          <MDBCol md="8" className="right-part">
            <MDBCard className="mb-4">
              <MDBCardHeader className="py-3">
                <MDBTypography tag="h5" className="mb-0">
                  All Jobs
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody className="mt-3">
                {allJobs?.length === 0 && (
                  <>
                    <p>No jobs created yet</p>
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate("/create-job")}
                    >
                      Create Now
                    </button>
                  </>
                )}
                {allJobs.map((ele, idx) => {
                  return auth?.user?._id ? (
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
                                      backgroundColor:
                                        "rgba(251, 251, 251, 0.2)",
                                    }}
                                  ></div>
                                </a>

                                {auth?.user?.role === "Admin" && (
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
                                )}
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
                                    // to={`/single-job/${ele._id}`}
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
                    </>
                  ) : (
                    "no jobs created yet"
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
