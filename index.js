import express from "express";
import fetch from "node-fetch";
import { Client, GatewayIntentBits } from "discord.js";

const app = express();
app.use(express.json());

// === ROUTE TEST ===
app.get("/", (req, res) => {
  res.send("✅ Relai Discord ↔ SL actif !");
  console.log("Ping reçu depuis navigateur / objet SL");
});

// === VARIABLES ENVIRONNEMENT ===
const DISCORD_TOKEN = process.env.DISCORD_TOKEN;
const CHANNEL_ID = process.env.CHANNEL_ID || "1053752734836342865"; // mets ton vrai salon Discord ici
let slURL = "";

if (!DISCORD_TOKEN) {
  console.error("❌ DISCORD_TOKEN manquant !");
  process.exit(1);
}

// === BOT DISCORD ===
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once("ready", () => console.log("✅ Bot connecté à Discord"));
client.login(DISCORD_TOKEN);

// === ROUTE POUR RECEVOIR L’URL DE SL ===
app.post("/register", (req, res) => {
  slURL = req.body.url;
  console.log("Nouvelle URL SL :", slURL);
  res.json({ ok: true });
});

// === RELAI DISCORD → SL ===
client.on("messageCreate", async (msg) => {
  if (msg.channel.id === CHANNEL_ID && !msg.author.bot && slURL) {
    await fetch(slURL, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: `[Discord] ${msg.author.username}: ${msg.content}`,
    });
  }
});

// === LANCEMENT SERVEUR ===
app.listen(process.env.PORT || 3000, () =>
  console.log(`🌐 Relai en ligne sur port ${process.env.PORT || 3000}`)
);