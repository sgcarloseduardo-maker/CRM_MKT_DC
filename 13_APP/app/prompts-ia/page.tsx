import { prisma } from "@/lib/prisma";
import {
  createPromptTemplate,
  togglePromptTemplate,
  updatePromptTemplate
} from "@/features/prompts/actions";

export const dynamic = "force-dynamic";

export default async function PromptsPage() {
  const [templates, channels] = await Promise.all([
    prisma.promptTemplate.findMany({ include: { channel: true }, orderBy: { createdAt: "desc" } }),
    prisma.channel.findMany({ orderBy: { name: "asc" } })
  ]);

  return (
    <section>
      <h1>Prompts Criativos</h1>
      <div className="card" style={{ marginTop: 16 }}>
        <h3 style={{ marginTop: 0 }}>Estrutura operacional de prompts</h3>
        <ul>
          <li>Prompt de imagem (curto e detalhado)</li>
          <li>Prompt de vídeo (curto e longo)</li>
          <li>Prompt por formato e canal</li>
          <li>Prompt por objetivo (review, comparação, conversão)</li>
          <li>Prompt por cena + briefing para Edits/CapCut</li>
        </ul>
      </div>
      <div className="grid" style={{ marginTop: 16 }}>
        <form action={createPromptTemplate} className="card" style={{ display: "grid", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Novo prompt criativo</h3>
          <input name="name" placeholder="Nome" required />
          <input name="objective" placeholder="Objetivo (copy, checklist...)" />
          <input name="format" placeholder="Formato (feed, reels...)" />
          <select name="channelId" defaultValue="">
            <option value="">Canal geral</option>
            {channels.map((channel) => (
              <option key={channel.id} value={channel.id}>
                {channel.name}
              </option>
            ))}
          </select>
          <textarea name="body" rows={5} placeholder="Conteúdo do prompt" required />
          <button type="submit">Criar prompt</button>
        </form>

        <div className="card">
          <h3 style={{ marginTop: 0 }}>Lista de prompts</h3>
          <div style={{ display: "grid", gap: 10 }}>
            {templates.map((item) => (
              <div key={item.id} style={{ border: "1px solid var(--border)", borderRadius: 10, padding: 10 }}>
                <form action={updatePromptTemplate} style={{ display: "grid", gap: 8 }}>
                  <input type="hidden" name="id" value={item.id} />
                  <input name="name" defaultValue={item.name} required />
                  <input name="objective" defaultValue={item.objective ?? ""} />
                  <input name="format" defaultValue={item.format ?? ""} />
                  <textarea name="body" rows={3} defaultValue={item.body} required />
                  <div className="muted">
                    Canal: {item.channel?.name ?? "Geral"} • Status: {item.active ? "Ativo" : "Inativo"}
                  </div>
                  <button type="submit">Salvar edição</button>
                </form>
                <form action={togglePromptTemplate} style={{ marginTop: 8 }}>
                  <input type="hidden" name="id" value={item.id} />
                  <input type="hidden" name="current" value={String(item.active)} />
                  <button type="submit">{item.active ? "Desativar" : "Ativar"}</button>
                </form>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
