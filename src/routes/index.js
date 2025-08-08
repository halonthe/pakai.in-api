import authRouter from "./auth.route.js";

const _routes = [authRouter];

export default function router(app) {
  _routes.forEach((route) => app.use('/api',route));
}
