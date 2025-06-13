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

const UpdateTipoCambioAlternativo = () => {
  const idImportacion = useParams().idImportacion;
  const indice = useParams().index;

  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  let [tipoCambioAlternativo, setTipoCambioAlternativo] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      const datafetch = await fetch(
        `${ip}:${port}/importaciones/getImport/${idImportacion}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let data = await datafetch.json();
      setTipoCambioAlternativo(data.tipoCambioAlternativo);
    };
    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    tipoCambioAlternativo: Yup.number()
      .typeError("El campo debe ser un número")
      .min(0, "El valor no puede ser menor a 0"),
  });

  const onSubmit = async (
    { tipoCambioAlternativo },
    { setSubmitting, setErrors, resetForm }
  ) => {
    let user = sessionStorage.getItem("user");
    let dataUser = JSON.parse(user);

    let data = {
      idImportacion: idImportacion,
      tipoCambioAlternativo: tipoCambioAlternativo,
      usuarioModificaTipoCambio: dataUser.email,
    };
    try {
      let response = await fetch(
        `${ip}:${port}/importaciones/updateImportacion`,
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
        title: "Tipo Cambio Alternativo Actualizado",
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
        <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
          Modifica Tipo de Cambio Alternativo
        </Typography>

        <Formik
          initialValues={{
            tipoCambioAlternativo: tipoCambioAlternativo || "",
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
                type="number"
                placeholder="Ingrese Tipo de Cambio Alternativo"
                value={values.tipoCambioAlternativo}
                onChange={handleChange}
                name="tipoCambioAlternativo"
                onBlur={handleBlur}
                id="tipoCambioAlternativo"
                label="Ingrese Tipo de Cambio Alternativo"
                fullWidth
                sx={{ mb: 3 }}
                error={
                  errors.tipoCambioAlternativo && touched.tipoCambioAlternativo
                }
                helperText={
                  errors.tipoCambioAlternativo &&
                  touched.tipoCambioAlternativo &&
                  errors.tipoCambioAlternativo
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

export default UpdateTipoCambioAlternativo;
