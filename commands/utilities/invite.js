const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')

module.exports = {
    name: 'invite',
    description: "Invite me to your server",
    botPerms: ["EMBED_LINKS"],
    userPerms: [],
    categories: 'Utilities',
}

module.exports.run = async(sime, message, args) => {
    const embed = new MessageEmbed().setDescription(`**[Invite Me !](https://discord.com/oauth2/authorize?client_id=843073453708017716&scope=bot&permissions=470084735)**`)
    .setColor("RANDOM");
    message.lineReply(embed)
}