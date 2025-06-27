import React, { useState, useEffect } from 'react';
import { 
  Typography, 
  Button, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Box,
  IconButton,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import axios from 'axios';

const ViagemList = () => {
  const [viagens, setViagens] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    destino: '',
    dataPartida: '',
    dataRetorno: '',
    preco: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadViagens();
  }, []);

  const loadViagens = async () => {
    try {
      const response = await axios.get('http://localhost:5000/viagens');
      setViagens(response.data);
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
    }
  };

  const handleOpen = () => setOpen(true);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/viagens/${editingId}`, formData);
        setSnackbar({ open: true, message: 'Viagem atualizada com sucesso!', severity: 'success' });
      } else {
        await axios.post('http://localhost:5000/viagens', formData);
        setSnackbar({ open: true, message: 'Viagem criada com sucesso!', severity: 'success' });
      }
      handleClose();
      loadViagens();
      setFormData({ destino: '', dataPartida: '', dataRetorno: '', preco: '' });
    } catch (error) {
      console.error('Erro ao salvar viagem:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar viagem!', severity: 'error' });
    }
  };

  const handleEdit = (viagem) => {
    setFormData({
      destino: viagem.destino,
      dataPartida: viagem.dataPartida.split('T')[0],
      dataRetorno: viagem.dataRetorno.split('T')[0],
      preco: viagem.preco
    });
    setEditingId(viagem.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/viagens/${id}`);
      loadViagens();
      setSnackbar({ open: true, message: 'Viagem removida com sucesso!', severity: 'success' });
    } catch (error) {
      console.error('Erro ao deletar viagem:', error);
      setSnackbar({ open: true, message: 'Erro ao remover viagem!', severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({ destino: '', dataPartida: '', dataRetorno: '', preco: '' });
  };

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 3, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <FlightTakeoffIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Viagens
          </Typography>
        </Box>
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<AddIcon />}
          sx={{
            bgcolor: 'white',
            color: 'primary.main',
            '&:hover': {
              bgcolor: 'rgba(255,255,255,0.9)'
            }
          }}
        >
          Nova Viagem
        </Button>
      </Paper>

      <TableContainer 
        component={Paper}
        sx={{
          borderRadius: 2,
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
          overflow: 'hidden'
        }}
      >
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#f5f5f5' }}>
              <TableCell sx={{ fontWeight: 'bold' }}>Destino</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data de Partida</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data de Retorno</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Preço</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {viagens.map((viagem) => (
              <TableRow 
                key={viagem.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: '#f8f8f8'
                  }
                }}
              >
                <TableCell>{viagem.destino}</TableCell>
                <TableCell>{new Date(viagem.dataPartida).toLocaleDateString()}</TableCell>
                <TableCell>{new Date(viagem.dataRetorno).toLocaleDateString()}</TableCell>
                <TableCell>R$ {viagem.preco}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(viagem)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(viagem.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog 
        open={open} 
        onClose={handleClose}
        PaperProps={{
          sx: {
            borderRadius: 2,
            maxWidth: 500,
            width: '100%'
          }
        }}
      >
        <DialogTitle sx={{ 
          bgcolor: 'primary.main', 
          color: 'white',
          px: 3,
          py: 2
        }}>
          {editingId ? 'Editar Viagem' : 'Nova Viagem'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            name="destino"
            label="Destino"
            fullWidth
            value={formData.destino}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            name="dataPartida"
            label="Data de Partida"
            type="date"
            fullWidth
            value={formData.dataPartida}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="dataRetorno"
            label="Data de Retorno"
            type="date"
            fullWidth
            value={formData.dataRetorno}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            name="preco"
            label="Preço"
            type="number"
            fullWidth
            value={formData.preco}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputProps={{
              startAdornment: 'R$ '
            }}
          />
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={handleClose}
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            startIcon={editingId ? <EditIcon /> : <AddIcon />}
          >
            {editingId ? 'Atualizar' : 'Salvar'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert 
          onClose={() => setSnackbar({ ...snackbar, open: false })} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ViagemList;
