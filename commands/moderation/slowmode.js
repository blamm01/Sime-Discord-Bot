const ms = require('ms')

module.exports = {
    name: 'slowmode',
    aliases: ['sm'],
    userPerms: ["MANAGE_CHANNELS","MANAGE_MESSAGES"],
    botPerms: ["MANAGE_CHANNELS","MANAGE_MESSAGES"],
    example: 'slowmode 5s',
    description: "Sets Channel's Slowmode",
    categories: 'Moderation',
}

module.exports.run = async(sime, message, args) => {
    const time = args.join(" ")
    if(!time) return message.lineReply(`Current Slowmode is ${message.channel.rateLimitPerUser} seconds | Provide new slowmode to change it`);
    const msTime = ms(time);
    if(!Number(msTime)) return message.lineReply(`New Slowmode is not a number. Make sure change it like: \`5s\``);
    if((msTime / 1000) > 21600) return message.lineReply(`New Slowmode can't be more than 21600 seconds`)
    try {
        message.channel.setRateLimitPerUser(msTime / 1000, `${message.author.tag}`);
        message.lineReply(`🔨 Slowmode Updated: ${ms(msTime, { long: true })}`)
    } catch(err) {
        message.lineReply(new MessageEmbed().setTitle(`❌ An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"))
    }
}