const schema = require('../models/auto-punishes')
const punishDB = require("../models/punishment")
const muteRoleSchema = require("../models/muteRole")

async function autoPunish(sime, guild, member, channel, lang) {
  let Warn_Count = 0
  const Warn_Data = await punishDB.find({ Guild: guild.id, User: member.id, Type: "Warn" });
  if(!Warn_Data) return;
  Warn_Data.map(async(d) => Warn_Count++)
  console.log(Warn_Count)
  if(Warn_Count == 0 || Warn_Count == 1) return;
  let punish = await schema.findOne({ Guild: guild.id, Count: Warn_Count })
  if(!punish) return;
  punish = punish.Punish || "kick"
  if(punish.toLowerCase() == "kick") {
    if(lang == "en") {
    try {
      member.kick(`[AUTO PUNISHMENT] ${Warn_Count} warnings | Kick`)
      channel.send(
        `${sime.emoji.success} **[AUTO PUNISHMENT] ${member.user.tag}** was kicked for reaching **${Warn_Count}** warnings`
      )
    } catch(err) {
      channel.send(`${sime.emoji.error} An error occured:\n\n \`\`\`${err}\`\`\``)
    }
    } else if(lang == "vi") {
    try {
      member.kick(`[AUTO PUNISHMENT] ${Warn_Count} cảnh cáo | Kick`)
      channel.send(
        `${sime.emoji.success} **[AUTO PUNISHMENT] ${member.user.tag}** đã bị đá khỏi máy chủ vì đã đạt **${Warn_Count}** cảnh cáo`
      )
    } catch(err) {
        channel.send(`${sime.emoji.error} Có lỗi xảy ra:\n\n \`\`\`${err}\`\`\``)
    }
  }
} else if(punish.toLowerCase() == "ban") {
    if(lang == "en") {
    try {
      member.ban({ reason: `[AUTO PUNISHMENT] ${Warn_Count} warnings | Ban` })
      channel.send(
        `${sime.emoji.success} **[AUTO PUNISHMENT] ${member.user.tag}** was  for reaching **${Warn_Count} warnings**`
      )
    } catch(err) {
     channel.send(`${sime.emoji.error} An error occured:\n\n \`\`\`${err}\`\`\``)
    }
    } else if(lang == "vi") {
    try {
      member.ban({ reason: `[AUTO PUNISHMENT] ${Warn_Count} cảnh cáo | Ban` })
      channel.send(
        `${sime.emoji.success} **[AUTO PUNISHMENT] ${member.user.tag}** đã bị cấm khỏi máy chủ vì đã đạt **${Warn_Count} cảnh cáo**`
      )
    } catch(err) {
        channel.send(`${sime.emoji.error} Có lỗi xảy ra:\n\n \`\`\`${err}\`\`\``)
    }
  }
} else if(punish.toLowerCase() == "mute") {
      const muteRoleData = await muteRoleSchema.findOne({ Guild: guild.id })
    if(lang == "en") {
      if (!muteRoleData || !guild.roles.cache.find(r => r.id == muteRoleData.Role)) return channel.send(`🔨 I can't find muted role`)
      const muteRole = await guild.roles.cache.find(r => r.id == muteRoleData.Role)
    try {
      
      member.roles.add(muteRole, `[AUTO PUNISHMENT] ${Warn_Count} warnings | Mute`)
      channel.send(
        `${sime.emoji.success} **[AUTO PUNISHMENT] ${member.user.tag}** was muted for reaching **${Warn_Count} warnings**`
      )
      new punishinfo({
                    Guild: message.guild.id,
                    ID: punish,
                    User: member.id,
                    Moderator: message.member.id,
                    Reason: reason,
                    Type: "Mute",
                    At: moment.utc(Date.now()).format("MM/DD/YYYY")
                }).save()
    } catch(err) {
      channel.send(`${sime.emoji.error} An error occured:\n\n \`\`\`${err}\`\`\``)
    }
    } else if(lang == "vi") {
      if (!muteRoleData || !guild.roles.cache.find(r => r.id == muteRoleData.Role)) return channel.send(`🔨 Tôi không tìm thấy role Muted`)
      const muteRole = await guild.roles.cache.find(r => r.id == muteRoleData.Role)
    try {
      member.roles.add(muteRole, `[AUTO PUNISHMENT] ${Warn_Count} cảnh cáo | Mute`)
      channel.send(
        `${sime.emoji.success} **[AUTO PUNISHMENT] ${member.user.tag}** đã bị câm tại máy chủ vì đã đạt **${Warn_Count} cảnh cáo**`
      )
      new punishinfo({
                    Guild: message.guild.id,
                    ID: punish,
                    User: member.id,
                    Moderator: message.member.id,
                    Reason: reason,
                    Type: "Mute",
                    At: moment.utc(Date.now()).format("MM/DD/YYYY")
                }).save()
    } catch(err) {
        channel.send(`${sime.emoji.error} Có lỗi xảy ra:\n\n \`\`\`${err}\`\`\``)
    }
  }
}
}

module.exports = { autoPunish }