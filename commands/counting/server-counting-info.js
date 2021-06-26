const schema = require('../../models/server-counting')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'server-counting-info',
    description: "Check information of Counting Module in this server",
    categories: "Counting",
    example: 'server-counting-info',
}

module.exports.run = async(sime, message, args) => {
  const Data = await schema.findOne({ Guild: message.guild.id })
  if(!Data) return message.lineReply(`This server is not setup Counting Module`)
  message.channel.send(new MessageEmbed().setTitle(`Counting Information`).setDescription(`Channel: <#${Data.Channel}>\n\nCounted: ${Data.Number - 1}`).setColor("RANDOM"))
}