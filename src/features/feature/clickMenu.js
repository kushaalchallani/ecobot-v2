const Nuggies = require("nuggies");

module.exports = (client) => {
    client.on("clickMenu", (menu) => {
        Nuggies.dropclick(client, menu);
    });
};
