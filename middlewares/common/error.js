// middleware function
const errHandler = () => {
  return (err, req, res, next) => {
    switch (err) {
      // client side errors
      case 401:
        return res.status(401).render("pages/error.ejs", {
          error: {
            ero: [4, 0, 1],
            msg: "Unauthorized",
          },
        });
      case 403:
        return res.status(403).render("pages/error.ejs", {
          error: {
            ero: [4, 0, 3],
            msg: "Forbidden",
          },
        });
      case 404:
        return res.status(404).render("pages/error.ejs", {
          error: {
            ero: [4, 0, 4],
            msg: "Not found",
          },
        });
      case 408:
        return res.status(408).render("pages/error.ejs", {
          error: {
            ero: [4, 0, 8],
            msg: "Request Timeout",
          },
        });
      //   server side errors
      case 502:
        return res.status(502).render("pages/error.ejs", {
          error: {
            ero: [5, 0, 2],
            msg: "Bad Gateway",
          },
        });
      case 503:
        return res.status(503).render("pages/error.ejs", {
          error: {
            ero: [5, 0, 3],
            msg: "Service Unavailable",
          },
        });
      case 504:
        return res.status(504).render("pages/error.ejs", {
          error: {
            ero: [5, 0, 4],
            msg: "Gateway Timeout",
          },
        });
      // custom error message
      case 500:
        return res.status(500).render("pages/error.", {
          error: {
            ero: [5, 0, 0],
            msg: "Internal Server Error",
          },
        });
      default:
        console.log(err.stack);
        return res.status(500).render("pages/error.ejs", {
          error: {
            ero: ["Err", "O", "r"],
            msg: err,
          },
        });
    }
  };
};

module.exports = errHandler;
