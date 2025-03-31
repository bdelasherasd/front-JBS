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
} from "@mui/material";
import { Formik } from "formik";
import * as Yup from "yup";
import ListUsers from "../../components/ListUsers";
import { useLocation } from "react-router-dom";

const Index = () => {
  const location = useLocation();
  console.log(location.pathname);

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
          Usuarios del Sistema
        </Typography>

        <ListUsers />
      </Box>
    </Container>
  );
};

export default Index;
