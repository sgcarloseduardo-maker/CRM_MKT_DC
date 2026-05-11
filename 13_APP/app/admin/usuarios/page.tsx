import { prisma } from "@/lib/prisma";
import {
  createUserAction,
  resetUserPasswordAction,
  toggleUserActiveAction,
  updateUserRoleAction
} from "@/features/users/actions";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <section>
      <h1>Admin - Usuários</h1>

      <form action={createUserAction} className="card" style={{ display: "grid", gap: 8 }}>
        <h3 style={{ margin: 0 }}>Criar usuário</h3>
        <input name="username" placeholder="Username" required />
        <input name="password" type="password" placeholder="Senha" required />
        <select name="role" defaultValue="editor">
          <option value="admin">admin</option>
          <option value="editor">editor</option>
        </select>
        <button type="submit">Criar</button>
      </form>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Lista de usuários</h3>
        {users.map((user) => (
          <div key={user.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10, marginBottom: 8 }}>
            <strong>{user.username}</strong> - {user.role} - {user.isActive ? "ativo" : "inativo"}

            <form action={updateUserRoleAction} style={{ marginTop: 8, display: "grid", gap: 6 }}>
              <input type="hidden" name="id" value={user.id} />
              <select name="role" defaultValue={user.role}>
                <option value="admin">admin</option>
                <option value="editor">editor</option>
              </select>
              <button type="submit">Atualizar papel</button>
            </form>

            <form action={toggleUserActiveAction} style={{ marginTop: 8 }}>
              <input type="hidden" name="id" value={user.id} />
              <input type="hidden" name="current" value={String(user.isActive)} />
              <button type="submit">{user.isActive ? "Desativar" : "Ativar"}</button>
            </form>

            <form action={resetUserPasswordAction} style={{ marginTop: 8, display: "grid", gap: 6 }}>
              <input type="hidden" name="id" value={user.id} />
              <input name="password" type="password" placeholder="Nova senha" required />
              <button type="submit">Resetar senha</button>
            </form>
          </div>
        ))}
      </div>
    </section>
  );
}
