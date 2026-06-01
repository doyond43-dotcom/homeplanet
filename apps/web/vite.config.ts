import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
  plugins: [
    react(),

    {
      name: "dev-livekit-token",
      configureServer(server) {
        server.middlewares.use("/api/livekit-token", async (req, res) => {
          try {
            const url = new URL(req.url ?? "", "http://localhost");
            const room = (url.searchParams.get("room") || "taylor-creek").trim();
            const role = (url.searchParams.get("role") || "viewer").trim();

            const livekitUrl =
              env.LIVEKIT_URL || env.VITE_LIVEKIT_URL || process.env.LIVEKIT_URL || process.env.VITE_LIVEKIT_URL;
            const apiKey =
              env.LIVEKIT_API_KEY || env.VITE_LIVEKIT_API_KEY || process.env.LIVEKIT_API_KEY || process.env.VITE_LIVEKIT_API_KEY;
            const apiSecret =
              env.LIVEKIT_API_SECRET || env.VITE_LIVEKIT_API_SECRET || process.env.LIVEKIT_API_SECRET || process.env.VITE_LIVEKIT_API_SECRET;

            if (!livekitUrl || !apiKey || !apiSecret) {
              res.statusCode = 501;
              res.setHeader("Content-Type", "application/json");
              res.end(
                JSON.stringify({
                  error: "LiveKit not configured",
                  need: [
                    "LIVEKIT_URL",
                    "LIVEKIT_API_KEY",
                    "LIVEKIT_API_SECRET",
                  ],
                  got: {
                    LIVEKIT_URL: !!livekitUrl,
                    LIVEKIT_API_KEY: !!apiKey,
                    LIVEKIT_API_SECRET: !!apiSecret,
                  },
                })
              );
              return;
            }

            const { AccessToken } = await import("livekit-server-sdk");

            const identity = role === "host" ? "host" : "viewer";
            const name = role === "host" ? "Host" : "Viewer";

            const at = new AccessToken(apiKey, apiSecret, {
              identity,
              name,
            });

            at.addGrant({ roomJoin: true, room });

            const token = await at.toJwt();

            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ token, url: livekitUrl, room }));
          } catch (e) {
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: String(e) }));
          }
        });
      },
    },
  ],
  };
});

