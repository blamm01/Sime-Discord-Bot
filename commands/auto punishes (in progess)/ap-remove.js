const schema = require('../../models/auto-punishes');
const {
    MessageEmbed
} = require('discord.js')
const ms = require("ms")

module.exports = {
    name: 'ap-remove',
    description: "Remove auto punishment",
    example: `ap-remove 3`,
    categories: 'Auto Punishes',
    userPerms: ["ADMINISTRATOR"],
    usage: '<Warning Count>'
}

module.exports.run = async (sime, message, args, lang) => {
    let count = args[0]
    if(lang == "vi") {
      if(!count) return message.lineReply("Bạn phải điền số cảnh cáo")
    count = parseInt(count)
    if(!count || !Number(count)) return message.lineReply("Bạn phải điền số cảnh cáo hợp lệ (Là một số)")
    if(count == 0 || count == 1) return message.lineReply("Số cảnh cáo không thể là **0** hoặc **1** cảnh cáo")
    const Data = await schema.findOne({ Guild: message.guild.id, Count: count })
    if(!Data) return message.lineReply(`Không có trừng phạt tự động nào nếu đạt **${count}** cảnh cáo`)
    Data.delete()
    message.channel.send(`Đã xóa trừng phạt tự động nếu đạt **${count}** cảnh cáo`)
    } else if(lang == "en") {
      if(!count) return message.lineReply("Please provide Warnings Count")
    count = parseInt(count)
    if(!count || !Number(count)) return message.lineReply("Please provide valid Warnings Count (Number)")
    if(count == 0 || count == 1) return message.lineReply("Warnings count can't be **0** and **1** warnings")
    const Data = await schema.find({ Guild: message.guild.id, Count: count })
    if(Data) return message.lineReply(`There is auto punishment for **${count}** warnings already`)
    const punishEmb = new MessageEmbed()
      .setTitle("Error")
      .setDescription("You need to provide punish type\n\nmute [time | no provide = permantly] - mute (like `mute` command)\nkick - kick (like `kick` command)\nban [time | no provide = permantly] - ban (like `ban` command)")
      .setColor("RED")
    if(!punish) return message.lineReply(punishEmb)
    if(punish.toLowerCase() !== "kick" && punish.toLowerCase() !== "ban" && punish.toLowerCase() !== "mute") return message.lineReply(punishEmb)
    new schema({
      Guild: message.guild.id,
      Count: count,
      Punish: punish.toLowerCase()
    }).save()
    message.channel.send(`Action **${punish.toUpperCase()}** will be run in a user who reach **${count}** warnings`)
    }
}