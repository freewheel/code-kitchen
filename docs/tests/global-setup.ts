import { createServer } from "http";
import next from "next";
import { parse } from "url";

async function nextDev() {
  const port = 3000;
  const hostname = "localhost";
  const app = next({ dev: true, hostname });
  const handle = app.getRequestHandler();

  await app.prepare();
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error("Error occurred handling", req.url, err);
      res.statusCode = 500;
      res.end("internal server error");
    }
  }).listen(port, () => {
    console.log(`> Ready on http://${hostname}:${port}`);
  });
}

async function globalSetup() {
  await nextDev();
}

export default globalSetup;
