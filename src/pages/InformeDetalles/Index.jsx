import { useState, useEffect } from "react";
import { useUserContext } from "../../context/UserContext";
import { useDevice } from "../../context/DeviceContext";

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
  List,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const Index = () => {
  let [ano, setAno] = useState("");
  let [fechaInicial, setFechaInicial] = useState("");
  let [fechaFinal, setFechaFinal] = useState("");

  const { isMobile } = useDevice();

  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  const { user, setUser } = useUserContext();

  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const currentYear = new Date().getFullYear();
      setAno(currentYear.toString());
      const currentDate = new Date();
      setFechaInicial(currentDate.toISOString().split("T")[0]); // Formato YYYY-MM-DD
      setFechaFinal(currentDate.toISOString().split("T")[0]); // Formato YYYY-MM-DD
    };

    fetchData();
  }, []);

  const validationSchema = Yup.object().shape({
    ano: Yup.string()
      .trim()
      .min(4, "Minimo 4 caracteres")
      .required("Campo requerido"),
    fechaInicial: Yup.string().trim().required("Campo requerido"),
    fechaFinal: Yup.string().trim().required("Campo requerido"),
  });

  const onSubmit = async (
    { ano, fechaInicial, fechaFinal },
    { setSubmitting, setErrors, resetForm }
  ) => {
    if (ano < 2025) {
      return Swal.fire({
        icon: "error",
        title: "Año no válido",
        text: "El año debe ser 2025 o posterior.",
      });
    }
    let data = {
      ano: ano.toString(),
    };
    console.log("data:", data);

    try {
      let response = await fetch(
        `${ip}:${port}/informeDetalles/list/${ano}/${fechaInicial}/${fechaFinal}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let dataResponse = await response.json();

      if (dataResponse.length === 0) {
        return Swal.fire({
          icon: "info",
          title: "No hay datos disponibles",
          text: "No se encontraron registros para los filtros seleccionados.",
        });
      }

      const ws = XLSX.utils.json_to_sheet(dataResponse);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Detalles");
      XLSX.writeFile(wb, "Detalles.xlsx");
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
          Informe de Detalles
        </Typography>

        <Formik
          initialValues={{
            ano: ano,
            fechaInicial: fechaInicial,
            fechaFinal: fechaFinal,
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
            <Box
              onSubmit={handleSubmit}
              component="form"
              sx={{ mt: 1, ml: 3, mr: 3 }}
            >
              <TextField
                type="number"
                placeholder="ano"
                value={values.ano}
                onChange={handleChange}
                name="ano"
                onBlur={handleBlur}
                id="ano"
                label="Ingrese Año"
                //fullWidth
                sx={{ mb: 3 }}
                error={errors.ano && touched.ano}
                helperText={errors.ano && touched.ano && errors.ano}
              />

              <TextField
                type="date"
                placeholder="fechaInicial"
                value={values.fechaInicial}
                onChange={handleChange}
                name="fechaInicial"
                onBlur={handleBlur}
                id="fechaInicial"
                label="Fecha Pago Inicial"
                //fullWidth
                sx={!isMobile ? { mb: 3, ml: 3 } : { mb: 3 }}
                error={errors.fechaInicial && touched.fechaInicial}
                helperText={
                  errors.fechaInicial &&
                  touched.fechaInicial &&
                  errors.fechaInicial
                }
              />

              <TextField
                type="date"
                placeholder="fechaFinal"
                value={values.fechaFinal}
                onChange={handleChange}
                name="fechaFinal"
                onBlur={handleBlur}
                id="fechaFinal"
                label="Fecha Pago Final"
                //fullWidth
                sx={!isMobile ? { mb: 3, ml: 3 } : { mb: 3 }}
                error={errors.fechaFinal && touched.fechaFinal}
                helperText={
                  errors.fechaFinal && touched.fechaFinal && errors.fechaFinal
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
                Generar Informe
              </Button>
            </Box>
          )}
        </Formik>
      </Box>
    </Container>
  );
};

export default Index;
