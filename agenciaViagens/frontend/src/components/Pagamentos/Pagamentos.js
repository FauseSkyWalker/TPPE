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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from 'axios';

const validationSchema = yup.object({
  tipo: yup.string().required('Tipo de pagamento é obrigatório'),
  valor: yup.number().required('Valor é obrigatório'),
  // Campos específicos para cada tipo de pagamento
  numero_cartao: yup.string().when('tipo', {
    is: 'CARTAO',
    then: yup.string().required('Número do cartão é obrigatório'),
  }),
  nome_titular: yup.string().when('tipo', {
    is: 'CARTAO',
    then: yup.string().required('Nome do titular é obrigatório'),
  }),
  data_validade: yup.string().when('tipo', {
    is: 'CARTAO',
    then: yup.string().required('Data de validade é obrigatória'),
  }),
  cvv: yup.string().when('tipo', {
    is: 'CARTAO',
    then: yup.string().required('CVV é obrigatório'),
  }),
  cpf_cnpj: yup.string().when('tipo', {
    is: 'BOLETO',
    then: yup.string().required('CPF/CNPJ é obrigatório'),
  }),
  chave_pix: yup.string().when('tipo', {
    is: 'PIX',
    then: yup.string().required('Chave PIX é obrigatória'),
  }),
});

const Pagamentos = () => {
  const [open, setOpen] = useState(false);
  const [pagamentos, setPagamentos] = useState([]);

  const formik = useFormik({
    initialValues: {
      tipo: '',
      valor: '',
      numero_cartao: '',
      nome_titular: '',
      data_validade: '',
      cvv: '',
      cpf_cnpj: '',
      chave_pix: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem('token');
        let payload = {
          tipo: values.tipo,
          valor: values.valor,
        };

        switch (values.tipo) {
          case 'CARTAO':
            payload = {
              ...payload,
              numero_cartao: values.numero_cartao,
              nome_titular: values.nome_titular,
              data_validade: values.data_validade,
              cvv: values.cvv,
            };
            break;
          case 'BOLETO':
            payload = {
              ...payload,
              cpf_cnpj: values.cpf_cnpj,
            };
            break;
          case 'PIX':
            payload = {
              ...payload,
              chave_pix: values.chave_pix,
            };
            break;
        }

        await axios.post('http://localhost:8000/api/pagamentos', payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
        handleClose();
        fetchPagamentos();
      } catch (error) {
        console.error('Erro ao realizar pagamento:', error);
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDENTE':
        return '#FFA726';
      case 'APROVADO':
        return '#66BB6A';
      case 'REJEITADO':
        return '#EF5350';
      default:
        return '#9E9E9E';
    }
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
                  Pagamento {pagamento.tipo}
                </Typography>
                <Typography>Valor: R$ {pagamento.valor}</Typography>
                <Typography>
                  Data: {new Date(pagamento.data_criacao).toLocaleString()}
                </Typography>
                <Typography style={{ color: getStatusColor(pagamento.status) }}>
                  Status: {pagamento.status}
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
            <FormControl fullWidth margin="normal">
              <InputLabel>Tipo de Pagamento</InputLabel>
              <Select
                id="tipo"
                name="tipo"
                value={formik.values.tipo}
                onChange={formik.handleChange}
                error={formik.touched.tipo && Boolean(formik.errors.tipo)}
              >
                <MenuItem value="CARTAO">Cartão</MenuItem>
                <MenuItem value="BOLETO">Boleto</MenuItem>
                <MenuItem value="PIX">PIX</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              margin="normal"
              id="valor"
              name="valor"
              label="Valor"
              type="number"
              value={formik.values.valor}
              onChange={formik.handleChange}
              error={formik.touched.valor && Boolean(formik.errors.valor)}
              helperText={formik.touched.valor && formik.errors.valor}
            />

            {formik.values.tipo === 'CARTAO' && (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  id="numero_cartao"
                  name="numero_cartao"
                  label="Número do Cartão"
                  value={formik.values.numero_cartao}
                  onChange={formik.handleChange}
                  error={formik.touched.numero_cartao && Boolean(formik.errors.numero_cartao)}
                  helperText={formik.touched.numero_cartao && formik.errors.numero_cartao}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="nome_titular"
                  name="nome_titular"
                  label="Nome do Titular"
                  value={formik.values.nome_titular}
                  onChange={formik.handleChange}
                  error={formik.touched.nome_titular && Boolean(formik.errors.nome_titular)}
                  helperText={formik.touched.nome_titular && formik.errors.nome_titular}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="data_validade"
                  name="data_validade"
                  label="Data de Validade"
                  value={formik.values.data_validade}
                  onChange={formik.handleChange}
                  error={formik.touched.data_validade && Boolean(formik.errors.data_validade)}
                  helperText={formik.touched.data_validade && formik.errors.data_validade}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="cvv"
                  name="cvv"
                  label="CVV"
                  value={formik.values.cvv}
                  onChange={formik.handleChange}
                  error={formik.touched.cvv && Boolean(formik.errors.cvv)}
                  helperText={formik.touched.cvv && formik.errors.cvv}
                />
              </>
            )}

            {formik.values.tipo === 'BOLETO' && (
              <TextField
                fullWidth
                margin="normal"
                id="cpf_cnpj"
                name="cpf_cnpj"
                label="CPF/CNPJ"
                value={formik.values.cpf_cnpj}
                onChange={formik.handleChange}
                error={formik.touched.cpf_cnpj && Boolean(formik.errors.cpf_cnpj)}
                helperText={formik.touched.cpf_cnpj && formik.errors.cpf_cnpj}
              />
            )}

            {formik.values.tipo === 'PIX' && (
              <TextField
                fullWidth
                margin="normal"
                id="chave_pix"
                name="chave_pix"
                label="Chave PIX"
                value={formik.values.chave_pix}
                onChange={formik.handleChange}
                error={formik.touched.chave_pix && Boolean(formik.errors.chave_pix)}
                helperText={formik.touched.chave_pix && formik.errors.chave_pix}
              />
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button type="submit" variant="contained">Pagar</Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Pagamentos;
