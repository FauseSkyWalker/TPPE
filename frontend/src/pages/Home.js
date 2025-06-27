import React from 'react';
import { 
  Typography, 
  Card, 
  CardContent, 
  Grid, 
  Box, 
  CardMedia,
  Button,
  CardActions,
  Paper
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PeopleIcon from '@mui/icons-material/People';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';

const Home = () => {
  const navigate = useNavigate();

  const cards = [
    {
      title: 'Clientes',
      description: 'Gerencie os clientes da agência. Cadastre novos clientes e mantenha suas informações atualizadas.',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      path: '/clientes',
      image: 'https://source.unsplash.com/random/400x200/?customer'
    },
    {
      title: 'Viagens',
      description: 'Gerencie os pacotes de viagens disponíveis. Crie novos destinos e configure preços.',
      icon: <FlightTakeoffIcon sx={{ fontSize: 40 }} />,
      path: '/viagens',
      image: 'https://source.unsplash.com/random/400x200/?travel'
    },
    {
      title: 'Reservas',
      description: 'Gerencie as reservas dos clientes. Acompanhe o status e faça alterações quando necessário.',
      icon: <ConfirmationNumberIcon sx={{ fontSize: 40 }} />,
      path: '/reservas',
      image: 'https://source.unsplash.com/random/400x200/?booking'
    }
  ];

  return (
    <Box sx={{ maxWidth: 1200, margin: '0 auto' }}>
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, 
          mb: 4, 
          borderRadius: 2,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
          color: 'white'
        }}
      >
        <Typography 
          variant="h3" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)'
          }}
        >
          Bem-vindo à Agência de Viagens
        </Typography>
        <Typography variant="h6" sx={{ maxWidth: 600, opacity: 0.9 }}>
          Sistema de gerenciamento completo para sua agência de viagens.
          Gerencie clientes, viagens e reservas de forma simples e eficiente.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {cards.map((card) => (
          <Grid item xs={12} md={4} key={card.title}>
            <Card 
              sx={{ 
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 6
                }
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={card.image}
                alt={card.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box sx={{ 
                    mr: 2, 
                    color: 'primary.main',
                    display: 'flex',
                    alignItems: 'center'
                  }}>
                    {card.icon}
                  </Box>
                  <Typography variant="h5" component="h2">
                    {card.title}
                  </Typography>
                </Box>
                <Typography variant="body1" color="text.secondary">
                  {card.description}
                </Typography>
              </CardContent>
              <CardActions sx={{ p: 2 }}>
                <Button 
                  size="large" 
                  variant="contained" 
                  fullWidth
                  onClick={() => navigate(card.path)}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    '&:hover': {
                      background: 'linear-gradient(45deg, #1976D2 30%, #1CB5E0 90%)'
                    }
                  }}
                >
                  Acessar {card.title}
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default Home;
