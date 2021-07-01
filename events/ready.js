const sime = require('../index');
const Discord = require('discord.js');

module.exports = async(sime) => {
    console.log(`Logged in as ${sime.user.tag}`)
    await sime.user.setActivity(`${sime.guilds.cache.size} servers`)
    await sime.user.setStatus("dnd")
}