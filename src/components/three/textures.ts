/**
 * Canvas-drawn textures shared by every scene: soft contact shadows, the
 * snap glint, icon glyphs for the glass tiles and the laptop/printer
 * screens. All procedural; nothing is loaded from disk.
 */
import * as THREE from "three";

export function canvasTexture(width: number, height: number, draw: (ctx: CanvasRenderingContext2D) => void) {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  draw(canvas.getContext("2d")!);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return texture;
}

/** Soft round falloff, for contact shadows and light pools. */
export function radialTexture(rgb: string, inner = 0.9, mid = 0.35) {
  return canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    g.addColorStop(0, `rgba(${rgb},${inner})`);
    g.addColorStop(0.45, `rgba(${rgb},${mid})`);
    g.addColorStop(1, `rgba(${rgb},0)`);
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
  });
}

/** Four-point specular star for the snap glint. */
export function glintTexture() {
  return canvasTexture(128, 128, (ctx) => {
    const g = ctx.createRadialGradient(64, 64, 0, 64, 64, 20);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 128, 128);
    ctx.fillStyle = "rgba(255,255,255,0.95)";
    ctx.beginPath();
    ctx.moveTo(64, 4);
    ctx.quadraticCurveTo(68, 60, 124, 64);
    ctx.quadraticCurveTo(68, 68, 64, 124);
    ctx.quadraticCurveTo(60, 68, 4, 64);
    ctx.quadraticCurveTo(60, 60, 64, 4);
    ctx.fill();
  });
}

/** 24px line-icon paths (stroke) for the glass tiles. */
export const ICON_PATHS = {
  shield: ["M12 3 5 6v5.5c0 4.2 2.9 7.9 7 9 4.1-1.1 7-4.8 7-9V6l-7-3Z", "m9 12 2 2 4-4"],
  gear: [
    "M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z",
    "M12 2.5v2.2M12 19.3v2.2M4.6 4.6l1.6 1.6M17.8 17.8l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.6 19.4l1.6-1.6M17.8 6.2l1.6-1.6",
  ],
  network: ["M12 4.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z", "M5 15.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM19 15.5a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z", "M12 8.5v3.5M12 12l-6 3.6M12 12l6 3.6"],
  camera: ["M3.5 8.5 15 5l1.5 5L5 13.5l-1.5-5Z", "M16.5 7.5 20.5 6v5l-3.3-1", "M7 13l1 4H4.5"],
  printer: ["M7 8V3.5h10V8", "M5 8h14a2 2 0 0 1 2 2v5.5h-4", "M7 15.5H3V10a2 2 0 0 1 2-2", "M7 13h10v7.5H7Z"],
  laptop: ["M5 5.5h14v9H5Z", "M2.5 18.5h19l-1.5-4h-16l-1.5 4Z"],
  chart: ["M4 20.5h16", "M6.5 17v-5M11 17V7M15.5 17v-8M20 17V4"],
  wrench: ["M14.5 5.5a4 4 0 0 0 4.9 4.9l-9 9a2.1 2.1 0 1 1-3-3l9-9a4 4 0 0 0-1.9-1.9Z", "M14.5 5.5 17 3l1.5 3.5L22 8l-2.6 2.4"],
} as const;

export type IconKey = keyof typeof ICON_PATHS;

/** An icon glyph, drawn white-to-sky on transparent, for inside a tile. */
export function iconTexture(icon: IconKey, color = "#ffffff") {
  return canvasTexture(256, 256, (ctx) => {
    ctx.translate(128, 128);
    ctx.scale(6.4, 6.4);
    ctx.translate(-12, -12);
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.lineWidth = 1.7;
    ctx.strokeStyle = color;
    ctx.shadowColor = "rgba(143,179,255,0.9)";
    ctx.shadowBlur = 1.2;
    for (const d of ICON_PATHS[icon]) ctx.stroke(new Path2D(d));
  });
}

/** A UI screen: a dark panel with a few interface rows and a chart. */
export function screenTexture(kind: "laptop" | "printer") {
  return canvasTexture(512, 320, (ctx) => {
    const bg = ctx.createLinearGradient(0, 0, 512, 320);
    bg.addColorStop(0, "#1b3a5c");
    bg.addColorStop(1, "#0f2742");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 512, 320);
    ctx.fillStyle = "rgba(143,179,255,0.9)";
    if (kind === "laptop") {
      ctx.fillRect(36, 40, 180, 14);
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      [80, 108, 136].forEach((y, i) => ctx.fillRect(36, y, 220 - i * 40, 9));
      const bars = [0.45, 0.7, 0.55, 0.9, 0.75];
      bars.forEach((h, i) => {
        ctx.fillStyle = i === 3 ? "#8fb3ff" : "rgba(143,179,255,0.45)";
        ctx.fillRect(300 + i * 36, 260 - h * 170, 22, h * 170);
      });
      ctx.fillStyle = "rgba(255,255,255,0.18)";
      ctx.fillRect(36, 200, 200, 70);
    } else {
      ctx.fillRect(40, 60, 120, 18);
      ctx.fillStyle = "rgba(255,255,255,0.3)";
      ctx.fillRect(40, 110, 300, 12);
      ctx.fillRect(40, 140, 220, 12);
    }
  });
}
