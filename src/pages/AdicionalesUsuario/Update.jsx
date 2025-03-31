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
  const id = useParams().id;

  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [nombre, setNombre] = useState("");
  let [username, setUsername] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      console.log(`useEfect ${id}`);
      const data = await fetch(`${ip}:${port}/usuario/getUser/${id}`, {
        method: "GET",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
        },
      });
      let dataResponse = await data.json();
      setNombre(dataResponse.nombre);
      setEmail(dataResponse.email);
      setUsername(dataResponse.username);
      setPassword("");
      console.log(dataResponse);
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Formato Email Obligatorio")
      .required("Campo requerido"),
    // password: Yup.string()
    //   .trim()
    //   .min(6, "Minimo 6 caracteres")
    //   .required("Campo requerido"),
    nombre: Yup.string()
      .trim()
      .min(2, "Minimo 2 caracteres")
      .required("Campo requerido"),
    username: Yup.string()
      .trim()
      .min(2, "Minimo 2 caracteres")
      .required("Campo requerido"),
  });

  const onSubmit = async (
    { nombre, email, password, username },
    { setSubmitting, setErrors, resetForm }
  ) => {
    let data = {
      idUsuario: id,
      email: email,
      password: password,
      nombre: nombre,
      username: username,
    };
    try {
      let response = await fetch(`${ip}:${port}/usuario/updateUser`, {
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
        title: "Usuario Actualizado",
        showConfirmButton: false,
        timer: 1500,
      });
      navigate("/dashboard/adicionales-usuario");

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
    navigate("/dashboard/adicionales-usuario");
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
          Adicionales Usuario
        </Typography>

        <Formik
          initialValues={{
            email: email,
            nombre: nombre,
            password: password,
            username: username,
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
                placeholder="Ingrese Email"
                value={values.email}
                onChange={handleChange}
                name="email"
                onBlur={handleBlur}
                id="email"
                label="Ingrese Email"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.email && touched.email}
                helperText={errors.email && touched.email && errors.email}
              />

              <TextField
                type="password"
                placeholder="Ingrese Contrasena"
                value={values.password}
                onChange={handleChange}
                name="password"
                onBlur={handleBlur}
                id="password"
                label="Ingrese Password"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.password && touched.password}
                helperText={
                  errors.password && touched.password && errors.password
                }
              />

              <TextField
                type="text"
                placeholder="Ingrese Nombre"
                value={values.nombre}
                onChange={handleChange}
                name="nombre"
                onBlur={handleBlur}
                id="nombre"
                label="Ingrese Nombre"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.nombre && touched.nombre}
                helperText={errors.nombre && touched.nombre && errors.nombre}
              />

              <TextField
                type="text"
                placeholder="Ingrese Username"
                value={values.username}
                onChange={handleChange}
                name="username"
                onBlur={handleBlur}
                id="username"
                label="Ingrese Username"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.username && touched.username}
                helperText={
                  errors.username && touched.username && errors.username
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

export default Update;
