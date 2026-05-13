import React, { useState } from "react";
import { TextField, Button, Paper, Typography, Container } from "@mui/material";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../lib/firebase";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
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
    <Container
      maxWidth="xs"
      className="h-screen flex items-center justify-center"
    >
      <Paper elevation={3} className="p-8 w-full flex flex-col gap-4">
        <Typography variant="h5" className="text-center font-bold">
          {isRegister ? "Criar Conta SAAS" : "Login Broadcast"}
        </Typography>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <TextField
            label="E-mail"
            variant="outlined"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Senha"
            type="password"
            variant="outlined"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            fullWidth
          >
            {isRegister ? "Cadastrar" : "Entrar"}
          </Button>
        </form>

        <Button onClick={() => setIsRegister(!isRegister)} className="text-sm">
          {isRegister ? "Já tenho conta? Entrar" : "Não tem conta? Cadastre-se"}
        </Button>
      </Paper>
    </Container>
  );
};
