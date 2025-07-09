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
  placa: yup.string().required('Placa é obrigatória').max(7, 'Placa deve ter no máximo 7 caracteres'),
  valor_diaria: yup.number().required('Valor da diária é obrigatório').positive('Valor deve ser positivo'),
});

const Aluguel = () => {
  const [open, setOpen] = useState(false);
  const [carros, setCarros] = useState([]);
  const [openAlugar, setOpenAlugar] = useState(false);
  const [carroSelecionado, setCarroSelecionado] = useState(null);

  const formik = useFormik({
    initialValues: {
      modelo: '',
      placa: '',
      valor_diaria: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8000/api/alugueis/carros', values, {
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
      const response = await axios.get('http://localhost:8000/api/alugueis/carros', {
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

  const [dataInicio, setDataInicio] = useState('');
  const [dataFim, setDataFim] = useState('');

  const calcularValorTotal = () => {
    if (!dataInicio || !dataFim || !carroSelecionado) return 0;
    const inicio = new Date(dataInicio);
    const fim = new Date(dataFim);
    const diffDias = Math.ceil((fim - inicio) / (1000 * 60 * 60 * 24));
    return diffDias * carroSelecionado.valor_diaria;
  };

  const handleConfirmarAluguel = async () => {
    if (!dataInicio || !dataFim) {
      alert('Por favor, selecione as datas de início e fim do aluguel');
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/alugueis/alugueis/carros',
        {
          carro_id: carroSelecionado.id,
          data_inicio: dataInicio,
          data_fim: dataFim,
          valor: calcularValorTotal(),
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
                <Typography variant="h6">{carro.modelo}</Typography>
                <Typography>Placa: {carro.placa}</Typography>
                <Typography>Valor da diária: R$ {carro.valor_diaria}</Typography>
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
              id="placa"
              name="placa"
              label="Placa"
              value={formik.values.placa}
              onChange={formik.handleChange}
              error={formik.touched.placa && Boolean(formik.errors.placa)}
              helperText={formik.touched.placa && formik.errors.placa}
              inputProps={{ maxLength: 7 }}
            />
            <TextField
              fullWidth
              margin="normal"
              id="valor_diaria"
              name="valor_diaria"
              label="Valor da Diária"
              type="number"
              value={formik.values.valor_diaria}
              onChange={formik.handleChange}
              error={formik.touched.valor_diaria && Boolean(formik.errors.valor_diaria)}
              helperText={formik.touched.valor_diaria && formik.errors.valor_diaria}
              inputProps={{ min: 0, step: 0.01 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Cadastrar</Button>
          </DialogActions>
        </form>
      </Dialog>

      <Dialog open={openAlugar} onClose={handleCloseAlugar} maxWidth="sm" fullWidth>
        <DialogTitle>Confirmar Aluguel</DialogTitle>
        <DialogContent>
          {carroSelecionado && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>{carroSelecionado.modelo}</Typography>
              <Typography>Placa: {carroSelecionado.placa}</Typography>
              <Typography gutterBottom>Valor da diária: R$ {carroSelecionado.valor_diaria}</Typography>
              
              <TextField
                fullWidth
                margin="normal"
                label="Data de Início"
                type="date"
                value={dataInicio}
                onChange={(e) => setDataInicio(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                fullWidth
                margin="normal"
                label="Data de Fim"
                type="date"
                value={dataFim}
                onChange={(e) => setDataFim(e.target.value)}
                InputLabelProps={{ shrink: true }}
              />
              
              {dataInicio && dataFim && (
                <Box sx={{ mt: 2, p: 2, bgcolor: 'background.paper', borderRadius: 1 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Resumo do Aluguel
                  </Typography>
                  <Typography>
                    Período: {new Date(dataInicio).toLocaleDateString()} até {new Date(dataFim).toLocaleDateString()}
                  </Typography>
                  <Typography variant="h6" sx={{ mt: 1, color: 'primary.main' }}>
                    Valor total: R$ {calcularValorTotal()}
                  </Typography>
                </Box>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAlugar}>Cancelar</Button>
          <Button 
            onClick={handleConfirmarAluguel} 
            variant="contained"
            disabled={!dataInicio || !dataFim}
          >
            Confirmar Aluguel
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Aluguel;
