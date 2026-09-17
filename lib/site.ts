export const siteName = "席マネ";

export const siteDescription =
  "座席表の作成や座席割り当てを、ドラッグ＆クリックでかんたんに行える無料のWebアプリです。";

export function getSiteUrl(): URL | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;

  try {
    return new URL(value);
  } catch {
    return undefined;
  }
}
