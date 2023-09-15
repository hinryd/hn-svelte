import { presetUno, defineConfig, presetWind } from "unocss";

export default defineConfig({
  theme: {
    extend: {
      colors: {
        primary: "#FF6363",
        secondary: "#4B5563",
        accent: "#67C3C3",
      },
    },
  },
  plugins: [presetWind()],
});
