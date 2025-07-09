import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  RadioGroup,
  FormControlLabel,
  Radio,
  FormControl,
  FormLabel,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const validationSchema = yup.object({
  nome: yup.string().required('Nome é obrigatório'),
  email: yup.string().email('Digite um email válido').required('Email é obrigatório'),
  senha: yup.string().min(6, 'A senha deve ter no mínimo 6 caracteres').required('Senha é obrigatória'),
  tipo: yup.string().required('Tipo de pessoa é obrigatório'),
  cpf: yup.string().when('tipo', {
    is: 'fisica',
    then: yup.string().required('CPF é obrigatório'),
  }),
  data_nascimento: yup.string().when('tipo', {
    is: 'fisica',
    then: yup.string().required('Data de nascimento é obrigatória'),
  }),
  cnpj: yup.string().when('tipo', {
    is: 'juridica',
    then: yup.string().required('CNPJ é obrigatório'),
  }),
  razao_social: yup.string().when('tipo', {
    is: 'juridica',
    then: yup.string().required('Razão social é obrigatória'),
  }),
});

const Register = () => {
  const navigate = useNavigate();
  const [tipo, setTipo] = useState('fisica');

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
          ? 'http://localhost:8000/api/usuarios/pessoa-fisica'
          : 'http://localhost:8000/api/usuarios/pessoa-juridica';

        const payload = values.tipo === 'fisica'
          ? {
              usuario: {
                nome: values.nome,
                email: values.email,
                senha: values.senha,
              },
              cpf: values.cpf,
              data_nascimento: values.data_nascimento,
            }
          : {
              usuario: {
                nome: values.nome,
                email: values.email,
                senha: values.senha,
              },
              cnpj: values.cnpj,
              razao_social: values.razao_social,
            };

        await axios.post(endpoint, payload);
        navigate('/login');
      } catch (error) {
        console.error('Erro ao cadastrar:', error);
      }
    },
  });

  const handleTipoChange = (event) => {
    setTipo(event.target.value);
    formik.setFieldValue('tipo', event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Cadastro
        </Typography>
        <Box component="form" onSubmit={formik.handleSubmit} sx={{ mt: 1 }}>
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

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cadastrar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
