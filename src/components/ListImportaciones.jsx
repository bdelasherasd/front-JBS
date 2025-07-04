import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import * as XLSX from "xlsx";
const urlBackend = import.meta.env.VITE_URL_BACKEND;

const ListImportaciones = () => {
  const [tableData, setTableData] = useState([]);
  const [paginationModel, setPaginationModel] = useState(() => {
    // Restaurar la página desde localStorage o usar la página 0 por defecto
    const savedPage = localStorage.getItem("importacionesPage");
    return { page: savedPage ? parseInt(savedPage, 10) : 0, pageSize: 10 };
  });

  const navigate = useNavigate();

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "nroDespacho", headerName: "Despacho", width: 90 },
    { field: "tipoTransporte", headerName: "Transporte", width: 90 },
    { field: "proveedor", headerName: "Proveedor", width: 200 },
    { field: "refCliente", headerName: "Referencia", width: 100 },
    { field: "fechaCreacion", headerName: "Fecha", width: 100 },
    {
      field: "valido",
      headerName: "Validación",
      width: 100,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Con Errores" ? "red" : "inherit",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "estado",
      headerName: "Estado",
      width: 100,
      renderCell: (params) => (
        <span
          style={{
            color: params.value === "Aprobado" ? "green" : "inherit",
          }}
        >
          {params.value}
        </span>
      ),
    },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() =>
            navigate(`/dashboard/importacion-detalle/${params.row.id}`)
          }
        >
          Editar
        </Button>
      ),
    },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Importaciones");
    XLSX.writeFile(wb, "Importaciones.xlsx");
  };

  useEffect(() => {
    fetch(`${urlBackend}/importaciones/listImportaciones`)
      .then((response) => response.json())
      .then((data) => {
        setTableData(
          data.map((e) => ({
            id: e.idImportacion,
            nroDespacho: e.nroDespacho,
            tipoTransporte: e.tipoTranporte,
            proveedor: e.proveedor,
            refCliente: e.refCliente,
            fechaCreacion: e.fechaCreacion,
            valido: e.valido ? "Valido" : "Con Errores",
            estado: e.estado,
          }))
        );
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  const handlePaginationChange = (model) => {
    setPaginationModel(model);
    localStorage.setItem("importacionesPage", model.page); // Guardar la página actual
  };

  return (
    <Box sx={{ width: "90%", mx: "auto", bgcolor: "grey.200", p: 2 }}>
      <Button
        variant="contained"
        color="primary"
        onClick={exportToExcel}
        sx={{ mb: 2 }}
      >
        Exportar a Excel
      </Button>
      <DataGrid
        rows={tableData}
        columns={columns}
        density="compact"
        autoHeight
        paginationModel={paginationModel} // Vincular el modelo de paginación
        onPaginationModelChange={handlePaginationChange} // Manejar cambios de paginación
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20]}
        localeText={esES.components.MuiDataGrid.defaultProps.localeText}
        sx={{
          minWidth: "100%",
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "primary.light",
            fontSize: 14,
          },
          "& .MuiDataGrid-cell": { fontSize: 12 },
        }}
      />
    </Box>
  );
};
export default ListImportaciones;
