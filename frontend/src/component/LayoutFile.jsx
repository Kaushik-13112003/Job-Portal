import * as React from "react";
import PropTypes from "prop-types";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { Link, NavLink } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import SearchIcon from "@mui/icons-material/Search";
import { useSaveContext } from "../context/SaveContext";
import { IoIosMoon } from "react-icons/io";
import { IoIosSunny } from "react-icons/io";

const drawerWidth = 240;

function DrawerAppBar(props) {
  const { auth } = useGlobalContext();
  const { saveJob } = useSaveContext();
  const [mode, setMode] = React.useState(false);

  const handleMode = () => {
    const newMode = !mode;
    document.body.style.background = "#e5e6f3";
    document.body.style.color = "black";
    setMode(newMode);
    localStorage.setItem("mode", newMode ? true : false);
  };

  const handleMode2 = () => {
    const newMode = !mode;
    document.body.style.background = "white";
    document.body.style.color = "black";
    setMode(newMode);
    localStorage.setItem("mode", newMode ? true : false);
  };

  const navItems =
    auth?.user?.role === "Admin"
      ? [
          { label: "Jobs", path: "/jobs" },
          { label: "Create Job", path: "/create-job" },
          { label: "Manage Job", path: "/manage-job" },
          { label: "Applicantions", path: "/applications" },
          { label: "Profile", path: "/profile" },
          { label: "Home", path: "/" },
        ]
      : [
          { label: "Jobs", path: "/jobs" },
          { label: "My Jobs", path: "/my-jobs" },
          {
            label: `Intrested ${`${saveJob.length}`}`,
            path: "/saved-jobs",
          },
          { label: "Profile", path: "/profile" },
          { label: "Home", path: "/" },
        ];

  // const navItems2 = [
  //   { label: "Jobs", path: "/jobs" },
  //   { label: "Profile", path: "/profile" },
  //   { label: "Home", path: "/" },
  // ];
  // auth?.role === "Admin" && navItems;
  // auth?.role === "Student" && navItems2;
  const { window } = props;
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen((prevState) => !prevState);
  };

  React.useEffect(() => {
    const storedMode = localStorage.getItem("mode");
    if (storedMode === "true") {
      // If stored mode is "true", meaning dark mode is enabled
      setMode(true);
      document.body.style.background = "#e5e6f3"; // Set background color for dark mode
      document.body.style.color = "black"; // Set background color for dark mode
    } else {
      // If stored mode is not "true", set to light mode
      setMode(false);
      document.body.style.background = "white"; // Set background color for light mode
      document.body.style.color = "black";
    }
  }, []);
  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        <NavLink to="/" className={"nav-link"}>
          Job{" "}
          <SearchIcon className="text-danger" style={{ cursor: "pointer" }} />
        </NavLink>
        <hr />
      </Typography>
      <Divider />
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              sx={{ textAlign: "center" }}
              component={Link}
              to={item.path}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {mode ? (
        <IoIosMoon className="lightDark" onClick={handleMode2} />
      ) : (
        <IoIosSunny className="lightDark" onClick={handleMode} />
      )}{" "}
    </Box>
  );

  const container =
    window !== undefined ? () => window().document.body : undefined;

  return (
    <Box sx={{ display: "flex", marginBottom: "100px" }}>
      <CssBaseline />
      <AppBar component="nav">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: "none" } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, display: { xs: "none", sm: "block" } }}
          >
            <NavLink to="/" className={"nav-link"}>
              Job{" "}
              <SearchIcon
                className="text-warning"
                style={{ cursor: "pointer" }}
                id="searchIcon"
              />
            </NavLink>{" "}
          </Typography>
          <Box sx={{ display: { xs: "none", sm: "block" } }}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                sx={{ color: "#fff" }}
                component={Link}
                to={item.path}
              >
                {item.label === `Intrested ${saveJob.length}` ? (
                  <span className="text-warning">{item.label}</span>
                ) : (
                  item.label
                )}
              </Button>
            ))}
            {/* <Button sx={{ color: "#fff" }}>{"kkk"}</Button> */}(
            <>
              {mode ? (
                <IoIosMoon className="lightDark" onClick={handleMode2} />
              ) : (
                <IoIosSunny className="lightDark" onClick={handleMode} />
              )}
            </>
            )
          </Box>
        </Toolbar>
      </AppBar>
      <nav>
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", sm: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </nav>
    </Box>
  );
}

DrawerAppBar.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * You won't need it on your project.
   */
  window: PropTypes.func,
};

export default DrawerAppBar;
