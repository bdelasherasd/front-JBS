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
import { useUserContext } from "../../context/UserContext";
import * as XLSX from "xlsx";

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
  const [estado, setEstado] = useState("");
  const [valido, setValido] = useState("");
  const [usuario, setUsuario] = useState("");
  const [tipoCambioAlternativo, setTipoCambioAlternativo] = useState("");

  const [totalCantidad, setTotalCantidad] = useState(0);
  const [totalPeso, setTotalPeso] = useState(0);
  const [totalValor, setTotalValor] = useState(0);

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
        setTipoCambioAlternativo(dataImp.tipoCambioAlternativo);

        let dataUser = sessionStorage.getItem("user");
        if (dataUser) {
          let user = JSON.parse(dataUser);
          setUsuario(user.nombre);
        }

        if (dataImp.estado === "0") {
          setEstado("Ingresado");
        } else if (dataImp.estado === "1") {
          setEstado("Aprobado");
        }

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
        setValido(true);
        let data2 = await response2.json();
        setTableDetalle(JSON.parse(data2.detalles || "[]"));
        let tabla = JSON.parse(data2.detalles || "[]");
        setTotalCantidad(0);
        setTotalPeso(0);
        setTotalValor(0);
        for (let [index, detalle] of tabla.entries()) {
          if (
            detalle.codigoInvalido ||
            detalle.cantidadInvalida ||
            detalle.valorInvalido ||
            detalle.peso === "0"
          ) {
            setValido(false);
          }
          setTotalCantidad((prev) => prev + parseFloat(detalle.cantidad || 0));
          setTotalPeso((prev) => prev + parseFloat(detalle.peso || 0));
          setTotalValor((prev) => prev + parseFloat(detalle.valor || 0));
        }
        setTotalCantidad((prev) => prev.toFixed(2));
        setTotalPeso((prev) => prev.toFixed(2));
        setTotalValor((prev) => prev.toFixed(2));
        if (tabla.length === 0) {
          setValido(false);
        }

        setTablePacking(JSON.parse(data2.packingList || "[]"));
        tabla = JSON.parse(data2.packingList || "[]");
        for (let [index, packing] of tabla.entries()) {
          if (
            packing.vencimientoInvalido ||
            packing.pesonetoInvalido ||
            packing.pesobrutoInvalido
          ) {
            setValido(false);
          }
        }

        if (tabla.length === 0) {
          setValido(false);
        }
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

  const handleClickUpdatePackingList = (index) => {
    navigate(`/dashboard/importacion-update-packing-list/${id}/${index}`);
  };

  const handleClickInsertPackingList = () => {
    navigate(`/dashboard/importacion-insert-packing-list/${id}`);
  };

  const handleClickDeletePackingList = async (index) => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea eliminar este detalle de Packing List?",
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
          `${ip}:${port}/importaciones/deletePackingList`,
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
        setTablePacking(JSON.parse(data2.packingList || "[]"));

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

  const handleClickDownloadPdfUyD = async () => {
    const datafetch = await fetch(
      `${ip}:${port}/importaciones/getImportacionUyD/${id}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    const datafetch2 = await datafetch.json();
    if (datafetch2.nombreArchivoUyD && datafetch2.nombreArchivoUyD !== "") {
      window.open(
        `${ip}:${port}/pdfs/${datafetch2.nombreArchivoUyD}`,
        "_blank"
      );
    }
  };

  const handleClickDownloadExcel = async () => {
    try {
      let response = await fetch(
        `${ip}:${port}/informeAprobados/list/2025/2025-01-01/2025-01-31/${nroDespacho}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let dataResponse = await response.json();

      if (dataResponse.length === 0) {
        return Swal.fire({
          icon: "info",
          title: "No hay datos disponibles",
          text: "No se encontraron registros para los filtros seleccionados.",
        });
      }

      const ws = XLSX.utils.json_to_sheet(dataResponse);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Detalles");
      XLSX.writeFile(wb, `Detalles_${nroDespacho}.xlsx`);

      let response2 = await fetch(
        `${ip}:${port}/informeAprobadosModificaExcel/list/2025/2025-01-01/2025-01-31/${nroDespacho}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const blob = await response2.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "output.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Error downloading Excel:", error);
    }
  };

  const handleClickAprobar = async () => {
    if (!valido) {
      Swal.fire(
        "Error",
        "La importación contiene errores, por favor corríjalos antes de aprobar.",
        "error"
      );
      return;
    }

    Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea aprobar esta importación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, aprobar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let user = sessionStorage.getItem("user");
        let dataUser = JSON.parse(user);
        let data = {
          idImportacion: id,
          usuarioAprueba: dataUser.email,
        };
        let response = await fetch(
          `${ip}:${port}/importaciones/apruebaImportacion`,
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          Swal.fire("Aprobado", "La importación ha sido aprobada", "success");
          setEstado("Aprobado");
        } else {
          Swal.fire("Error", "No se pudo aprobar la importación", "error");
        }
      }
    });
  };

  const handleClickDesAprobar = async () => {
    Swal.fire({
      title: "¿Está seguro?",
      text: "¿Desea desaprobar esta importación?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desaprobar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        let user = sessionStorage.getItem("user");
        let dataUser = JSON.parse(user);
        let data = {
          idImportacion: id,
          usuarioAprueba: dataUser.email,
        };
        let response = await fetch(
          `${ip}:${port}/importaciones/desapruebaImportacion`,
          {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
          }
        );

        if (response.ok) {
          Swal.fire(
            "DesAprobado",
            "La importación ha sido desaprobada",
            "success"
          );
          setEstado("Ingresado");
        } else {
          Swal.fire("Error", "No se pudo desaprobar la importación", "error");
        }
      }
    });
  };

  const { user, rutasPermitidas, rutasControladas } = useUserContext();
  const handleClickUpdateTipoCambioAlternativo = async () => {
    const purePathname =
      "/dashboard/importacion-update-tipo-cambio-alternativo";

    const isAllowed = rutasPermitidas.includes(purePathname);
    const isControled = rutasControladas.includes(purePathname);
    if (!isAllowed && isControled) {
      Swal.fire({
        title: "No Autorizado",
        text: "No tiene permisos para acceder a esta ruta",
        icon: "error",
      });
    } else {
      navigate(`/dashboard/importacion-update-tipo-cambio-alternativo/${id}`);
    }
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
          pdf FullSet
        </Button>
        <Button
          variant="contained"
          color="info"
          size="small"
          sx={{ ml: 2, mb: 1 }}
          onClick={handleClickDownloadPdfUyD}
        >
          pdf UYD
        </Button>

        <Button
          variant="contained"
          color="info"
          size="small"
          sx={{ ml: 2, mb: 1 }}
          onClick={handleClickDownloadExcel}
        >
          Excel
        </Button>

        <Button
          variant="contained"
          color="secondary"
          sx={{ ml: 2, mb: 1 }}
          onClick={handleClickRegresar}
          size="small"
        >
          Regresar
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
                    {gastos.length > 0 ? (
                      gastos.map((gasto, index) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="caption">
                            No hay datos disponibles
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
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
                    {desembolsos.length > 0 ? (
                      desembolsos.map((gasto, index) => (
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
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={3} align="center">
                          <Typography variant="caption">
                            No hay datos disponibles
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
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
              <Box display="flex" justifyContent="flex-end">
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    mb: 1,
                  }}
                  onClick={handleClickAprobar}
                  disabled={estado === "Aprobado"}
                >
                  {estado === "Ingresado" ? "Aprobar" : "Aprobado"}
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{
                    mb: 1,
                    ml: 2,
                  }}
                  onClick={handleClickDesAprobar}
                  hidden={estado === "Ingresado" || !usuario.includes("(sa)")}
                >
                  Cambiar a Ingresado
                </Button>
              </Box>
              <Typography variant="h10">Detalle</Typography>

              <Button
                variant="contained"
                color="info"
                size="small"
                sx={{ ml: 2, mb: 1 }}
                onClick={handleClickInsertarDetalle}
                disabled={estado === "Aprobado"}
              >
                +
              </Button>

              <Paper variant="outlined">
                <Table
                  size="small"
                  sx={{ fontSize: "0.875rem" }}
                  display="flex"
                >
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                    <TableRow>
                      <TableCell>Invoice</TableCell>
                      <TableCell>Codigo</TableCell>
                      <TableCell>Cantidad</TableCell>
                      <TableCell>Valor</TableCell>
                      <TableCell>Peso</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {tableDetalle.length > 0 ? (
                      tableDetalle.map((e, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                color:
                                  e.invoiceNumber == "0" ? "red" : "inherit",
                              }}
                            >
                              {e.invoiceNumber}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                color: e.codigoInvalido ? "red" : "inherit",
                              }}
                            >
                              {e.codigo.substring(0, 15) || ""}
                            </Typography>
                          </TableCell>
                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                color: e.cantidadInvalida ? "red" : "inherit",
                              }}
                            >
                              {e.cantidad.substring(0, 15) || ""}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                color: e.valorInvalido ? "red" : "inherit",
                              }}
                            >
                              {e.valor.substring(0, 15) || ""}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                color: e.peso == "0" ? "red" : "inherit",
                              }}
                            >
                              {e.peso}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <>
                              <Button
                                variant="contained"
                                color="secondary"
                                size="small"
                                sx={{ mt: 0 }}
                                onClick={() =>
                                  handleClickModificaDetalle(index)
                                }
                                disabled={estado === "Aprobado"}
                              >
                                Modificar
                              </Button>
                              <Button
                                variant="contained"
                                color="error"
                                size="small"
                                sx={{ ml: 2 }}
                                onClick={() =>
                                  handleClickEliminarDetalle(index)
                                }
                                disabled={estado === "Aprobado"}
                              >
                                Eliminar
                              </Button>
                            </>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} align="center">
                          <Typography variant="caption">
                            No hay datos disponibles
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                    <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableCell>
                        <Typography variant="subtitle2">Totales</Typography>
                      </TableCell>
                      <TableCell></TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {totalCantidad}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">
                          {totalValor}
                        </Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{totalPeso}</Typography>
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </Paper>

              <Box sx={{ mt: 2 }}>
                <Typography variant="h10">Totales por Invoice</Typography>
                <Paper variant="outlined">
                  <Table size="small" sx={{ fontSize: "0.875rem" }}>
                    <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
                      <TableRow>
                        <TableCell>Invoice</TableCell>
                        <TableCell>Total Cantidad</TableCell>
                        <TableCell>Total Valor</TableCell>
                        <TableCell>Total Peso</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Object.entries(
                        tableDetalle.reduce((acc, curr) => {
                          const invoice = curr.invoiceNumber || "Sin Invoice";
                          if (!acc[invoice]) {
                            acc[invoice] = {
                              totalCantidad: 0,
                              totalValor: 0,
                              totalPeso: 0,
                            };
                          }
                          acc[invoice].totalCantidad += parseFloat(
                            curr.cantidad || 0
                          );
                          acc[invoice].totalValor += parseFloat(
                            curr.valor || 0
                          );
                          acc[invoice].totalPeso += parseFloat(curr.peso || 0);
                          return acc;
                        }, {})
                      ).map(([invoice, totals], index) => (
                        <TableRow key={index}>
                          <TableCell>{invoice}</TableCell>
                          <TableCell>
                            {totals.totalCantidad.toFixed(2)}
                          </TableCell>
                          <TableCell>{totals.totalValor.toFixed(2)}</TableCell>
                          <TableCell>{totals.totalPeso.toFixed(2)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Paper>
              </Box>
            </Box>

            <Box flex={1} sx={{ mt: 3 }}>
              <Typography variant="h10">Packing List</Typography>
              <Button
                variant="contained"
                color="info"
                size="small"
                sx={{ ml: 2, mb: 1 }}
                onClick={handleClickInsertPackingList}
                disabled={estado === "Aprobado"}
              >
                +
              </Button>
              <Paper variant="outlined">
                <Table
                  size="small"
                  sx={{ fontSize: "0.875rem" }}
                  display="flex"
                >
                  <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
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
                    {tablePacking.length > 0 ? (
                      tablePacking.map((e, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Typography variant="caption">
                              {e.descripcion.substring(0, 15) || ""}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="caption">
                              {e.sif.substring(0, 15) || ""}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                color: e.vencimientoInvalido
                                  ? "red"
                                  : "inherit",
                              }}
                            >
                              {e.fechaVencimiento.substring(0, 12) || ""}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography variant="caption">
                              {e.CajasPallet.substring(0, 15) || ""}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                color: e.pesonetoInvalido ? "red" : "inherit",
                              }}
                            >
                              {e.PesoNeto.substring(0, 15) || ""}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Typography
                              variant="caption"
                              sx={{
                                color: e.pesobrutoInvalido ? "red" : "inherit",
                              }}
                            >
                              {e.PesoBruto.substring(0, 15) || ""}
                            </Typography>
                          </TableCell>

                          <TableCell>
                            <Button
                              variant="contained"
                              color="secondary"
                              size="small"
                              sx={{ mt: 0 }}
                              onClick={() =>
                                handleClickUpdatePackingList(index)
                              }
                              disabled={estado === "Aprobado"}
                            >
                              Modificar
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              size="small"
                              sx={{ ml: 2 }}
                              onClick={() =>
                                handleClickDeletePackingList(index)
                              }
                              disabled={estado === "Aprobado"}
                            >
                              Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={7} align="center">
                          <Typography variant="caption">
                            No hay datos disponibles
                          </Typography>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </Paper>
            </Box>

            <Box flex={1} sx={{ mt: 3 }}>
              <Typography variant="caption">
                Tipo Cambio Alternativo:
                <Button
                  variant="outlined"
                  sx={{ ml: 2 }}
                  onClick={() => handleClickUpdateTipoCambioAlternativo()}
                >
                  {tipoCambioAlternativo}
                </Button>
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default IndexDetalle;
