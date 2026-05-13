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
  List,
  ListItem,
  ListItemText,
  IconButton,
  CircularProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

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

  const handleDelete = async (id: string | undefined) => {
    if (id) await connectionService.delete(id);
  };

  if (loading) return <CircularProgress className="m-auto" />;

  return (
    <Container maxWidth="md" className="py-10">
      <Typography variant="h4" className="mb-6 font-bold">
        Minhas Conexões (SaaS Area)
      </Typography>

      <Paper className="p-6 mb-6">
        <form onSubmit={handleAdd} className="flex gap-4">
          <TextField
            label="Nome da Conexão"
            variant="outlined"
            fullWidth
            value={newConnectionName}
            onChange={(e) => setNewConnectionName(e.target.value)}
          />
          <Button type="submit" variant="contained" className="bg-blue-600">
            Adicionar
          </Button>
        </form>
      </Paper>

      <List component={Paper}>
        {connections.map((conn) => (
          <ListItem
            key={conn.id}
            secondaryAction={
              <IconButton edge="end" onClick={() => handleDelete(conn.id)}>
                <DeleteIcon color="error" />
              </IconButton>
            }
            className="border-b last:border-0"
          >
            <ListItemText primary={conn.name} secondary={`ID: ${conn.id}`} />
          </ListItem>
        ))}
        {connections.length === 0 && (
          <ListItem>
            <ListItemText primary="Nenhuma conexão encontrada." />
          </ListItem>
        )}
      </List>
    </Container>
  );
};
