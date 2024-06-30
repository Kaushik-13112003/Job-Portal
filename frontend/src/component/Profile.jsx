import React, { useEffect } from "react";
import {
  MDBCol,
  MDBContainer,
  MDBRow,
  MDBCard,
  MDBCardText,
  MDBCardBody,
  MDBCardImage,
  MDBTypography,
  MDBIcon,
} from "mdb-react-ui-kit";
import LayoutFile from "./LayoutFile";
import { useGlobalContext } from "../context/context";
import { FiEdit } from "react-icons/fi";
import { NavLink } from "react-router-dom";

export default function PersonalProfile() {
  const { auth } = useGlobalContext();

  return (
    <section className="vh-100">
      <LayoutFile />
      <MDBContainer className="py-5 ">
        <MDBRow className="justify-content-center align-items-center h-100">
          <MDBCol lg="6" className="mb-4 mb-lg-0">
            <MDBCard className="mb-3" style={{ borderRadius: ".5rem" }}>
              <MDBRow className="g-0">
                <MDBCol
                  md="4"
                  className="gradient-custom text-center text-white bg-body-secondary"
                  style={{
                    borderTopLeftRadius: ".5rem",
                    borderBottomLeftRadius: ".5rem",
                  }}
                >
                  <MDBCardImage
                    // src={`${import.meta.env.VITE_BACKEND_URL}/user-photo/${
                    //   auth?.user?._id
                    // }`}
                    src={auth?.user?.photo}
                    alt="Avatar"
                    className="my-3 "
                    style={{
                      width: "150px",
                      height: "150px",
                      borderRadius: "10px",
                    }}
                    fluid
                  />

                  <NavLink
                    className={"nav-link"}
                    to={`/update-user/${auth?.user?._id}`}
                  >
                    <FiEdit
                      id="edit"
                      style={{
                        position: "absolute",
                        bottom: 80,
                        left: "80px",
                        fontSize: "24px",
                        cursor: "pointer",
                      }}
                    />
                  </NavLink>
                </MDBCol>
                <MDBCol md="8">
                  <MDBCardBody className="p-4">
                    <MDBCol size="" className="mb-3">
                      <MDBTypography tag="h6">Name</MDBTypography>
                      <MDBCardText className="text-muted">
                        {auth?.user?.name}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol size="" className="mb-3">
                      <MDBTypography tag="h6">Email</MDBTypography>
                      <MDBCardText className="text-muted">
                        {auth?.user?.email}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol size="" className="mb-3">
                      <MDBTypography tag="h6">Phone</MDBTypography>
                      <MDBCardText className="text-muted">
                        {auth?.user?.phone}
                      </MDBCardText>
                    </MDBCol>
                    <MDBCol size="" className="">
                      <MDBTypography tag="h6">Role</MDBTypography>
                      <MDBCardText className="text-muted">
                        {auth?.user?.role}
                      </MDBCardText>
                    </MDBCol>
                  </MDBCardBody>
                </MDBCol>
              </MDBRow>
            </MDBCard>
          </MDBCol>
        </MDBRow>
      </MDBContainer>
    </section>
  );
}
