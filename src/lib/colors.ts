// 趣魅 · 复古橙色彩系统

export const C = {
  brick: "#A64B3A",
  dark: "#8B3A2A",
  terracotta: "#D4A090",
  warm: "#FDF0EA",
  white: "#FFFAF7",
  text: "#3D1810",
  textMuted: "#8B5A4A",
} as const;

export const cardTones = [C.white, C.terracotta, C.brick] as const;

// 共享样式工厂
export const S = {
  heading: {
    fontFamily: "'ZCOOL KuaiLe', 'Noto Sans SC', cursive",
    fontWeight: 400,
    letterSpacing: "0.03em",
  } as React.CSSProperties,

  body: {
    fontFamily: "'Noto Sans SC', system-ui, sans-serif",
    fontSize: "16px",
    lineHeight: 1.85,
  } as React.CSSProperties,

  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "11px 22px",
    fontSize: "13px",
    fontWeight: 700,
    color: C.warm,
    background: C.brick,
    border: "none",
    borderRadius: "8px",
    textDecoration: "none",
    cursor: "pointer",
  } as React.CSSProperties,

  btnOutline: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    padding: "11px 22px",
    fontSize: "13px",
    fontWeight: 700,
    color: C.brick,
    background: "transparent",
    border: `2px solid ${C.brick}`,
    borderRadius: "8px",
    textDecoration: "none",
    cursor: "pointer",
  } as React.CSSProperties,

  circle: (size: number, borderStyle = "solid") =>
    ({
      width: size,
      height: size,
      borderRadius: "50%",
      border: `2.5px ${borderStyle} ${C.terracotta}`,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    } as React.CSSProperties),
};
