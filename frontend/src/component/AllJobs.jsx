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
import Zoom from "react-reveal/Zoom";
import { NavLink, useNavigate } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import InfiniteScroll from "react-infinite-scroll-component";
import { useSearchContext } from "../context/SearchContext";
import { toast } from "react-toastify";
import { salaryForFilter } from "./salary";
import { IoAddCircleOutline } from "react-icons/io5";

export default function PaymentMethods() {
  const navigate = useNavigate("");
  const { search, setSearch } = useSearchContext();
  const [categories, setCategory] = useState([]);
  const [salaryFilter, setSalaryFilter] = useState(salaryForFilter);
  const [checked, setChecked] = useState("");
  const [salary, setSalary] = useState("");
  const [allJobs, setAllJobs] = useState([]);
  const { auth } = useGlobalContext();
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categoryType, setCategoryType] = useState([
    "Frontend",
    "Backend",
    "Full Stack",
  ]);

  const [initialJobs, setInitialJobs] = useState(5);
  const [displayJobs, setDisplayJobs] = useState([]);
  const [showLoadMore, setShowLoadMore] = useState(false);

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

  const getJobs = async () => {
    try {
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/all-job`, {
        method: "GET",
      });

      const dataFromResponse = await res.json();
      console.log(dataFromResponse?.allJob)

      if (res.ok) {
        setAllJobs(dataFromResponse?.allJob);
        setFrontend(dataFromResponse?.frontend);
        setBackend(dataFromResponse?.backend);
        setFullStack(dataFromResponse?.fullStack);
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

  // handleCategories
  const handleCategories = (filteredCategory, id) => {
    let all = [...checked];

    if (filteredCategory) {
      all.push(id);
    } else {
      all = all.filter((cat) => {
        return cat != id;
      });
    }
    setChecked(all);
  };

  //filter product
  const filterJobs = async () => {
    setInitialJobs(5);
    try {
      let res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/filter-jobs`, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ checked, salary }),
      });

      const dataFromResponse = await res.json();
      // console.log(dataFromResponse);

      if (res.ok) {
        setAllJobs(dataFromResponse?.allFilteredJobs);
      }
    } catch (err) {
      console.log(err);
    }
  };

  //load more
  const handleLoadMore = () => {
    setInitialJobs((prev) => prev + 5);
  };

  useEffect(() => {
    if (!checked.length && !salary.length) {
      getJobs();
    }

    if (checked.length || salary.length) {
      filterJobs();
    }
  }, [page, checked, salary, frontend, backtend, fullStack]);

  useEffect(() => {
    // getJobsCategories();
    setDisplayJobs(allJobs.slice(0, initialJobs));
    setShowLoadMore(initialJobs < allJobs?.length);
  }, [initialJobs, allJobs, frontend, backtend, fullStack]);

  useEffect(() => {
    if (salary || checked) {
      if (window.innerWidth >= 770) {
        window.scrollTo(0, 0);
      }
    }
  }, [navigate, checked, salary]);
  return (
    <section className="h-100 gradient-custom container">
      <LayoutFile />

      <MDBContainer className="py h-100">
        <MDBRow className="justify-content-center my-4">
          <MDBCol md="4" className="left-part">
            <MDBCol md="12">
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
            </MDBCol>{" "}
            <button
              style={{ width: "100%" }}
              className="btn btn-warning mb-4"
              onClick={() => window.location.reload()}
            >
              Clear Filter
            </button>
            <MDBCard className="mb-4">
              <MDBCardHeader>
                <MDBTypography tag="h5" className="mb-0">
                  Category
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody>
                <p className="text-primary">Category</p>
                {/* {JSON.stringify(checked)} */}
                {categoryType.map((ele, idx) => {
                  return (
                    <>
                      <label id={idx} style={{ cursor: "pointer" }}>
                        <input
                          type="checkbox"
                          key={idx}
                          value={ele}
                          id={idx}
                          onChange={(e) =>
                            handleCategories(e.target.checked, ele)
                          }
                          style={{ cursor: "pointer" }}
                        />
                        <span className="mx-2">{ele}</span>
                      </label>
                      <br />
                    </>
                  );
                })}
              </MDBCardBody>
            </MDBCard>
            <MDBCard className="mb-4">
              <MDBCardHeader>
                <MDBTypography tag="h5" className="mb-0">
                  Salary
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody>
                {salaryFilter.map((ele, idx) => {
                  return (
                    <>
                      <label id={idx} style={{ cursor: "pointer" }}>
                        <input
                          type="radio"
                          key={idx}
                          name="salary"
                          id={idx}
                          value={ele.arr}
                          onChange={() => setSalary(ele.arr)}
                          style={{ cursor: "pointer" }}
                        />
                        <span className="mx-2">{ele.name}</span>
                      </label>
                      <br />
                    </>
                  );
                })}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
          <MDBCol md="8" className="right-part">
            <form className="form-inline d-flex mb-5">
              <input
                className="form-control "
                value={search.keyword}
                onChange={(e) =>
                  setSearch({ ...search, keyword: e.target.value })
                }
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
            <MDBCard className="mb-4">
              <MDBCardHeader className="py-3">
                <MDBTypography tag="h5" className="mb-0">
                  All Jobs
                </MDBTypography>
              </MDBCardHeader>
              <MDBCardBody className="mt-3">
                {allJobs.length === 0 && <p>No jobs yet</p>}
                {displayJobs.map((ele, idx) => {
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
                                  src={ele?.photo}
                                  // src={`${
                                  //   import.meta.env.VITE_BACKEND_URL
                                  // }/job-photo/${ele?._id}`}
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

                              {auth?.user?.role === "Admin" && auth?.user?._id === ele?.publishedBy?._id && (
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
                                    <NavLink to={`/apply-for-job/${ele._id}`}>
                                      <button className="btn btn-warning">
                                        Apply Now
                                      </button>
                                    </NavLink>
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

                {showLoadMore && (
                  <>
                    <IoAddCircleOutline
                      style={{
                        display: "block",
                        margin: "auto",
                        cursor: "pointer",
                      }}
                      size={25}
                      onClick={handleLoadMore}
                    />
                  </>
                )}
              </MDBCardBody>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
