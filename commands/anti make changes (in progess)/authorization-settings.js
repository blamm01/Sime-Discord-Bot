const messageembed = require('discord.js').MessageEmbed;
const schema = require('../../models/authorization-roles')

module.exports = {
  name: 'authorization-settings',
  description: "Enable/Disable Anti Make Changes module",
  categories: "Anti Make Changes",
  example: 'authorization-settings on',
  usage: '<On/Off>',
  userPerms: ["ADMINISTRATOR"],
  aliases: ['authorize-set']
}

module.exports.run = async (sime, message, args) => {
  const option = args[0]
  if(!option || !(["on","off"]).includes(option.toLowerCase())) return message.channel.send(`You need to provide option | Option: on | off`)
  const da = await sime.mongo.get(`antiMakeChanges_${message.guild.id}`) || false
  if(option.toLowerCase() == 'on') {
    if(da == true) return message.channel.send("This server enabled Anti Make Changes module already")
    await sime.mongo.set(`antiMakeChanges_${message.guild.id}`, true)
    message.channel.send(`I have enabled Anti Make Changes module`)
  } else if(option.toLowerCase() == 'off') {
    if(da == false) return message.channel.send("This server is not enabled Anti Make Changes module")
    await sime.mongo.set(`antiMakeChanges_${message.guild.id}`, false)
    message.channel.send(`I have disabled Anti Make Changes module`)
  }
}