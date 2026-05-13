import React, { useEffect, useState } from "react";
import {
  TextField,
  Button,
  Paper,
  Typography,
  Container,
  Autocomplete,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Chip,
  Divider,
} from "@mui/material";
import {
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { db } from "../lib/firebase";
import { useAuth } from "../hooks/useAuth";
import { useConnections } from "../hooks/useConnections";
import { useContacts } from "../hooks/useContacts";

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { connections } = useConnections(user?.uid);

  const [filter, setFilter] = useState<"all" | "scheduled" | "sent">("all");
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedConnection, setSelectedConnection] = useState("");
  const { contacts } = useContacts(selectedConnection);

  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const handleSend = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!user || selectedContacts.length === 0 || !scheduledDate) return;

    await addDoc(collection(db, "messages"), {
      content,
      contactIds: selectedContacts.map((c) => c.id),
      connectionId: selectedConnection,
      ownerId: user.uid,
      status: "scheduled",
      scheduledDate: Timestamp.fromDate(new Date(scheduledDate)),
      createdAt: Timestamp.now(),
    });

    setContent("");
    setSelectedContacts([]);
    setScheduledDate("");
    alert("Mensagem agendada com sucesso!");
  };

  useEffect(() => {
    if (!user) return;

    // Criamos a query base ordenando pela data de agendamento
    let q = query(
      collection(db, "messages"),
      where("ownerId", "==", user.uid),
      orderBy("scheduledDate", "desc"),
    );

    if (filter !== "all") {
      q = query(q, where("status", "==", filter));
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [user, filter]);

  return (
    <Container maxWidth="md" className="py-10">
      <Typography variant="h4" className="mb-6 font-bold">
        Broadcast de Mensagens
      </Typography>

      {/* Seção de Envio */}
      <Paper className="p-6 flex flex-col gap-6 mb-10">
        <Typography variant="h6">Agendar Nova Mensagem</Typography>
        <FormControl fullWidth>
          <InputLabel>Conexão</InputLabel>
          <Select
            value={selectedConnection}
            label="Conexão"
            onChange={(e) => setSelectedConnection(e.target.value)}
          >
            {connections.map((c) => (
              <MenuItem key={c.id} value={c.id}>
                {c.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Autocomplete
          multiple
          options={contacts}
          getOptionLabel={(option) => option.name}
          onChange={(_, newValue) => setSelectedContacts(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Selecionar Contatos" />
          )}
          disabled={!selectedConnection}
          value={selectedContacts}
        />

        <TextField
          label="Conteúdo da Mensagem"
          multiline
          rows={3}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <TextField
          label="Data e Hora do Disparo"
          type="datetime-local"
          fullWidth
          value={scheduledDate}
          onChange={(e) => setScheduledDate(e.target.value)}
          // Em vez de InputLabelProps, use slotProps
          slotProps={{
            inputLabel: {
              shrink: true,
            },
          }}
        />

        <Button
          variant="contained"
          size="large"
          onClick={handleSend}
          disabled={!content || selectedContacts.length === 0}
        >
          Agendar Mensagem
        </Button>
      </Paper>

      <Divider className="mb-10" />

      {/* Seção de Listagem e Filtros */}
      <Typography variant="h5" className="mb-4 font-bold">
        Histórico e Agendamentos
      </Typography>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs value={filter} onChange={(_, newValue) => setFilter(newValue)}>
          <Tab label="Todas" value="all" />
          <Tab label="Agendadas" value="scheduled" />
          <Tab label="Enviadas" value="sent" />
        </Tabs>
      </Box>

      <List>
        {messages.map((msg) => (
          <Paper key={msg.id} className="mb-3">
            <ListItem>
              <ListItemText
                primary={msg.content}
                secondary={`Agendado para: ${msg.scheduledDate?.toDate().toLocaleString()}`}
              />
              <Chip
                label={msg.status === "sent" ? "Enviada" : "Agendada"}
                color={msg.status === "sent" ? "success" : "warning"}
                variant="outlined"
              />
            </ListItem>
          </Paper>
        ))}
        {messages.length === 0 && (
          <Typography className="text-gray-500 italic text-center py-10">
            Nenhuma mensagem encontrada para este filtro.
          </Typography>
        )}
      </List>
    </Container>
  );
};
