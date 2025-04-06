import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import * as XLSX from "xlsx";
import { useUserContext } from "../context/UserContext";
import Swal from "sweetalert2";
const urlBackend = import.meta.env.VITE_URL_BACKEND;

const ListUsers = () => {
  const [tableData, setTableData] = useState([]);
  const navigate = useNavigate();

  const { user, setUser } = useUserContext();

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "aplicacion", headerName: "Aplicacion", width: 150 },
    { field: "dia", headerName: "Dia", width: 120 },
    { field: "hora", headerName: "Hora", width: 120 },
    {
      field: "actions",
      headerName: "Acciones",
      width: 110,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="error"
          size="small"
          onClick={() => handleClickDelete(params.row.id)}
        >
          Eliminar
        </Button>
      ),
    },
  ];

  const handleClickDelete = (id) => {
    console.log("id => ", id);
    Swal.fire({
      title: "¿Está seguro?",
      text: "No podrás revertir esto",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`${urlBackend}/apiBancoCentral/eliminaagenda`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ id: id }),
        })
          .then((response) => {
            if (response.ok) {
              Swal.fire("Eliminado", "El usuario ha sido eliminado", "success");
              setTableData((prevData) =>
                prevData.filter((user) => user.id !== id)
              );
            } else {
              Swal.fire("Error", "No se pudo eliminar el usuario", "error");
            }
          })
          .catch((error) => console.error("Error:", error));
      }
    });
  };

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Tareas");
    XLSX.writeFile(wb, "Tareas.xlsx");
  };

  useEffect(() => {
    let dias = [
      { dia: 0, glosa: "Todos los días" },
      { dia: 2, glosa: "Lunes" },
      { dia: 3, glosa: "Martes" },
      { dia: 4, glosa: "Miércoles" },
      { dia: 5, glosa: "Jueves" },
      { dia: 6, glosa: "Viernes" },
      { dia: 7, glosa: "Sábado" },
      { dia: 1, glosa: "Domingo" },
    ];

    console.log(`${urlBackend}/apiBancoCentral/listTasks/${user.username}`);
    fetch(`${urlBackend}/apiBancoCentral/listTasks/${user.username}`)
      .then((response) => response.json())
      .then((data) => {
        console.log("data => ", data);
        setTableData(
          data.map((e) => ({
            id: e.idTask,
            aplicacion: e.aplicacion,
            dia:
              dias.find((d) => d.dia === parseInt(e.dia))?.glosa ||
              "No definido",
            hora: `${String(e.hora).padStart(2, "0")}:${String(
              e.minuto
            ).padStart(2, "0")}`,
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
