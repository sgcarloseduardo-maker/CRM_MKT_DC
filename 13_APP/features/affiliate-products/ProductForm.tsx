"use client";

import { useFormStatus } from "react-dom";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button type="submit" disabled={pending}>
      {pending ? "Salvando..." : "Criar produto"}
    </button>
  );
}

export function ProductForm({
  action
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  return (
    <form action={action} className="card" style={{ display: "grid", gap: 10 }}>
      <h3 style={{ margin: 0 }}>Novo produto afiliado</h3>
      <input name="name" placeholder="Nome do produto" required />
      <input name="category" placeholder="Categoria" required />
      <input name="brand" placeholder="Marca" />
      <input name="affiliateUrl" placeholder="Link de afiliado" />
      <input name="priceRange" placeholder="Faixa de preço (ex: R$ 300-500)" />
      <textarea name="notes" placeholder="Observações" rows={3} />
      <label style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input type="checkbox" name="isPriority" /> Produto prioritário
      </label>
      <SubmitButton />
    </form>
  );
}
