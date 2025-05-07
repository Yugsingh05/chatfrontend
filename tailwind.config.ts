// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      backgroundImage: {
        chat: "url('/chat-bg.png')",
      },
      colors: {
        secondary: "#8696a0",
        tealLight: "#7ae3c3",
        photopickerOverlay: "rgba(30,42,49,0.8)",
        dropdown: "#233138",
        dropdownHover: "#182229",
        input: "#2a3942",
        primaryStrong: "#e9edef",
        panelHeader: "#202c33",
        panelIcon: "#aebac1",
        iconLighter: "#8696a0",
        iconGreen: "#00a884",
        searchInput: "#111b21",
        conversationBorder: "rgba(134,150,160,0.15)",
        conversationPanel: "#0b141a",
        hoverBackground: "#202c33",
        incoming: "#202c33",
        outgoing: "#005c4b",
        bubbleMeta: "hsla(0,0%,100%,0.6)",
        iconAck: "#53bdeb",
      },
      gridTemplateColumns: {
        main: "1fr 2.4fr",
      },
    },
  },
  plugins: [],
};

export default config;
