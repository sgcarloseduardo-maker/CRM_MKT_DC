import Link from "next/link";
import { StatusBadge } from "@/components/status/StatusBadge";
import { prisma } from "@/lib/prisma";
import { createContentFromInputAction } from "@/features/content-master/actions";

export const dynamic = "force-dynamic";

export default async function ContentMasterListPage() {
  const items = await prisma.contentMaster.findMany({ orderBy: { createdAt: "desc" }, take: 50 });

  return (
    <section>
      <h1>Gerador de Conteúdo</h1>
      <p className="muted">Entrada principal do CRM: texto ou PDF, criação de projeto e envio para refino SEO.</p>

      <form action={createContentFromInputAction} className="card" style={{ marginTop: 16, display: "grid", gap: 10 }}>
        <h3 style={{ margin: 0 }}>Entrada de conteúdo (origem-mestre)</h3>
        <textarea name="rawText" rows={14} placeholder="Cole aqui todo o escopo/conteúdo do projeto" required style={{ fontSize: 16 }} />
        <input name="pdfName" placeholder="Upload de documento/PDF (nome do arquivo)" />
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          <button type="submit" name="actionType" value="iniciar">Iniciar projeto</button>
          <button type="submit" name="actionType" value="enviar-refino">Enviar para Refino SEO</button>
        </div>
      </form>

      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Lista</h3>
        {items.length === 0 ? (
          <p className="muted">Nenhum conteúdo principal cadastrado.</p>
        ) : (
          <div style={{ display: "grid", gap: 10 }}>
            {items.map((item) => (
              <div key={item.id} className="row-item">
                <div>
                  <Link href={`/conteudos-principais/${item.id}`}><strong>{item.title}</strong></Link>
                  <div className="muted">{item.mainProduct} vs {item.mainCompetitor}</div>
                  <div style={{ marginTop: 6 }}>
                    <Link href={`/refino-seo?contentMasterId=${item.id}`}>Abrir Refino SEO</Link>
                  </div>
                </div>
                <StatusBadge status={item.status} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
