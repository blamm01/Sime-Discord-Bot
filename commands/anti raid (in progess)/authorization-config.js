const messageembed = require('discord.js').MessageEmbed;

module.exports = {
  name: 'authorization-config',
  description: "Configuration Anti Raid module",
  categories: "Anti Raid",
  example: 'authorization-settings roleCreate 3',
  userPerms: ["ADMINISTRATOR"],
  aliases: ['authorize-config']
}

module.exports.run = async (sime, message, args) => {
  const argsEmbed = new messageembed()
    .setTitle(`Arguements Invalid`)
    .setColor("RED")
    .setDescription(`**>> roleCreateLimit <Limit (Number)>\n>> roleDeleteLimit <Limit (Number)>\n>> roleUpdateLimit <Limit (Number)>\n>> channelCreateLimit <Limit (Number)>\n>> channelDeleteLimit <Limit (Number)>\n>> channelUpdateLimit <Limit (Number)>\n>> guildUpdateLimit <Limit (Number)>\n>> ActionLogs\n>> Action\n>> Show**`)
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
  const option = args[0]
  if(!option) return message.channel.send(argsEmbed)
  if(option.toLowerCase() == "rolecreatelimit") {
    const number = parseInt(args[1])
    if(!number || !Number(number) || !Number.isInteger(number)) return message.channel.send("You need to provide valid number, and it is a integer number")
    await sime.mongo.set(`roleCreateLimit_${message.guild.id}`, number)
    message.channel.send(`Limit of roleCreate event has been updated to ${number}`)
  }
}