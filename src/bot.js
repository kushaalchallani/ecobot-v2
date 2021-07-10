const Client = require("./structures/client");
const client = new Client();
require("discord-buttons")(client);
client.start();
