const mongoose = require("mongoose");
const readLine = require("readline");
const host = process.env.DB_HOST || "127.0.0.1";
const dbURI = `mongodb://${host}/travlr`;


// avoid current server discovery and monitoring engine is depreciated
//mongoose.set("useUnifiedTopology", false);

const connect = () => {
  setTimeout(
    () =>
      mongoose.connect(dbURI, {
        useNewUrlParser: true,
        useUnifiedTopology : true,
        useCreateIndex: true,
      }),
    1000
  );
};

mongoose.connection.on("connected", () => {
  console.log(`Mongoose connected to ${dbURI}`);
});

mongoose.connection.on("error", (err) => {
  console.log(`Mongoose connection error: `, err);
});

mongoose.connection.on("disconnected", () => {
  console.log(`Mongoose disconnected`);
});

// Windows-specific code and macOS -specific code
if (process.platform == "win32" || "darwin" ) {
  const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.on("SIGINT", () => {
    process.emit("SIGINT");
  });
}

const gracefulShutdown = (msg, callback) => {
  mongoose.connection.close(() => {
    console.log(`Mongoose disconnected through ${msg}`);
    callback();
  });
};

// nodemon restarts
process.once("SIGUSR2", () => {
  gracefulShutdown("nodemon restart", () => {
    process.kill(process.pid, "SIGUSR2");
  });
});

// app termination
process.on("SIGINT", () => {
  gracefulShutdown("app termination", () => {
    process.exit(0);
  });
});

// Herokue app termination
process.on("SIGTERM", () => {
  gracefulShutdown("Heroku app shutdown", () => {
    process.exit(0);
  });
});

connect();

// bring in schema
// require("./models/travlr");
require('./travlr');
require('./rooms');
require('./news');
require('./meals');