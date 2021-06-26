const schema = require('../../models/customcommands')
const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'c-delete',
    categories: 'Custom Commands',
    aliases: ['custom-command-delete'],
    description: "Delete a custom command",
    example: 'c-delete apply',
    usage: '<Command Name>',
    userPerms: ['MANAGE_GUILD']
}

module.exports.run = async(sime, message, args) => {
    const command = args[0]
    if(!command) return message.lineReply(`:x: Please provide command name to continue`)
    schema.findOne({ Guild: message.guild.id, Command: command.toLowerCase() }, async(err, data) => {
        if(!data) return message.lineReply(`:x: There is no custom command called **${command}**`)
        data.delete()
        message.lineReply(`:white_check_mark: Removed **${command}**`)
    })
}