export type ChannelSlug =
  | "instagram"
  | "facebook"
  | "youtube"
  | "tiktok"
  | "kwai"
  | "whatsapp"
  | "telegram"
  | "blog_site"
  | "mercado_livre"
  | "shopee";

export interface SidebarModule {
  label: string;
  href: string;
}
