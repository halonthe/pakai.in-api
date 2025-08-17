import authRouter from "./auth.route.js";
import userRouter from "./user.route.js";

const _routes = [
  { path: "/auth", router: authRouter },
  { path: "/users", router: userRouter },
];

export default function router(app) {
  _routes.forEach(({ path, router }) => app.use(`/api${path}`, router));
}
