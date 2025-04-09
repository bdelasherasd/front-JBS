import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useUserContext } from "../context/UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import { Box, Avatar, Typography, TextField, Button } from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import logo from "../assets/jbs-s-a-1.svg";

import { login } from "../config/firebase";
const urlBackend = import.meta.env.VITE_URL_BACKEND;

const Login = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");

  const navigate = useNavigate();
  const {
    user,
    setUser,
    rutasPermitidas,
    setRutasPermitidas,
    rutasControladas,
    setRutasControladas,
  } = useUserContext();

  const validationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Formato Email Obligatorio")
      .required("Campo requerido"),
    password: Yup.string()
      .trim()
      .min(6, "Minimo 6 caracteres")
      .required("Campo requerido"),
  });

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user]);

  const onSubmit = async (
    { email, password },
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      const credentialUser = await login({ email: email, password: password });
      //console.log(credentialUser);
      if (!credentialUser.error) {
        console.log("credenciales login", credentialUser);
        sessionStorage.setItem("user", JSON.stringify(credentialUser));
        setUser(credentialUser);
        const rutas = await getRutasPermitidas(credentialUser.idUsuario);
        setRutasPermitidas(rutas);
        const rutasControladas = await getRutasControladas();
        setRutasControladas(rutasControladas);
        resetForm();
      } else {
        return setErrors({ password: credentialUser.error });
      }
    } catch (error) {
      return setErrors({ password: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const getRutasPermitidas = async (usuario) => {
    try {
      const response = await fetch(
        `${urlBackend}/privilegio/getRutasPermitidas/${usuario}`
      );
      const data = await response.json();
      let arr = data.map((e) => e.ruta);
      return arr;
    } catch (error) {
      console.log(error);
    }
  };

  const getRutasControladas = async () => {
    try {
      const response = await fetch(`${urlBackend}/aplicacion/listAplicaciones`);
      const data = await response.json();
      let arr = data.map((e) => e.ruta);
      return arr;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Box sx={{ mt: 10, maxWidth: 400, mx: "auto", textAlign: "center", px: 3 }}>
      {/* <Avatar sx={{ mx: "auto", bgcolor: "white", mb: 2 }}> */}
      {/* <AddAPhotoIcon /> */}
      <img src={logo} alt="Logo" width="50%" height="50%" />
      {/* </Avatar> */}

      <Typography variant="h5" sx={{ mb: 3, mt: 3 }} component="h1">
        Login
      </Typography>

      <Formik
        initialValues={{ email: "", password: "" }}
        onSubmit={onSubmit}
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

            <Button
              type="submit"
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="contained"
              fullWidth
              sx={{ mb: 3 }}
            >
              Login
            </Button>

            <Button fullWidth component={Link} to="/recover">
              Recuperar Contraseña
            </Button>
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Login;
