import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Agência de Viagens
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">Home</Button>
          <Button color="inherit" component={Link} to="/login">Login</Button>
          <Button color="inherit" component={Link} to="/register">Cadastro</Button>
          <Button color="inherit" component={Link} to="/viagens">Viagens</Button>
          <Button color="inherit" component={Link} to="/aluguel">Aluguel</Button>
          <Button color="inherit" component={Link} to="/pagamentos">Pagamentos</Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
