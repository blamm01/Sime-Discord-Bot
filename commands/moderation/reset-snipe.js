const { WebhookClient, MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
    name: 'reset-snipe',
    usage: '[channel]',
    description: "Delete all the messages was deleted from the cache",
    example: `snipe #general`,
    userPerms: ['MANAGE_MESSAGES'],
    categories: 'Moderation',
}

module.exports.run = async(sime, message, args) => {
  
  const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(f => f.name == args[0]) || message.channel

  let snipes = await sime.snipes.get(channel.id)
  if(!snipes) return message.lineReply(new MessageEmbed()
    .setTitle(`Error`)
    .setDescription(`**I can't find any messages was deleted in my cache**`)
    .setColor("RED")
  )

  await sime.snipes.delete(channel.id)

  channel.send(new MessageEmbed()
    .setAuthor(message.author.tag, message.author.displayAvatarURL({ dynamic: true }))
    .setDescription(`All messages was deleted in this channel has been removed from my cache`)
    .setTitle("Cache Reseted")
    .setColor("GREEN")
  )
}
