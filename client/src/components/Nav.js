import FitnessIcon from '@mui/icons-material/FitnessCenter';
import MenuIcon from '@mui/icons-material/Menu';
import AppBar from '@mui/material/AppBar';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { React, useState } from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';
import useLogout from '../hooks/useLogout';

function Nav() {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const logout = useLogout();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  // User Functions
  const handleLogoutBtn = async () => {
    await logout();
    navigate('/');
  };

  const handleAccountBtn = () => {
    navigate('/myaccount');
  };

  const renderLoggedInNav = () => {
    const pages = [
      { name: 'Home', path: '/' },
      { name: 'Sessions', path: '/sessions' },
      { name: 'Workouts', path: '/workouts' },
      { name: 'Explore Workouts', path: '/explore' },
    ];

    const settings = [
      { name: 'Account', onClick: handleAccountBtn },
      { name: 'Logout', onClick: handleLogoutBtn },
    ];

    return (
      <AppBar position="static" sx={{ backgroundColor: '#333333' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <FitnessIcon
              sx={{
                display: { xs: 'none', md: 'flex' },
                mr: 1.5,
                color: 'gold',
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              WORKOUTS
            </Typography>

            {/*small menu */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem
                    component="a"
                    href={page.path}
                    key={page.name}
                    onClick={handleCloseNavMenu}
                  >
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
            <FitnessIcon
              sx={{
                display: { xs: 'flex', md: 'none' },
                mr: 1.5,
                color: 'gold',
              }}
            />
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              WORKOUTS
            </Typography>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  component="a"
                  href={page.path}
                  key={page.name}
                  onClick={handleCloseNavMenu}
                  sx={{
                    my: 2,
                    color: 'white',
                    display: 'block',
                    ':hover': { color: 'gold' },
                  }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Open settings">
                <Button
                  onClick={handleOpenUserMenu}
                  size="large"
                  sx={{
                    my: 2,
                    color: 'black',
                    backgroundColor: 'gold',
                    display: 'block',
                    ':hover': { color: 'gold' },
                  }}
                >
                  {auth.firstName}
                </Button>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => {
                      handleCloseUserMenu();
                      setting.onClick();
                    }}
                  >
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>
    );
  };

  const renderLoggedOutNav = () => {
    return (
      <AppBar position="static" sx={{ backgroundColor: '#333333' }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            <FitnessIcon
              sx={{
                display: { xs: 'none', md: 'flex' },
                mr: 1.5,
                color: 'gold',
              }}
            />
            <Typography
              variant="h6"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                justifyContent: 'center',
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              WORKOUTS
            </Typography>
            <FitnessIcon
              sx={{
                display: { xs: 'flex', md: 'none' },
                mr: 1.5,
                color: 'gold',
              }}
            />
            <Typography
              variant="h5"
              noWrap
              component={Link}
              to="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontFamily: 'monospace',
                fontWeight: 700,
                letterSpacing: '.3rem',
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              WORKOUTS
            </Typography>
          </Toolbar>
        </Container>
      </AppBar>
    );
  };

  return auth?.accessToken ? renderLoggedInNav() : renderLoggedOutNav();
}

export default Nav;
