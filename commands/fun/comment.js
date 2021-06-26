const { fight } = require('weky')
const Meme = require("memer-api")
const memer = new Meme();
const Discord = require('discord.js')

module.exports = {
    name: 'comment',
    description: "Comment on youtube :D",
    example: `comment best lol`,
    categories: 'Fun',
    usage: '<Text>',
    aliases: ['youtube'],
}

module.exports.run = async(sime, message, args) => {
	const message1 = args.join(" ") || args[0]
    if(!message1) return message.lineReply(`Please provide comment text :D`)
    const user1 = message.member;

    const avatar = user1.user.displayAvatarURL({ dynamic: false })
    
    const username = user1.user.username;
    
    memer.youtube(avatar, username, message1).then(image => {
            const attachment = new Discord.MessageAttachment(image, "youtube.png")
            message.channel.send(attachment)
        })
    
}