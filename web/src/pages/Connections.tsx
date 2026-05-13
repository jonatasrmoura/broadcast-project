import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useConnections } from "../hooks/useConnections";
import { connectionService } from "../services/connectionService";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  IconButton,
  CircularProgress,
  Box,
} from "@mui/material";
import { DeleteOutlined, Add as AddIcon, Hub } from "@mui/icons-material";

export const Connections: React.FC = () => {
  const { user } = useAuth();
  const { connections, loading } = useConnections(user?.uid);
  const [newConnectionName, setNewConnectionName] = useState("");

  const handleAdd = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!newConnectionName.trim() || !user) return;
    await connectionService.create(newConnectionName, user.uid);
    setNewConnectionName("");
  };

  if (loading)
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <CircularProgress thickness={4} size={40} className="text-blue-600" />
      </div>
    );

  return (
    <Container maxWidth="lg" className="p-0">
      <Box className="mb-10">
        <Typography
          variant="h4"
          className="font-black text-slate-900 tracking-tight sm:text-5xl"
        >
          Conexões
        </Typography>
        <Typography className="text-slate-500 mt-2 text-lg">
          Configure seus canais de transmissão para múltiplos contatos.
        </Typography>
      </Box>

      <Paper
        elevation={0}
        className="p-6 mb-12 border border-slate-200 rounded-3xl bg-white shadow-sm"
      >
        <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-4">
          <TextField
            label="Identificação da Conexão"
            variant="outlined"
            fullWidth
            value={newConnectionName}
            onChange={(e) => setNewConnectionName(e.target.value)}
            slotProps={{
              input: { className: "rounded-2xl bg-slate-50/50" },
            }}
          />
          <Button
            type="submit"
            variant="contained"
            disableElevation
            startIcon={<AddIcon />}
            className="bg-blue-600! hover:bg-blue-700! h-[56px] px-10 rounded-2xl capitalize font-bold text-base"
          >
            Adicionar
          </Button>
        </form>
      </Paper>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {connections.map((conn) => (
          <Paper
            key={conn.id}
            elevation={0}
            className="group p-6 border border-slate-200 rounded-3xl bg-white hover:border-blue-400 hover:shadow-xl hover:shadow-blue-500/5 transition-all relative overflow-hidden"
          >
            <div className="flex items-start justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 flex items-center justify-center bg-blue-50 text-blue-600 rounded-2xl group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                  <Hub fontSize="medium" />
                </div>
                <div>
                  <Typography className="font-bold text-slate-800 text-lg group-hover:text-blue-600 transition-colors">
                    {conn.name}
                  </Typography>
                  <Typography
                    variant="caption"
                    className="text-slate-400 font-mono"
                  >
                    #{conn.id?.substring(0, 6)}
                  </Typography>
                </div>
              </div>
              <IconButton
                size="small"
                onClick={() => connectionService.delete(conn.id!)}
                className="text-slate-300! hover:text-red-500! hover:bg-red-50!"
              >
                <DeleteOutlined fontSize="small" />
              </IconButton>
            </div>
            {/* Detalhe visual de fundo */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
              <Hub sx={{ fontSize: 120 }} />
            </div>
          </Paper>
        ))}
      </div>

      {connections.length === 0 && (
        <Box className="text-center py-24 bg-white rounded-3xl border border-slate-100 shadow-inner">
          <Hub className="text-slate-200 text-7xl mb-4" />
          <Typography variant="h6" className="text-slate-400">
            Pronto para começar?
          </Typography>
          <Typography className="text-slate-400 mt-1">
            Crie sua primeira conexão para gerenciar contatos.
          </Typography>
        </Box>
      )}
    </Container>
  );
};
