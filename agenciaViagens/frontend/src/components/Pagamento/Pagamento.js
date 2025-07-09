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
  Grid,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const validationSchema = yup.object().shape({
  valor: yup.string().required('Valor é obrigatório'),
  numero_cartao: yup.string().required('Número do cartão é obrigatório')
});

const Pagamento = () => {
  const [open, setOpen] = useState(false);
  const [pagamentos, setPagamentos] = useState([]);

  const formik = useFormik({
    initialValues: {
      valor: '',
      numero_cartao: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        await axios.post('http://localhost:8000/api/pagamentos/cartao', {
          valor: Number(values.valor),
          numero_cartao: values.numero_cartao,
        }, {
          headers: { Authorization: `Bearer ${token}` },
        });
        handleClose();
        fetchPagamentos();
      } catch (error) {
        console.error('Erro ao criar pagamento:', error);
      }
    },
  });

  const fetchPagamentos = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8000/api/pagamentos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPagamentos(response.data);
    } catch (error) {
      console.error('Erro ao buscar pagamentos:', error);
    }
  };

  useEffect(() => {
    fetchPagamentos();
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  return (
    <Container>
      <Box sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Pagamentos
        </Typography>
        <Button variant="contained" onClick={handleClickOpen}>
          Novo Pagamento
        </Button>
      </Box>

      <Grid container spacing={3}>
        {pagamentos.map((pagamento) => (
          <Grid item xs={12} sm={6} md={4} key={pagamento.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">
                  Pagamento - R$ {pagamento.valor}
                </Typography>
                <Typography>Status: {pagamento.status}</Typography>
                <Typography>Cartão: {pagamento.numero_cartao}</Typography>
                <Typography>
                  Data: {new Date(pagamento.data_criacao).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Novo Pagamento</DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              name="valor"
              label="Valor"
              type="number"
              value={formik.values.valor}
              onChange={formik.handleChange}
              error={formik.touched.valor && Boolean(formik.errors.valor)}
              helperText={formik.touched.valor && formik.errors.valor}
              inputProps={{ min: 0, step: 0.01 }}
            />
            <TextField
              fullWidth
              margin="normal"
              name="numero_cartao"
              label="Número do Cartão"
              value={formik.values.numero_cartao}
              onChange={formik.handleChange}
              error={formik.touched.numero_cartao && Boolean(formik.errors.numero_cartao)}
              helperText={formik.touched.numero_cartao && formik.errors.numero_cartao}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">
              Criar Pagamento
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Pagamento;
