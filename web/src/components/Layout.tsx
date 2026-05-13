import React from "react";
import { useNavigate, useLocation, Outlet } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Button,
  Typography,
  AppBar,
} from "@mui/material";
import { People, Link, Send, Logout } from "@mui/icons-material";
import { auth } from "../lib/firebase";

const drawerWidth = 240;

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: "Conexões", icon: <Link />, path: "/" },
    { text: "Contatos", icon: <People />, path: "/contacts" },
    { text: "Mensagens", icon: <Send />, path: "/messages" },
  ];

  const handleLogout = () => auth.signOut();

  return (
    <div className="flex">
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar className="bg-blue-700 flex justify-between">
          <Typography variant="h6" noWrap component="div">
            Broadcast SaaS
          </Typography>
          <Button color="inherit" onClick={handleLogout} startIcon={<Logout />}>
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>

      <main className="flex-grow p-8 mt-16 bg-gray-50 min-h-screen">
        <Outlet />{" "}
        {/* Aqui serão renderizadas as páginas (Connections, Contacts, etc) */}
      </main>
    </div>
  );
};
