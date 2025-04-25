import { useState, useEffect } from "react";
import { useRedirectActiveUser } from "../hooks/useRedirectActiveUser";
import { useUserContext } from "../context/UserContext";
import { register } from "../config/firebase";
import { Formik } from "formik";
import * as Yup from "yup";
import { Box, Avatar, Typography, TextField, Button } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import logo from "../assets/JBS nuevo.png";

const Recover = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [password2, setPassword2] = useState("");
  let [nombre, setNombre] = useState("");
  let [username, setUsername] = useState("");

  let [codigo, setCodigo] = useState("");
  let [codigoFromServer, setCodigoFromServer] = useState(0);
  let [emailForUpdate, setEmailForUpdate] = useState("");
  let [passwordForUpdate, setPasswordForUpdate] = useState("");

  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  const navigate = useNavigate();
  const { user, setUser, rutasPermitidas } = useUserContext();
  const location = useLocation();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Formato Email Obligatorio")
      .required("Campo requerido"),
    password: Yup.string()
      .trim()
      .min(6, "Minimo 6 caracteres")
      .required("Campo requerido"),
    password2: Yup.string()
      .trim()
      .min(6, "Minimo 6 caracteres")
      .required("Campo requerido"),
  });

  const validationSchemaForm2 = Yup.object().shape({
    codigo: Yup.number()
      .required("Campo requerido")
      .positive("Solo numeros")
      .integer("Solo numeros")
      .min(0, "Debe ser mayor o igual a 0"),
  });

  //useRedirectActiveUser(user, "/dashboard");

  const onSubmit1 = async (
    { email, password, password2, nombre, username },
    { setSubmitting, setErrors, resetForm }
  ) => {
    if (password !== password2) {
      setErrors({ password2: "Contrasenas deben ser iguales" });
      return;
    }

    let data = {
      email: email,
    };

    let response = await fetch(
      `${ip}:${port}/usuario/recoverGetCodigo/${encodeURIComponent(data.email)}`
    );
    response = await response.json();

    if (response.error) {
      Swal.fire({
        title: "Error",
        text: response.mensaje,
        icon: "error",
        confirmButtonText: "Ok",
      });
    } else {
      setCodigoFromServer(response.codigo);
      setEmailForUpdate(email);
      setPasswordForUpdate(password);
      Swal.fire({
        title: "Codigo Enviado",
        text: "Se ha enviado un codigo a su email",
        icon: "success",
        confirmButtonText: "Ok",
      });
    }
  };

  const onSubmit = async (
    { codigo },
    { setSubmitting, setErrors, resetForm }
  ) => {
    // si codigo es correcto, actualiza usuario
    console.log("codigo", codigoFromServer);
    if (codigoFromServer !== parseInt(codigo)) {
      setErrors({ codigo: "Codigo incorrecto" });
      return;
    } else {
      let data = {
        email: emailForUpdate,
        password: passwordForUpdate,
      };
      console.log("data", data);
      let response = await fetch(
        `${ip}:${port}/usuario/recoverUpdatePassword`,
        {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      response = await response.json();

      if (response.error) {
        Swal.fire({
          title: "Error",
          text: response.mensaje,
          icon: "error",
          confirmButtonText: "Ok",
        });
      } else {
        Swal.fire({
          title: "Contrasena Actualizada",
          text: "Su contrasena ha sido actualizada",
          icon: "success",
          confirmButtonText: "Ok",
        });
        navigate("/");
      }
    }
  };

  return (
    <Box sx={{ mt: 3, maxWidth: 400, mx: "auto", textAlign: "center", px: 3 }}>
      {/* <Avatar sx={{ mx: "auto", bgcolor: "#111", mb: 2 }}>
        <AddAPhotoIcon />
      </Avatar> */}

      <img src={logo} alt="Logo" width="50%" height="50%" />

      <Typography variant="h5" sx={{ mb: 3, mt: 2 }} component="h1">
        Recupera Contraseña
      </Typography>

      <Formik
        initialValues={{
          email: "",
          password: "",
          password2: "",
        }}
        onSubmit={onSubmit1}
        validationSchema={validationSchema}
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
              placeholder="email@example.com"
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
              placeholder="Ingrese Nueva Contrasena"
              value={values.password}
              onChange={handleChange}
              name="password"
              onBlur={handleBlur}
              id="password"
              label="Ingrese Nueva Password"
              fullWidth
              sx={{ mb: 3 }}
              error={errors.password && touched.password}
              helperText={
                errors.password && touched.password && errors.password
              }
            />

            <TextField
              type="password"
              placeholder="Confirme Nueva Contrasena"
              value={values.password2}
              onChange={handleChange}
              name="password2"
              onBlur={handleBlur}
              id="password2"
              label="Confirme Nueva Password"
              fullWidth
              sx={{ mb: 3 }}
              error={errors.password2 && touched.password2}
              helperText={
                errors.password2 && touched.password2 && errors.password2
              }
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="contained"
              fullWidth
              sx={{ mb: 3 }}
            >
              Solicitar Codigo
            </Button>
          </Box>
        )}
      </Formik>

      <Formik
        initialValues={{
          codigo: "",
        }}
        onSubmit={onSubmit}
        validationSchema={validationSchemaForm2}
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
              type="number"
              placeholder="Ingrese Codigo"
              value={values.codigo}
              onChange={handleChange}
              name="codigo"
              onBlur={handleBlur}
              id="codigo"
              label="Ingrese Codigo"
              fullWidth
              sx={{ mb: 3 }}
              error={errors.codigo && touched.codigo}
              helperText={errors.codigo && touched.codigo && errors.codigo}
            />

            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="contained"
              fullWidth
              sx={{ mb: 3 }}
            >
              Actualiza Usuario
            </Button>

            <Button fullWidth component={Link} to="/">
              Volver a Login
            </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Recover;
