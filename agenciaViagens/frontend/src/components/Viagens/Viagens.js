import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Card,
  CardContent,
  CardActions,
  Grid,
} from '@mui/material';
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
  const [openCompra, setOpenCompra] = useState(false);
  const [vooSelecionado, setVooSelecionado] = useState(null);

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

  const handleComprarPassagem = async (voo) => {
    setVooSelecionado(voo);
    setOpenCompra(true);
  };

  const handleCloseCompra = () => {
    setOpenCompra(false);
    setVooSelecionado(null);
  };

  const handleConfirmarCompra = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/viagens/passagens',
        {
          voo_id: vooSelecionado.id,
          tipo_passageiro: 'ADULTO',
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleCloseCompra();
      fetchVoos();
    } catch (error) {
      console.error('Erro ao comprar passagem:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Viagens
        </Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          Criar Novo Voo
        </Button>
      </Box>

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
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleComprarPassagem(voo)}
                  disabled={voo.assentos_disponiveis === 0}
                >
                  Comprar Passagem
                </Button>
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

      <Dialog open={openCompra} onClose={handleCloseCompra}>
        <DialogTitle>Confirmar Compra de Passagem</DialogTitle>
        <DialogContent>
          {vooSelecionado && (
            <>
              <Typography>Voo: {vooSelecionado.nome}</Typography>
              <Typography>Partida: {new Date(vooSelecionado.data_partida).toLocaleString()}</Typography>
              <Typography>Chegada: {new Date(vooSelecionado.data_chegada).toLocaleString()}</Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseCompra}>Cancelar</Button>
          <Button onClick={handleConfirmarCompra} variant="contained">
            Confirmar Compra
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Viagens;
