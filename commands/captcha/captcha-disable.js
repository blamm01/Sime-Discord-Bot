const schema = require('../../models/captcha')

module.exports = {
    name: 'captcha-disable',
    description: "Disable Captcha System for the server",
    categories: "Captcha",
    usage: '<Role>',
    userPerms: ['ADMINISTRATOR']
}

module.exports.run = async(sime, message, args) => {
    const role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name == args[0])
    if(!role) return message.lineReply(`:x: You need provide role first !`);
    schema.findOne({ Guild: message.guild.id }, async(err, data) => {
        if(!data) return message.lineReply(`:x: This server is not enabled Captcha System`)
        data.delete()
        message.lineReply(`:white_check_mark: Captcha System Disabled !`)
    })
}