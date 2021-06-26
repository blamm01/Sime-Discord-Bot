const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'autorole',
    categories: 'Setup',
    aliases: ['autorole-set','autorole-settings'],
    usage: '<Role>',
    description: "Settings AutoRole Module",
    example: 'autorole @Member',
    userPerms: ['MANAGE_ROLES']
}

module.exports.run = async(sime, message, args) => {
  const role = await message.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == args[0]) || message.guild.roles.cache.find(r => r.id == args.join(" "));
  if(!role) return message.lineReply(`:x: You need mention role to set autorole`)
  if(db.has(`autorole_${message.guild.id}`)) db.delete(`autorole_${message.guild.id}`)
  await db.set(`autorole_${message.guild.id}`, role.id)
  message.lineReply(`:white_check_mark: AutoRole for this server updated: **${role.name}**`)
}
