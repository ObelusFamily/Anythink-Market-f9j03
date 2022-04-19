require("dotenv").config();
const mongoose = require("mongoose");
require("./models/User");
require("./models/Item");
var Item = mongoose.model('Item');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("debug", true);


const seedItems = () => {
    const itemsSeed = [];
    let i = 0
    for (i; i < 120; i++) {
        itemsSeed.push({
            title: `How to train your ${i} dragon`,
            description:"Ever wonder how?",
            body: "Very carefully.",
            tagList:["dragons","training"]
        })
    }
    return itemsSeed
}
const seedDB = async () => {
    await Item.deleteMany({});
    await Item.insertMany(seedItems());
}

seedDB().then(() => mongoose.connection.close())