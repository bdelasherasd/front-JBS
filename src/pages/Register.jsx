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

const Register = () => {
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [nombre, setNombre] = useState("");
  let [username, setUsername] = useState("");

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
    nombre: Yup.string()
      .trim()
      .min(3, "Minimo 3 caracteres")
      .required("Campo requerido"),
    username: Yup.string()
      .trim()
      .min(3, "Minimo 3 caracteres")
      .required("Campo requerido"),
  });

  //useRedirectActiveUser(user, "/dashboard");

  const onSubmit = async (
    { email, password, nombre, username },
    { setSubmitting, setErrors, resetForm }
  ) => {
    try {
      const credentialUser = await register({
        email: email,
        password: password,
        nombre: nombre,
        username: username,
      });
      setUser(credentialUser);
      resetForm();
    } catch (error) {
      //console.log(error.code, error.message);
      if (error.code === "auth/user-not-found") {
        return setErrors({ email: "Usuario no encontrado" });
      }
      if (error.code === "auth/wrong-password") {
        return setErrors({ password: "Contrasena incorrecta" });
      }
      return setErrors({ password: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box sx={{ mt: 2, maxWidth: 400, mx: "auto", textAlign: "center", px: 3 }}>
      <Avatar sx={{ mx: "auto", bgcolor: "#111", mb: 2 }}>
        <AddAPhotoIcon />
      </Avatar>

      <Typography variant="h5" sx={{ mb: 3 }} component="h1">
        Registro
      </Typography>

      <Formik
        initialValues={{ email: "", password: "", username: "", nombre: "" }}
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

            <TextField
              type="text"
              placeholder="Ingrese Nombre Completo"
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
              disabled={isSubmitting}
              loading={isSubmitting}
              variant="contained"
              fullWidth
              sx={{ mb: 3 }}
            >
              Registrarse
            </Button>

            {/* <Button fullWidth component={Link} to="/">
              Ya tienes cuenta? Inicia Sesion
            </Button> */}
          </Box>
        )}
      </Formik>
    </Box>
  );
};

export default Register;
