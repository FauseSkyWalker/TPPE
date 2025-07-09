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
  modelo: yup.string().required('Modelo é obrigatório'),
  marca: yup.string().required('Marca é obrigatória'),
  ano: yup.number().required('Ano é obrigatório'),
  preco_diaria: yup.number().required('Preço da diária é obrigatório'),
  disponivel: yup.boolean(),
});

const Aluguel = () => {
  const [open, setOpen] = useState(false);
  const [carros, setCarros] = useState([]);
  const [openAlugar, setOpenAlugar] = useState(false);
  const [carroSelecionado, setCarroSelecionado] = useState(null);

  const formik = useFormik({
    initialValues: {
      modelo: '',
      marca: '',
      ano: '',
      preco_diaria: '',
      disponivel: true,
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8000/api/aluguel/carros', values, {
          headers: { Authorization: `Bearer ${token}` },
        });
        handleClose();
        fetchCarros();
      } catch (error) {
        console.error('Erro ao cadastrar carro:', error);
      }
    },
  });

  const fetchCarros = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/aluguel/carros', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCarros(response.data);
    } catch (error) {
      console.error('Erro ao buscar carros:', error);
    }
  };

  useEffect(() => {
    fetchCarros();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  const handleAlugar = (carro) => {
    setCarroSelecionado(carro);
    setOpenAlugar(true);
  };

  const handleCloseAlugar = () => {
    setOpenAlugar(false);
    setCarroSelecionado(null);
  };

  const handleConfirmarAluguel = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/aluguel/alugueis',
        {
          carro_id: carroSelecionado.id,
          data_inicio: new Date().toISOString(),
          data_fim: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 dias
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      handleCloseAlugar();
      fetchCarros();
    } catch (error) {
      console.error('Erro ao alugar carro:', error);
    }
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Aluguel de Carros
        </Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          Cadastrar Novo Carro
        </Button>
      </Box>

      <Grid container spacing={3}>
        {carros.map((carro) => (
          <Grid item xs={12} sm={6} md={4} key={carro.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{carro.marca} {carro.modelo}</Typography>
                <Typography>Ano: {carro.ano}</Typography>
                <Typography>Preço da diária: R$ {carro.preco_diaria}</Typography>
                <Typography>
                  Status: {carro.disponivel ? 'Disponível' : 'Indisponível'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => handleAlugar(carro)}
                  disabled={!carro.disponivel}
                >
                  Alugar
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Cadastrar Novo Carro</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              id="modelo"
              name="modelo"
              label="Modelo"
              value={formik.values.modelo}
              onChange={formik.handleChange}
              error={formik.touched.modelo && Boolean(formik.errors.modelo)}
              helperText={formik.touched.modelo && formik.errors.modelo}
            />
            <TextField
              fullWidth
              margin="normal"
              id="marca"
              name="marca"
              label="Marca"
              value={formik.values.marca}
              onChange={formik.handleChange}
              error={formik.touched.marca && Boolean(formik.errors.marca)}
              helperText={formik.touched.marca && formik.errors.marca}
            />
            <TextField
              fullWidth
              margin="normal"
              id="ano"
              name="ano"
              label="Ano"
              type="number"
              value={formik.values.ano}
              onChange={formik.handleChange}
              error={formik.touched.ano && Boolean(formik.errors.ano)}
              helperText={formik.touched.ano && formik.errors.ano}
            />
            <TextField
              fullWidth
              margin="normal"
              id="preco_diaria"
              name="preco_diaria"
              label="Preço da Diária"
              type="number"
              value={formik.values.preco_diaria}
              onChange={formik.handleChange}
              error={formik.touched.preco_diaria && Boolean(formik.errors.preco_diaria)}
              helperText={formik.touched.preco_diaria && formik.errors.preco_diaria}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Cadastrar</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openAlugar} onClose={handleCloseAlugar}>
        <DialogTitle>Confirmar Aluguel</DialogTitle>
        <DialogContent>
          {carroSelecionado && (
            <>
              <Typography>Carro: {carroSelecionado.marca} {carroSelecionado.modelo}</Typography>
              <Typography>Ano: {carroSelecionado.ano}</Typography>
              <Typography>Preço da diária: R$ {carroSelecionado.preco_diaria}</Typography>
              <Typography>Período: 7 dias</Typography>
              <Typography>
                Valor total: R$ {carroSelecionado.preco_diaria * 7}
              </Typography>
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlugar}>Cancelar</Button>
          <Button onClick={handleConfirmarAluguel} variant="contained">
            Confirmar Aluguel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Aluguel;
