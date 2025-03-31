import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { esES } from "@mui/x-data-grid/locales";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";

const urlBackend = import.meta.env.VITE_URL_BACKEND;

const ListRutas = ({ idUsuario }) => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const navigate = useNavigate();

  const columns = [
    { field: "id", headerName: "ID", width: 50 },
    { field: "descripcion", headerName: "Descripcion", width: 200 },
    { field: "ruta", headerName: "Ruta", width: 200 },
    {
      field: "idUsuario",
      headerName: "Usuario",
      width: 50,
    },
  ];

  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(tableData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Aplicaciones");
    XLSX.writeFile(wb, "Aplicaciones.xlsx");
  };

  useEffect(() => {
    fetch(`${urlBackend}/privilegio/listPrivilegios/${idUsuario}`)
      .then((response) => response.json())
      .then((data) => {
        const formattedData = data.map((e) => ({
          id: e.idAplicacion,
          permitido: e.permitido,
          idUsuario: e.idUsuario,
          descripcion: e.descripcion,
          ruta: e.ruta,
        }));

        setTableData(formattedData);

        // Filtrar los IDs con idPrivilegio !== 0 para seleccionarlos automáticamente
        const selectedIds = formattedData
          .filter((row) => row.permitido !== 0)
          .map((row) => row.id);

        setSelectedRows(selectedIds);
      })
      .catch((error) => console.error("Error:", error));
  }, [idUsuario]);

  const handleClickRegistrar = async () => {
    let data = {
      idUsuario: idUsuario,
      aplicaciones: selectedRows,
    };
    try {
      let response = await fetch(`${urlBackend}/privilegio/updatePrivilegio`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let dataResponse = await response.json();
      await Swal.fire({
        icon: "success",
        title: "Privilegios Actualizados",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ width: "90%", mx: "auto", bgcolor: "grey.200", p: 2 }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={handleClickRegistrar}
        sx={{ mb: 2, mr: 2 }}
      >
        Registrar
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
        checkboxSelection
        disableRowSelectionOnClick
        rowSelectionModel={selectedRows} // Aplicar la selección automática
        onRowSelectionModelChange={(newSelection) =>
          setSelectedRows(newSelection)
        }
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
export default ListRutas;
