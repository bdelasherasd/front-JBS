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

import TareasProgramadas from "../pages/Tareas/Index";

import RpaRossi from "../pages/RpaRossi/Index";

import CargaSku from "../pages/CargaSku/Index";

import Importacion from "../pages/Importacion/Index";
import ImportacionDetalle from "../pages/Importacion/IndexDetalle";
import ImportacionUpdateDetalle from "../pages/Importacion/UpdateDetalle";
import ImportacionInsertDetalle from "../pages/Importacion/InsertDetalle";

import ImportacionUpdatePackingList from "../pages/Importacion/UpdatePackingList";
import ImportacionInsertPackingList from "../pages/Importacion/InsertPackingList";
import UpdateTipoCambioAlternativo from "../pages/Importacion/UpdateTipoCambioAlternativo";

import InformeCostosAduanaIndex from "../pages/InformeCostosAduana/Index";
import InformeDetallesIndex from "../pages/InformeDetalles/Index";

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

          { path: "carga-sku", element: <CargaSku /> },

          { path: "tareas-programadas", element: <TareasProgramadas /> },

          { path: "importacion", element: <Importacion /> },
          { path: "importacion-detalle/:id", element: <ImportacionDetalle /> },
          {
            path: "importacion-update-detalle/:idImportacion/:index",
            element: <ImportacionUpdateDetalle />,
          },
          {
            path: "importacion-insert-detalle/:idImportacion",
            element: <ImportacionInsertDetalle />,
          },

          {
            path: "importacion-update-packing-list/:idImportacion/:index",
            element: <ImportacionUpdatePackingList />,
          },

          {
            path: "importacion-insert-packing-list/:idImportacion",
            element: <ImportacionInsertPackingList />,
          },
          {
            path: "importacion-update-tipo-cambio-alternativo/:idImportacion",
            element: <UpdateTipoCambioAlternativo />,
          },

          {
            path: "informeCostosAduana",
            element: <InformeCostosAduanaIndex />,
          },

          { path: "informeDetalles", element: <InformeDetallesIndex /> },

          {
            path: "register",
            element: <Register />,
          },
        ],
      },
    ],
  },
]);
