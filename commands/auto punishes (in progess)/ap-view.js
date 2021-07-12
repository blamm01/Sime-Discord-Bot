const schema = require('../../models/auto-punishes');
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: 'ap-view',
    description: "View all the punishments",
    example: `ap-view`,
    categories: 'Auto Punishes',
    userPerms: ["ADMINISTRATOR"]
}

module.exports.run = async (sime, message, args, lang) => {
    const Data = await schema.find({ Guild: message.guild.id })
    let Desc = "";

    let amount = 0;

    const emb = new MessageEmbed()
      .setColor("RANDOM")
      .setThumbnail(message.guild.iconURL({ dynamic: true }))


    if(lang == "vi") {
      emb.setTitle("Trừng phạt tự động")
      Data.map(async (d) => amount++);
    if(amount == 0) {
      Desc = `${sime.emoji.error} Máy chủ này không đặt bất cứ trừng phạt tự động nào.`
    }
      Data.map(d => Desc+=`${d.Count} cảnh cáo : ${d.Punish.toUpperCase()}\n`)
    emb.setDescription(Desc)
    } else if(lang == "en") {
      emb.setTitle("Auto Punishment")
      Data.map(async (d) => amount++);
    if(amount == 0) {
      Desc = `${sime.emoji.error} There is no auto punish for this server`
    }
      Data.map(async d => Desc+=`${d.Count} warnings : ${d.Punish.toUpperCase()}\n`)
    emb.setDescription(Desc)
    }

    message.channel.send(emb)
}