process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const passport = require("passport");
// const session = require("express-session");
// const redis = require("redis");
// const RedisStore = require("connect-redis")(session);

// const redisClient = redis.createClient(
//   process.env.NODE_ENV === "production"
//     ? { host: process.env.REDIS_URL }
//     : {
//         host: "127.0.0.1",
//         port: 6379,
//         prefix: "sess",
//         pass: "passwordtoredis",
//       }
// );

const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const youtubeRouter = require("./routes/media-links");
const playlistRouter = require("./routes/playlists");

const app = express();

app.use(
  require("express-session")({
    // store: new RedisStore({
    //   client: redisClient,
    // }),
    secret: "secret",
    resave: false,
    saveUninitialized: false,
  })
);

require("./config/passport")(passport);
// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser("secret"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "ui", "build")));

  app.get("*", (req, res, next) => {
    res.sendFile(path.join(__dirname, "ui", "build", "index.html"));
  });
}

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/youtube", youtubeRouter);
app.use("/playlists", playlistRouter);

app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send();
});

module.exports = app;
