const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')

module.exports = {
    name: 'badges',
    description: "Shows all badges the user have",
    example: 'badges @ToLaCut',
    usage: '[Member]',
    botPerms: ["EMBED_LINKS"],
    userPerms: [],
    categories: 'Utilities',
}

module.exports.run = async(sime, message, args) => {
    const user = message.mentions.users.first() || message.author;

    const flags = user.flags.toArray();

    console.log(flags);
    
    message.lineReply(new MessageEmbed().setTitle(`${user.tag} 's Badges`).setDescription(flags.join(', ')).setColor("RANDOM"))
}
