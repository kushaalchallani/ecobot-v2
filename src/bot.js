require("dotenv/config");
const Client = require("./structures/client");
const client = new Client();
const Statcord = require("statcord.js");
const statcord = new Statcord.Client({
    client: client,
    key: process.env.statcord_key,
    postCpuStatistics: true,
    postMemStatistics: true,
    postNetworkStatistics: true,
});
require("discord-buttons")(client);
client.start();

module.exports = statcord;
