import { getData } from "@/lib/getData";
import { ImageResponse } from "next/og";

export const runtime = "nodejs";
export const revalidate = 3600;

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Project case study by Harshdeep Singh";

// Brand cyan + dark background — no theme access inside ImageResponse, so the
// key tokens are inlined here.
const ACCENT = "#38bdf8";
const BG = "#0a0a0a";

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getData.getProjectBySlug(slug);

  const name = project?.name ?? "Project";
  const tech = (project?.technologyStack ?? []).slice(0, 6).join("  •  ");

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          padding: "80px",
          backgroundImage: `radial-gradient(circle at 100% 0%, rgba(56,189,248,0.18), transparent 45%)`,
        }}
      >
        <div style={{ display: "flex", color: ACCENT, fontSize: 30, letterSpacing: 2 }}>
          {"> CASE STUDY"}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div
            style={{
              display: "flex",
              color: "#ffffff",
              fontSize: 76,
              fontWeight: 700,
              lineHeight: 1.1,
            }}
          >
            {name}
          </div>
          {tech && (
            <div style={{ display: "flex", color: "#9ca3af", fontSize: 30 }}>{tech}</div>
          )}
        </div>

        <div style={{ display: "flex", color: "#e5e7eb", fontSize: 32, fontWeight: 500 }}>
          Harshdeep Singh
          <span style={{ color: ACCENT, marginLeft: 12 }}>— Full Stack Developer</span>
        </div>
      </div>
    ),
    { ...size },
  );
}
