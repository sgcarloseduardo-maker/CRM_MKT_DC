import Link from "next/link";
import { coreModules } from "@/lib/navigation";
import { getSessionUser } from "@/features/auth/session";
import { logoutAction } from "@/features/auth/actions";

export async function Sidebar() {
  let actor: Awaited<ReturnType<typeof getSessionUser>> = null;
  try {
    actor = await getSessionUser();
  } catch {
    actor = null;
  }
  return (
    <aside className="sidebar">
      <div className="brand">Decisão Certa Afiliados</div>

      <div className="nav-section">
        <div className="nav-title">Operação Principal</div>
        {coreModules.map((item, index) => (
          <Link key={item.href} href={item.href} className="nav-link" style={{ animationDelay: `${index * 70}ms` }}>
            {item.label}
          </Link>
        ))}
      </div>

      <div className="nav-section">
        <div className="nav-title">Acesso</div>
        <Link href="/admin/auditoria" className="nav-link">
          Auditoria
        </Link>
        <Link href="/admin/usuarios" className="nav-link">
          Usuários
        </Link>
        <Link href="/login" className="nav-link">
          Login
        </Link>
        {actor ? (
          <form action={logoutAction} style={{ marginTop: 8 }}>
            <button type="submit">Sair ({actor.username})</button>
          </form>
        ) : null}
      </div>
    </aside>
  );
}
