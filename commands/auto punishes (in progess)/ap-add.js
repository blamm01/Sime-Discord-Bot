const schema = require('../../models/auto-punishes');
const {
    MessageEmbed
} = require('discord.js')
const ms = require("ms")

module.exports = {
    name: 'ap-add',
    description: "Add auto punishment",
    example: `ap-add 3 mute`,
    categories: 'Auto Punishes',
    userPerms: ["ADMINISTRATOR"],
    usage: '<Warning Count> <Punishment> [Time (Only required for mute and ban action)]'
}

module.exports.run = async (sime, message, args, lang) => {
    let count = args[0]
    let punish = args[1]
    if(lang == "vi") {
      if(!count) return message.lineReply("Bạn phải điền số cảnh cáo")
    count = parseInt(count)
    if(!count || !Number(count)) return message.lineReply("Bạn phải điền số cảnh cáo hợp lệ (Là một số)")
    if(count == 0 || count == 1) return message.lineReply("Số cảnh cáo không thể là **0** hoặc **1** cảnh cáo")
    const Data = await schema.findOne({ Guild: message.guild.id, Count: count })
    if(Data) return message.lineReply(`Đã có trừng phạt tự động nếu đạt **${count}** cảnh cáo trước đó rồi`)
    const punishEmb = new MessageEmbed()
      .setTitle("Lỗi")
      .setDescription("Bạn phải nhập loại trừng phạt\n\nmute [thời gian | không điền = vĩnh viễn] - tắt tiếng (giống với lệnh `mute`)\nkick - đá (giống với lệnh `kick`)\nban [thời gian | không điền = vĩnh viễn] - cấm (giống với lệnh `ban`)")
      .setColor("RED")
    if(!punish) return message.lineReply(punishEmb)
    if(punish.toLowerCase() !== "kick" && punish.toLowerCase() !== "ban" && punish.toLowerCase() !== "mute") return message.lineReply(punishEmb)
    if(punish.toLowerCase() == "kick") {
      new schema({
      Guild: message.guild.id,
      Count: count,
      Punish: punish.toLowerCase()
      }).save()
message.channel.send(`Hành động **${punish.toUpperCase()}** sẽ được thực hiện nếu ai đó đạt **${count}** cảnh cáo`)
    } else if(punish.toLowerCase() == "ban") {
      let time = args[2]
      if(!time) time = "1s"
      time = ms(time)
      if(!Number(time) || !time) time = 1000;
      new schema({
      Guild: message.guild.id,
      Count: count,
      Punish: `${punish.toLowerCase()} | ${time}`
      }).save()
message.channel.send(`Hành động **TEMP${punish.toUpperCase()} ${ms(time, { long: true } )}** sẽ được thực hiện nếu ai đó đạt **${count}** cảnh cáo`)
    }else if(punish.toLowerCase() == "mute") {
      let time = args[2]
      if(!time) time = "1s"
      time = ms(time)
      if(!Number(time) || !time) time = 1000;
      new schema({
      Guild: message.guild.id,
      Count: count,
      Punish: `${punish.toLowerCase()} | ${time}`
      }).save()
message.channel.send(`Hành động **TEMP${punish.toUpperCase()} ${ms(time, { long: true } )}** sẽ được thực hiện nếu ai đó đạt **${count}** cảnh cáo`)
    }
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