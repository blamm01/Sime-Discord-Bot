const schema = require('../../models/prefixes');
const { MessageEmbed } = require('discord.js')
const config = require('../../config.json')

module.exports = {
    name: 'prefix',
    usage: '[Symbol]',
    description: "Sets Bot Prefix",
    example: `prefix $`,
    userPerms: ["ADMINISTRATOR"],
    categories: 'Setup',
}

module.exports.run = async(sime, message, args) => {
    const symbol = args.join(" ")
    const prefix = await sime.prefix(message)
    if(!symbol) return message.lineReply(`Current Prefix is **${prefix}**`)
    schema.find({ Guild: message.guild.id }, async(err, data) => {
        data.map((d) => d.delete())
        message.lineReply(`Prefix Updated **${symbol}**`)
        if(symbol == config.prefix) return;
        new schema({
            Guild: message.guild.id,
            Prefix: symbol
        }).save()
    })
}