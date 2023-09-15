const { Request: Req, Response: Res, Application: App } = require("express");
const fs = require("fs");
const path = require("path");

type RouteDetail = {
  path: string;
  pattern: RegExp;
  handler: Function;
};

type RouteFile = {
  dir: string;
  path: string;
};

const compactRoutes: Record<string, RouteDetail[]> = {
  get: [],
  post: [],
  put: [],
  delete: [],
};

module.exports = function (app: typeof App, routesPath: string): void {
  for (const routeFile of readAllFiles(routesPath, routesPath)) {
    //load each route
    const router = require(path.join(routeFile.dir));

    // each route has a prop named stack which is an array of all defined handlers
    router.stack.forEach((s: any) => {
      const httpMethod = s.route.stack[0].method;

      // routeFile.path > /admin/posts
      // s.route.path >  / or /:id
      const httpPath: string = routeFile.path + s.route.path;

      // add handlers to a list to later use them in a global handler for each method
      compactRoutes[httpMethod].push({
        path: httpPath,
        pattern: updatePattern(s.regexp, routeFile.path),
        handler: s.route.stack[0].handle,
      });
    });
  }

  /* Now we have something like this in compactRoutes

  get: [
    {
      path:"/admin/posts",
      pattern: /^\/admin\/posts\//i,
      handler: [function]
    },
    {
      path: "/admin/posts/:id",
      pattern: ...
      handler: ...
    }
  ],
  post:[
    {
      path: "auth/login",
      pattern: ...,
      handler: ...
    }
  ]

  */

  // Now for each httpMethod
  Object.keys(compactRoutes).forEach((method) => {
    // get all the paths
    const paths = compactRoutes[method].map((r) => r.path);

    // if there are any
    if (paths.length > 0)
      // add a global handler to app for that method which handles all the requests for all the paths
      app[method](paths, (req: typeof Req, res: typeof Res) => {
        // find the corresponding route defined by developer by testing the path with patterns
        const currentRoute = compactRoutes[method].find((r) =>
          r.pattern.test(req.path)
        );

        // pass request to that route
        return currentRoute?.handler(req, res);
      });
  });
};

function* readAllFiles(dir: string, baseDir: string): Generator<RouteFile> {
  const contents = fs.readdirSync(dir, { withFileTypes: true });

  for (const item of contents) {
    if (item.isDirectory()) {
      yield* readAllFiles(path.join(dir, item.name), baseDir);
    } else {
      yield {
        dir: path.join(dir, item.name),
        path: buildRouteFilePath(item.name, dir, baseDir),
      };
    }
  }
}

function buildRouteFilePath(
  fileName: string,
  dir: string,
  baseDir: string
): string {
  // convert "c:\proj\src\routes\admin" to "/admin"
  const filePath = dir.replace(baseDir, "").replace(path.sep, "/");

  // if route's filename is home.route.js or home.js
  // we don't want a path like /admin/home
  // we want /admin
  const fileNameWithoutExt = fileName.includes("home")
    ? ""
    : "/" + path.basename(fileName, ".js");

  // return "/admin/posts"
  return `${filePath}${fileNameWithoutExt}`;
}

// to update /^\//i to /^\/admin\/posts\//i
function updatePattern(currentPattern: RegExp, collectionPath: string): RegExp {
  const [rgxStart, ...rest] = currentPattern.source.split("\\/");

  return new RegExp(
    `${rgxStart}${collectionPath}\\/${rest.join("\\/")}`,
    currentPattern.flags
  );
}
