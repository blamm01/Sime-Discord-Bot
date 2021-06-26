const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'givecoins',
    categories: 'Economy',
    aliases: ['give-coins'],
    description: "Give user your coins",
    usage: '<Member> <Coins>',
    example: 'givecoins 406032338384977923 30000'
}

module.exports.run = async(sime, message, args) => {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0])
    let bal = await sime.mongo.get(`balance_${message.member.id}_${message.guild.id}`) || '0'
    if(bal == 0) return message.lineReply(`:x: You don't have any money in your wallet`);
    if(!member) return message.lineReply(`:x: You need mention member to give coin`)
    if(member.user.bot) return message.lineReply(`You can't give coins to bot`)
    let bal1 = await sime.mongo.get(`balance_${member.id}_${message.guild.id}`) || '0'
    let coins = args.slice(1).join(" ")
    if(!coins || !Number(coins)) return message.lineReply(`:x: You need provide coins to give`);
    if(coins > bal) {
        coins = parseInt(bal)
    }
    let currency = await sime.mongo.get(`currency_${message.guild.id}`)
    if(!currency) { 
    await sime.mongo.set(`currency_${message.guild.id}`, `🪙`); 
    currency = await sime.mongo.get(`currency_${message.guild.id}`) 
    }
    await sime.mongo.add(`balance_${member.id}_${message.guild.id}`, parseInt(coins));
    await sime.mongo.set(`balance_${message.member.id}_${message.guild.id}`, bal - parseInt(coins));
    message.lineReply(new MessageEmbed().setTitle(`Give Coins Successfully`).setDescription(`**${message.author.tag}** gave **${member.user.tag}** **${currency} ${coins}**. Enjoy !`).setColor("GREEN").setThumbnail(message.author.displayAvatarURL({ dynamic: true })))
}