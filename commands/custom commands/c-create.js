const schema = require('../../models/customcommands')
const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'c-create',
    categories: 'Custom Commands',
    aliases: ['custom-command-create'],
    description: "Create a custom command",
    example: 'c-create apply Create a ticket to apply for staff',
    usage: '<Command Name> <Command Response>',
    userPerms: ['MANAGE_GUILD']
}

module.exports.run = async(sime, message, args) => {
    const command = args[0]
    const response = args.slice(1).join(" ") || args[1]
    if(!command) return message.lineReply(`:x: Please provide command name to continue`)
    if(!response) return message.lineReply(`:x: Please provide command response to continue`)
    if(response.length > 2000) return message.lineReply(`:x: Response must be 2000 or fewer in length`)
    if(command.toLowerCase() == 'undefined') return message.channel.send(`You can't set Custom Command to **undefined**`)
    schema.findOne({ Guild: message.guild.id, Command: command }, async(err, data) => {
        if(data) data.delete()
        new schema({
            Guild: message.guild.id,
            Command: command.toLowerCase(),
            Response: response
        }).save()
        message.lineReply(`:white_check_mark: Added **${command.toLowerCase()}** with response **${response}**`)
    })
}