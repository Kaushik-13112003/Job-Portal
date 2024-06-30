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
import { salaryForFilter } from "./salary";
import { useSaveContext } from "../context/SaveContext";
import { CiSaveDown1 } from "react-icons/ci";
export default function PaymentMethods() {
  const navigate = useNavigate("");
  const { search, setSearch } = useSearchContext();
  const [categories, setCategory] = useState([]);
  const [salaryFilter, setSalaryFilter] = useState(salaryForFilter);
  const [checked, setChecked] = useState("");
  const [salary, setSalary] = useState("");
  const { saveJob, jobId, setSaveJob, saveJobFunction } = useSaveContext();

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
  const [categoryType, setCategoryType] = useState([
    "Frontend",
    "Backend",
    "Full Stack",
  ]);

  const getJobs = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/all-job`, {
        method: "GET",
      });

      const dataFromResponse = await res.json();

      if (res.ok) {
        setAllJobs(dataFromResponse?.allJob);
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

  return (
    <section className="h-100 gradient-custom container">
      <LayoutFile />
      <form className="form-inline d-flex m-2">
        <input
          className="form-control "
          value={search.keyword}
          onChange={(e) => setSearch({ ...search, keyword: e.target.value })}
          placeholder="Search Jobs"
        />
        <button
          className="btn btn-primary "
          type="submit"
          onClick={handleSearch}
        >
          Search
        </button>
      </form>{" "}
      <MDBContainer className="py h-100">
        {saveJob?.length !== 0 && (
          <>
            <p className="mt-5">
              You are intrested in {saveJob?.length}{" "}
              {saveJob?.length > 1 ? " jobs" : "job"}{" "}
            </p>
          </>
        )}
        <MDBRow className="justify-content-center my-4">
          <MDBCol md="12">
            <MDBCard className="mb-4">
              <MDBCardHeader className="py-3">
                <MDBTypography tag="h5" className="mb-0">
                  All Jobs
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody className="mt-3">
                {saveJob?.length === 0 && (
                  <>
                    <p>No intrested jobs yet</p>
                    <button
                      className="btn btn-warning"
                      onClick={() => navigate("/jobs")}
                    >
                      Explore Now
                    </button>
                  </>
                )}
                {saveJob.map((ele, idx) => {
                  const isExist = jobId.includes(ele._id); //edit

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

                              {auth?.user?.role === "Student" && (
                                <>
                                  <div className=" text-center mt-4">
                                    <CiSaveDown1
                                      size={20}
                                      key="save"
                                      id="edit"
                                      className={`${
                                        isExist
                                          ? "icon text-danger mx-3 editAndDelte"
                                          : "icon text-primary mx-3 editAndDelte"
                                      }`}
                                      onClick={() => saveJobFunction(ele)}
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
                                  className={"nav-link "}
                                  to={`/apply-for-job/${ele._id}`}
                                >
                                  {auth?.user?.role === "Student" && (
                                    <>
                                      <button className="btn btn-warning">
                                        Apply Now
                                      </button>{" "}
                                    </>
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
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
