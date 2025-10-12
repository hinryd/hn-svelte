import { dev } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import type { PageLoad } from "./$types";

export const load: PageLoad = () => {
  throw redirect(dev ? 302 : 301, "/top");
};
