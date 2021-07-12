const { WebhookClient, MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
    name: 'snipe',
    usage: '[Message Number]',
    description: "Check message deleted",
    example: `snipe 3`,
    userPerms: ['MANAGE_MESSAGES'],
    categories: 'Moderation',
    modRole: true
}

module.exports.run = async(sime, message, args) => {

  let snipe;

  let channel = await message.mentions.channels.first()

  if(channel) {
    snipe = +args[1] - 1 || 0;
  } else if(!channel) {
    snipe = +args[0] - 1 || 0;
    channel = message.channel
  }

  let snipes = await sime.snipes.get(channel.id)
  if(!snipes) return message.lineReply(new MessageEmbed()
    .setTitle(`Error`)
    .setDescription(`**I can't find any messages was deleted in my cache**`)
    .setColor("RED")
  )

  let target = snipes[snipe]
  if(!target) snipe = snipes.length - 1;
  target = snipes[snipe]
  let { msg, time, image } = target;
  message.channel.send(new MessageEmbed()
    .setAuthor(msg.author.tag, msg.author.displayAvatarURL({ dynamic: true }))
    .setDescription(msg.content)
    .setImage(image)
    .setTitle(moment(time).fromNow())
    .setFooter(`ID: ${msg.id} | Message ${snipe + 1} / ${snipes.length} `)
    .setColor("RANDOM")
  )
}
