import React, { useState } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
  CssBaseline,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AcUnitIcon from '@mui/icons-material/AcUnit';
import HistoryIcon from '@mui/icons-material/History';
import DeviceThermostatIcon from '@mui/icons-material/DeviceThermostat';
import BarChartIcon from '@mui/icons-material/BarChart';

const drawerWidth = 240; // 사이드바 너비

// 메뉴 아이템 정의
const menuItems = [
  { text: '홈', icon: <HomeIcon />, path: '/' },
  { text: '에어컨 제어', icon: <AcUnitIcon />, path: '/aircon/control' },
  { text: '실시간 온습도', icon: <DeviceThermostatIcon />, path: '/temp/check' },
  { text: '제어 기록', icon: <HistoryIcon />, path: '/aircon/history' },
  { text: '온습도 기록', icon: <BarChartIcon />, path: '/temp/history' },
];

/**
 * MUI의 AppBar와 Drawer를 사용한 메인 대시보드 레이아웃
 * (기존 Header, Side, Footer 대체)
 */
function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  // 'md' (768px) 미만일 경우 모바일로 간주
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  // Drawer (사이드바)에 표시될 컨텐츠
  const drawerContent = (
    <div>
      <Toolbar />
      <Box sx={{ overflow: 'auto' }}>
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={location.pathname === item.path}
                onClick={isMobile ? handleDrawerToggle : undefined}
                sx={{
                  borderRadius: '0 100px 100px 0',
                  marginRight: '10px',
                  '&.Mui-selected': {
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '& .MuiListItemIcon-root': {
                      color: 'white',
                    },
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    },
                  },
                }}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: 'none' } }} // 모바일에서만 햄버거 메뉴 보이기
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            Smart Home Dashboard
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* Mobile Drawer (Temporary) */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
            },
          }}
        >
          {drawerContent}
        </Drawer>

        {/* Desktop Drawer (Permanent) */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              borderRight: 'none',
              backgroundColor: '#fdfdfd',
            },
          }}
          open
        >
          {drawerContent}
        </Drawer>
      </Box>

      {/* 메인 컨텐츠 영역 */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Toolbar />
        <Box sx={{ flexGrow: 1 }}>{children}</Box>

        {/* Footer */}
        <Box
          component="footer"
          sx={{
            textAlign: 'center',
            py: 2,
            mt: 4,
            color: 'text.secondary',
          }}
        >
          <Typography variant="body2">
            &copy; {new Date().getFullYear()} SmartApp. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

// export default Layout;
