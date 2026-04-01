import { create } from "zustand";

const themes = {
  brown: {
    name: "Brown",
    pageBg: "#140904",
    panelBg: "linear-gradient(180deg, #180803 0%, #130602 100%)",
    panelSoft: "rgba(29, 10, 5, 0.8)",
    inputBg: "rgba(39, 13, 6, 0.9)",
    border: "rgba(196, 133, 82, 0.35)",
    borderSoft: "rgba(196, 133, 82, 0.24)",
    text: "#f8dfc7",
    subtext: "#ddb38e",
    muted: "#b48f71",
    accent: "#b57a4d",
    accentStrong: "#c48752",
    online: "#76e04b",
    offline: "#7b726b",
    outgoing: "#b57a4d",
    incoming: "#2b130b",
    unreadBorder: "rgba(255, 59, 59, 0.55)",
    unreadBg: "rgba(58, 18, 10, 0.92)",
    danger: "#ff3b3b",
  },

  purple: {
    name: "Purple",
    pageBg: "#12091d",
    panelBg: "linear-gradient(180deg, #1a1028 0%, #12091d 100%)",
    panelSoft: "rgba(28, 16, 44, 0.82)",
    inputBg: "rgba(34, 20, 54, 0.95)",
    border: "rgba(169, 111, 255, 0.35)",
    borderSoft: "rgba(169, 111, 255, 0.22)",
    text: "#f1e8ff",
    subtext: "#cdb8ff",
    muted: "#ae95d8",
    accent: "#8f5cf7",
    accentStrong: "#a96fff",
    online: "#76e04b",
    offline: "#7b726b",
    outgoing: "#8f5cf7",
    incoming: "#241632",
    unreadBorder: "rgba(255, 59, 59, 0.55)",
    unreadBg: "rgba(64, 25, 85, 0.95)",
    danger: "#ff3b3b",
  },

  blue: {
    name: "Blue",
    pageBg: "#07131f",
    panelBg: "linear-gradient(180deg, #0d2031 0%, #08131d 100%)",
    panelSoft: "rgba(10, 27, 42, 0.84)",
    inputBg: "rgba(12, 31, 49, 0.95)",
    border: "rgba(97, 173, 255, 0.35)",
    borderSoft: "rgba(97, 173, 255, 0.22)",
    text: "#e8f4ff",
    subtext: "#b6d7ff",
    muted: "#8fb3da",
    accent: "#3793ff",
    accentStrong: "#61adff",
    online: "#76e04b",
    offline: "#7b726b",
    outgoing: "#3793ff",
    incoming: "#122131",
    unreadBorder: "rgba(255, 59, 59, 0.55)",
    unreadBg: "rgba(18, 38, 59, 0.96)",
    danger: "#ff3b3b",
  },

  emerald: {
    name: "Emerald",
    pageBg: "#071611",
    panelBg: "linear-gradient(180deg, #0d2119 0%, #071611 100%)",
    panelSoft: "rgba(12, 33, 25, 0.84)",
    inputBg: "rgba(14, 37, 28, 0.95)",
    border: "rgba(91, 214, 160, 0.35)",
    borderSoft: "rgba(91, 214, 160, 0.22)",
    text: "#e8fff5",
    subtext: "#b4e9d1",
    muted: "#8fc8af",
    accent: "#2fbf83",
    accentStrong: "#5bd6a0",
    online: "#76e04b",
    offline: "#7b726b",
    outgoing: "#2fbf83",
    incoming: "#11241c",
    unreadBorder: "rgba(255, 59, 59, 0.55)",
    unreadBg: "rgba(17, 36, 28, 0.96)",
    danger: "#ff3b3b",
  },
};

const savedThemeKey = localStorage.getItem("chat-theme") || "brown";

export const useThemeStore = create((set) => ({
  themes,
  currentThemeKey: themes[savedThemeKey] ? savedThemeKey : "brown",

  setTheme: (themeKey) => {
    if (!themes[themeKey]) return;
    localStorage.setItem("chat-theme", themeKey);
    set({ currentThemeKey: themeKey });
  },
}));
