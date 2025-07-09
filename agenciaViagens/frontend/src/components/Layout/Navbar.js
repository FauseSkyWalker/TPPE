import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import GroupIcon from '@mui/icons-material/Group';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PaymentIcon from '@mui/icons-material/Payment';

const Navbar = () => {
  const location = useLocation();
  return (
    <AppBar 
      position="static" 
      sx={{
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar sx={{ py: 1 }}>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/"
            sx={{ 
              flexGrow: 1, 
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: 1
            }}
          >
            <FlightTakeoffIcon sx={{ fontSize: 28 }} />
            Agência de Viagens
          </Typography>
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              component={Link}
              to="/passageiros"
              startIcon={<GroupIcon />}
              color="primary"
              variant={location.pathname === '/passageiros' ? 'contained' : 'text'}
              sx={{
                color: location.pathname === '/passageiros' ? '#fff' : '#666',
                '&:hover': {
                  color: location.pathname === '/passageiros' ? '#fff' : '#2196F3',
                }
              }}
            >
              Passageiros
            </Button>
            <Button
              component={Link}
              to="/viagens"
              startIcon={<FlightTakeoffIcon />}
              color="primary"
              variant={location.pathname === '/viagens' ? 'contained' : 'text'}
              sx={{
                color: location.pathname === '/viagens' ? '#fff' : '#666',
                '&:hover': {
                  color: location.pathname === '/viagens' ? '#fff' : '#2196F3',
                }
              }}
            >
              Viagens
            </Button>
            <Button
              component={Link}
              to="/aluguel"
              startIcon={<DirectionsCarIcon />}
              color="primary"
              variant={location.pathname === '/aluguel' ? 'contained' : 'text'}
              sx={{
                color: location.pathname === '/aluguel' ? '#fff' : '#666',
                '&:hover': {
                  color: location.pathname === '/aluguel' ? '#fff' : '#2196F3',
                }
              }}
            >
              Aluguel
            </Button>
            <Button
              component={Link}
              to="/pagamentos"
              startIcon={<PaymentIcon />}
              color="primary"
              variant={location.pathname === '/pagamentos' ? 'contained' : 'text'}
              sx={{
                color: location.pathname === '/pagamentos' ? '#fff' : '#666',
                '&:hover': {
                  color: location.pathname === '/pagamentos' ? '#fff' : '#2196F3',
                }
              }}
            >
              Pagamentos
            </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
