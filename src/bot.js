const Client = require("./structures/client");
const client = new Client({ ws: { intents: ["GUILDS", "GUILD_MESSAGES", "GUILD_MEMBERS", "GUILD_PRESENCES"] } });
client.start();
