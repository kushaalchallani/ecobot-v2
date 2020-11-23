const mongoose = require("mongoose");

const tagSchema = mongoose.Schema({
    guildID: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    tagName: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    tagContent: {
        type: mongoose.SchemaTypes.String,
        requried: true,
    },
    tagAliases: {
        type: mongoose.SchemaTypes.Array,
        required: true,
    },
    tagCreator: {
        type: mongoose.SchemaTypes.String,
        required: true,
    },
    tagUses: {
        type: mongoose.SchemaTypes.Number,
        default: 0,
        required: true,
    },
    tagHoisted: {
        type: mongoose.SchemaTypes.Boolean,
        default: false,
        required: true,
    },
    tagCreated: {
        type: mongoose.SchemaTypes.Date,
        required: true,
    },
    lastModifiedAt: {
        type: mongoose.SchemaTypes.Date,
    },
    lastModifiedBy: {
        type: mongoose.SchemaTypes.String,
    },
});

module.exports = mongoose.model("tag", tagSchema);
