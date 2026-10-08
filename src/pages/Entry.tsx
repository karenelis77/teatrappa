import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "../ui";
import { useStore } from "../store";

export function Splash() {
  const nav = useNavigate();
  const { user, guest } = useStore();
  useEffect(() => {
    const t = setTimeout(() => nav(user || guest ? "/home" : "/auth", { replace: true }), 1800);
    return () => clearTimeout(t);
  }, [nav, user, guest]);
  return (
    <div className="splash">
      <div className="curtain left" />
      <div className="curtain right" />
      <div className="splash-logo">
        <Logo />
      </div>
    </div>
  );
}

export function Auth() {
  const nav = useNavigate();
  const { signIn, continueGuest } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn({ name: name.trim() || email.split("@")[0], email });
    nav("/home", { replace: true });
  };

  return (
    <div className="auth">
      <Logo />
      <p className="muted center">Tu entrada a las salas de teatro de la ciudad</p>
      <div className="seg">
        <button className={mode === "login" ? "on" : ""} onClick={() => setMode("login")}>
          Iniciar sesión
        </button>
        <button className={mode === "register" ? "on" : ""} onClick={() => setMode("register")}>
          Registrarse
        </button>
      </div>
      <form onSubmit={submit} className="form">
        {mode === "register" && (
          <input placeholder="Nombre" value={name} onChange={(e) => setName(e.target.value)} required />
        )}
        <input type="email" placeholder="Correo" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Contraseña" value={pass} onChange={(e) => setPass(e.target.value)} required />
        <button className="btn block">{mode === "login" ? "Entrar" : "Crear cuenta"}</button>
      </form>
      <div className="or">o</div>
      <button
        className="btn ghost block"
        onClick={() => {
          continueGuest();
          nav("/home", { replace: true });
        }}
      >
        Continuar como invitado
      </button>
      <p className="muted small center">Demo: no se guarda ninguna contraseña ni se envía información.</p>
    </div>
  );
}
