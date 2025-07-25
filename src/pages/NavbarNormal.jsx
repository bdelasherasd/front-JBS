import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { logout } from "../config/firebase";
import logo from "../assets/JBS nuevo.png";

const NavbarNormal = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false); // Para manejar el submenú
  const { user, setUser } = useUserContext();

  const [usuario, setUsuario] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const storedUser = sessionStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          setUsuario(parsedUser.email || "Usuario");
        } else {
          setUsuario("Usuario no autenticado");
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      }
    };
    fetchData();
  }, []);

  const handleClick = async () => {
    try {
      let result = await logout();
      setUser(false);
      sessionStorage.clear();
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

  const handleClickApiBancoCentral = () => {
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

  const handleClickInformeDetalles = () => {
    //setAnchorEl(null);
    navigate("/dashboard/informeDetalles");
  };

  const handleClickNotificaProceso = () => {
    //setAnchorEl(null);
    navigate("/dashboard/notifica-proceso");
  };

  const handleClickInformeAprobados = () => {
    //setAnchorEl(null);
    navigate("/dashboard/informeAprobados");
  };

  const handleClickGeneraSoftland = () => {
    //setAnchorEl(null);
    navigate("/dashboard/genera-softland");
  };

  const handleClickCargaProveedores = () => {
    //setAnchorEl(null);
    navigate("/dashboard/carga-proveedores");
  };

  return (
    <>
      <header
        id="header"
        className="header d-flex align-items-center sticky-top"
      >
        <div className="container position-relative d-flex align-items-center bg-body-secondary p-2 rounded">
          <a href="#" className="logo d-flex align-items-center me-auto">
            <table>
              <tbody>
                <tr>
                  <td>
                    <img src={logo} alt="Logo" width="50%" height="100%" />
                  </td>
                </tr>
                <tr>
                  <td>
                    <span
                      style={{
                        fontSize: "0.8rem",
                        marginLeft: "5px",
                        color: "#000",
                        fontWeight: "normal",
                      }}
                    >
                      {usuario}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
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
                    <a href="#" onClick={handleClickApiBancoCentral}>
                      Agenda API Banco Central
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickRpaRossi}>
                      Robot Agencia Rossi
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickCargaSku}>
                      Carga SKU
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickCargaProveedores}>
                      Carga Proveedores
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickImportacion}>
                      Importaciones
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickInformeCostosAduana}>
                      Informe de Costos Aduana
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickInformeDetalles}>
                      Informe de Detalles de Importación
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickInformeAprobados}>
                      Informe de Aprobados
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickNotificaProceso}>
                      Agenda Notificador de Proceso
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={handleClickGeneraSoftland}>
                      Genera Excel Guias de Entrada Softland
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

                  <li>
                    <a href="#" onClick={handleClickTareasProgramadas}>
                      Tareas Programadas
                    </a>
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
