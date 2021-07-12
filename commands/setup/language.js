const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'language',
    description: "Set Server's Language (Beta)",
    example: `language vi`,
    userPerms: ["ADMINISTRATOR"],
    categories: 'Setup',
    aliases: ['lang','set-language','set-lang','setlanguage','setlang']
}

module.exports.run = async(sime, message, args, lang) => {
  const la = args[0]
    if(lang == "vi") {
      if(!la || !(["vi","en"]).includes(la.toLowerCase())) return message.channel.send(
        new MessageEmbed()
          .setTitle("Lỗi")
          .setDescription("Bạn hãy nhập ngôn ngữ cần đổi. Sau đây là bảng ngôn ngữ:\n\n```en : Tiếng Anh (English)\nvi: Tiếng việt (Vietnamese) | Ngôn ngữ hiện tại```")
          .setColor("RED")
      )
      if(la.toLowerCase() == "vi") return message.channel.send("Ngôn ngữ hiện tại đã là Tiếng Việt")
      await sime.mongo.set(`language_${message.guild.id}`, `en`)
      message.channel.send("Language Updated: **English**.")
    } else if(lang == "en") {
      if(!la || !(["vi","en"]).includes(la.toLowerCase())) return message.channel.send(
        new MessageEmbed()
          .setTitle("Error")
          .setDescription("Please provide new language to change. Here is the language table\n\n```en : English (Tiếng Anh) | Current language\nvi: Vietnamese (Tiếng Việt)```")
          .setColor("RED")
      )
      if(la.toLowerCase() == "en") return message.channel.send("Current language is English already")
      await sime.mongo.set(`language_${message.guild.id}`, `vi`)
      message.channel.send("Ngôn ngữ đã được cập nhật: Tiếng Việt\n\nLưu ý: Thông tin về các lệnh sẽ không thay đổi ngôn ngữ")
    }
}