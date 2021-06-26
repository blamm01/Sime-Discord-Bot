const messageembed = require('discord.js').MessageEmbed;

module.exports = {
  name: 'authorization-settings',
  description: "Enable/Disable Anti Raid module",
  categories: "Anti Raid",
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
    if(da == true) return message.channel.send("This server enabled Anti Raid module already")
    await sime.mongo.set(`antiMakeChanges_${message.guild.id}`, true)
    message.channel.send(`I have enabled Anti Raid module`)
  } else if(option.toLowerCase() == 'off') {
    if(da == false) return message.channel.send("This server is not enabled Anti Raid module")
    await sime.mongo.set(`antiMakeChanges_${message.guild.id}`, false)
    message.channel.send(`I have disabled Anti Raid module`)
  }
}