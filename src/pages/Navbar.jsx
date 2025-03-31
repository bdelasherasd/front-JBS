import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { useDevice } from "../context/DeviceContext";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Box,
} from "@mui/material";
import { logout } from "../config/firebase";
import NavbarMobile from "./NavbarMobile";
import NavbarNormal from "./NavbarNormal";

const Navbar = () => {
  const { user, setUser } = useUserContext();
  const { isMobile } = useDevice();
  const handleClick = async () => {
    try {
      let result = await logout();
      setUser(false);
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  };
  const navigate = useNavigate();
  const handleClickAdicionalesUsuario = () => {
    setAnchorEl(null);
    navigate("/dashboard/adicionales-usuario");
  };
  const handleClickRegistrarUsuarios = () => {
    setAnchorEl(null);
    navigate("/dashboard/register");
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClickMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [anchorEl2, setAnchorEl2] = useState(null);
  const open2 = Boolean(anchorEl2);
  const handleClickMenu2 = (event) => {
    setAnchorEl2(event.currentTarget);
  };
  const handleClose2 = () => {
    setAnchorEl2(null);
  };

  if (!isMobile) {
    return (
      <>
        <NavbarNormal />
      </>
    );
  } else {
    return (
      <>
        <NavbarMobile />
      </>
    );
  }
};

export default Navbar;
