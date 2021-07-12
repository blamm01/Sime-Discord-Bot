const schema = require('../../models/captcha')

module.exports = {
    name: 'captcha-disable',
    description: "Disable Captcha System for the server",
    categories: "Captcha",
    usage: '<Role>',
    userPerms: ['ADMINISTRATOR']
}

module.exports.run = async(sime, message, args) => {
    schema.findOne({ Guild: message.guild.id }, async(err, data) => {
        if(!data) return message.lineReply(`:x: This server is not enabled Captcha System`)
        data.delete()
        message.lineReply(`:white_check_mark: Captcha System Disabled !`)
    })
}