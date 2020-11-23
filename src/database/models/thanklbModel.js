const { Schema, model } = require("mongoose");

const reqString = {
   type: String,
   required: true,
};

const thanklb = Schema({
   _Id: reqString,
   channelId: reqString,
});

module.exports = model("thank-lb", thanklb);
