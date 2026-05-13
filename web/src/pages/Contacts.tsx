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
  IconButton,
  Box,
  Avatar,
} from "@mui/material";
import {
  DeleteOutlined,
  PersonAddOutlined,
  ContactPhoneOutlined,
  BadgeOutlined,
  PhoneEnabledOutlined,
} from "@mui/icons-material";

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
    <Container maxWidth="lg" className="p-0">
      <Box className="mb-8">
        <Typography
          variant="h4"
          className="font-black text-slate-900 tracking-tight sm:text-5xl"
        >
          Contatos
        </Typography>
        <Typography className="text-slate-500 mt-2 text-lg">
          Gerencie os destinatários das suas campanhas de broadcast.
        </Typography>
      </Box>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <Box className="lg:col-span-5">
          <Paper
            elevation={0}
            className="p-6 border border-slate-200 rounded-3xl bg-white shadow-sm sticky top-24"
          >
            <Typography
              variant="h6"
              className="font-bold text-slate-800 mb-6 flex items-center gap-2"
            >
              <PersonAddOutlined className="text-blue-600" />
              Novo Contato
            </Typography>

            <form onSubmit={handleAddContact} className="flex flex-col gap-5">
              <FormControl fullWidth>
                <InputLabel>Conexão de Origem</InputLabel>
                <Select
                  value={selectedConnection}
                  label="Conexão de Origem"
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
                label="Nome Completo"
                fullWidth
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!selectedConnection}
                slotProps={{
                  input: {
                    className: "rounded-2xl bg-slate-50/50",
                    startAdornment: (
                      <BadgeOutlined
                        className="mr-2 text-slate-400"
                        fontSize="small"
                      />
                    ),
                  },
                }}
              />

              <TextField
                label="Telefone / WhatsApp"
                fullWidth
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!selectedConnection}
                placeholder="(00) 00000-0000"
                slotProps={{
                  input: {
                    className: "rounded-2xl bg-slate-50/50",
                    startAdornment: (
                      <PhoneEnabledOutlined
                        className="mr-2 text-slate-400"
                        fontSize="small"
                      />
                    ),
                  },
                }}
              />

              <Button
                type="submit"
                variant="contained"
                disabled={!selectedConnection || !name || !phone}
                disableElevation
                className="bg-blue-600! hover:bg-blue-700! h-[56px] rounded-2xl capitalize font-bold text-base mt-2"
              >
                Salvar Contato
              </Button>
            </form>
          </Paper>
        </Box>

        <Box className="lg:col-span-7">
          <Paper
            elevation={0}
            className="border border-slate-200 rounded-3xl bg-white overflow-hidden shadow-sm"
          >
            <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
              <Typography className="font-bold text-slate-700">
                Lista de Contatos
              </Typography>
              <Typography
                variant="caption"
                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold"
              >
                {contacts.length} cadastrados
              </Typography>
            </div>

            <div className="divide-y divide-slate-100">
              {contacts.map((contact) => (
                <div
                  key={contact.id}
                  className="p-4 sm:p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group"
                >
                  <div className="flex items-center gap-4">
                    <Avatar className="bg-blue-600 text-white font-bold w-12 h-12 rounded-2xl shadow-md shadow-blue-100">
                      {contact.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <div>
                      <Typography className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                        {contact.name}
                      </Typography>
                      <Typography
                        variant="body2"
                        className="text-slate-500 flex items-center gap-1"
                      >
                        <PhoneEnabledOutlined sx={{ fontSize: 14 }} />
                        {contact.phone}
                      </Typography>
                    </div>
                  </div>

                  <IconButton
                    onClick={() => contactService.delete(contact.id!)}
                    className="text-slate-300! hover:text-red-500! hover:bg-red-50!"
                  >
                    <DeleteOutlined />
                  </IconButton>
                </div>
              ))}

              {contacts.length === 0 && (
                <Box className="py-20 text-center px-6">
                  <ContactPhoneOutlined className="text-slate-200 text-7xl mb-4" />
                  <Typography className="text-slate-400 font-medium">
                    {selectedConnection
                      ? "Nenhum contato nesta conexão."
                      : "Selecione uma conexão para ver os contatos."}
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
