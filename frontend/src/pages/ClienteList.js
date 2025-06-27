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
import axios from 'axios';

const ClienteList = () => {
  const [clientes, setClientes] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    telefone: ''
  });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    loadClientes();
  }, []);

  const loadClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
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
        await axios.put(`http://localhost:5000/clientes/${editingId}`, formData);
        setSnackbar({ open: true, message: 'Cliente atualizado com sucesso!', severity: 'success' });
      } else {
        await axios.post('http://localhost:5000/clientes', formData);
        setSnackbar({ open: true, message: 'Cliente criado com sucesso!', severity: 'success' });
      }
      handleClose();
      loadClientes();
      setFormData({ nome: '', email: '', telefone: '' });
    } catch (error) {
      console.error('Erro ao salvar cliente:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar cliente!', severity: 'error' });
    }
  };

  const handleEdit = (cliente) => {
    setFormData({
      nome: cliente.nome,
      email: cliente.email,
      telefone: cliente.telefone
    });
    setEditingId(cliente.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/clientes/${id}`);
      loadClientes();
      setSnackbar({ open: true, message: 'Cliente removido com sucesso!', severity: 'success' });
    } catch (error) {
      console.error('Erro ao deletar cliente:', error);
      setSnackbar({ open: true, message: 'Erro ao remover cliente!', severity: 'error' });
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({ nome: '', email: '', telefone: '' });
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
        <Typography 
          variant="h4" 
          sx={{ 
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Clientes
        </Typography>
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
          Novo Cliente
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
              <TableCell sx={{ fontWeight: 'bold' }}>Nome</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Telefone</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {clientes.map((cliente) => (
              <TableRow 
                key={cliente.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: '#f8f8f8'
                  }
                }}
              >
                <TableCell>{cliente.nome}</TableCell>
                <TableCell>{cliente.email}</TableCell>
                <TableCell>{cliente.telefone}</TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(cliente)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(cliente.id)}
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
          {editingId ? 'Editar Cliente' : 'Novo Cliente'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <TextField
            name="nome"
            label="Nome"
            fullWidth
            value={formData.nome}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
          />
          <TextField
            name="email"
            label="Email"
            fullWidth
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            type="email"
          />
          <TextField
            name="telefone"
            label="Telefone"
            fullWidth
            value={formData.telefone}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
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

export default ClienteList;
