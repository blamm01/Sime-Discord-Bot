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
    .setDescription(`**>> roleCreateLimit <Limit (Number)>\n>> roleDeleteLimit <Limit (Number)>\n>> roleUpdateLimit <Limit (Number)>\n>> channelCreateLimit <Limit (Number)>\n>> channelDeleteLimit <Limit (Number)>\n>> channelUpdateLimit <Limit (Number)>\n>> guildUpdateLimit <Limit (Number)>\n>> Logs\n>> Action\n>> Show**`)
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
  const option = args[0]
  if(!option) return message.channel.send(argsEmbed)
  if(option.toLowerCase() == "rolecreatelimit") {
    const number = parseInt(args[1])
    if(!number || !Number(number) || !Number.isInteger(number)) return message.channel.send("You need to provide valid number, and it is a integer number")
    await sime.mongo.set(`roleCreateLimit_${message.guild.id}`, number)
    message.channel.send(`Limit of roleCreate event has been updated to ${number}`)
  } else if(option.toLowerCase() == "roledeletelimit") {
    const number = parseInt(args[1])
    if(!number || !Number(number) || !Number.isInteger(number)) return message.channel.send("You need to provide valid number, and it is a integer number")
    await sime.mongo.set(`roleDeleteLimit_${message.guild.id}`, number)
    message.channel.send(`Limit of roleDelete event has been updated to ${number}`)
  } else if(option.toLowerCase() == "roleupdatelimit") {
    const number = parseInt(args[1])
    if(!number || !Number(number) || !Number.isInteger(number)) return message.channel.send("You need to provide valid number, and it is a integer number")
    await sime.mongo.set(`roleUpdateLimit_${message.guild.id}`, number)
    message.channel.send(`Limit of roleUpdate event has been updated to ${number}`)
  } else if(option.toLowerCase() == "channelcreatelimit") {
    const number = parseInt(args[1])
    if(!number || !Number(number) || !Number.isInteger(number)) return message.channel.send("You need to provide valid number, and it is a integer number")
    await sime.mongo.set(`channelCreateLimit_${message.guild.id}`, number)
    message.channel.send(`Limit of channelCreate event has been updated to ${number}`)
  } else if(option.toLowerCase() == "channeldeletelimit") {
    const number = parseInt(args[1])
    if(!number || !Number(number) || !Number.isInteger(number)) return message.channel.send("You need to provide valid number, and it is a integer number")
    await sime.mongo.set(`channelDeleteLimit_${message.guild.id}`, number)
    message.channel.send(`Limit of channelDelete event has been updated to ${number}`)
  } else if(option.toLowerCase() == "channelupdatelimit") {
    const number = parseInt(args[1])
    if(!number || !Number(number) || !Number.isInteger(number)) return message.channel.send("You need to provide valid number, and it is a integer number")
    await sime.mongo.set(`channelUpdateLimit_${message.guild.id}`, number)
    message.channel.send(`Limit of channelUpdate event has been updated to ${number}`)
  } else if(option.toLowerCase() == "guildupdatelimit") {
    const number = parseInt(args[1])
    if(!number || !Number(number) || !Number.isInteger(number)) return message.channel.send("You need to provide valid number, and it is a integer number")
    await sime.mongo.set(`guildUpdateLimit_${message.guild.id}`, number)
    message.channel.send(`Limit of guildUpdate event has been updated to ${number}`)
  } else if(option.toLowerCase() == "logs") {
    let channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name == args.slice(1).join(" ")) || message.guild.channels.cache.find(c => c.name == args[1]) || message.channel
    await sime.mongo.set(`logs_${message.guild.id}`, channel.id)
    message.channel.send(`Anti Raid Logs was updated to ${channel}`)
  } else if(option.toLowerCase() == "action") {
    let action = args.slice(1).join(" ") || args[1]
    if(!action || !(["ban","kick","removeroles"]).includes(action.toLowerCase())) return message.channel.send(new messageembed().setTitle(`Action List`).setDescription(`**BAN - Ban the member reach the limit\nKICK - Kick the member reach the limit\nRemoveRoles - Remove all the roles of the member who reach the limit.**`).setColor("RED"))
    await sime.mongo.set(`action_${message.guild.id}`, action.toLowerCase())
    message.channel.send(`Action was updated to **${action.toUpperCase()}**`)
  } else if(option.toLowerCase() == "show") {
    message.channel.send(new messageembed().setTitle("Event Limit").setDescription(
    `**
    >> roleCreateLimit : ${await sime.mongo.get(`roleCreateLimit_${message.guild.id}`) || "Not Set"}\n
    >> roleDeleteLimit : ${await sime.mongo.get(`roleDeleteLimit_${message.guild.id}`) || "Not Set"}\n
    >> roleUpdateLimit : ${await sime.mongo.get(`roleUpdateLimit_${message.guild.id}`) || "Not Set"}\n
    >> channelCreateLimit : ${await sime.mongo.get(`channelCreateLimit_${message.guild.id}`) || "Not Set"}\n
    >> channelDeleteLimit : ${await sime.mongo.get(`channelDeleteLimit_${message.guild.id}`) || "Not Set"}\n
    >> guildUpdateLimit : ${await sime.mongo.get(`guildUpdateLimit_${message.guild.id}`) || "Not Set"}\n
    >> Logs : <#${await sime.mongo.get(`logs_${message.guild.id}`) || "Not Set"}> (${await sime.mongo.get(`logs_${message.guild.id}`) || "Not Set"})\n
    >> Action : ${await sime.mongo.get(`action_${message.guild.id}`) || "Not Set"}\n
    **`
    ).setColor("RANDOM"))
  } else {
    return message.channel.send(argsEmbed)
  }
}