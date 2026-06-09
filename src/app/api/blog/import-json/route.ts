import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/auth";
import path from "path";
import fs from "fs/promises";

const TMP_DIR = path.join(process.cwd(), "tmp");

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

function isTiptapDoc(obj: unknown): obj is { type: "doc"; content: unknown[] } {
  return (
    typeof obj === "object" &&
    obj !== null &&
    (obj as Record<string, unknown>)["type"] === "doc" &&
    Array.isArray((obj as Record<string, unknown>)["content"])
  );
}

const KNOWN_NODE_TYPES = new Set([
  "doc", "paragraph", "text", "heading", "bulletList", "orderedList",
  "listItem", "blockquote", "codeBlock", "horizontalRule", "image",
  "youtube", "table", "tableRow", "tableHeader", "tableCell",
  "chip", "hardBreak",
]);

function normalizeNode(
  node: Record<string, unknown>,
  warnings: string[],
): Record<string, unknown> {
  const type = node.type as string;
  if (type !== "text" && !KNOWN_NODE_TYPES.has(type)) {
    warnings.push(`Unknown node type "${type}" replaced with paragraph`);
    node = { type: "paragraph", content: (node.content as unknown[]) ?? [] };
  }
  if (Array.isArray(node.content)) {
    node = {
      ...node,
      content: (node.content as Record<string, unknown>[]).map((child) =>
        normalizeNode(child, warnings),
      ),
    };
  }
  return node;
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let tmpPath: string | null = null;
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }
    if (!file.name.toLowerCase().endsWith(".json")) {
      return NextResponse.json({ error: "File must be a .json file" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "File exceeds 5 MB limit" }, { status: 400 });
    }

    const buf = Buffer.from(await file.arrayBuffer());
    await fs.mkdir(TMP_DIR, { recursive: true });
    tmpPath = path.join(TMP_DIR, `tiptap-import-${Date.now()}.json`);
    await fs.writeFile(tmpPath, buf);

    let raw: unknown;
    try {
      raw = JSON.parse(buf.toString("utf-8"));
    } catch {
      return NextResponse.json(
        { error: "Invalid JSON: file could not be parsed" },
        { status: 422 },
      );
    }

    if (!isTiptapDoc(raw)) {
      return NextResponse.json(
        { error: 'Not a valid TipTap document. Expected { type: "doc", content: [...] }' },
        { status: 422 },
      );
    }

    const warnings: string[] = [];
    const normalized = normalizeNode(raw as Record<string, unknown>, warnings);

    return NextResponse.json({ json: normalized, warnings });
  } finally {
    if (tmpPath) await fs.unlink(tmpPath).catch(() => {});
  }
}
