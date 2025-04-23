import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Button,
  Box,
  Paper,
  Container,
  TextField,
  List,
  Modal,
  Grid,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableSortLabel,
  TablePagination,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const IndexDetalle = () => {
  const id = useParams().id;

  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  const navigate = useNavigate();

  const [gastosData, setGastosData] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [desembolsos, setDesembolsos] = useState([]);

  const [tableDetalle, setTableDetalle] = useState([]);
  const [tablePacking, setTablePacking] = useState([]);

  const [nroDespacho, setNroDespacho] = useState("");
  const [nroRefer, setNroRefer] = useState("");
  const [fecha, setFecha] = useState("");
  const [proveedor, setProveedor] = useState("");
  useEffect(() => {
    const fetchData = async () => {
      try {
        let responseImp = await fetch(
          `${ip}:${port}/importaciones/getImport/${id}`
        );
        let dataImp = await responseImp.json();
        setNroDespacho(dataImp.nroDespacho);
        setNroRefer(dataImp.refCliente);
        setFecha(dataImp.fechaETA);
        setProveedor(dataImp.proveedor);

        let response = await fetch(
          `${ip}:${port}/importaciones/listGastosAgencia/${id}`
        );
        let data = await response.json();
        setGastosData(data);
        setGastos(JSON.parse(data.gastosAgencia));
        setDesembolsos(JSON.parse(data.desembolsosAgencia));

        let response2 = await fetch(
          `${ip}:${port}/importaciones/listAdicionales/${id}`
        );
        let data2 = await response2.json();
        setTableDetalle(JSON.parse(data2.detalles));
        setTablePacking(JSON.parse(data2.packingList));
      } catch (error) {
        console.error("Error fetching data:", error);
        //navigate("/error");
      }
    };

    fetchData();
  }, []);

  const handleClickRegresar = () => {
    navigate("/dashboard/importacion");
  };

  const handleClickModificaDetalle = (index) => {
    navigate(`/dashboard/importacion-update-detalle/${id}/${index}`);
  };

  const handleClickInsertarDetalle = () => {
    navigate(`/dashboard/importacion-insert-detalle/${id}`);
  };

  const handleClickEliminarDetalle = async (index) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea eliminar este detalle?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let data = {
          idImportacion: id,
          index: index,
        };
        let response = await fetch(
          `${ip}:${port}/importaciones/deleteDetalles`,
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        let response2 = await fetch(
          `${ip}:${port}/importaciones/listAdicionales/${id}`
        );
        let data2 = await response2.json();
        setTableDetalle(JSON.parse(data2.detalles));

        Swal.fire("Eliminado", "El detalle ha sido eliminado", "success");
      }
    });
  };

  const handleClickDownloadPdf = async () => {
    const datafetch = await fetch(
      `${ip}:${port}/importaciones/getImportacion/${id}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const datafetch2 = await datafetch.json();
    window.open(`${ip}:${port}/pdfs/${datafetch2.nombreArchivo}`, "_blank");
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          p: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 4,
          mt: 2,
          mb: 2,
        }}
      >
        <Typography variant="h6" gutterBottom>
          Importación{" "}
          {nroDespacho +
            " - Referencia " +
            nroRefer +
            " - Fecha " +
            fecha +
            " - " +
            proveedor}
        </Typography>
        <Button
          variant="contained"
          color="info"
          size="small"
          sx={{ ml: 2, mb: 1 }}
          onClick={handleClickDownloadPdf}
        >
          pdf original
        </Button>

        <Box
          sx={{
            p: 4,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 3,
            mt: 2,
          }}
        >
          <Box
            display="flex"
            gap={4}
            flexWrap="wrap"
            justifyContent="space-between"
          >
            <Box>
              <Typography variant="body2" color="textSecondary">
                Mercadería
              </Typography>
              <Typography variant="body1">{gastosData.mercaderia}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary">
                Bultos
              </Typography>
              <Typography variant="body1">{gastosData.bultos}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary">
                Tipo de Cambio
              </Typography>
              <Typography variant="body1">{gastosData.tipocambio}</Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary">
                Valor CIF
              </Typography>
              <Typography variant="body1">
                {gastosData.monedaCif + " "}
                {gastosData.valorCif}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="textSecondary">
                IVA GCP
              </Typography>
              <Typography variant="body1">
                {gastosData.MonedaIvaGcp + " "}
                {gastosData.valorIvaGcp}
              </Typography>
            </Box>
          </Box>

          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={4}
            sx={{ mt: 2 }}
          >
            <Box flex={1}>
              <Typography variant="h10">
                Gastos de Agencia (Valores Netos Afectos a IVA)
              </Typography>
              <Paper variant="outlined">
                <Table
                  size="small"
                  sx={{ fontSize: "0.875rem" }}
                  display="flex"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre Gasto</TableCell>
                      <TableCell>Moneda</TableCell>
                      <TableCell>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {gastos.map((gasto, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="caption">
                            {gasto.nombreGasto}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {gasto.moneda}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption">
                            {gasto.valor}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>

            <Box flex={1}>
              <Typography variant="h10">Desembolsos de Agencia</Typography>
              <Paper variant="outlined">
                <Table
                  size="small"
                  sx={{ fontSize: "0.875rem" }}
                  display="flex"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Nombre Gasto</TableCell>
                      <TableCell>Moneda</TableCell>
                      <TableCell>Valor</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {desembolsos.map((gasto, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="caption">
                            {gasto.nombreGasto}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {gasto.moneda}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption">
                            {gasto.valor}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </Box>

          <Box
            sx={{
              p: 4,
              bgcolor: "background.paper",
              borderRadius: 2,
              boxShadow: 3,
              mt: 2,
            }}
          >
            <Box flex={1}>
              <Typography variant="h10">Detalle</Typography>
              <Button
                variant="contained"
                color="info"
                size="small"
                sx={{ ml: 2, mb: 1 }}
                onClick={handleClickInsertarDetalle}
              >
                +
              </Button>
              <Paper variant="outlined">
                <Table
                  size="small"
                  sx={{ fontSize: "0.875rem" }}
                  display="flex"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Codigo</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableDetalle.map((e, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography
                            variant="caption"
                            sx={{
                              color: e.codigoInvalido ? "red" : "inherit",
                            }}
                          >
                            {e.codigo}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Typography variant="caption">
                            {e.cantidad}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption">{e.valor}</Typography>
                        </TableCell>

                        <TableCell>
                          <>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              sx={{ mt: 0 }}
                              onClick={() => handleClickModificaDetalle(index)}
                            >
                              Modificar
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{ ml: 2 }}
                              onClick={() => handleClickEliminarDetalle(index)}
                            >
                              Eliminar
                            </Button>
                          </>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>

            <Box flex={1} sx={{ mt: 3 }}>
              <Typography variant="h10">Packing List</Typography>
              <Button
                variant="contained"
                color="info"
                size="small"
                sx={{ ml: 2, mb: 1 }}
                onClick={handleClickRegresar}
              >
                +
              </Button>
              <Paper variant="outlined">
                <Table
                  size="small"
                  sx={{ fontSize: "0.875rem" }}
                  display="flex"
                >
                  <TableHead>
                    <TableRow>
                      <TableCell>Descripcion</TableCell>
                      <TableCell>SIF</TableCell>
                      <TableCell>Vencimiento</TableCell>
                      <TableCell>Cajas Pallet</TableCell>
                      <TableCell>Peso Neto</TableCell>
                      <TableCell>Peso Bruto</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tablePacking.map((e, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <Typography variant="caption">
                            {e.descripcion.substring(0, 20)}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption">{e.sif}</Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption">
                            {e.fechaVencimiento}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption">
                            {e.CajasPallet}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption">
                            {e.PesoNeto}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Typography variant="caption">
                            {e.PesoBruto}
                          </Typography>
                        </TableCell>

                        <TableCell>
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            sx={{ mt: 0 }}
                            onClick={handleClickRegresar}
                          >
                            Modificar
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            size="small"
                            sx={{ ml: 2 }}
                            onClick={handleClickRegresar}
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Paper>
            </Box>
          </Box>
        </Box>

        <Button
          variant="contained"
          color="secondary"
          sx={{ mt: 2 }}
          onClick={handleClickRegresar}
        >
          Regresar
        </Button>
      </Box>
    </Container>
  );
};

export default IndexDetalle;
