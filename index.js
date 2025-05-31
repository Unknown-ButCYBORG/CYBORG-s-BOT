const path = require("path");
const { Client, Collection, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const config = require("./config.json");
const eventHandler = require("./Handlers/EventHandler");
const cmdHandler = require("./Handlers/CmdHandler");
const mongoose = require("mongoose");

mongoose
  .connect(config.mongoDbURL, {})
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.config = config;
client.commands = new Collection();
client.slashCommands = new Collection();

eventHandler(client);
cmdHandler(client);

client.login(config.token);

const express = require("express");
const session = require("express-session");
const passport = require("passport");
const pathExpress = require("path");

const app = express();
const PORT = 3000 || config.port;

require("./dashboard/strategies/discord");

app.set("view engine", "ejs");
app.set("views", pathExpress.join(__dirname, "dashboard", "views"));
app.use(express.static(pathExpress.join(__dirname, "dashboard", "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: config.clientSecret,
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

module.exports = client;

const dashboardRoutes = require("./dashboard/routes/index");
app.use("/", dashboardRoutes);

app.listen(PORT, () => {
  console.log(`Dashboard is running at http://localhost:${PORT}`);
});
