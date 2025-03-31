import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { logout } from "../config/firebase";

const NavbarNormal = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Para manejar el submenú
  const { user, setUser } = useUserContext();

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

  const handleClickAplicaciones = () => {
    //setAnchorEl(null);
    navigate("/dashboard/aplicacion");
  };

  const handleClickPrivilegios = () => {
    //setAnchorEl(null);
    navigate("/dashboard/privilegios");
  };

  const handleClickRegistrarUsuarios = () => {
    //setAnchorEl(null);
    navigate("/dashboard/register");
  };

  return (
    <>
      <header
        id="header"
        className="header d-flex align-items-center sticky-top"
      >
        <div className="container position-relative d-flex align-items-center bg-body-secondary p-3 rounded mt-3">
          <a href="#" className="logo d-flex align-items-center me-auto">
            <h3 className="sitename">JBS Chile</h3>
            <span>.</span>
          </a>

          <nav id="navmenu" className="navmenu">
            <ul>
              <li className="dropdown">
                <a href="#">
                  <span>Importaciones</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  <li>
                    <a href="#" onClick={handleClickAplicaciones}>
                      Agenda API Banco Central
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickPrivilegios}>
                      Robot Agencia Rossi
                    </a>
                  </li>
                </ul>
              </li>

              <li className="dropdown">
                <a href="#">
                  <span>Administracion</span>{" "}
                  <i className="bi bi-chevron-down toggle-dropdown"></i>
                </a>
                <ul>
                  <li>
                    <a href="#" onClick={handleClickAplicaciones}>
                      Aplicaciones
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickPrivilegios}>
                      Privilegios
                    </a>
                  </li>
                  <li className="dropdown">
                    <a href="#">
                      <span>Usuarios</span>{" "}
                      <i className="bi bi-chevron-down toggle-dropdown"></i>
                    </a>
                    <ul>
                      <li>
                        <a href="#" onClick={handleClickRegistrarUsuarios}>
                          Registro
                        </a>
                      </li>
                      <li>
                        <a href="#" onClick={handleClickAdicionalesUsuario}>
                          Modificación
                        </a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </li>

              <li>
                <a href="#" className="active" onClick={handleClick}>
                  Logout
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </header>
      <link href="../src/assets/css/main.css" rel="stylesheet"></link>
    </>
  );
};
export default NavbarNormal;
