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
  Autocomplete,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

const UpdateDetalle = () => {
  const idImportacion = useParams().idImportacion;
  const indice = useParams().index;

  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  let [invoice, setInvoice] = useState("");
  let [codigo, setCodigo] = useState("");
  let [cantidad, setCantidad] = useState("");
  let [valor, setValor] = useState("");
  let [peso, setPeso] = useState("");
  let [listcodigos, setListCodigos] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const datafetch = await fetch(
        `${ip}:${port}/importaciones/getImportacion/${idImportacion}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let dataResponse = await datafetch.json();
      let data = JSON.parse(dataResponse.detalles)[indice];
      console.log(data);
      setInvoice(data.invoiceNumber);
      setCodigo(data.codigo);
      setCantidad(data.cantidad);
      setValor(data.valor);
      setPeso(data.peso);

      const datafetchlist = await fetch(
        `${ip}:${port}/importaciones/listCodigos/${idImportacion}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let listaCodigos = await datafetchlist.json();
      setListCodigos(
        listaCodigos.map((e) => ({
          id: e.sku,
          codigo: e.sku,
          producto: e.producto,
        }))
      );
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    invoice: Yup.string()
      .trim()
      .min(2, "Minimo 2 caracteres")
      .required("Campo requerido"),
    codigo: Yup.string()
      .trim()
      .min(2, "Minimo 2 caracteres")
      .required("Campo requerido"),
    cantidad: Yup.number()
      .typeError("El campo debe ser un número")
      .required("Campo requerido")
      .min(0, "La cantidad no puede ser menor a 0"),
    valor: Yup.number()
      .typeError("El campo debe ser un número")
      .required("Campo requerido")
      .min(0, "El valor no puede ser menor a 0"),
    peso: Yup.number()
      .typeError("El campo debe ser un número")
      .required("Campo requerido")
      .min(0, "El valor no puede ser menor a 0"),
  });

  const onSubmit = async (
    { invoice, codigo, cantidad, valor, peso },
    { setSubmitting, setErrors, resetForm }
  ) => {
    let cantidadInvalida = await valCantidad(cantidad);
    let valorInvalido = await valCantidad(valor);

    if (cantidadInvalida) {
      return setErrors({ cantidad: "Cantidad invalida" });
    }
    if (valorInvalido) {
      return setErrors({ valor: "Valor invalido" });
    }
    let codigoInvalido = await valCodigo(codigo);
    if (codigoInvalido) {
      return setErrors({
        codigo: "Codigo " + codigo + ", no existe en la base de datos",
      });
    }

    let data = {
      idImportacion: idImportacion,
      index: indice,
      invoiceNumber: invoice,
      codigo: codigo,
      cantidad: cantidad,
      valor: valor,
      peso: peso,
    };
    try {
      let response = await fetch(`${ip}:${port}/importaciones/updateDetalles`, {
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
        title: "Detalle Actualizado",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate(`/dashboard/importacion-detalle/${idImportacion}`);

      //resetForm();
    } catch (error) {
      //console.log(error.code, error.message);
      return setErrors({ username: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const navigate = useNavigate();

  const handleClickRegresar = () => {
    navigate(`/dashboard/importacion-detalle/${idImportacion}`);
  };

  const valCantidad = async (cantidad) => {
    if (isNaN(cantidad) || cantidad <= 0) {
      return true;
    } else {
      if (cantidad.includes(",")) {
        return true;
      } else {
        return false;
      }
    }
  };

  const valCodigo = async (codigo) => {
    let response = await fetch(
      `${ip}:${port}/importaciones/validaCodigo/${codigo}`,
      {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    let dataResponse = await response.json();
    return dataResponse.error;
  };

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          p: 4,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          mt: 5,
        }}
      >
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Modifica Detalles Importacion
        </Typography>

        <Formik
          initialValues={{
            invoice: invoice,
            codigo: codigo,
            cantidad: cantidad,
            valor: valor,
            peso: peso,
          }}
          onSubmit={onSubmit}
          validationSchema={validationSchema}
          enableReinitialize={true}
        >
          {({
            values,
            handleSubmit,
            handleChange,
            errors,
            touched,
            handleBlur,
            isSubmitting,
            setFieldValue,
          }) => (
            <Box onSubmit={handleSubmit} component="form" sx={{ mt: 1 }}>
              <Autocomplete
                options={listcodigos}
                getOptionLabel={(option) =>
                  `${option.codigo} ${option.producto}`
                }
                value={
                  listcodigos.find((item) => item.codigo === values.codigo) ||
                  null
                }
                onChange={(event, newValue) => {
                  setFieldValue("codigo", newValue ? newValue.codigo : "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Seleccione Codigo"
                    placeholder="Seleccione Codigo"
                    fullWidth
                    sx={{ mb: 3 }}
                    error={errors.codigo && touched.codigo}
                    helperText={
                      errors.codigo && touched.codigo && errors.codigo
                    }
                  />
                )}
              />
              <TextField
                type="text"
                placeholder="Ingrese Invoice"
                value={values.invoice}
                onChange={handleChange}
                name="invoice"
                onBlur={handleBlur}
                id="invoice"
                label="Ingrese Invoice"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.invoice && touched.invoice}
                helperText={errors.invoice && touched.invoice && errors.invoice}
              />

              <TextField
                type="text"
                placeholder="Ingrese Cantidad"
                value={values.cantidad}
                onChange={handleChange}
                name="cantidad"
                onBlur={handleBlur}
                id="cantidad"
                label="Ingrese Cantidad"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.cantidad && touched.cantidad}
                helperText={
                  errors.cantidad && touched.cantidad && errors.cantidad
                }
              />

              <TextField
                type="text"
                placeholder="Ingrese Valor"
                value={values.valor}
                onChange={handleChange}
                name="valor"
                onBlur={handleBlur}
                id="valor"
                label="Ingrese Valor"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.valor && touched.valor}
                helperText={errors.valor && touched.valor && errors.valor}
              />

              <TextField
                type="text"
                placeholder="Ingrese Peso"
                value={values.peso}
                onChange={handleChange}
                name="peso"
                onBlur={handleBlur}
                id="peso"
                label="Ingrese Peso"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.peso && touched.peso}
                helperText={errors.peso && touched.peso && errors.peso}
              />

              <Button
                type="submit"
                color="primary"
                disabled={isSubmitting}
                loading={isSubmitting}
                variant="contained"
                //fullWidth
                sx={{ mb: 3 }}
              >
                Registrar
              </Button>

              <Button
                variant="contained"
                color="secondary"
                sx={{ mb: 3, ml: 2 }}
                onClick={handleClickRegresar}
              >
                Regresar
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default UpdateDetalle;
