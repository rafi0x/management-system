// routes
const authRoutes = require("./auth");
const dashboardRoutes = require("./dashboard");
const profileRoutes = require("./profile");
const messagesRoutes = require("./message");
const employeesRoutes = require("./employee");
const tasksRoutes = require("./task");

const routes = [
  dashboardRoutes,
  profileRoutes,
  messagesRoutes,
  employeesRoutes,
  tasksRoutes,
];

const routers = [
  {
    path: "/auth",
    handeler: authRoutes,
  },
  {
    path: "/tadmin",
    handeler: routes,
  },
  {
    path: "",
    handeler: (req, res, next) => {
      next(404);
    },
  },
];

module.exports = (app) => {
  routers.map((router) => {
    app.use(router.path, router.handeler);
  });
};
