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
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Box,
  IconButton,
  Tooltip,
  Alert,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import axios from 'axios';

const ReservaList = () => {
  const [reservas, setReservas] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [viagens, setViagens] = useState([]);
  const [open, setOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    clienteId: '',
    viagemId: '',
    dataReserva: new Date().toISOString().split('T')[0],
    status: 'PENDENTE'
  });

  useEffect(() => {
    loadReservas();
    loadClientes();
    loadViagens();
  }, []);

  const loadReservas = async () => {
    try {
      const response = await axios.get('http://localhost:5000/reservas');
      setReservas(response.data);
    } catch (error) {
      console.error('Erro ao carregar reservas:', error);
    }
  };

  const loadClientes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/clientes');
      setClientes(response.data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const loadViagens = async () => {
    try {
      const response = await axios.get('http://localhost:5000/viagens');
      setViagens(response.data);
    } catch (error) {
      console.error('Erro ao carregar viagens:', error);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditingId(null);
    setFormData({
      clienteId: '',
      viagemId: '',
      dataReserva: new Date().toISOString().split('T')[0],
      status: 'PENDENTE'
    });
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await axios.put(`http://localhost:5000/reservas/${editingId}`, formData);
        setSnackbar({ open: true, message: 'Reserva atualizada com sucesso!', severity: 'success' });
      } else {
        await axios.post('http://localhost:5000/reservas', formData);
        setSnackbar({ open: true, message: 'Reserva criada com sucesso!', severity: 'success' });
      }
      handleClose();
      loadReservas();
      setFormData({
        clienteId: '',
        viagemId: '',
        dataReserva: new Date().toISOString().split('T')[0],
        status: 'PENDENTE'
      });
    } catch (error) {
      console.error('Erro ao salvar reserva:', error);
      setSnackbar({ open: true, message: 'Erro ao salvar reserva!', severity: 'error' });
    }
  };

  const handleEdit = (reserva) => {
    setFormData({
      clienteId: reserva.clienteId,
      viagemId: reserva.viagemId,
      dataReserva: reserva.dataReserva.split('T')[0],
      status: reserva.status
    });
    setEditingId(reserva.id);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/reservas/${id}`);
      loadReservas();
      setSnackbar({ open: true, message: 'Reserva removida com sucesso!', severity: 'success' });
    } catch (error) {
      console.error('Erro ao deletar reserva:', error);
      setSnackbar({ open: true, message: 'Erro ao remover reserva!', severity: 'error' });
    }
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
          <ConfirmationNumberIcon sx={{ fontSize: 40, mr: 2 }} />
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
            }}
          >
            Reservas
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
          Nova Reserva
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
              <TableCell sx={{ fontWeight: 'bold' }}>Cliente</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Viagem</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data da Reserva</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {reservas.map((reserva) => (
              <TableRow 
                key={reserva.id}
                sx={{ 
                  '&:hover': { 
                    bgcolor: '#f8f8f8'
                  }
                }}
              >
                <TableCell>
                  {clientes.find(c => c.id === reserva.clienteId)?.nome || 'N/A'}
                </TableCell>
                <TableCell>
                  {viagens.find(v => v.id === reserva.viagemId)?.destino || 'N/A'}
                </TableCell>
                <TableCell>{new Date(reserva.dataReserva).toLocaleDateString()}</TableCell>
                <TableCell>
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      borderRadius: 1,
                      display: 'inline-block',
                      bgcolor: 
                        reserva.status === 'CONFIRMADA' ? 'success.light' :
                        reserva.status === 'CANCELADA' ? 'error.light' :
                        'warning.light',
                      color: 
                        reserva.status === 'CONFIRMADA' ? 'success.dark' :
                        reserva.status === 'CANCELADA' ? 'error.dark' :
                        'warning.dark'
                    }}
                  >
                    {reserva.status}
                  </Box>
                </TableCell>
                <TableCell>
                  <Tooltip title="Editar">
                    <IconButton
                      color="primary"
                      size="small"
                      onClick={() => handleEdit(reserva)}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Excluir">
                    <IconButton
                      color="error"
                      size="small"
                      onClick={() => handleDelete(reserva.id)}
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
          {editingId ? 'Editar Reserva' : 'Nova Reserva'}
        </DialogTitle>
        <DialogContent sx={{ p: 3 }}>
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Cliente</InputLabel>
            <Select
              name="clienteId"
              value={formData.clienteId}
              onChange={handleChange}
              label="Cliente"
            >
              {clientes.map((cliente) => (
                <MenuItem key={cliente.id} value={cliente.id}>
                  {cliente.nome}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Viagem</InputLabel>
            <Select
              name="viagemId"
              value={formData.viagemId}
              onChange={handleChange}
              label="Viagem"
            >
              {viagens.map((viagem) => (
                <MenuItem key={viagem.id} value={viagem.id}>
                  {viagem.destino}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            name="dataReserva"
            label="Data da Reserva"
            type="date"
            fullWidth
            value={formData.dataReserva}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            InputLabelProps={{ shrink: true }}
          />

          <FormControl fullWidth margin="normal" variant="outlined">
            <InputLabel>Status</InputLabel>
            <Select
              name="status"
              value={formData.status}
              onChange={handleChange}
              label="Status"
            >
              <MenuItem value="PENDENTE">Pendente</MenuItem>
              <MenuItem value="CONFIRMADA">Confirmada</MenuItem>
              <MenuItem value="CANCELADA">Cancelada</MenuItem>
            </Select>
          </FormControl>
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

export default ReservaList;
