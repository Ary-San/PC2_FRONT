import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { ProtectedLayout } from "./components";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import LocationDetail from "./pages/LocationDetail";
import MyTickets from "./pages/MyTickets";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/locations" element={<Dashboard />} />
          <Route path="/locations/:id" element={<LocationDetail />} />
          <Route path="/my-tickets" element={<MyTickets />} />
        </Route>
        <Route path="*" element={<Navigate to="/locations" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
