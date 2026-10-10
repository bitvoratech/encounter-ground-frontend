import {
  IconBrandInstagram,
  IconBrandTiktok,
  IconBrandWhatsapp,
  IconBrandYoutube,
  IconWorld,
  type IconProps,
} from "@tabler/icons-react";

// Matches the names in `contact.socials` (src/content/ministry.ts).
const icons: Record<string, React.ComponentType<IconProps>> = {
  Instagram: IconBrandInstagram,
  YouTube: IconBrandYoutube,
  TikTok: IconBrandTiktok,
  "WhatsApp channel": IconBrandWhatsapp,
};

/** Brand icon for a social network by its display name; decorative, so pair it with text or an aria-label. */
export function SocialIcon({ name, ...props }: { name: string } & IconProps) {
  const Icon = icons[name] ?? IconWorld;
  return <Icon aria-hidden="true" stroke={1.75} {...props} />;
}
