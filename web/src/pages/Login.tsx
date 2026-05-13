import React, { useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Box,
  InputAdornment,
  IconButton,
} from "@mui/material";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";
import {
  EmailOutlined,
  LockOutlined,
  VisibilityOutlined,
  VisibilityOffOutlined,
  RocketLaunchOutlined,
} from "@mui/icons-material";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, password);
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      alert("Erro na autenticação: " + (error as Error).message);
    }
  };

  return (
    <Box className="min-h-screen flex items-center justify-center bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-blue-100 via-slate-50 to-indigo-100 p-4">
      <Container
        maxWidth="xs"
        className="animate-in fade-in zoom-in duration-700"
      >
        {/* Logo / Header da App */}
        <Box className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-blue-600 rounded-3xl flex items-center justify-center shadow-xl shadow-blue-200 mb-4 transform hover:scale-110 transition-transform cursor-default">
            <RocketLaunchOutlined className="text-white text-3xl" />
          </div>
          <Typography
            variant="h4"
            className="font-black text-slate-900 tracking-tight text-center"
          >
            Broadcast <span className="text-blue-600">SaaS</span>
          </Typography>
          <Typography className="text-slate-500 font-medium mt-1">
            {isRegister ? "Crie sua conta agora" : "Bem-vindo de volta"}
          </Typography>
        </Box>

        {/* Card de Login */}
        <Paper
          elevation={0}
          className="p-8 w-full flex flex-col gap-6 border border-white/50 rounded-[2.5rem] bg-white/80 backdrop-blur-xl shadow-2xl shadow-blue-900/5"
        >
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <TextField
              label="E-mail"
              variant="outlined"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              slotProps={{
                input: {
                  className: "rounded-2xl bg-slate-50/50",
                  startAdornment: (
                    <InputAdornment position="start">
                      <EmailOutlined
                        className="text-slate-400"
                        fontSize="small"
                      />
                    </InputAdornment>
                  ),
                },
              }}
            />

            <TextField
              label="Senha"
              type={showPassword ? "text" : "password"}
              variant="outlined"
              fullWidth
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              slotProps={{
                input: {
                  className: "rounded-2xl bg-slate-50/50",
                  startAdornment: (
                    <InputAdornment position="start">
                      <LockOutlined
                        className="text-slate-400"
                        fontSize="small"
                      />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? (
                          <VisibilityOffOutlined fontSize="small" />
                        ) : (
                          <VisibilityOutlined fontSize="small" />
                        )}
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              disableElevation
              className="bg-blue-600! hover:bg-blue-700! h-14 rounded-2xl capitalize font-bold text-lg shadow-lg shadow-blue-200 mt-2"
            >
              {isRegister ? "Criar Conta" : "Entrar"}
            </Button>
          </form>

          <Box className="text-center">
            <Typography variant="body2" className="text-slate-500 inline mr-1">
              {isRegister ? "Já possui acesso?" : "Ainda não tem conta?"}
            </Typography>
            <Button
              onClick={() => setIsRegister(!isRegister)}
              className="text-blue-600! font-bold capitalize p-0 min-w-0 hover:bg-transparent!"
            >
              {isRegister ? "Fazer Login" : "Cadastre-se"}
            </Button>
          </Box>
        </Paper>

        <Typography
          variant="caption"
          className="block text-center mt-10 text-slate-400 font-medium"
        >
          © 2024 Broadcast SaaS. Todos os direitos reservados.
        </Typography>
      </Container>
    </Box>
  );
};
