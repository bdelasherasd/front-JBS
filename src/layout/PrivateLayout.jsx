import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import Navbar from "../pages/Navbar";
import Swal from "sweetalert2";

const Private = () => {
  const { user, rutasPermitidas, rutasControladas } = useUserContext();
  const location = useLocation();
  const isAllowed = rutasPermitidas.includes(location.pathname);
  const isControled = rutasControladas.includes(location.pathname);

  if (user.username === "admin") {
    return (
      <>
        <Navbar />
        <Outlet />
      </>
    );
  }

  if (user) {
    if (isAllowed || !isControled) {
      return (
        <>
          <Navbar />
          <Outlet />
        </>
      );
    } else {
      Swal.fire({
        title: "No Autorizado",
        text: "No tiene permisos para acceder a esta ruta",
        icon: "error",
      });
      return <Navigate to="/dashboard" />;
    }
  } else {
    return <Navigate to="/" />;
  }
};

export default Private;
