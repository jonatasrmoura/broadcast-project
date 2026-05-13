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
import {
  SendOutlined,
  HistoryOutlined,
  CheckCircle,
  Schedule,
  MessageOutlined,
} from "@mui/icons-material";

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
    <Container maxWidth="lg" className="py-6 sm:py-12">
      <Box className="mb-8 px-2">
        <Typography
          variant="h3"
          className="font-black text-slate-900 tracking-tight sm:text-5xl"
        >
          Broadcast
        </Typography>
        <Typography className="text-slate-500 mt-2 text-lg">
          Agende e gerencie suas campanhas de forma inteligente.
        </Typography>
      </Box>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Box className="lg:col-span-5 order-1">
          <Paper
            elevation={0}
            className="p-6 border border-slate-200 rounded-3xl bg-white shadow-sm sticky top-24"
          >
            <div className="flex items-center gap-2 mb-6">
              <SendOutlined className="text-blue-600" />
              <Typography variant="h6" className="font-bold text-slate-800">
                Novo Agendamento
              </Typography>
            </div>

            <form onSubmit={handleSend} className="flex flex-col gap-5">
              <FormControl fullWidth>
                <InputLabel>Conexão</InputLabel>
                <Select
                  value={selectedConnection}
                  label="Conexão"
                  onChange={(e) => setSelectedConnection(e.target.value)}
                  className="rounded-2xl bg-slate-50/50"
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
                getOptionLabel={(option: any) => option.name}
                onChange={(_, newValue) => setSelectedContacts(newValue)}
                disabled={!selectedConnection}
                value={selectedContacts}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Destinatários"
                    className="rounded-2xl bg-slate-50/50"
                  />
                )}
              />

              <TextField
                label="Mensagem"
                multiline
                rows={4}
                placeholder="O que você deseja enviar?"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                slotProps={{
                  input: { className: "rounded-2xl bg-slate-50/50" },
                }}
              />

              <TextField
                label="Data de Disparo"
                type="datetime-local"
                fullWidth
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                slotProps={{
                  inputLabel: { shrink: true },
                  input: { className: "rounded-2xl bg-slate-50/50" },
                }}
              />

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleSend}
                disabled={!content || selectedContacts.length === 0}
                className="bg-blue-600! hover:bg-blue-700! h-14 rounded-2xl capitalize font-bold text-base shadow-lg shadow-blue-100"
              >
                Agendar Agora
              </Button>
            </form>
          </Paper>
        </Box>

        <Box className="lg:col-span-7 order-2">
          <Paper
            elevation={0}
            className="border border-slate-200 rounded-3xl bg-white overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-2">
                <HistoryOutlined className="text-slate-500" />
                <Typography className="font-bold text-slate-700">
                  Histórico
                </Typography>
              </div>
              <Tabs
                value={filter}
                onChange={(_, newValue) => setFilter(newValue)}
                className="bg-white rounded-xl p-1 border border-slate-200"
                sx={{
                  "& .MuiTabs-indicator": {
                    backgroundColor: "#2563eb",
                    height: 3,
                    borderRadius: 2,
                  },
                }}
              >
                <Tab label="Tudo" value="all" className="min-w-0 font-bold" />
                <Tab
                  label="Agendadas"
                  value="scheduled"
                  className="min-w-0 font-bold"
                />
                <Tab
                  label="Enviadas"
                  value="sent"
                  className="min-w-0 font-bold"
                />
              </Tabs>
            </div>

            <div className="p-2 sm:p-6 flex flex-col gap-4">
              {messages.map((msg) => (
                <Paper
                  key={msg.id}
                  elevation={0}
                  className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 hover:border-blue-200 transition-all"
                >
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-start">
                      <Chip
                        icon={
                          msg.status === "sent" ? <CheckCircle /> : <Schedule />
                        }
                        label={msg.status === "sent" ? "Enviada" : "Agendada"}
                        color={msg.status === "sent" ? "success" : "warning"}
                        size="small"
                        variant="filled"
                        className="font-bold"
                      />
                      <Typography
                        variant="caption"
                        className="text-slate-400 font-mono"
                      >
                        {msg.scheduledDate?.toDate().toLocaleString()}
                      </Typography>
                    </div>
                    <Typography className="text-slate-700 leading-relaxed font-medium">
                      "{msg.content}"
                    </Typography>
                    <Divider />
                    <Typography
                      variant="caption"
                      className="text-slate-500 flex items-center gap-1 font-bold"
                    >
                      {msg.contactIds?.length || 0} destinatários
                    </Typography>
                  </div>
                </Paper>
              ))}

              {messages.length === 0 && (
                <div className="py-20 text-center text-slate-400">
                  <MessageOutlined className="text-6xl mb-2 opacity-20" />
                  <Typography className="italic">
                    Nenhum registro encontrado.
                  </Typography>
                </div>
              )}
            </div>
          </Paper>
        </Box>
      </div>
    </Container>
  );
};
