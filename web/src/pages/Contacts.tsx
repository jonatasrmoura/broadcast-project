import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useConnections } from "../hooks/useConnections";
import { useContacts } from "../hooks/useContacts";
import { contactService } from "../services/contactService";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export const Contacts: React.FC = () => {
  const { user } = useAuth();
  const { connections } = useConnections(user?.uid);
  const [selectedConnection, setSelectedConnection] = useState("");

  const { contacts } = useContacts(selectedConnection);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const handleAddContact = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name || !phone || !selectedConnection || !user) return;

    await contactService.create(name, phone, selectedConnection, user.uid);
    setName("");
    setPhone("");
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h4" className="mb-6 font-bold">
        Gestão de Contatos
      </Typography>

      <Paper className="p-6 mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormControl fullWidth>
          <InputLabel>Selecione a Conexão</InputLabel>
          <Select
            value={selectedConnection}
            label="Selecione a Conexão"
            onChange={(e) => setSelectedConnection(e.target.value)}
          >
            {connections.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <form
          onSubmit={handleAddContact}
          className="flex flex-col gap-4 col-span-2"
        >
          <div className="flex gap-4">
            <TextField
              label="Nome"
              fullWidth
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={!selectedConnection}
            />
            <TextField
              label="Telefone"
              fullWidth
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={!selectedConnection}
            />
          </div>
          <Button
            type="submit"
            variant="contained"
            disabled={!selectedConnection}
          >
            Adicionar Contato
          </Button>
        </form>
      </Paper>

      <List component={Paper}>
        {contacts.map((contact) => (
          <ListItem
            key={contact.id}
            secondaryAction={
              <IconButton
                edge="end"
                onClick={() => contactService.delete(contact.id!)}
              >
                <DeleteIcon color="error" />
              </IconButton>
            }
          >
            <ListItemText primary={contact.name} secondary={contact.phone} />
          </ListItem>
        ))}
      </List>
    </Container>
  );
};
