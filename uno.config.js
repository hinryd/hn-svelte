import { presetWind, defineConfig, presetAttributify } from "unocss";

export default defineConfig({
  plugins: [presetWind(), presetAttributify()],
});
