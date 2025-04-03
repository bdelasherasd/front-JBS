import { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { Formik } from "formik";
import * as Yup from "yup";
import {
  Box,
  Avatar,
  Typography,
  TextField,
  Button,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";

const Index = () => {
  let [dia, setDia] = useState(0);
  let [hora, setHora] = useState("0");
  let [minuto, setMinuto] = useState("0");

  let [tableDias, setTableDias] = useState([]);

  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  const { user, setUser } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    let dias = [
      { dia: 0, glosa: "Todos los días" },
      { dia: 2, glosa: "Lunes" },
      { dia: 3, glosa: "Martes" },
      { dia: 4, glosa: "Miércoles" },
      { dia: 5, glosa: "Jueves" },
      { dia: 6, glosa: "Viernes" },
      { dia: 7, glosa: "Sábado" },
      { dia: 1, glosa: "Domingo" },
    ];
    setTableDias(
      dias.map((e) => ({
        id: e.dia,
        glosa: e.glosa,
      }))
    );
  }, []);

  const validationSchema = Yup.object().shape({
    dia: Yup.string()
      .trim()
      .min(1, "Minimo 1 caracteres")
      .required("Campo requerido"),
    hora: Yup.string()
      .trim()
      .min(1, "Minimo 1 caracteres")
      .required("Campo requerido"),
    minuto: Yup.string()
      .trim()
      .min(1, "Minimo 1 caracteres")
      .required("Campo requerido"),
  });

  const handleChangeDia = (event) => {
    const newValue = event.target.value;
    console.log("dia:", newValue);
    setDia(newValue);
  };

  const onSubmit = async (
    { hora, minuto },
    { setSubmitting, setErrors, resetForm }
  ) => {
    if (hora < 0 || hora > 23) {
      return setErrors({ hora: "Hora debe ser entre 0 y 23" });
    }
    if (minuto < 0 || minuto > 59) {
      return setErrors({ minuto: "Minuto debe ser entre 0 y 59" });
    }
    let data = {
      dia: dia.toString(),
      hora: hora.toString(),
      minuto: minuto.toString(),
      usuario: user.username,
    };
    console.log("data:", data);

    try {
      let response = await fetch(`${ip}:${port}/apiBancoCentral/agenda`, {
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
        title: "Agendado",
        text: "Proceso agendado correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      return setErrors({ minuto: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 0 }}>
      <Box
        sx={{
          pb: 2,
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 3,
          mt: 2,
        }}
      >
        <Typography variant="h6" sx={{ p: 2 }} gutterBottom>
          Agenda API Banco Central
        </Typography>

        <Formik
          initialValues={{ dia: "0", hora: "", minuto: "" }}
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
            <Box
              onSubmit={handleSubmit}
              component="form"
              sx={{ mt: 1, ml: 3, mr: 3 }}
            >
              <FormControl sx={{ ml: 0, mb: 3, minWidth: 300 }}>
                <InputLabel id="demo-simple-select-label">Dia</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={dia}
                  label="Dia"
                  onChange={handleChangeDia}
                >
                  {tableDias.map((e) => (
                    <MenuItem key={e.id} value={e.id}>
                      {e.glosa}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                type="number"
                placeholder="Hora"
                value={values.hora}
                onChange={handleChange}
                name="hora"
                onBlur={handleBlur}
                id="hora"
                label="Ingrese Hora"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.hora && touched.hora}
                helperText={errors.hora && touched.hora && errors.hora}
              />

              <TextField
                type="number"
                placeholder="Minuto"
                value={values.minuto}
                onChange={handleChange}
                name="minuto"
                onBlur={handleBlur}
                id="minuto"
                label="Ingrese Minuto"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.minuto && touched.minuto}
                helperText={errors.minuto && touched.minuto && errors.minuto}
              />

              <Button
                type="submit"
                disabled={isSubmitting}
                loading={isSubmitting}
                variant="contained"
                fullWidth
                sx={{ mb: 3 }}
              >
                Agendar
              </Button>

              {/* <Button fullWidth component={Link} to="/">
              Ya tienes cuenta? Inicia Sesion
            </Button> */}
            </Box>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Index;
