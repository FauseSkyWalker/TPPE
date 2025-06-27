import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import ClienteList from './pages/ClienteList';
import ViagemList from './pages/ViagemList';
import ReservaList from './pages/ReservaList';

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/clientes" element={<ClienteList />} />
          <Route path="/viagens" element={<ViagemList />} />
          <Route path="/reservas" element={<ReservaList />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
