import { loginAction } from "@/features/auth/actions";

export default function LoginPage({ searchParams }: { searchParams?: { error?: string } }) {
  const hasError = searchParams?.error === "credenciais";
  return (
    <section>
      <h1>Login</h1>
      {hasError ? <p className="alert alert-error">Usuário ou senha inválidos.</p> : null}
      <form action={loginAction} className="card" style={{ display: "grid", gap: 8, maxWidth: 420 }}>
        <input name="username" placeholder="Usuário" required />
        <input name="password" type="password" placeholder="Senha" required />
        <button type="submit">Entrar</button>
      </form>
    </section>
  );
}
