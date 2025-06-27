import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { Link, useLocation } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';
import PeopleIcon from '@mui/icons-material/People';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import ConfirmationNumberIcon from '@mui/icons-material/ConfirmationNumber';
import MenuIcon from '@mui/icons-material/Menu';

const Layout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/' },
    { text: 'Clientes', icon: <PeopleIcon />, path: '/clientes' },
    { text: 'Viagens', icon: <FlightTakeoffIcon />, path: '/viagens' },
    { text: 'Reservas', icon: <ConfirmationNumberIcon />, path: '/reservas' }
  ];

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ mt: 2 }}>
      <List>
        {menuItems.map((item) => (
          <ListItem 
            button 
            key={item.text} 
            component={Link} 
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              '&.Mui-selected': {
                backgroundColor: 'primary.main',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white'
                },
                '&:hover': {
                  backgroundColor: 'primary.dark'
                }
              },
              '&:hover': {
                backgroundColor: 'primary.light',
                color: 'white',
                '& .MuiListItemIcon-root': {
                  color: 'white'
                }
              },
              borderRadius: 2,
              m: 1,
              pl: 2
            }}
          >
            <ListItemIcon sx={{ color: location.pathname === item.path ? 'white' : 'inherit' }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f5f5f5' }}>
      <AppBar 
        position="fixed" 
        sx={{ 
          zIndex: (theme) => theme.zIndex.drawer + 1,
          background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)'
        }}
      >
        <Toolbar>
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography 
            variant="h6" 
            component="div" 
            sx={{ 
              flexGrow: 1,
              fontWeight: 'bold',
              letterSpacing: 1
            }}
          >
            ✈️ Agência de Viagens
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: 240 }, flexShrink: { sm: 0 } }}
      >
        {isMobile ? (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 240,
                bgcolor: 'background.default'
              }
            }}
          >
            {drawer}
          </Drawer>
        ) : (
          <Drawer
            variant="permanent"
            sx={{
              '& .MuiDrawer-paper': { 
                boxSizing: 'border-box', 
                width: 240,
                bgcolor: 'background.default',
                borderRight: '1px solid rgba(0, 0, 0, 0.12)'
              }
            }}
            open
          >
            <Toolbar />
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - 240px)` },
          mt: 8,
          backgroundColor: '#f5f5f5'
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default Layout;
