import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, errorCode, errorMessage } from "../api";
import { Button, Field, inputClass } from "../components";

type Errors = { name?: string; email?: string; password?: string; confirmPassword?: string };

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});
  const [apiError, setApiError] = useState("");
  const [sending, setSending] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    const next: Errors = {};
    if (!name.trim() || name.trim().length > 100) next.name = "El nombre es obligatorio (máx. 100 caracteres).";
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Ingresa un correo válido.";
    if (!/^[\x20-\x7E]{8,72}$/.test(password)) next.password = "La contraseña debe tener entre 8 y 72 caracteres ASCII.";
    if (confirmPassword !== password) next.confirmPassword = "Las contraseñas no coinciden.";
    setErrors(next);
    setApiError("");
    if (Object.keys(next).length > 0) return;

    setSending(true);
    try {
      await api.post("/auth/register", { name: name.trim(), email, password });
      navigate("/login");
    } catch (err) {
      if (errorCode(err) === "EMAIL_EXISTS") setErrors({ email: "El correo ya está registrado." });
      else setApiError(errorMessage(err, "No se pudo registrar."));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <form onSubmit={submit} noValidate className="mx-auto max-w-sm space-y-4 rounded bg-white p-6 shadow">
        <h1 className="text-xl font-semibold">Crear cuenta</h1>
        <Field label="Nombre" error={errors.name}>
          <input className={inputClass} value={name} onChange={(e) => setName(e.target.value)} />
        </Field>
        <Field label="Correo" error={errors.email}>
          <input type="email" className={inputClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <Field label="Contraseña" error={errors.password}>
          <input type="password" className={inputClass} value={password} onChange={(e) => setPassword(e.target.value)} />
        </Field>
        <Field label="Confirmar contraseña" error={errors.confirmPassword}>
          <input type="password" className={inputClass} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
        </Field>
        {apiError && <p className="text-red-600">{apiError}</p>}
        <Button type="submit" disabled={sending} className="w-full">Registrarme</Button>
        <p className="text-sm">¿Ya tienes cuenta? <Link to="/login" className="text-blue-600">Inicia sesión</Link></p>
      </form>
    </div>
  );
}
