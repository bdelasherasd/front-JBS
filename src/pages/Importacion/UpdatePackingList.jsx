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

const UpdatePackingList = () => {
  const idImportacion = useParams().idImportacion;
  const indice = useParams().index;

  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  let [descripcion, setDescripcion] = useState("");
  let [sif, setSif] = useState("");
  let [vencimiento, setVencimiento] = useState("");
  let [cajas, setCajas] = useState("");
  let [pesoneto, setPesoneto] = useState("");
  let [pesobruto, setPesobruto] = useState("");

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
      let data = JSON.parse(dataResponse.packingList)[indice];
      console.log(data);
      setDescripcion(data.descripcion);
      setSif(data.sif);
      setVencimiento(data.fechaVencimiento);
      setCajas(data.CajasPallet);
      setPesoneto(data.PesoNeto);
      setPesobruto(data.PesoBruto);
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    descripcion: Yup.string()
      .trim()
      .min(2, "Minimo 2 caracteres")
      .required("Campo requerido"),
    sif: Yup.number()
      .typeError("El campo debe ser un número")
      .required("Campo requerido"),
    vencimiento: Yup.date()
      .typeError("El campo debe ser una fecha")
      .required("Campo requerido"),
    cajas: Yup.number()
      .typeError("El campo debe ser un número")
      .required("Campo requerido"),
    pesoneto: Yup.number()
      .typeError("El campo debe ser un número")
      .required("Campo requerido"),
    pesobruto: Yup.number()
      .typeError("El campo debe ser un número")
      .required("Campo requerido"),
  });

  const onSubmit = async (
    { descripcion, sif, vencimiento, cajas, pesoneto, pesobruto },
    { setSubmitting, setErrors, resetForm }
  ) => {
    if (!fechaValida(vencimiento)) {
      return setErrors({ vencimiento: "Fecha no válida" });
    }

    let data = {
      idImportacion: idImportacion,
      index: indice,
      descripcion: descripcion,
      sif: sif,
      fechaVencimiento: vencimiento,
      CajasPallet: cajas,
      PesoNeto: pesoneto,
      PesoBruto: pesobruto,
    };
    try {
      let response = await fetch(
        `${ip}:${port}/importaciones/updatePackingList`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
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

  const fechaValida = (fecha) => {
    const regex = /^\d{4}\/\d{2}\/\d{2}$/;
    if (!regex.test(fecha)) return false;

    const [year, month, day] = fecha.split("/").map(Number);
    const date = new Date(year, month - 1, day);

    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
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
        <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
          Modifica Detalles Packing List
        </Typography>

        <Formik
          initialValues={{
            descripcion: descripcion,
            sif: sif,
            vencimiento: vencimiento,
            cajas: cajas,
            pesoneto: pesoneto,
            pesobruto: pesobruto,
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
              <TextField
                type="text"
                placeholder="Ingrese Descripcion"
                value={values.descripcion}
                onChange={handleChange}
                name="descripcion"
                onBlur={handleBlur}
                id="descripcion"
                label="Ingrese Descripcion"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.descripcion && touched.descripcion}
                helperText={
                  errors.descripcion &&
                  touched.descripcion &&
                  errors.descripcion
                }
              />

              <TextField
                type="text"
                placeholder="Ingrese SIF"
                value={values.sif}
                onChange={handleChange}
                name="sif"
                onBlur={handleBlur}
                id="sif"
                label="Ingrese SIF"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.sif && touched.sif}
                helperText={errors.sif && touched.sif && errors.sif}
              />

              <TextField
                type="text"
                placeholder="Ingrese Vencimiento"
                value={values.vencimiento}
                onChange={handleChange}
                name="vencimiento"
                onBlur={handleBlur}
                id="vencimiento"
                label="Ingrese Vencimiento"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.vencimiento && touched.vencimiento}
                helperText={
                  errors.vencimiento &&
                  touched.vencimiento &&
                  errors.vencimiento
                }
              />

              <TextField
                type="text"
                placeholder="Ingrese Cajas Pallet"
                value={values.cajas}
                onChange={handleChange}
                name="cajas"
                onBlur={handleBlur}
                id="cajas"
                label="Ingrese Cajas Pallet"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.cajas && touched.cajas}
                helperText={errors.cajas && touched.cajas && errors.cajas}
              />

              <TextField
                type="text"
                placeholder="Ingrese Peso Neto"
                value={values.pesoneto}
                onChange={handleChange}
                name="pesoneto"
                onBlur={handleBlur}
                id="pesoneto"
                label="Ingrese Peso Neto"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.pesoneto && touched.pesoneto}
                helperText={
                  errors.pesoneto && touched.pesoneto && errors.pesoneto
                }
              />
              <TextField
                type="text"
                placeholder="Ingrese Peso Bruto"
                value={values.pesobruto}
                onChange={handleChange}
                name="pesobruto"
                onBlur={handleBlur}
                id="pesobruto"
                label="Ingrese Peso Bruto"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.pesobruto && touched.pesobruto}
                helperText={
                  errors.pesobruto && touched.pesobruto && errors.pesobruto
                }
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

export default UpdatePackingList;
