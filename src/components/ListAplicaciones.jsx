import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import * as XLSX from "xlsx";
const urlBackend = import.meta.env.VITE_URL_BACKEND;

const ListAplicaciones = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "descripcion", headerName: "Descripcion", width: 200 },
    { field: "ruta", headerName: "Ruta", width: 200 },
    {
      field: "update",
      headerName: "",
      align: "center",
      width: 90,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() =>
            navigate(`/dashboard/aplicacion-update/${params.row.id}`)
          }
        >
          Editar
        </Button>
      ),
    },
    {
      field: "delete",
      headerName: "",
      align: "center",
      width: 110,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() =>
            navigate(`/dashboard/aplicacion-delete/${params.row.id}`)
          }
        >
          Eliminar
        </Button>
      ),
    },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Aplicaciones");
    XLSX.writeFile(wb, "Aplicaciones.xlsx");
  };

  const handleClickNuevaAplicacion = () => {
    navigate("/dashboard/aplicacion-new");
  };

  useEffect(() => {
    fetch(`${urlBackend}/aplicacion/listAplicaciones`)
      .then((response) => response.json())
      .then((data) => {
        setTableData(
          data.map((e) => ({
            id: e.idAplicacion,
            descripcion: e.descripcion,
            ruta: e.ruta,
          }))
        );
      })
      .catch((error) => console.error("Error:", error));
  }, []);

  return (
    <Box sx={{ width: "90%", mx: "auto", bgcolor: "grey.200", p: 2 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClickNuevaAplicacion}
        sx={{ mb: 2, mr: 2 }}
      >
        Nueva Aplicacion
      </Button>
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
        initialState={{
          pagination: {
            paginationModel: { pageSize: 10 },
          },
        }}
        pageSizeOptions={[10, 20, 50]}
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
export default ListAplicaciones;
