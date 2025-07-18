import React, { useState, useEffect } from 'react';
import {
  Container,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Grid,
  Card,
  CardContent,
  CardActions,
  Typography,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const validationSchema = yup.object({
  nome: yup.string().required('Nome do voo é obrigatório'),
  data_partida: yup.string().required('Data de partida é obrigatória'),
  data_chegada: yup.string().required('Data de chegada é obrigatória'),
});

const Viagens = () => {
  const [open, setOpen] = useState(false);
  const [voos, setVoos] = useState([]);

  const formik = useFormik({
    initialValues: {
      nome: '',
      data_partida: '',
      data_chegada: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8000/api/viagens/voos', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        handleClose();
        fetchVoos();
      } catch (error) {
        console.error('Erro ao criar voo:', error);
      }
    },
  });

  const fetchVoos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/viagens/voos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVoos(response.data);
    } catch (error) {
      console.error('Erro ao buscar voos:', error);
    }
  };

  useEffect(() => {
    fetchVoos();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  const handleExcluir = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este voo?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:8000/api/viagens/voos/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        fetchVoos();
      } catch (error) {
        console.error('Erro ao excluir voo:', error);
        alert(error.response?.data?.detail || 'Erro ao excluir voo');
      }
    }
  };

  return (
    <Container>
      <div style={{ marginTop: '24px' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Viagens
        </Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          Criar Novo Voo
        </Button>
      </div>

      <Grid container spacing={3}>
        {voos.map((voo) => (
          <Grid item xs={12} sm={6} md={4} key={voo.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{voo.nome}</Typography>
                <Typography>Partida: {new Date(voo.data_partida).toLocaleString()}</Typography>
                <Typography>Chegada: {new Date(voo.data_chegada).toLocaleString()}</Typography>
              </CardContent>
              <CardActions>
                <IconButton
                  aria-label="delete"
                  onClick={() => handleExcluir(voo.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Criar Novo Voo</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              id="nome"
              name="nome"
              label="Nome do Voo"
              value={formik.values.nome}
              onChange={formik.handleChange}
              error={formik.touched.nome && Boolean(formik.errors.nome)}
              helperText={formik.touched.nome && formik.errors.nome}
            />
            <TextField
              fullWidth
              margin="normal"
              id="data_partida"
              name="data_partida"
              label="Data de Partida"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={formik.values.data_partida}
              onChange={formik.handleChange}
              error={formik.touched.data_partida && Boolean(formik.errors.data_partida)}
              helperText={formik.touched.data_partida && formik.errors.data_partida}
            />
            <TextField
              fullWidth
              margin="normal"
              id="data_chegada"
              name="data_chegada"
              label="Data de Chegada"
              type="datetime-local"
              InputLabelProps={{ shrink: true }}
              value={formik.values.data_chegada}
              onChange={formik.handleChange}
              error={formik.touched.data_chegada && Boolean(formik.errors.data_chegada)}
              helperText={formik.touched.data_chegada && formik.errors.data_chegada}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Criar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Viagens;
