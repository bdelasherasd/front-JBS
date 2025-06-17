import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

import ListRutas from "../../components/ListRutas";

const urlBackend = import.meta.env.VITE_URL_BACKEND;

const Index = () => {
  const navigate = useNavigate();

  const [usuario, setUsuario] = useState(0);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${urlBackend}/usuario/listUsers`);
        let data = await response.json();
        setTableData(
          data.map((user) => ({
            id: user.idUsuario,
            email: user.email,
            nombre: user.nombre,
            username: user.username,
          }))
        );
        setUsuario(data[0].idUsuario);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  const handleChangeUsuario = (event) => {
    const newValue = event.target.value;
    setUsuario(newValue);
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
          Privilegios del Usuario
        </Typography>

        <FormControl sx={{ ml: 2, mb: 2, minWidth: 300 }}>
          <InputLabel id="demo-simple-select-label">Usuario</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={usuario}
            label="Usuario"
            onChange={handleChangeUsuario}
          >
            {tableData.map((user) => (
              <MenuItem key={user.id} value={user.id}>
                {user.email}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <ListRutas idUsuario={usuario} />
      </Box>
    </Container>
  );
};

export default Index;
