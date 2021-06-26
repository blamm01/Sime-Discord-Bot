const db = require('quick.db')
const ms = require('ms')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'daily',
    categories: 'Economy',
    description: "Claim Daily",
    cooldown: 86400,
    example: 'work'
}

module.exports.run = async(sime, message, args) => {
    const member = message.member
    const coins = Math.floor(Math.random() * 5000) + 1;
    let currency = await sime.mongo.get(`currency_${message.guild.id}`)
    if(!currency) {
        await sime.mongo.set(`currency_${message.guild.id}`, `🪙`)
        currency = await sime.mongo.get(`currency_${message.guild.id}`)
    }
    let oldBal = await sime.mongo.get(`balance_${member.id}_${message.guild.id}`) || '0';
    if(oldBal == 0) {
        let coinadd = await sime.mongo.set(`balance_${member.id}_${message.guild.id}`, coins)
    } else {
        let coinadd = await sime.mongo.add(`balance_${member.id}_${message.guild.id}`, coins)
    }
    let newBal = await sime.mongo.get(`balance_${member.id}_${message.guild.id}`)
    message.lineReply(new MessageEmbed().setTitle(`Daily Successfully`).setDescription(`You claimed **${currency} ${coins}** from your daily. Now, You have **${currency} ${newBal}**`).setColor("GREEN").setTimestamp().setThumbnail(message.author.displayAvatarURL({ dynamic: true })))
}