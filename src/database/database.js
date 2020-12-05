const mongoose = require("mongoose");
const chalk = require("chalk");

module.exports = () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };

    mongoose.connect(process.env.mongo_uri, options);

    mongoose.connection.once("open", () => {
        console.log(chalk.red("[DATABASE] ") + "Connected to DB");

        mongoose.connection.once("connected", () => {
            console.log(chalk.red("[DATABASE] ") + "MongoDB event connected");
        });

        mongoose.connection.once("disconnected", () => {
            console.log(chalk.red("[DATABASE] ") + "MongoDB event disconnected");
        });

        mongoose.connection.once("reconnected", () => {
            console.log(chalk.red("[DATABASE] ") + "MongoDB event reconnected");
        });

        mongoose.connection.once("error", (error) => {
            console.log(chalk.red("[DATABASE] ") + `MongoDB Error: ${error}`);
        });
    });
};
