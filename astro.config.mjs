import node from "@astrojs/node";
import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://ethereal-aperture.onrender.com",
  output: "server",
  adapter: node({ mode: "standalone" }),
  security: {
    // Render terminates TLS in front of the app, so Origin is https while
    // the Node process sees http. The default check blocks every admin form.
    checkOrigin: false,
  },
});
