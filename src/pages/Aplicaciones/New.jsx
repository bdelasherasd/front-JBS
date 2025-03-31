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

const Update = () => {
  const navigate = useNavigate();

  const id = useParams().id;

  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  let [descripcion, setDescripcion] = useState("");
  let [ruta, setRuta] = useState("");

  // useEffect(() => {
  //   const fetchData = async () => {
  //     console.log(`useEfect ${id}`);
  //     const data = await fetch(`${ip}:${port}/aplicacion/getAplicacion/${id}`, {
  //       method: "GET",
  //       mode: "cors",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //     });
  //     let dataResponse = await data.json();
  //     setDescripcion(dataResponse.descripcion);
  //     setRuta(dataResponse.ruta);
  //   };

  //   fetchData();
  // }, []);

  const validationSchema = Yup.object().shape({
    ruta: Yup.string().trim().required("Campo requerido"),
    descripcion: Yup.string()
      .trim()
      .min(2, "Minimo 2 caracteres")
      .required("Campo requerido"),
  });

  const onSubmit = async (
    { descripcion, ruta },
    { setSubmitting, setErrors, resetForm }
  ) => {
    let data = {
      descripcion: descripcion,
      ruta: ruta,
    };
    try {
      let response = await fetch(`${ip}:${port}/aplicacion/newAplicacion`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      let dataResponse = await response.json();
      console.log(dataResponse);
      await Swal.fire({
        icon: "success",
        title: "Aplicacion Creada",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/dashboard/aplicacion");

      //resetForm();
    } catch (error) {
      //console.log(error.code, error.message);
      return setErrors({ ruta: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleClickRegresar = () => {
    navigate("/dashboard/aplicacion");
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
          Aplicaciones
        </Typography>

        <Formik
          initialValues={{
            descripcion: descripcion,
            ruta: ruta,
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
                placeholder="Ingrese Ruta"
                value={values.ruta}
                onChange={handleChange}
                name="ruta"
                onBlur={handleBlur}
                id="ruta"
                label="Ingrese Ruta"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.ruta && touched.ruta}
                helperText={errors.ruta && touched.ruta && errors.ruta}
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

export default Update;
