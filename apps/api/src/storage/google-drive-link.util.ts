export function normalizeGoogleDriveFileId(input: string): string {
  const value = input.trim();
  if (!value) return value;

  try {
    const parsedUrl = new URL(value);
    const queryId = parsedUrl.searchParams.get('id') || parsedUrl.searchParams.get('fileId');
    if (queryId) return queryId;

    const pathMatch = parsedUrl.pathname.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (pathMatch?.[1]) return pathMatch[1];

    return value;
  } catch {
    return value;
  }
}
