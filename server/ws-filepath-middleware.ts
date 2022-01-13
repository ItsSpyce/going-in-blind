// this middleware will read the files from /pages/ws and create socket handlers
// like file based routing
import path from 'path';
import fs from 'fs';
// import { pathToRegexp } from 'path-to-regexp';
import type { Socket } from 'socket.io';
import type { ExtendedError } from 'socket.io/dist/namespace';
import { WebSocketHandler } from './types';

function walk(dir: string): Promise<string[]> {
  return new Promise((resolve, reject) => {
    let result: string[] = [];
    fs.readdir(dir, (err, files) => {
      if (err) {
        return reject(err);
      }
      let pending = files.length;
      if (pending === 0) {
        return resolve(files);
      }
      for (let i = 0; i < files.length; ++i) {
        const file = path.resolve(dir, files[i]);
        fs.stat(file, (statErr, stat) => {
          if (statErr) {
            return reject(statErr);
          }
          if (stat.isDirectory()) {
            // walk through
            walk(file)
              .then((files) => {
                result = [...result, ...files];
                if (--pending === 0) {
                  return resolve(result);
                }
              })
              .catch(reject);
          } else {
            result.push(path.relative(process.cwd(), file));
            if (--pending === 0) {
              return resolve(result);
            }
          }
        });
      }
    });
  });
}

export type WsFilepathMiddlewareOptions = Partial<{
  directory?: string;
}>;

type WsFilepathMapping = {
  filename: string;
  path: string;
};

const getPathFromFilename = (filename: string) =>
  filename.substring(
    filename.startsWith('/') ? 1 : 0,
    filename.lastIndexOf('.')
  );

const getHandler = async (filename: string) => {
  const resolvedImport = await import(path.resolve(process.cwd(), filename));
  if (typeof resolvedImport === 'function') {
    return resolvedImport;
  }
  if ('default' in resolvedImport) {
    return resolvedImport.default;
  }
  if ('handle' in resolvedImport) {
    return resolvedImport.handle;
  }
  throw new Error(
    `Invalid handler found at ${filename}. Use default exports or named export "handle"`
  );
};

export default function wsFilepath({
  directory = 'pages/ws',
}: WsFilepathMiddlewareOptions) {
  const dir = path.resolve('./', directory);
  let filePathMappings = new Array<WsFilepathMapping>();
  return async (socket: Socket, next: (err?: ExtendedError) => void) => {
    if (filePathMappings.length === 0) {
      filePathMappings = (await walk(dir)).map((filename) => ({
        filename,
        path: getPathFromFilename(filename.split(directory)[1]),
      }));
    }
    for (const mapping of filePathMappings) {
      socket.on(mapping.path, async (...args) => {
        const handler = (await getHandler(
          mapping.filename
        )) as WebSocketHandler;
        handler(socket, ...args);
      });
    }
    // we have to manually call this one because we're already in the connect handler
    const connectHandlerMapping = filePathMappings.find(
      (mapping) => mapping.path === 'connect'
    );
    if (connectHandlerMapping) {
      const connectHandler = await getHandler(connectHandlerMapping.filename);
      connectHandler(socket);
    }

    next();
  };
}

wsFilepath.next = () => wsFilepath({ directory: 'pages/ws' });
