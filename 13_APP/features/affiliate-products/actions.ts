"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

const slugify = (value: string) =>
  value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

export async function createAffiliateProduct(formData: FormData) {
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const affiliateUrl = String(formData.get("affiliateUrl") || "").trim();
  const priceRange = String(formData.get("priceRange") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const isPriority = String(formData.get("isPriority") || "") === "on";

  if (!name || !category) {
    throw new Error("Nome e categoria são obrigatórios.");
  }

  const slug = slugify(`${name}-${brand || "produto"}`);

  await prisma.affiliateProduct.create({
    data: {
      slug,
      name,
      category,
      brand: brand || null,
      affiliateUrl: affiliateUrl || null,
      priceRange: priceRange || null,
      notes: notes || null,
      isPriority
    }
  });

  revalidatePath("/produtos-afiliados");
}

export async function updateAffiliateProduct(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  const name = String(formData.get("name") || "").trim();
  const category = String(formData.get("category") || "").trim();
  const brand = String(formData.get("brand") || "").trim();
  const affiliateUrl = String(formData.get("affiliateUrl") || "").trim();
  const notes = String(formData.get("notes") || "").trim();
  const isPriority = String(formData.get("isPriority") || "") === "on";

  if (!id || !name || !category) throw new Error("ID, nome e categoria são obrigatórios.");

  await prisma.affiliateProduct.update({
    where: { id },
    data: {
      name,
      category,
      brand: brand || null,
      affiliateUrl: affiliateUrl || null,
      notes: notes || null,
      isPriority
    }
  });

  revalidatePath("/produtos-afiliados");
  redirect("/produtos-afiliados");
}

export async function deleteAffiliateProduct(formData: FormData) {
  const id = String(formData.get("id") || "").trim();
  if (!id) throw new Error("ID obrigatório.");

  await prisma.affiliateProduct.delete({ where: { id } });
  revalidatePath("/produtos-afiliados");
  redirect("/produtos-afiliados");
}

export async function confirmDetectedProductLink(formData: FormData) {
  const contentMasterId = String(formData.get("contentMasterId") || "").trim();
  const productName = String(formData.get("productName") || "").trim();
  const affiliateUrl = String(formData.get("affiliateUrl") || "").trim();

  if (!contentMasterId || !productName || !affiliateUrl) {
    throw new Error("Produto e link afiliado são obrigatórios.");
  }

  const existing = await prisma.affiliateProduct.findFirst({ where: { name: productName } });

  if (existing) {
    await prisma.affiliateProduct.update({
      where: { id: existing.id },
      data: { affiliateUrl, isPriority: true }
    });
  } else {
    await prisma.affiliateProduct.create({
      data: {
        slug: slugify(`${productName}-detectado`),
        name: productName,
        category: "detectado-do-refino",
        brand: null,
        affiliateUrl,
        priceRange: null,
        notes: `Confirmado a partir do conteúdo ${contentMasterId}`,
        isPriority: true
      }
    });
  }

  revalidatePath("/produtos-afiliados");
  redirect(`/produtos-afiliados?contentMasterId=${contentMasterId}&ok=link-confirmado`);
}
