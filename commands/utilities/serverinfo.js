const { MessageEmbed } = require('discord.js')
const moment = require('moment')

module.exports = {
    name: 'serverinfo',
    description: "Shows information of the server",
    example: 'serverinfo',
    botPerms: ["EMBED_LINKS"],
    userPerms: [],
    aliases: ['si'],
    categories: 'Utilities',
}

module.exports.run = async(sime, message, args) => {
    const p = await sime.prefix(message)
        const embed = new MessageEmbed()
            .setTitle(`Server Information`)
            .setColor("RANDOM")
            .addField(`General Information`, [
                `ID: ${message.guild.id}`,
                `Name: ${message.guild.name}`,
                `Owner: <@${message.guild.ownerID}>`,
            ])
            .addField(`Server Counts`, [
                `Roles: ${message.guild.roles.cache.size - 1} roles | ${message.guild.roles.cache.map(role => role.toString()).join(" , ") || "Cannot list all here"}`,
                `Emojis: ${message.guild.emojis.cache.size} emojis | Regular: ${message.guild.emojis.cache.filter(e => !e.animated).size} , Animated: ${message.guild.emojis.cache.filter(e => e.animated).size}`,
                `Channels: ${message.guild.channels.cache.filter(c => c.type == 'text').size} Text Channels , ${message.guild.channels.cache.filter(c => c.type == 'voice').size} Voice Channels , ${message.guild.channels.cache.filter(c => c.type == 'news').size} Announcement Channels`
            ])
            .addField(`Additional Information`, [
                `Created: ${moment(message.guild.createdTimestamp).format(
                    "LT"
                )} ${moment(message.guild.createdTimestamp).format(
                    "LL"
                )}  ${moment(message.guild.createdTimestamp).fromNow()}`,
                `Region: ${message.guild.region}`,
                `Vanity URL Code: ${message.guild.vanityURLCode || `No Vanity`}`,
                `Boosts Tier: ${
                    message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : "None"
                }`,
                `Boosts Counts: ${
                    message.guild.premiumSubscriptionCount ? `Count ${message.guild.premiumSubscriptionCount}` : "0"
                } boost(s)`,
                `Verification Level: ${message.guild.verificationLevel}`,
                `Verified: ${message.guild.verified}`,
                `Prefix: ${p}`,
            ])
            .setThumbnail(message.guild.iconURL({dynamic: true}))
        message.lineReply(embed)
          .catch(err => {
            const embed1 = new MessageEmbed()
            .setTitle(`Server Info`)
            .setColor("RANDOM")
            .addField(`General Information`, [
                `ID: ${message.guild.id}`,
                `Name: ${message.guild.name}`,
                `Owner: <@${message.guild.ownerID}>`,
            ])
            .addField(`Server Counts`, [
                `Roles: ${message.guild.roles.cache.size - 1} roles | Cannot list all here`,
                `Emojis: ${message.guild.emojis.cache.size} emojis | Regular: ${message.guild.emojis.cache.filter(e => !e.animated).size} , Animated: ${message.guild.emojis.cache.filter(e => e.animated).size}`,
                `Channels: ${message.guild.channels.cache.filter(c => c.type == 'text').size} Text Channels , ${message.guild.channels.cache.filter(c => c.type == 'voice').size} Voice Channels , ${message.guild.channels.cache.filter(c => c.type == 'news').size} Announcement Channels`
            ])
            .addField(`Additional Information`, [
                `Created: ${moment(message.guild.createdTimestamp).format(
                    "LT"
                )} ${moment(message.guild.createdTimestamp).format(
                    "LL"
                )}  ${moment(message.guild.createdTimestamp).fromNow()}`,
                `Region: ${message.guild.region}`,
                `Vanity URL Code: ${message.guild.vanityURLCode || `No Vanity`}`,
                `Boosts Tier: ${
                    message.guild.premiumTier ? `Tier ${message.guild.premiumTier}` : "None"
                }`,
                `Boosts Counts: ${
                    message.guild.premiumSubscriptionCount ? `Count ${message.guild.premiumSubscriptionCount}` : "0"
                } boost(s)`,
                `Verification Level: ${message.guild.verificationLevel}`,
                `Verified: ${message.guild.verified}`,
                `Prefix: ${p}`,
            ])
            .setThumbnail(message.guild.iconURL({dynamic: true}))
          message.lineReply(embed1)
          })
    }