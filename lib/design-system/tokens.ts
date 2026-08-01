/**
 * Global SaaS Design Tokens
 * Design language inspired by premium SaaS visual standards (vidsync.framer.ai style)
 */

export const colors = {
  primary: {
    DEFAULT: "#5B5CEB",
    hover: "#4F46E5",
    light: "#EEF2FF",
    dark: "#4338CA",
  },
  secondary: {
    DEFAULT: "#111827",
    light: "#1F2937",
  },
  text: {
    primary: {
      light: "#111827",
      dark: "#F9FAFB",
    },
    secondary: {
      light: "#4B5563",
      dark: "#9CA3AF",
    },
    muted: {
      light: "#9CA3AF",
      dark: "#6B7280",
    },
  },
  background: {
    light: "#FFFFFF",
    dark: "#0B0F19",
  },
  section: {
    light: "#F8FAFC",
    dark: "#0F172A",
  },
  card: {
    light: "#FFFFFF",
    dark: "#141C2E",
  },
  border: {
    light: "rgba(17, 24, 39, 0.08)",
    dark: "rgba(255, 255, 255, 0.08)",
  },
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    danger: "#EF4444",
    info: "#3B82F6",
  },
} as const

export const typography = {
  fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  display: {
    xl: { fontSize: "72px", lineHeight: "1.05", fontWeight: "800" },
    lg: { fontSize: "64px", lineHeight: "1.05", fontWeight: "800" },
    md: { fontSize: "56px", lineHeight: "1.05", fontWeight: "700" },
  },
  heading: {
    xl: { fontSize: "48px", lineHeight: "1.1", fontWeight: "700" },
    lg: { fontSize: "40px", lineHeight: "1.15", fontWeight: "700" },
    md: { fontSize: "32px", lineHeight: "1.2", fontWeight: "600" },
  },
  title: {
    lg: { fontSize: "28px", lineHeight: "1.25", fontWeight: "600" },
    md: { fontSize: "24px", lineHeight: "1.3", fontWeight: "600" },
    sm: { fontSize: "20px", lineHeight: "1.35", fontWeight: "600" },
  },
  body: {
    lg: { fontSize: "18px", lineHeight: "1.7", fontWeight: "400" },
    md: { fontSize: "16px", lineHeight: "1.7", fontWeight: "400" },
    sm: { fontSize: "14px", lineHeight: "1.6", fontWeight: "400" },
  },
  caption: {
    fontSize: "12px",
    lineHeight: "1.5",
    fontWeight: "500",
  },
} as const

export const spacing = {
  4: "4px",
  8: "8px",
  12: "12px",
  16: "16px",
  20: "20px",
  24: "24px",
  32: "32px",
  40: "40px",
  48: "48px",
  56: "56px",
  64: "64px",
  80: "80px",
  96: "96px",
  120: "120px",
  160: "160px",
} as const

export const radius = {
  sm: "6px",
  md: "10px",
  lg: "16px",
  xl: "20px", // Preferred card radius
  "2xl": "24px",
  "3xl": "32px",
  full: "9999px",
} as const

export const shadows = {
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.05), 0 4px 6px -2px rgba(0, 0, 0, 0.025)",
  xl: "0 20px 25px -5px rgba(0, 0, 0, 0.05), 0 10px 10px -5px rgba(0, 0, 0, 0.02)",
  glow: "0 0 25px -5px rgba(91, 92, 235, 0.25)",
} as const

export const gradients = {
  primary: "linear-gradient(135deg, #5B5CEB 0%, #4F46E5 100%)",
  hero: "linear-gradient(180deg, #FFFFFF 0%, #EEF2FF 100%)",
  button: "linear-gradient(135deg, #5B5CEB 0%, #3B82F6 100%)",
  glow: "radial-gradient(circle at center, rgba(91, 92, 235, 0.15) 0%, transparent 70%)",
} as const

export const layout = {
  containerWidth: "1280px",
  contentWidth: "768px",
  sectionPaddingDesktop: "120px",
  sectionPaddingMobile: "80px",
} as const
