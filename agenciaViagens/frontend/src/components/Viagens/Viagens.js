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
  origem: yup.string().required('Origem é obrigatória'),
  destino: yup.string().required('Destino é obrigatório'),
  data_partida: yup.string().required('Data de partida é obrigatória'),
  data_chegada: yup.string().required('Data de chegada é obrigatória'),
  preco: yup.number().required('Preço é obrigatório'),
  assentos_disponiveis: yup.number().required('Número de assentos é obrigatório'),
});

const Viagens = () => {
  const [open, setOpen] = useState(false);
  const [voos, setVoos] = useState([]);
  const [openCompra, setOpenCompra] = useState(false);
  const [vooSelecionado, setVooSelecionado] = useState(null);

  const formik = useFormik({
    initialValues: {
      origem: '',
      destino: '',
      data_partida: '',
      data_chegada: '',
      preco: '',
      assentos_disponiveis: '',
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
                <Typography variant="h6">{voo.origem} → {voo.destino}</Typography>
                <Typography>Partida: {new Date(voo.data_partida).toLocaleString()}</Typography>
                <Typography>Chegada: {new Date(voo.data_chegada).toLocaleString()}</Typography>
                <Typography>Preço: R$ {voo.preco}</Typography>
                <Typography>Assentos disponíveis: {voo.assentos_disponiveis}</Typography>
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
              id="origem"
              name="origem"
              label="Origem"
              value={formik.values.origem}
              onChange={formik.handleChange}
              error={formik.touched.origem && Boolean(formik.errors.origem)}
              helperText={formik.touched.origem && formik.errors.origem}
            />
            <TextField
              fullWidth
              margin="normal"
              id="destino"
              name="destino"
              label="Destino"
              value={formik.values.destino}
              onChange={formik.handleChange}
              error={formik.touched.destino && Boolean(formik.errors.destino)}
              helperText={formik.touched.destino && formik.errors.destino}
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
            <TextField
              fullWidth
              margin="normal"
              id="preco"
              name="preco"
              label="Preço"
              type="number"
              value={formik.values.preco}
              onChange={formik.handleChange}
              error={formik.touched.preco && Boolean(formik.errors.preco)}
              helperText={formik.touched.preco && formik.errors.preco}
            />
            <TextField
              fullWidth
              margin="normal"
              id="assentos_disponiveis"
              name="assentos_disponiveis"
              label="Assentos Disponíveis"
              type="number"
              value={formik.values.assentos_disponiveis}
              onChange={formik.handleChange}
              error={formik.touched.assentos_disponiveis && Boolean(formik.errors.assentos_disponiveis)}
              helperText={formik.touched.assentos_disponiveis && formik.errors.assentos_disponiveis}
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
              <Typography>Voo: {vooSelecionado.origem} → {vooSelecionado.destino}</Typography>
              <Typography>Data: {new Date(vooSelecionado.data_partida).toLocaleString()}</Typography>
              <Typography>Preço: R$ {vooSelecionado.preco}</Typography>
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
