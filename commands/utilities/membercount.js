const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')

module.exports = {
    name: 'membercount',
    description: "Shows all count of members, bots and humans",
    example: 'membercount',
    categories: 'Utilities',
}

module.exports.run = async(sime, message, args) => {
  const embed = new MessageEmbed()
            .setDescription(`**👥 Members Count: ${message.guild.memberCount}\n\n🤖 Bots Count: ${message.guild.members.cache.filter(u => u.user.bot).size}\n\n🧑 Humans Count: ${message.guild.members.cache.filter(u => !u.user.bot).size}**`)
            .setColor("RANDOM")
            .setThumbnail(message.guild.iconURL({ dynamic: true }))
        message.channel.send(embed)
}
