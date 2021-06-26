const schema = require('../../models/server-counting')
const schema1 = require('../../models/user-counting')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'user-counting-info',
    description: "Check information of Counting Module of a user",
    categories: "Counting",
    example: 'user-counting-info @NiceDD',
    usage: '[Member]'
}

module.exports.run = async(sime, message, args) => {
  const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
  const Data = await schema.findOne({ Guild: message.guild.id })
  if(!Data) return message.lineReply(`This server is not setup Counting Module`)
  let counted = 0;
  const Data1 = await schema1.findOne({ Guild: message.guild.id, Member: member.id })
  if(Data1) counted = Data1.Number
  else counted = 0
  message.channel.send(`**${member.user.tag}** counted **${counted}**`)
}