import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { Login } from "./pages/Login";
import { Connections } from "./pages/Connections";
import { Messages } from "./pages/Messages";
import { CircularProgress } from "@mui/material";
import { Layout } from "./components/Layout";
import { Contacts } from "./pages/Contacts";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <CircularProgress />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/" />}
        />

        {/* Todas as rotas dentro deste Route usarão o Layout */}
        <Route element={user ? <Layout /> : <Navigate to="/login" />}>
          <Route path="/" element={<Connections />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/messages" element={<Messages />} />
        </Route>

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}
