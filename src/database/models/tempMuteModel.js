const { Schema, model } = require("mongoose");
module.exports = model(
    "tempmute",
    new Schema({
        guildID: String,
        memberID: String,
        length: Date,
        memberRoles: Array,
    })
);
