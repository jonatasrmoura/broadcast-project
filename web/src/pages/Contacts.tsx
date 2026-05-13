import React, { useState, useMemo } from "react";
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
  IconButton,
  Box,
  Avatar,
  InputAdornment,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import {
  DeleteOutlined,
  Search,
  PersonAddOutlined,
  PhoneEnabledOutlined,
  WhatsApp,
} from "@mui/icons-material";
import { useAuth } from "../hooks/useAuth";
import { useConnections } from "../hooks/useConnections";
import { useContacts } from "../hooks/useContacts";
import { contactService } from "../services/contactService";

export const Contacts: React.FC = () => {
  const { user } = useAuth();
  const { connections } = useConnections(user?.uid);
  const [selectedConnection, setSelectedConnection] = useState("");

  const { contacts, loading, refresh } = useContacts(selectedConnection);

  const [searchTerm, setSearchTerm] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const filteredContacts = useMemo(() => {
    return contacts.filter((c) => {
      const search = searchTerm.toLowerCase();
      return c.name.toLowerCase().includes(search) || c.phone.includes(search);
    });
  }, [contacts, searchTerm]);

  const handleAddContact = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    if (!name || !phone || !selectedConnection || !user) return;

    await contactService.create(name, phone, selectedConnection, user.uid);

    await refresh();

    setName("");
    setPhone("");
  };

  const handleDeleteContact = async (id: string) => {
    await contactService.delete(id);
    await refresh();
  };

  return (
    <Container maxWidth="lg" className="p-0 animate-in fade-in duration-700">
      <Box className="mb-8 px-2 sm:px-0">
        <Typography
          variant="h4"
          className="font-black text-slate-900 tracking-tight"
        >
          Gestão de Contatos
        </Typography>
        <Typography className="text-slate-500 mt-1">
          Gerencie os leads da conexão{" "}
          <strong>
            {connections.find((c) => c.id === selectedConnection)?.name ||
              "selecionada"}
          </strong>
          .
        </Typography>
      </Box>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Formulário de Cadastro */}
        <Box className="lg:col-span-4 order-2 lg:order-1">
          <Paper
            elevation={0}
            className="p-6 border border-slate-200 rounded-3xl bg-white shadow-sm sticky top-24"
          >
            <div className="flex items-center gap-2 mb-6">
              <PersonAddOutlined className="text-blue-600" />
              <Typography className="font-bold text-slate-800">
                Novo Contato
              </Typography>
            </div>

            <form onSubmit={handleAddContact} className="flex flex-col gap-4">
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

              <TextField
                label="Nome do Contato"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!selectedConnection}
                slotProps={{
                  input: { className: "rounded-2xl bg-slate-50/50" },
                }}
              />

              <TextField
                label="Número (WhatsApp)"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!selectedConnection}
                placeholder="55119..."
                slotProps={{
                  input: { className: "rounded-2xl bg-slate-50/50" },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!selectedConnection || !name || !phone}
                className="bg-blue-600! hover:bg-blue-700! h-14 rounded-2xl capitalize font-bold text-base shadow-lg shadow-blue-100"
              >
                Salvar na Lista
              </Button>
            </form>
          </Paper>
        </Box>

        {/* Listagem com Filtro */}
        <Box className="lg:col-span-8 order-1 lg:order-2">
          <Paper
            elevation={0}
            className="border border-slate-200 rounded-3xl bg-white overflow-hidden shadow-sm"
          >
            <div className="p-4 sm:p-6 border-b border-slate-100 bg-slate-50/30 flex items-center gap-4">
              <TextField
                placeholder="Filtrar por nome..."
                fullWidth
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                slotProps={{
                  input: {
                    className: "rounded-2xl bg-white border-none",
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search className="text-slate-400" />
                      </InputAdornment>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "16px",
                    backgroundColor: "white",
                  },
                }}
              />
              {loading && (
                <CircularProgress size={24} className="text-blue-600" />
              )}
            </div>

            <div className="divide-y divide-slate-50 min-h-[300px]">
              {filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold w-12 h-12 rounded-2xl shadow-md">
                      {contact.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <Typography className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {contact.name}
                      </Typography>
                      <div className="flex items-center gap-2 mt-0.5">
                        <WhatsApp
                          sx={{ fontSize: 14 }}
                          className="text-green-500"
                        />
                        <Typography
                          variant="body2"
                          className="text-slate-500 font-medium"
                        >
                          {contact.phone}
                        </Typography>
                      </div>
                    </div>
                  </div>

                  <Tooltip title="Excluir Contato">
                    <IconButton
                      onClick={() => handleDeleteContact(contact.id!)}
                      className="text-slate-300! hover:text-red-500! hover:bg-red-50!"
                    >
                      <DeleteOutlined fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </div>
              ))}

              {/* State: Sem resultados ou carregando */}
              {!loading && filteredContacts.length === 0 && (
                <Box className="py-24 text-center px-6">
                  <PhoneEnabledOutlined className="text-slate-200 text-6xl mb-4" />
                  <Typography variant="h6" className="text-slate-400 font-bold">
                    {selectedConnection
                      ? "Nenhum contato encontrado."
                      : "Selecione uma conexão para listar."}
                  </Typography>
                </Box>
              )}
            </div>
          </Paper>
        </Box>
      </div>
    </Container>
  );
};
