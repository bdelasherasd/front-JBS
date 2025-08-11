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
  Input,
} from "@mui/material";
import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Link, useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";

const Index = () => {
  const url = window.location.href.split(":");
  const ip = url[0] + ":" + url[1];
  const port = 3000;

  const { user, setUser } = useUserContext();

  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) {
      setMessage("Por favor, selecciona un archivo.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      setError(false);
      setMessage("");
      const response = await axios.post(
        `${ip}:${port}/cargaSeara/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log(response);

      if (response.status !== 200) {
        throw new Error("Error al subir el archivo");
      }

      //const result = await response.json();
      setMessage(response.data.message);
    } catch (error) {
      setError(true);
      setMessage(error.response.data.error);
    } finally {
      setLoading(false);
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
          Carga Excel SEARA
        </Typography>
        <Input
          type="file"
          inputProps={{ accept: ".xlsx,.xls" }}
          onChange={(e) => setFile(e.target.files[0])}
          sx={{ ml: 3, mr: 3, mb: 2, display: "block" }}
        />
        <Typography variant="body2" sx={{ ml: 3, mb: 2 }}>
          Selecciona un archivo Excel (.xlsx, .xls) para cargar.
        </Typography>

        <Button
          variant="contained"
          onClick={handleUpload}
          sx={{ ml: 3, mb: 2 }}
        >
          Subir archivo
        </Button>

        <Box sx={{ ml: 3, mb: 2 }}>
          {loading && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                animation: "blinking 1s infinite",
                "@keyframes blinking": {
                  "0%": { opacity: 1 },
                  "50%": { opacity: 0 },
                  "100%": { opacity: 1 },
                },
              }}
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                Cargando...
              </Typography>
            </Box>
          )}
          {message && (
            <Typography variant="body2" sx={{ color: error ? "red" : "green" }}>
              {message}
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default Index;
