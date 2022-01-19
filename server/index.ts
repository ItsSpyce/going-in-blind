// if anyone says "use tsconfig-paths!!!11!", suck one because that shit doesn't work
import 'module-alias/register';
import 'dotenv/config';
import './handlers';
import { createServer } from 'http';
import express from 'express';
import { parse } from 'url';
import next from 'next';
import { Server as SocketServer } from 'socket.io';
import { socketHandlerMiddlware } from './socket-handler';

const port = parseInt(process.env.PORT || '3000', 10);
const dev = process.env.NODE_ENV !== 'production';
const wsPath = '/ws';

(async function () {
  // create Next server
  const nextApp = next({ dev });
  const nextHandle = nextApp.getRequestHandler();
  await nextApp.prepare();

  // create Express server
  const app = express();
  app.use(express.json(), express.urlencoded());

  app.use((req, res, next) => {
    if (req.path.startsWith(wsPath)) {
      // avoid next
      return next();
    }
    const parsedUrl = parse(req.url!, true);
    return nextHandle(req, res, parsedUrl);
  });

  const httpServer = createServer(app);

  // don't let socketIO handle cookie creation and validation, we'll handle it in express
  const io = new SocketServer(httpServer, {
    path: wsPath,
  });
  io.use(socketHandlerMiddlware());

  httpServer.listen(port);
  console.log(
    `> Server listening at http://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
})();
