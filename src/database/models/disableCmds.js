const mongoose = require("mongoose");

const DisableSchema = new mongoose.Schema({
    guildId: {
        type: String,
        required: true,
        unique: true,
    },
    commands: {
        type: Array,
    },
});

module.exports = mongoose.model("DisabledCommands", DisableSchema);
