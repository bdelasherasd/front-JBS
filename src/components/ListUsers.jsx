import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import * as XLSX from "xlsx";
const urlBackend = import.meta.env.VITE_URL_BACKEND;

const ListUsers = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "email", headerName: "Correo", width: 150 },
    { field: "nombre", headerName: "Nombre", width: 120 },
    { field: "username", headerName: "Usuario", width: 120 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 100,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => navigate(`/dashboard/usuario-update/${params.row.id}`)}
        >
          Editar
        </Button>
      ),
    },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Usuarios");
    XLSX.writeFile(wb, "Usuarios.xlsx");
  };

  useEffect(() => {
    fetch(`${urlBackend}/usuario/listUsers`)
      .then((response) => response.json())
      .then((data) => {
        setTableData(
          data.map((user) => ({
            id: user.idUsuario,
            email: user.email,
            nombre: user.nombre,
            username: user.username,
          }))
        );
      })
      .catch((error) => console.error("Error:", error));
  }, []);

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
export default ListUsers;
