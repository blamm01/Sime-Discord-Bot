const ms = require('ms')

module.exports = {
    name: 'slowmode',
    aliases: ['sm'],
    userPerms: ["MANAGE_CHANNELS","MANAGE_MESSAGES"],
    botPerms: ["MANAGE_CHANNELS","MANAGE_MESSAGES"],
    example: 'slowmode 5s',
    description: "Sets Channel's Slowmode",
    categories: 'Moderation',
    modRole: true
}

module.exports.run = async(sime, message, args) => {
    let time = args[0]
    if(!time) return message.lineReply(`Current Slowmode is ${message.channel.rateLimitPerUser} seconds | Provide new slowmode to change it`);
    let channel = message.channel 
    if(message.mentions.channels.first()) { 
      time = args[1]
      channel = message.mentions.channels.first()
    }
    if(!time) return message.lineReply(`Current Slowmode is ${message.channel.rateLimitPerUser} seconds | Provide new slowmode to change it`);
    if(time.startsWith('-')) return message.channel.send("You need to provide valid new slowmode. Make sure change it like: \`5s\`")
    const msTime = ms(time);
    if(!Number(msTime)) return message.lineReply(`New Slowmode is not a number. Make sure change it like: \`5s\``);
    if((msTime / 1000) > 21600) return message.lineReply(`New Slowmode can't be more than 21600 seconds`)
    try {
        channel.setRateLimitPerUser(msTime / 1000, `${message.author.tag}`);
        message.lineReply(`🔨 Slowmode Updated: ${ms(msTime, { long: true })}`)
    } catch(err) {
        message.lineReply(new MessageEmbed().setTitle(`❌ An error occured`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"))
    }
}