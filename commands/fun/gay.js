const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: 'gay',
    description: "Check the gay rate of a member",
    example: `gay @NiceDD`,
    categories: 'Fun',
    usage: '[Member]',
    aliases: ['gayrate']
}

module.exports.run = async(sime, message, args, lang) => {
  if(lang == "en") {
     const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
   	 let gayrate = Math.floor(Math.random () * 99) + 1;
     let embed = new MessageEmbed()
     	.setTitle(`gayrate machine`)
     	.setDescription(`🏳️‍🌈**${member.user.tag}** is **${gayrate}%** gay`)
     	.setColor("#ff00ea")
     message.channel.send(embed)
  } else if(lang == "vi") {
    const member = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member;
   	 let gayrate = Math.floor(Math.random () * 99) + 1;
     let embed = new MessageEmbed()
     	.setTitle(`tỉ lệ gay`)
     	.setDescription(`🏳️‍🌈**${member.user.tag}** gay **${gayrate}%**`)
     	.setColor("#ff00ea")
     message.channel.send(embed)
  }
}