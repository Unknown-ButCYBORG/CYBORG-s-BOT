const express = require("express");
const passport = require("passport");
const path = require("path");
const ensureAuth = require("../middleware/ensureAuth");
const bot = require("../../index");
const GuildSettings = require("../../Models/guildSettings");

const router = express.Router();

function getMutualGuilds(userGuilds, botGuilds) {
  return userGuilds.filter(g => botGuilds.has(g.id));
}

router.get("/", (req, res) => {
  res.render("home", { user: req.user });
});

router.get("/login", passport.authenticate("discord"));

router.get("/callback", passport.authenticate("discord", {
  failureRedirect: "/"
}), (req, res) => {
  res.redirect("/dashboard");
});

router.get("/dashboard", ensureAuth, (req, res) => {
  const user = req.user;
  const guilds = getMutualGuilds(user.guilds, bot.guilds.cache);
  const commands = [
    { name: "ping", description: "Check bot latency" },
    { name: "kick", description: "Kick a user" },
    { name: "ban", description: "Ban a user" },
    { name: "serverinfo", description: "Get server details" },
    { name: "userinfo", description: "Get user details" }
  ];
  res.render("dashboard", { user, guilds, commands });
});

router.get("/dashboard/:guildID", ensureAuth, (req, res) => {
  const guild = bot.guilds.cache.get(req.params.guildID);
  if (!guild) return res.redirect("/dashboard");
  res.render("guild", { user: req.user, guild });
});

router.get("/dashboard/:guildID/welcome", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const guild = bot.guilds.cache.get(guildID);
  if (!guild) return res.redirect("/dashboard");
  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });
  const textChannels = guild.channels.cache.filter(c => c.type === 0 && c.viewable).map(c => ({ id: c.id, name: c.name }));
  res.render("modules/welcome", { user: req.user, guild, settings, textChannels });
});

router.post("/dashboard/:guildID/welcome", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });
  settings.welcome = {
    enabled: req.body.welcome_enabled === "on",
    channel: req.body.welcome_channel,
    message: req.body.welcome_message
  };
  await settings.save();
  res.redirect(`/dashboard/${guildID}/welcome`);
});

router.get("/dashboard/:guildID/modlog", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const guild = bot.guilds.cache.get(guildID);
  if (!guild) return res.redirect("/dashboard");
  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });
  const textChannels = guild.channels.cache.filter(c => c.type === 0 && c.viewable).map(c => ({ id: c.id, name: c.name }));
  res.render("modules/modlog", { user: req.user, guild, settings, textChannels });
});

router.post("/dashboard/:guildID/modlog", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });
  settings.modlog = {
    enabled: req.body.modlog_enabled === "on",
    channel: req.body.modlog_channel
  };
  await settings.save();
  res.redirect(`/dashboard/${guildID}/modlog`);
});

router.get("/dashboard/:guildID/autorole", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const guild = bot.guilds.cache.get(guildID);
  if (!guild) return res.redirect("/dashboard");
  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });
  const roles = guild.roles.cache.filter(r => r.editable && !r.managed).map(r => ({ id: r.id, name: r.name }));
  res.render("modules/autorole", { user: req.user, guild, settings, roles });
});

router.post("/dashboard/:guildID/autorole", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });
  settings.autorole = {
    enabled: req.body.autorole_enabled === "on",
    role: req.body.autorole_role
  };
  await settings.save();
  res.redirect(`/dashboard/${guildID}/autorole`);
});

router.get("/dashboard/:guildID/prefix", ensureAuth, async (req, res) => {
  const guild = bot.guilds.cache.get(req.params.guildID);
  if (!guild) return res.redirect("/dashboard");
  const settings = await GuildSettings.findOne({ guildID: guild.id }) || await GuildSettings.create({ guildID: guild.id });
  res.render("modules/prefix", { user: req.user, guild, settings });
});

router.post("/dashboard/:guildID/prefix", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });
  settings.prefix = req.body.prefix || "!";
  await settings.save();
  res.redirect(`/dashboard/${guildID}/prefix`);
});



router.get("/dashboard/:guildID/verify", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const guild = bot.guilds.cache.get(guildID);
  if (!guild) return res.redirect("/dashboard");
  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });
  const roles = guild.roles.cache.filter(r => r.editable && !r.managed).map(r => ({ id: r.id, name: r.name }));
  const textChannels = guild.channels.cache.filter(c => c.type === 0 && c.viewable).map(c => ({ id: c.id, name: c.name }));
  res.render("modules/verify", { user: req.user, guild, settings, roles, textChannels });
});

router.post("/dashboard/:guildID/verify", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });
  settings.verification = {
    enabled: req.body.verification_enabled === "on",
    channel: req.body.verification_channel,
    role: req.body.verification_role,
    message: req.body.verification_message
  };
  await settings.save();

  const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
  const channel = bot.channels.cache.get(settings.verification.channel);
  if (settings.verification.enabled && settings.verification.channel && settings.verification.message && channel && channel.isTextBased()) {
    try {
      await channel.send({
        content: settings.verification.message,
        components: [
          new ActionRowBuilder().addComponents(
            new ButtonBuilder()
              .setCustomId("verify_button")
              .setLabel("✅ Verify Me")
              .setStyle(ButtonStyle.Success)
          )
        ]
      });
    } catch (err) {
      console.error("❌ Failed to send verification message:", err);
    }
  }

  res.redirect(`/dashboard/${guildID}/verify`);
});

router.get("/dashboard/:guildID/buttonroles", ensureAuth, async (req, res) => {
  const guildID = req.params.guildID;
  const guild = bot.guilds.cache.get(guildID);
  if (!guild) return res.redirect("/dashboard");

  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });

  const roles = guild.roles.cache.filter(r => r.editable && !r.managed).map(r => ({ id: r.id, name: r.name }));
  const textChannels = guild.channels.cache.filter(c => c.type === 0 && c.viewable).map(c => ({ id: c.id, name: c.name }));
  const emojis = guild.emojis.cache.map(e => ({ id: e.id, name: e.name, animated: e.animated }));

  res.render("modules/buttonroles", {
    user: req.user,
    guild,
    settings,
    roles,
    textChannels,
    emojis
  });
});

router.post("/dashboard/:guildID/buttonroles", ensureAuth, async (req, res) => {
  const { labels = [], roles = [], emojis = [], send_now, channel_id } = req.body;
  const guildID = req.params.guildID;

  const settings = await GuildSettings.findOne({ guildID }) || await GuildSettings.create({ guildID });

  settings.buttonRoles = [];

  if (Array.isArray(labels)) {
    for (let i = 0; i < labels.length; i++) {
      if (labels[i] && roles[i]) {
        settings.buttonRoles.push({
          label: labels[i],
          roleId: roles[i],
          emoji: emojis[i] || ""
        });
      }
    }
  }

  await settings.save();

  if (send_now === "on" && channel_id) {
    const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
    const channel = bot.channels.cache.get(channel_id);

    if (channel && channel.isTextBased()) {
      try {
        const row = new ActionRowBuilder();

        settings.buttonRoles.forEach(role => {
          const button = new ButtonBuilder()
            .setCustomId(`role_${role.roleId}`)
            .setLabel(role.label)
            .setStyle(ButtonStyle.Secondary);

          if (role.emoji && role.emoji.trim() !== "") {
            const match = role.emoji.match(/<?(a)?:?(\w+):(\d+)>?/);
            if (match) {
              button.setEmoji({ id: match[3] });
            } else {
              button.setEmoji(role.emoji);
            }
          }

          row.addComponents(button);
        });

        await channel.send({
          content: "Choose your roles by clicking the buttons below:",
          components: [row]
        });
      } catch (err) {
        console.error("❌ Failed to send button role message:", err);
      }
    }
  }

  res.redirect(`/dashboard/${guildID}/buttonroles`);
});

module.exports = router;
