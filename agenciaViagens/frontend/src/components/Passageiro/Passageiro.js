import React, { useState, useEffect } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,

  CardContent,
  Grid,
  Avatar,
  Chip,
  Divider,
  IconButton,
  Card,
  RadioGroup,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import EmailIcon from '@mui/icons-material/Email';
import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const validationSchema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Digite um email válido').required('Email é obrigatório'),
  senha: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
  tipo: yup.string().required('Tipo de pessoa é obrigatório'),
  cpf: yup.string().when('tipo', {
    is: 'fisica',
    then: () => yup.string()
      .matches(/^\d{11}$/, 'CPF deve ter exatamente 11 dígitos')
      .required('CPF é obrigatório'),
    otherwise: () => yup.string()
  }),
  data_nascimento: yup.string().when('tipo', {
    is: 'fisica',
    then: () => yup.string()
      .matches(/^\d{4}-\d{2}-\d{2}$/, 'Use o formato AAAA-MM-DD')
      .required('Data de nascimento é obrigatória'),
    otherwise: () => yup.string()
  }),
  cnpj: yup.string().when('tipo', {
    is: 'juridica',
    then: () => yup.string()
      .matches(/^\d{14}$/, 'CNPJ deve ter exatamente 14 dígitos')
      .required('CNPJ é obrigatório'),
    otherwise: () => yup.string()
  }),
  razao_social: yup.string().when('tipo', {
    is: 'juridica',
    then: () => yup.string().required('Razão social é obrigatória'),
    otherwise: () => yup.string()
  }),
});

const Passageiro = () => {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState('fisica');
  const [passageiros, setPassageiros] = useState([]);

  useEffect(() => {
    loadPassageiros();
  }, []);

  const loadPassageiros = async () => {
    try {
      const response = await axios.get(`${API_URL}/usuarios/pessoas-fisicas`);
      setPassageiros(response.data);
    } catch (error) {
      console.error('Erro ao carregar passageiros:', error);
    }
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    formik.resetForm();
  };

  const formik = useFormik({
    initialValues: {
      nome: '',
      email: '',
      senha: '',
      tipo: 'fisica',
      cpf: '',
      data_nascimento: '',
      cnpj: '',
      razao_social: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const endpoint = values.tipo === 'fisica' 
          ? `${API_URL}/usuarios/pessoa-fisica`
          : `${API_URL}/usuarios/pessoa-juridica`;

        // Remove qualquer caractere não numérico do CPF/CNPJ
        const cpfLimpo = values.cpf.replace(/\D/g, '');
        const cnpjLimpo = values.cnpj.replace(/\D/g, '');
        
        const payload = values.tipo === 'fisica'
          ? {
              usuario: {
                nome: values.nome,
                email: values.email,
                senha: values.senha,
              },
              cpf: cpfLimpo,
              data_nascimento: values.data_nascimento,
            }
          : {
              usuario: {
                nome: values.nome,
                email: values.email,
                senha: values.senha,
              },
              cnpj: cnpjLimpo,
              razao_social: values.razao_social,
            };

        await axios.post(endpoint, payload);
        handleClose();
        loadPassageiros();
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
      }
    },
  });

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
    formik.setFieldValue('tipo', event.target.value);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/usuarios/pessoas-fisicas/${id}`);
      loadPassageiros();
    } catch (error) {
      console.error('Erro ao deletar passageiro:', error);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 600 }}>
            Passageiros
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={handleClickOpen}
            sx={{
              px: 3,
              py: 1,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)',
              '&:hover': {
                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
              }
            }}
          >
            Novo Passageiro
          </Button>
        </Box>

        <Grid container spacing={3}>
          {passageiros.map((passageiro) => (
            <Grid item xs={12} sm={6} md={4} key={passageiro.id}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                }}
              >
                <CardContent sx={{ flex: 1 }}>
                  <Box sx={{ position: 'absolute', top: 16, right: 16 }}>
                    <IconButton
                      onClick={() => handleDelete(passageiro.id)}
                      sx={{
                        color: 'error.light',
                        '&:hover': { color: 'error.main' },
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>

                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        bgcolor: 'primary.main',
                        width: 56,
                        height: 56,
                        mr: 2
                      }}
                    >
                      {passageiro.cpf ? <PersonIcon /> : <BusinessIcon />}
                    </Avatar>
                    <Box>
                      <Typography variant="h6" gutterBottom sx={{ fontWeight: 500 }}>
                        {passageiro.usuario.nome}
                      </Typography>
                      <Chip
                        size="small"
                        label={passageiro.cpf ? 'Pessoa Física' : 'Pessoa Jurídica'}
                        color="primary"
                        variant="outlined"
                      />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    {passageiro.cpf && (
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <PersonIcon fontSize="small" />
                        CPF: {passageiro.cpf}
                      </Typography>
                    )}
                    {passageiro.cnpj && (
                      <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <BusinessIcon fontSize="small" />
                        CNPJ: {passageiro.cnpj}
                      </Typography>
                    )}
                    <Typography variant="body2" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <EmailIcon fontSize="small" />
                      {passageiro.usuario.email}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Dialog 
        open={open} 
        onClose={handleClose} 
        maxWidth="sm" 
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <PersonAddIcon color="primary" />
            <Typography variant="h6" component="span">
              Novo Passageiro
            </Typography>
          </Box>
        </DialogTitle>
        <form onSubmit={formik.handleSubmit}>
          <DialogContent>
            <TextField
              fullWidth
              margin="normal"
              id="nome"
              name="nome"
              label="Nome"
              value={formik.values.nome}
              onChange={formik.handleChange}
              error={formik.touched.nome && Boolean(formik.errors.nome)}
              helperText={formik.touched.nome && formik.errors.nome}
            />
            <TextField
              fullWidth
              margin="normal"
              id="email"
              name="email"
              label="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              error={formik.touched.email && Boolean(formik.errors.email)}
              helperText={formik.touched.email && formik.errors.email}
            />
            <TextField
              fullWidth
              margin="normal"
              id="senha"
              name="senha"
              label="Senha"
              type="password"
              value={formik.values.senha}
              onChange={formik.handleChange}
              error={formik.touched.senha && Boolean(formik.errors.senha)}
              helperText={formik.touched.senha && formik.errors.senha}
            />

            <FormControl component="fieldset" margin="normal">
              <FormLabel component="legend">Tipo de Pessoa</FormLabel>
              <RadioGroup row name="tipo" value={tipo} onChange={handleTipoChange}>
                <FormControlLabel value="fisica" control={<Radio />} label="Física" />
                <FormControlLabel value="juridica" control={<Radio />} label="Jurídica" />
              </RadioGroup>
            </FormControl>

            {tipo === 'fisica' ? (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  id="cpf"
                  name="cpf"
                  label="CPF"
                  value={formik.values.cpf}
                  onChange={formik.handleChange}
                  error={formik.touched.cpf && Boolean(formik.errors.cpf)}
                  helperText={formik.touched.cpf && formik.errors.cpf}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="data_nascimento"
                  name="data_nascimento"
                  label="Data de Nascimento"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  value={formik.values.data_nascimento}
                  onChange={formik.handleChange}
                  error={formik.touched.data_nascimento && Boolean(formik.errors.data_nascimento)}
                  helperText={formik.touched.data_nascimento && formik.errors.data_nascimento}
                />
              </>
            ) : (
              <>
                <TextField
                  fullWidth
                  margin="normal"
                  id="cnpj"
                  name="cnpj"
                  label="CNPJ"
                  value={formik.values.cnpj}
                  onChange={formik.handleChange}
                  error={formik.touched.cnpj && Boolean(formik.errors.cnpj)}
                  helperText={formik.touched.cnpj && formik.errors.cnpj}
                />
                <TextField
                  fullWidth
                  margin="normal"
                  id="razao_social"
                  name="razao_social"
                  label="Razão Social"
                  value={formik.values.razao_social}
                  onChange={formik.handleChange}
                  error={formik.touched.razao_social && Boolean(formik.errors.razao_social)}
                  helperText={formik.touched.razao_social && formik.errors.razao_social}
                />
              </>
            )}
          </DialogContent>
          <DialogActions sx={{ 
            borderTop: '1px solid',
            borderColor: 'divider',
            p: 2,
            gap: 1
          }}>
            <Button 
              onClick={handleClose}
              variant="outlined"
              sx={{ borderRadius: 2 }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{ 
                borderRadius: 2,
                px: 3,
                boxShadow: '0 2px 8px rgba(33, 150, 243, 0.2)',
                '&:hover': {
                  boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                }
              }}
            >
              Salvar
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Container>
  );
};

export default Passageiro;
