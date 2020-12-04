const mongoose = require("mongoose");

const EconomySchema = new mongoose.Schema({
    userId: { type: String, required: false },
    coinsInWallet: { type: Number, required: false, default: 0 },
    coinsInBank: { type: Number, required: false, default: 0 },
    bankSpace: { type: Number, required: false, default: 1000 },
    work: {
        job: { type: String, default: "none" },
        moneyEarned: { type: String, default: 0 },
        cooldown: { type: Date, default: new Date(Date.now() - 3600000) },
    },
    items: { type: Array, required: false, default: [] },
    dailyStreak: { type: Date, required: false, default: new Date(Date.now() - 86400000) },
    weeklyStreak: { type: Date, required: false, default: new Date(Date.now() - 604800000) },
    monthlyStreak: { type: Date, required: false, default: new Date(Date.now() - 2592000000) },
    hackStreak: { type: Date, required: false, default: new Date(Date.now() - 3600000) },
    robStreak: { type: Date, required: false, default: new Date(Date.now() - 3600000) },
    passiveStreak: { type: Date, required: false, default: new Date(Date.now() - 86400000) },
    passive: { type: Boolean, required: false, default: false },
});

module.exports = mongoose.model("economy", EconomySchema);
