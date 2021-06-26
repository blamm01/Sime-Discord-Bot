const schema = require('../../models/customcommands')
const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'c-list',
    categories: 'Custom Commands',
    aliases: ['custom-command-list'],
    description: "Shows all custom command",
    example: 'c-delete apply',
    usage: '<Command Name>',
    userPerms: ['MANAGE_GUILD']
}

module.exports.run = async(sime, message, args) => {
    schema.find({ Guild: message.guild.id }, async(err, data) => {
        let Commands;
        const embed = new MessageEmbed()
            .setTitle(`Custom Commands`)
            .setColor("RANDOM")
            .setThumbnail(message.guild.iconURL({ dynamic: true }));
      
        data.map((d) => Commands+=`**${d.Command}** => **${d.Response}**\n`)
        embed.setDescription(Commands.replace(`undefined`, ` `))
        message.channel.send(embed)
    })
}