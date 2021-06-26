const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
    name: 'userinfo',
    description: "Shows information of a user",
    example: 'userinfo',
    usage: '[User]',
    botPerms: ["EMBED_LINKS"],
    userPerms: [],
    aliases: ['whois','ui'],
    categories: 'Utilities',
}

module.exports.run = async(sime, message, args) => {
    const user = await message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.member
    let status;
        switch (user.user.presence.status) {
            case "online":
                status = "Online";
                break;
            case "dnd":
                status = "Do Not Disturb";
                break;
            case "idle":
                status = "Idle";
                break;
            case "offline":
                status = "Offline";
                break;
        }
    const embed = new MessageEmbed()
        .setTitle(`User Information`)
        .setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
        .setColor(`RANDOM`)
        .setThumbnail(user.user.displayAvatarURL({dynamic : true}))
        .addFields(
                {
                    name: "Tag:",
                    value: user.user.tag,
                    inline: true
                },
                {
                    name: "Username:",
                    value: user.user.username,
                    inline: true
                },
                {
                    name: "Discriminator: ",
                    value: `#${user.user.discriminator}`,
                    inline: true
                },
                {
                    name: "ID: ",
                    value: user.user.id,
                    inline: true
                },
                {
                    name: "Current Status: ",
                    value: status,
                    inline: true
                },
                {
                    name: "Activity: ",
                    value: user.presence.activities[0] ? user.presence.activities[0].name : `No Activity Found`,
                    inline: true
                },
                {
                    name: 'Avatar link: ',
                    value: `[Click Here](${user.user.displayAvatarURL({ dynamic:true })})`,
                    inline: true
                },
                {
                    name: 'Creation Date: ',
                    value: `${moment(user.user.createdTimestamp).format(
                    "LT"
                )} ${moment(user.user.createdTimestamp).format(
                    "LL"
                )}  ${moment(user.user.createdTimestamp).fromNow()}`,
                    inline: true
                },
                {
                    name: 'Joined Date: ',
                    value: `${moment(user.joinedTimestamp).format(
                    "LT"
                )} ${moment(user.joinedTimestamp).format(
                    "LL"
                )}  ${moment(user.joinedTimestamp).fromNow()}`,
                    inline: true
                },
                {
                    name: 'User Roles: ',
                    value: user.roles.cache.map(role => role.toString()).join(" | "),
                    inline: true
                },
                {
                   name: 'Is User Admin ? ',
                    value: message.member.hasPermission("ADMINISTRATOR"),
                    inline: true 
                },
                {
                   name: 'Is User Moderator ? ',
                    value: message.member.hasPermission("MANAGE_GUILD"),
                    inline: true 
                }
        )
    message.lineReply(embed)
}