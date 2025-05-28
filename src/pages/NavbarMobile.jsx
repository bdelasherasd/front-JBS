import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Navbar, Nav, Container, NavDropdown } from "react-bootstrap";
import "../assets/vendor/bootstrap/css/bootstrap.min.css";
import { logout } from "../config/firebase";
import { useUserContext } from "../context/UserContext";

const NavbarMobile = () => {
  const [showSubmenu, setShowSubmenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false); // Controla si el dropdown principal está abierto
  const [showDropdownImportaciones, setShowDropdownImportaciones] =
    useState(false); // Controla si el dropdown principal está abierto
  const { user, setUser } = useUserContext();

  const toggleSubmenu = (e) => {
    e.preventDefault(); // Evita que el enlace provoque un comportamiento inesperado
    e.stopPropagation(); // Evita que el menú principal se cierre
    setShowSubmenu(!showSubmenu);
  };

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
    //setAnchorEl(null);
    navigate("/dashboard/adicionales-usuario");
  };

  const handleClickRegistrarUsuarios = () => {
    //setAnchorEl(null);
    navigate("/dashboard/register");
  };

  const handleClickAplicaciones = () => {
    //setAnchorEl(null);
    navigate("/dashboard/aplicacion");
  };

  const handleClickPrivilegios = () => {
    //setAnchorEl(null);
    navigate("/dashboard/privilegios");
  };

  const handleClickApiBAncoCentral = () => {
    //setAnchorEl(null);
    navigate("/dashboard/api-banco-central");
  };

  const handleClickRpaRossi = () => {
    //setAnchorEl(null);
    navigate("/dashboard/rpa-rossi");
  };

  const handleClickTareasProgramadas = () => {
    //setAnchorEl(null);
    navigate("/dashboard/tareas-programadas");
  };

  const handleClickCargaSku = () => {
    //setAnchorEl(null);
    navigate("/dashboard/carga-sku");
  };

  const handleClickImportacion = () => {
    //setAnchorEl(null);
    localStorage.setItem("importacionesPage", 0);
    navigate("/dashboard/importacion");
  };

  const handleClickInformeCostosAduana = () => {
    //setAnchorEl(null);
    navigate("/dashboard/informeCostosAduana");
  };

  return (
    <Navbar expand="lg" bg="dark" variant="dark" className="px-3">
      <Container>
        <Navbar.Brand href="#">JBS Chile</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <NavDropdown
              title="Administracion"
              id="nav-dropdown"
              show={showDropdown} // Controla si el menú principal está abierto
              onMouseEnter={() => setShowDropdown(true)}
              onMouseLeave={() => setShowDropdown(false)}
            >
              <NavDropdown.Item href="#" onClick={handleClickAplicaciones}>
                Aplicaciones
              </NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={handleClickPrivilegios}>
                Privilegios
              </NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={handleClickTareasProgramadas}>
                Tareas Programadas
              </NavDropdown.Item>
              <NavDropdown.Divider />

              {/* Botón para desplegar el submenú */}
              <NavDropdown.Item
                onClick={toggleSubmenu}
                className="d-flex justify-content-between"
              >
                Usuarios <span>{showSubmenu ? "▲" : "▼"}</span>
              </NavDropdown.Item>

              {/* Submenú anidado */}
              {showSubmenu && (
                <div
                  className="dropdown-menu show position-static"
                  onClick={(e) => e.stopPropagation()}
                >
                  <NavDropdown.Item
                    href="#"
                    onClick={handleClickRegistrarUsuarios}
                  >
                    Registro
                  </NavDropdown.Item>
                  <NavDropdown.Item
                    href="#"
                    onClick={handleClickAdicionalesUsuario}
                  >
                    Modificación
                  </NavDropdown.Item>
                </div>
              )}
            </NavDropdown>

            <NavDropdown
              title="Importaciones"
              id="nav-dropdown"
              show={showDropdownImportaciones} // Controla si el menú principal está abierto
              onMouseEnter={() => setShowDropdownImportaciones(true)}
              onMouseLeave={() => setShowDropdownImportaciones(false)}
            >
              <NavDropdown.Item href="#" onClick={handleClickApiBAncoCentral}>
                Agenda API Banco Central
              </NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={handleClickRpaRossi}>
                Robot Agencia Rossi
              </NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={handleClickCargaSku}>
                Carga SKU
              </NavDropdown.Item>
              <NavDropdown.Item href="#" onClick={handleClickImportacion}>
                Importaciones
              </NavDropdown.Item>
              <NavDropdown.Item
                href="#"
                onClick={handleClickInformeCostosAduana}
              >
                Informe de Costos Aduana
              </NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="#" onClick={handleClick}>
              Logout
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavbarMobile;
