import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material';
import Navbar from './components/Layout/Navbar';
import Login from './components/Auth/Login';
import Register from './components/Auth/Register';
import Viagens from './components/Viagens/Viagens';
import Aluguel from './components/Aluguel/Aluguel';
import Pagamentos from './components/Pagamentos/Pagamentos';

const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/viagens" element={<Viagens />} />
          <Route path="/aluguel" element={<Aluguel />} />
          <Route path="/pagamentos" element={<Pagamentos />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
