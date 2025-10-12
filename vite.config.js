import devtoolsJson from "vite-plugin-devtools-json";
import { sveltekit } from "@sveltejs/kit/vite";
import UnoCSS from "unocss/vite";

/** @type {import('vite').UserConfig} */
const config = {
  plugins: [UnoCSS(), sveltekit(), devtoolsJson()],
};

export default config;
