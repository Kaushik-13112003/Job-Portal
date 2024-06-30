import React from "react";
import GitHubIcon from "@mui/icons-material/GitHub";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";
import { NavLink } from "react-router-dom";
import { FaLinkedinIn } from "react-icons/fa";

const Footer = () => {
  let cuurentYear = new Date().getFullYear();
  return (
    <>
      <footer className="bg-danger text-white p-2">
        <div className="icons">
          <NavLink
            to="https://www.instagram.com/_kaushikprajapati?igsh=MXFrY3Q5dDlicGNreg=="
            target="_blank"
            className={"nav-link iconColor"}
          >
            <div>
              <InstagramIcon />
            </div>
          </NavLink>

          <NavLink
            to="https://www.linkedin.com/in/kaushik-prajapati-0a258b27a?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
            target="_blank"
            className={"nav-link iconColor"}
          >
            <div>
              <FaLinkedinIn />
            </div>
          </NavLink>

          <NavLink
            to="https://github.com/Kaushik-13112003"
            target="_blank"
            className={"nav-link iconColor"}
          >
            <div>
              <GitHubIcon />
            </div>
          </NavLink>
        </div>
        <div className="footerText">
          copyright &copy; {cuurentYear} JobPortal All rights reserved
        </div>
      </footer>
    </>
  );
};

export default Footer;
