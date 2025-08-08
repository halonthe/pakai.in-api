import authRouter from "./auth.route.js";

const _routes = [{ path: "/auth", router: authRouter }];

export default function router(app) {
  _routes.forEach(({ path, router }) => app.use(`/api${path}`, router));
}
