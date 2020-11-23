const mongoose = require("mongoose");

module.exports = () => {
    const options = {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
    };

    mongoose.connect(process.env.mongo_uri, options);

    mongoose.connection.once("open", () => {
        console.log("Connected to DB");

        mongoose.connection.once("connected", () => {
            console.log("MongoDB event connected");
        });

        mongoose.connection.once("disconnected", () => {
            console.log("MongoDB event disconnected");
        });

        mongoose.connection.once("reconnected", () => {
            console.log("MongoDB event reconnected");
        });

        mongoose.connection.once("error", (error) => {
            console.log(`MongoDB Error: ${error}`);
        });
    });
};
