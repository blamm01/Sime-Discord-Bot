const schema = require('../../models/captcha')

module.exports = {
    name: 'captcha-enable',
    description: "Enable Captcha System for the server",
    categories: "Captcha",
    example: 'captcha-enable Verified',
    usage: '<Role>',
    userPerms: ['ADMINISTRATOR']
}

module.exports.run = async(sime, message, args) => {
    const role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name == args[0])
    if(!role) return message.lineReply(`:x: You need provide role first !`);
    schema.findOne({ Guild: message.guild.id }, async(err, data) => {
        if(data) data.delete();
        new schema({
            Guild: message.guild.id,
            Role: role.id
        }).save()
        message.lineReply(`:white_check_mark: Captcha Enabled : **${role.name}**`)
    })
}