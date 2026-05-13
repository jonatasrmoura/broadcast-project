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
  Chip,
  Divider,
  CircularProgress,
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
import type { Contact } from "../types";

export const Messages: React.FC = () => {
  const { user } = useAuth();
  const { connections } = useConnections(user?.uid);

  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedConnection, setSelectedConnection] = useState("");
  const { contacts } = useContacts(selectedConnection);
  const [selectedContacts, setSelectedContacts] = useState<Contact[]>([]);
  const [content, setContent] = useState("");
  const [scheduledDate, setScheduledDate] = useState("");

  const handleSend = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!user || selectedContacts.length === 0 || !scheduledDate) return;

    try {
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
    } catch (error) {
      console.error("Erro ao agendar:", error);
    }
  };

  console.log(messages);

  useEffect(() => {
    if (!user) return;
    setLoading(true);

    let q = query(
      collection(db, "messages"),
      where("ownerId", "==", user.uid),
      orderBy("scheduledDate", "desc"),
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
        setLoading(false);
      },
      (error) => {
        console.error("Erro no listener de mensagens:", error);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [user]);

  return (
    <Container
      maxWidth="lg"
      className="py-6 sm:py-12 animate-in fade-in duration-700"
    >
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
        {/* LADO ESQUERDO: FORMULÁRIO */}
        <Box className="lg:col-span-5 order-2 lg:order-1">
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
                  onChange={(e) => {
                    setSelectedConnection(e.target.value);
                    setSelectedContacts([]); // Limpa contatos ao trocar conexão
                  }}
                  className="rounded-2xl bg-slate-50/50"
                >
                  {connections.map((c) => (
                    <MenuItem key={c.id} value={c.id}>
                      {c.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <Autocomplete<Contact, true, false, false>
                multiple
                options={contacts}
                getOptionLabel={(option) => option.name}
                value={selectedContacts}
                onChange={(_, newValue) =>
                  setSelectedContacts(newValue as Contact[])
                }
                disabled={!selectedConnection}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Destinatários"
                    className="rounded-2xl bg-slate-50/50"
                  />
                )}
              />

              <TextField
                label="Conteúdo da Mensagem"
                multiline
                rows={4}
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
                className="bg-blue-600! hover:bg-blue-700! h-14 rounded-2xl capitalize font-bold text-base shadow-lg shadow-blue-100 transition-all active:scale-95"
              >
                Agendar Mensagem
              </Button>
            </form>
          </Paper>
        </Box>

        <Box className="lg:col-span-7 order-1 lg:order-2">
          <Paper
            elevation={0}
            className="border border-slate-200 rounded-3xl bg-white overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-end items-start sm:items-center gap-2">
              <HistoryOutlined className="text-slate-500" />
              <Typography className="font-bold text-slate-700">
                Histórico
              </Typography>
            </div>

            <div className="p-2 sm:p-6 flex flex-col gap-4 min-h-[400px]">
              {loading ? (
                <Box className="flex justify-center items-center py-20">
                  <CircularProgress size={40} className="text-blue-600" />
                </Box>
              ) : (
                <>
                  {messages.map((msg) => (
                    <Paper
                      key={msg.id}
                      elevation={0}
                      className="p-4 border border-slate-100 rounded-2xl bg-slate-50/30 hover:border-blue-200 transition-all group"
                    >
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <Chip
                            icon={
                              msg.status === "sent" ? (
                                <CheckCircle />
                              ) : (
                                <Schedule />
                              )
                            }
                            label={
                              msg.status === "sent" ? "Enviada" : "Agendada"
                            }
                            color={
                              msg.status === "sent" ? "success" : "warning"
                            }
                            size="small"
                            variant="filled"
                            className="font-bold"
                          />
                          <Typography
                            variant="caption"
                            className="text-slate-400 font-mono font-medium"
                          >
                            {msg.scheduledDate
                              ?.toDate()
                              .toLocaleString("pt-BR")}
                          </Typography>
                        </div>

                        <Typography className="text-slate-700 leading-relaxed font-medium text-lg">
                          {msg.content}
                        </Typography>

                        <Divider />

                        <Box className="flex justify-between items-center">
                          <Typography
                            variant="caption"
                            className="text-slate-500 flex items-center gap-1 font-bold"
                          >
                            {msg.contactIds?.length || 0} destinatários
                          </Typography>
                          <Typography
                            variant="caption"
                            className="text-blue-600 font-bold opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            {}
                          </Typography>
                        </Box>
                      </div>
                    </Paper>
                  ))}

                  {messages.length === 0 && (
                    <div className="py-20 text-center text-slate-400">
                      <MessageOutlined className="text-6xl mb-2 opacity-20" />
                      <Typography className="italic font-medium">
                        Nenhuma mensagem.
                      </Typography>
                    </div>
                  )}
                </>
              )}
            </div>
          </Paper>
        </Box>
      </div>
    </Container>
  );
};
