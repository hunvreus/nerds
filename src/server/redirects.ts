const redirects: Readonly<Record<string, string>> = {
  "/1": "https://luma.com/mi9hata3",
};

export function resolveRedirect(pathname: string): string | null {
  const normalizedPath = pathname.length > 1 ? pathname.replace(/\/$/, "") : pathname;
  return redirects[normalizedPath] ?? null;
}
