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

  let [codigo, setCodigo] = useState("");
  let [cantidad, setCantidad] = useState("");
  let [valor, setValor] = useState("");
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
      setCodigo(data.codigo);
      setCantidad(data.cantidad);
      setValor(data.valor);

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
    codigo: Yup.string()
      .trim()
      .min(2, "Minimo 2 caracteres")
      .required("Campo requerido"),
    cantidad: Yup.string()
      .trim()
      .min(2, "Minimo 2 caracteres")
      .required("Campo requerido"),
    valor: Yup.string()
      .trim()
      .min(2, "Minimo 2 caracteres")
      .required("Campo requerido"),
  });

  const onSubmit = async (
    { codigo, cantidad, valor },
    { setSubmitting, setErrors, resetForm }
  ) => {
    let data = {
      idImportacion: idImportacion,
      index: indice,
      codigo: codigo,
      cantidad: cantidad,
      valor: valor,
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
        <Typography variant="h5" gutterBottom>
          Modifica Detalles Importacion
        </Typography>

        <Formik
          initialValues={{
            codigo: codigo,
            cantidad: cantidad,
            valor: valor,
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
          }) => (
            <Box onSubmit={handleSubmit} component="form" sx={{ mt: 1 }}>
              <TextField
                select
                placeholder="Seleccione Codigo"
                value={values.codigo}
                onChange={handleChange}
                name="codigo"
                onBlur={handleBlur}
                id="codigo"
                label="Seleccione Codigo"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.codigo && touched.codigo}
                helperText={errors.codigo && touched.codigo && errors.codigo}
              >
                {listcodigos.map((option) => (
                  <MenuItem key={option.id} value={option.codigo}>
                    {option.codigo + " "}
                    {option.producto}
                  </MenuItem>
                ))}
              </TextField>

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
