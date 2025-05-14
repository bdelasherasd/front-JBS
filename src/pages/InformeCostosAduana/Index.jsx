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
  List,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";

const Index = () => {
  let [ano, setAno] = useState(2025);
  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  const { user, setUser } = useUserContext();

  const navigate = useNavigate();

  const validationSchema = Yup.object().shape({
    ano: Yup.string()
      .trim()
      .min(4, "Minimo 4 caracteres")
      .required("Campo requerido"),
  });

  const onSubmit = async ({ ano }, { setSubmitting, setErrors, resetForm }) => {
    if (ano < 2025) {
      return setErrors({ hora: "Hora debe ser mayor que 2025" });
    }
    let data = {
      ano: ano.toString(),
    };
    console.log("data:", data);

    try {
      let response = await fetch(
        `${ip}:${port}/informeCostosAduana/list/${ano}`,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      let dataResponse = await response.json();
      const ws = XLSX.utils.json_to_sheet(dataResponse);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Aduana");
      XLSX.writeFile(wb, "Aduana.xlsx");

      console.log(dataResponse);
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
          Informe de Costos Aduana
        </Typography>

        <Formik
          initialValues={{ ano: ano }}
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
              <TextField
                type="number"
                placeholder="ano"
                value={values.ano}
                onChange={handleChange}
                name="ano"
                onBlur={handleBlur}
                id="ano"
                label="Ingrese Año"
                fullWidth
                sx={{ mb: 3 }}
                error={errors.ano && touched.ano}
                helperText={errors.ano && touched.ano && errors.ano}
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
