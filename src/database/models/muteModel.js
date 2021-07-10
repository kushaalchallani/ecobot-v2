const { Schema, model } = require("mongoose");
module.exports = model(
    "mute",
    new Schema({
        guildID: String,
        memberID: String,
        memberRoles: Array,
    })
);
