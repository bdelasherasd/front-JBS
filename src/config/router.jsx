import { createBrowserRouter } from "react-router-dom";

import RootLayout from "../layout/RootLayout";
import PrivateLayout from "../layout/PrivateLayout";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Recover from "../pages/Recover";
import Dashboard from "../pages/Dashboard";

import AdicionalesUsuarioIndex from "../pages/AdicionalesUsuario/Index";
import AdicionalesUsuarioUpdate from "../pages/AdicionalesUsuario/Update";

import Aplicaciones from "../pages/Aplicaciones/Index";
import AplicacionesUpdate from "../pages/Aplicaciones/Update";
import AplicacionesNew from "../pages/Aplicaciones/New";
import AplicacionesDelete from "../pages/Aplicaciones/Delete";

import PrivilegiosIndex from "../pages/Privilegios/Index";

import ApiBancoCentral from "../pages/ApiBancoCentral/Index";

import RpaRossi from "../pages/RpaRossi/Index";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
      { path: "recover", element: <Recover /> },
      {
        path: "dashboard",
        element: <PrivateLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
          { path: "adicionales-usuario", element: <AdicionalesUsuarioIndex /> },
          { path: "usuario-update/:id", element: <AdicionalesUsuarioUpdate /> },

          { path: "aplicacion", element: <Aplicaciones /> },
          { path: "aplicacion-update/:id", element: <AplicacionesUpdate /> },
          { path: "aplicacion-new", element: <AplicacionesNew /> },
          { path: "aplicacion-delete/:id", element: <AplicacionesDelete /> },

          { path: "privilegios", element: <PrivilegiosIndex /> },

          { path: "api-banco-central", element: <ApiBancoCentral /> },

          { path: "rpa-rossi", element: <RpaRossi /> },

          {
            path: "register",
            element: <Register />,
          },
        ],
      },
    ],
  },
]);
