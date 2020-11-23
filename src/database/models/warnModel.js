const { Schema, model } = require("mongoose");

const warn = Schema({
   guildID: String,
   memberID: String,
   warnings: Array,
   moderator: Array,
   date: Array,
});

module.exports = model("warn", warn);
