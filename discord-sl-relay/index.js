import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.send("✅ Express fonctionne sur Replit !");
  console.log("Ping reçu depuis navigateur");
});

// 🔧 ligne critique : Replit attribue automatiquement le port dans process.env.PORT
app.listen(process.env.PORT || 3000, () =>
  console.log(`🌐 Serveur en ligne sur port ${process.env.PORT || 3000}`)
);