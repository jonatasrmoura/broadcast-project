import React, { useState } from "react";
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
  IconButton,
  useMediaQuery,
  useTheme,
  Box,
  Divider,
} from "@mui/material";
import {
  People,
  Link as LinkIcon,
  Send,
  Logout,
  Menu as MenuIcon,
  Code,
  Translate,
} from "@mui/icons-material";
import { auth } from "../lib/firebase";

const drawerWidth = 260;

export const Layout: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  const menuItems = [
    { text: "Conexões", icon: <LinkIcon />, path: "/" },
    { text: "Contatos", icon: <People />, path: "/contacts" },
    { text: "Mensagens", icon: <Send />, path: "/messages" },
  ];

  const devItems = [{ text: "Coding for Dev", icon: <Code />, path: "/dev" }];

  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const handleLogout = () => auth.signOut();

  const drawerContent = (
    <div className="h-full bg-slate-50 flex flex-col">
      <Toolbar className="flex items-center px-6 border-b border-slate-200">
        <Typography
          variant="h6"
          className="font-bold text-slate-800 tracking-tight"
        >
          Broadcast <span className="text-blue-600">SaaS</span>
        </Typography>
      </Toolbar>

      <List className="px-3 py-4 flex-grow">
        <Typography
          variant="caption"
          className="px-4 text-slate-400 font-bold uppercase tracking-wider mb-2 block"
        >
          Menu Principal
        </Typography>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding className="mb-1">
            <ListItemButton
              selected={location.pathname === item.path}
              onClick={() => {
                navigate(item.path);
                if (isMobile) setMobileOpen(false);
              }}
              className={`rounded-xl transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-blue-600! text-white shadow-md"
                  : "text-slate-600 hover:bg-slate-200"
              }`}
            >
              <ListItemIcon
                className={
                  location.pathname === item.path
                    ? "text-white"
                    : "text-slate-500"
                }
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{ primary: { className: "font-semibold text-sm" } }}
              />
            </ListItemButton>
          </ListItem>
        ))}

        <Divider className="my-4 mx-4" />

        <Typography
          variant="caption"
          className="px-4 text-slate-400 font-bold uppercase tracking-wider mb-2 block"
        >
          Desenvolvedor
        </Typography>
        {devItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              onClick={() => isMobile && setMobileOpen(false)}
              className="rounded-xl text-slate-600 hover:bg-slate-200"
            >
              <ListItemIcon className="text-slate-500">
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                slotProps={{ primary: { className: "font-semibold text-sm" } }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <div className="p-4 border-t border-slate-200 bg-white">
        <Button
          startIcon={<Translate />}
          fullWidth
          className="text-slate-500! justify-start capitalize font-medium"
        >
          PT / EN
        </Button>
      </div>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-slate-50/50">
      <AppBar
        position="fixed"
        elevation={0}
        className="bg-white/80! backdrop-blur-md border-b border-slate-200"
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
        }}
      >
        <Toolbar className="flex justify-between px-4 sm:px-8">
          <div className="flex items-center">
            {isMobile && (
              <IconButton
                edge="start"
                onClick={handleDrawerToggle}
                className="mr-2 text-slate-700"
              >
                <MenuIcon />
              </IconButton>
            )}
            <Typography variant="h6" className="font-bold text-slate-800">
              {menuItems.find((item) => item.path === location.pathname)
                ?.text || "Dashboard"}
            </Typography>
          </div>
          <Button
            onClick={handleLogout}
            className="text-slate-500! hover:text-red-500! transition-colors font-semibold"
            startIcon={<Logout />}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
      >
        <Drawer
          variant={isMobile ? "temporary" : "permanent"}
          open={isMobile ? mobileOpen : true}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              borderRight: "1px solid #e2e8f0",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      </Box>

      <main className="flex-grow p-4 sm:p-8 mt-16 max-w-7xl mx-auto w-full">
        <div className="animate-in fade-in slide-in-from-bottom-3 duration-700">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
