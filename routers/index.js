// api routes
const apiRoutes = require("../api/routers");

// routes
const authRoutes = require("./auth");
const dashboardRoutes = require("./dashboard");
const profileRoutes = require("./profile");
const messagesRoutes = require("./message");
const employeesRoutes = require("./employee");
const taskRoutes = require("./task");

// all routes

const routers = [
  {
    path: "/tadmin/messages",
    handeler: messagesRoutes,
  },
  {
    path: "/tadmin/profile",
    handeler: profileRoutes,
  },
  {
    path: "/tadmin/employees",
    handeler: employeesRoutes,
  },
  {
    path: "/tadmin/tasks",
    handeler: taskRoutes,
  },
  {
    path: "/tadmin",
    handeler: dashboardRoutes,
  },
  {
    path: "/auth",
    handeler: authRoutes,
  },
  {
    path: "/api",
    handeler: apiRoutes,
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
