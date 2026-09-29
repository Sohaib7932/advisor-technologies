import type { ReactNode } from "react";
import {
  GhostFibersBackground,
  GradientBlindsBackground,
  MoltenMetalBackground,
  OrbParticlesBackground,
} from "./lazy-backgrounds";
import { palette } from "./palette";

/**
 * Animated WebGL layers for the four supporting tiles of the home bento,
 * which deliberately use motion rather than photographs. `surface` is the
 * CSS gradient underneath: it shows before the effect loads, and stays as
 * the fallback if WebGL is unavailable.
 */
export const serviceEffects: Record<string, { surface: string; background: ReactNode }> = {
  computing: {
    surface: "bg-[linear-gradient(140deg,#0b1424_0%,#12233f_100%)]",
    background: (
      <GradientBlindsBackground
        gradientColors={[palette.deepNavy, palette.electricBlue, palette.cyan]}
        angle={18}
        noise={0.25}
        blindCount={12}
        blindMinWidth={40}
        mirrorGradient
        spotlightRadius={0.6}
        spotlightSoftness={1.2}
        spotlightOpacity={0.9}
        mouseDampening={0.15}
        shineDirection="left"
        mixBlendMode="lighten"
      />
    ),
  },
  "security-systems": {
    surface: "bg-[linear-gradient(160deg,#061426_0%,#0f3a66_52%,#050b14_100%)]",
    background: (
      <GhostFibersBackground
        lineColor={palette.deepNavy}
        glowColor={palette.cyan}
        layers={6}
        scale={1.6}
        speed={0.16}
        twist={0.14}
        lineSharpness={14}
        glowIntensity={1.3}
        brightness={1.7}
        vignette={0.7}
      />
    ),
  },
  printing: {
    surface:
      "bg-[radial-gradient(120%_120%_at_80%_20%,#1880d8_0%,#0f4c93_38%,#0d1a33_74%,#080b18_100%)]",
    background: (
      <MoltenMetalBackground
        color1={palette.deepNavy}
        color2={palette.electricBlue}
        color3={palette.cyan}
        colorMode="molten"
        speed={0.3}
        scale={5}
        detail={4}
        glow={2.2}
        coreSize={0.15}
        swirl={1.3}
        fold={-0.3}
        blackPoint={0.02}
        brightness={2.2}
        grain
        grainIntensity={0.04}
        mouseInteraction
        mouseStrength={0.25}
      />
    ),
  },
  maintenance: {
    surface: "bg-[linear-gradient(140deg,#0e1d38_0%,#12335e_100%)]",
    background: (
      <OrbParticlesBackground
        particleColors={[palette.cyan, palette.electricBlue, palette.offWhite]}
        particleCount={900}
        particleSpread={3.2}
        cameraDistance={20}
        speed={0.1}
        particleBaseSize={110}
        shellThickness={0.16}
        jitter={0.3}
        moveParticlesOnHover
        particleHoverFactor={0.6}
        alphaParticles
        disableRotation={false}
        pixelRatio={2}
      />
    ),
  },
};
