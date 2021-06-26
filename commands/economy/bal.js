const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
   name: 'balance',
    categories: 'Economy',
    aliases: ['bal'],
    description: "Checks User's Balance",
    usage: '[Member]',
    example: 'balance' 
}

module.exports.run = async(sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
    if(member.user.bot) return message.lineReply(`You can't check balance of bot`)
    let bal = await sime.mongo.get(`balance_${member.id}_${message.guild.id}`) || '0'
    let bank = await sime.mongo.get(`bank_${member.id}_${message.guild.id}`) || '0'
    let currency = await sime.mongo.get(`currency_${message.guild.id}`)
    if(!currency) { 
    await sime.mongo.set(`currency_${message.guild.id}`, `🪙`); 
    currency = await sime.mongo.get(`currency_${message.guild.id}`) 
}
    message.lineReply(new MessageEmbed().setTitle(`${member.user.tag}'s Balance`).setDescription(`Wallet: **${currency} ${bal}**\nBank: **${currency} ${bank}**`).setColor("RANDOM"))
}