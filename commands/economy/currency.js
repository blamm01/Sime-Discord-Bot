const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'currency',
    categories: 'Economy',
    aliases: ['setcurrency','set-currency','currency-set'],
    description: "Set new currency for the server",
    usage: '<New Currency>',
    example: 'currency $'
}

module.exports.run = async(sime, message, args) => {
    const symbol = args.join(" ");
    if(!symbol) return message.lineReply(`You need provide new currency to set`);
    await sime.mongo.set(`currency_${message.guild.id}`, symbol)
    message.lineReply(`Currency Set: **${symbol}**`)
}