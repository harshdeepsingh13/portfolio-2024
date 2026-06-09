export async function importTiptapJson(
  file: File,
): Promise<{ json: Record<string, unknown>; warnings: string[] }> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/blog/import-json", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error((data as { error?: string }).error ?? "Failed to import JSON");
  }
  return data as { json: Record<string, unknown>; warnings: string[] };
}
