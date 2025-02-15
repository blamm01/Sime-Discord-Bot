const schema = require('../../models/logging')
const { MessageEmbed } = require('discord.js')
const db = require('quick.db')

module.exports = {
    name: 'setmodlogs',
    categories: 'Logging',
    aliases: ['modlogs-set'],
    description: "Set Moderation Logs for the server",
    example: 'setmodlogs #modlogs',
    usage: '[Channel]',
    userPerms: ['ADMINISTRATOR']
}

module.exports.run = async(sime, message, args, lang) => {
  if(lang == "en") {
	const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name == args[0]) || message.channel;
    const data = await schema.findOne({ Guild: message.guild.id, Channel: channel.id })
    if(data) await data.delete()
    await channel.createWebhook(sime.user.username, {
        reason: "Moderation Logging",
        avatar: sime.user.displayAvatarURL({ dynamic: false })
    }).catch(err => message.channel.send(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${err}\`\`\``)).setColor("RED").setFooter(`An error occured when I'm trying to create webhook`))
      .then(hook => {
        new schema({
			Guild: message.guild.id,
            Channel: channel.id,
			WebhookID: hook.id,
            WebhookToken: hook.token
        }).save()
        message.channel.send(new MessageEmbed().setTitle(`Moderation Action Logging`).setColor("GREEN").setDescription(`**All Moderation Action will be logging in there**`).setThumbnail(sime.user.displayAvatarURL({ dynamic: true })))
    })
  } else if(lang == "vi") {
    const channel = await message.mentions.channels.first() || message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(c => c.name == args[0]) || message.channel;
    const data = await schema.findOne({ Guild: message.guild.id, Channel: channel.id })
    if(data) await data.delete()
    await channel.createWebhook(sime.user.username, {
        reason: "Moderation Logging",
        avatar: sime.user.displayAvatarURL({ dynamic: false })
    }).catch(err => message.channel.send(new MessageEmbed().setTitle(`Lỗi`).setDescription(`\`\`\`${err}\`\`\``)).setColor("RED").setFooter(`Có một lỗi xảy ra khi tôi đang cố tạo một webhook cho kênh này`))
      .then(hook => {
        new schema({
			Guild: message.guild.id,
            Channel: channel.id,
			WebhookID: hook.id,
            WebhookToken: hook.token
        }).save()
        message.channel.send(new MessageEmbed().setTitle(`Nhật ký về hành động Moderation`).setColor("GREEN").setDescription(`**Tất cả câu lệnh Moderation được dùng đều được ghi lại ở đây**`).setThumbnail(sime.user.displayAvatarURL({ dynamic: true })))
    })
  }
}
