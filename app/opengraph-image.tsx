import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "席マネ - 席替え・座席表作成ツール";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    <div style={{ alignItems: "center", background: "linear-gradient(135deg, #e0f2fe 0%, #ffffff 100%)", color: "#0f172a", display: "flex", height: "100%", padding: "72px", width: "100%" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ color: "#0369a1", display: "flex", fontSize: 34, fontWeight: 700 }}>席替え・座席表作成ツール</div>
        <div style={{ display: "flex", fontSize: 104, fontWeight: 800, marginTop: 24 }}>席マネ</div>
        <div style={{ color: "#334155", display: "flex", fontSize: 38, marginTop: 30 }}>かんたん操作で、理想の座席表を作成</div>
      </div>
    </div>,
    size,
  );
}
