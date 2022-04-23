require("dotenv").config();
const mongoose = require("mongoose");
require("./models/User");
require("./models/Item");
require("./models/Comment");
const User = mongoose.model('User');
const Item = mongoose.model('Item');
const Comment = mongoose.model('Comment');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.set("debug", true);

const userObjectPattern = (idx) => ({
    email: `user${idx}@example.com`,
    password: `user${idx + 1}`,
    username:`user${idx}`
})
const itemObjectPattern = async (idx) => {
    const userDoc = await getUserByIdx(idx)
    return {
        title: `How to train your ${idx} dragon`,
        description:"Ever wonder how?",
        body: "Very carefully.",
        tagList:["dragons","training"],
        seller: userDoc
    }
}
const commentObjectPattern = async (idx) => {
    const itemDoc = await getItemByIdx(idx)
    const userDoc = await getUserByIdx(idx)
    return {
        body: `thank you so much`,
        seller: userDoc,
        item: itemDoc
    }
}
const getItemByIdx = async (idx) => {
   const item = await Item.findOne({title: {$regex: idx}})
   return item?.id;
}
const getUserByIdx = async (idx) => {
   const user = await User.findOne({username: {$regex: idx}})
   return user?.id;
}
const seed = async (patternObject) => {
    const seedObjectsArray = [];
    let i = 0
    for (i; i < 120; i++) {
        const pattern = await patternObject(i)
        seedObjectsArray.push(pattern)
    }
    return seedObjectsArray
}

const handleSeedByModel = async (model, patternObject) => {
    await model.deleteMany({});
    const seedArr = await seed(patternObject)
    await model.insertMany(seedArr);
}

const seedDB = async () => {
    await handleSeedByModel(User, userObjectPattern)
    await handleSeedByModel(Item, itemObjectPattern)
    await handleSeedByModel(Comment, commentObjectPattern)
}

seedDB().then(() => mongoose.connection.close())