import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
} from '@mui/material';
import axios from 'axios';

const Pagamento = () => {
  const [selectedType, setSelectedType] = useState(null);
  const [pagamentos, setPagamentos] = useState([]);
  const [formData, setFormData] = useState({
    valor: '',
    status: 'PENDENTE',
    numero: '',
    validade: '',
    cvv: '',
    codigo_barras: '',
    chave: '',
  });

  useEffect(() => {
    loadPagamentos();
  }, []);

  const loadPagamentos = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/pagamentos/');
      setPagamentos(response.data);
    } catch (error) {
      console.error('Erro ao carregar pagamentos:', error);
      alert('Erro ao carregar pagamentos');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let payload;

      // Criar payload específico para cada tipo
      if (selectedType === 'CARTAO') {
        payload = {
          valor: parseFloat(formData.valor),
          tipo: 'CARTAO',
          status: 'PENDENTE',
          numero: formData.numero,
          validade: formData.validade,
          cvv: formData.cvv,
        };
      } else if (selectedType === 'BOLETO') {
        payload = {
          valor: parseFloat(formData.valor),
          tipo: 'BOLETO',
          status: 'PENDENTE',
          codigo_barras: formData.codigo_barras,
        };
      } else if (selectedType === 'PIX') {
        payload = {
          valor: parseFloat(formData.valor),
          tipo: 'PIX',
          status: 'PENDENTE',
          chave: formData.chave,
        };
      }

      const endpoint = `/api/pagamentos/${selectedType.toLowerCase()}`;
      await axios.post(`http://localhost:8000${endpoint}`, payload);
      alert('Pagamento registrado com sucesso!');
      loadPagamentos(); // Recarregar a lista

      // Limpar formulário
      setFormData({
        valor: '',
        status: 'PENDENTE',
        numero: '',
        validade: '',
        cvv: '',
        codigo_barras: '',
        chave: '',
      });
      setSelectedType(null);
    } catch (error) {
      console.error('Erro ao registrar pagamento:', error);
      alert('Erro ao registrar pagamento');
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '20px' }}>
      <Paper elevation={3} style={{ padding: '20px', marginBottom: '20px' }}>
        {!selectedType ? (
          <>
            <Typography variant="h5" gutterBottom>
              Selecione o Tipo de Pagamento
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setSelectedType('CARTAO')}
                >
                  Pagar com Cartão
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setSelectedType('BOLETO')}
                >
                  Gerar Boleto
                </Button>
              </Grid>
              <Grid item xs={12} sm={4}>
                <Button
                  variant="contained"
                  fullWidth
                  onClick={() => setSelectedType('PIX')}
                >
                  Pagar com PIX
                </Button>
              </Grid>
            </Grid>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <Typography variant="h5" gutterBottom>
              {selectedType === 'CARTAO' && 'Pagamento com Cartão'}
              {selectedType === 'BOLETO' && 'Gerar Boleto'}
              {selectedType === 'PIX' && 'Pagamento com PIX'}
            </Typography>

            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Valor"
                  name="valor"
                  type="number"
                  value={formData.valor}
                  onChange={handleInputChange}
                  required
                />
              </Grid>

              {selectedType === 'CARTAO' && (
                <>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Número do Cartão"
                      name="numero"
                      value={formData.numero}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Validade"
                      name="validade"
                      value={formData.validade}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="CVV"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      required
                    />
                  </Grid>
                </>
              )}

              {selectedType === 'BOLETO' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Código de Barras"
                    name="codigo_barras"
                    value={formData.codigo_barras}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              )}

              {selectedType === 'PIX' && (
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Chave PIX"
                    name="chave"
                    value={formData.chave}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  {selectedType === 'CARTAO' && 'Pagar com Cartão'}
                  {selectedType === 'BOLETO' && 'Gerar Boleto'}
                  {selectedType === 'PIX' && 'Pagar com PIX'}
                </Button>
              </Grid>

              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => setSelectedType(null)}
                >
                  Voltar
                </Button>
              </Grid>
            </Grid>
          </form>
        )}
      </Paper>

      {/* Lista de Pagamentos */}
      <Paper elevation={3} style={{ padding: '20px', marginTop: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Pagamentos Registrados
        </Typography>
        <Grid container spacing={2}>
          {pagamentos.map((pagamento) => (
            <Grid item xs={12} key={pagamento.id}>
              <Paper elevation={1} style={{ padding: '10px' }}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2">Valor:</Typography>
                    <Typography>R$ {pagamento.valor.toFixed(2)}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2">Tipo:</Typography>
                    <Typography>{pagamento.tipo}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2">Status:</Typography>
                    <Typography>{pagamento.status}</Typography>
                  </Grid>
                  <Grid item xs={12} sm={3}>
                    <Typography variant="subtitle2">Detalhes:</Typography>
                    <Typography>
                      {pagamento.tipo === 'CARTAO' && `Cartão: **** **** **** ${pagamento.numero?.slice(-4)}`}
                      {pagamento.tipo === 'BOLETO' && `Boleto: ${pagamento.codigo_barras?.slice(0, 10)}...`}
                      {pagamento.tipo === 'PIX' && `Chave: ${pagamento.chave}`}
                    </Typography>
                  </Grid>

                </Grid>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Paper>
    </Container>
  );
};

export default Pagamento;
