const db = require('quick.db')
const { MessageEmbed } = require('discord.js')

module.exports = {
   name: 'resetleaderboard',
    categories: 'Economy',
    description: "Reset all coins on the server",
    userPerms: ['MANAGE_GUILD']
}

module.exports.run = async(sime, message, args) => {
    let amount = 0
    message.guild.members.cache.filter(m => !m.user.bot).forEach(async (member,id) => {
        if(await sime.mongo.has(`balance_${member.id}_${message.guild.id}`)) {
            await sime.mongo.delete(`balance_${member.id}_${message.guild.id}`)
            amount = amount + 1
        }
    })
    if(amount == 0) return message.lineReply(`:x: There is no member ever worked on this server`)
    message.lineReply(`🔨 Reseted all coins of ${amount} members on this server.`)
}