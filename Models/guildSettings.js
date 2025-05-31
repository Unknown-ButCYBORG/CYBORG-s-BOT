const mongoose = require("mongoose");

const guildSettingsSchema = new mongoose.Schema({
  guildID: { type: String, required: true, unique: true },

  welcome: {
    enabled: { type: Boolean, default: false },
    channel: { type: String, default: "" },
    message: { type: String, default: "" },
  },

  modlog: {
    enabled: { type: Boolean, default: false },
    channel: { type: String, default: "" },
  },

  autorole: {
    enabled: { type: Boolean, default: false },
    role: { type: String, default: "" },
  },

  prefix: { type: String, default: "!" },
  customCommands: {
    type: Map,
    of: String,
    default: {},
  },
  verification: {
    enabled: { type: Boolean, default: false },
    channel: { type: String, default: "" },
    role: { type: String, default: "" },
    message: {
      type: String,
      default: "Click the button below to verify yourself!",
    },
  },
  buttonRoles: [
    {
      label: { type: String, required: true },
      roleId: { type: String, required: true },
      emoji: { type: String, default: "" },
    },
  ],
});

module.exports = mongoose.model("GuildSettings", guildSettingsSchema);
