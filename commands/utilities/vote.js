const Discord = require('discord.js')
const moment = require('moment')

module.exports = {
    name: 'vote',
    description: "Vote for me <3",
    example: 'vote',
    categories: 'Utilities',
}

module.exports.run = async(sime, message, args) => {
    const embed = new Discord.MessageEmbed()
      .setTitle(`Vote For Me`)
      .setThumbnail(message.member.user.displayAvatarURL({ dynamic: true }))
      .setColor(`RANDOM`)
      .setDescription(`**[Top.gg](https://top.gg/bot/843073453708017716/vote)**`);
    message.channel.send(embed)
}