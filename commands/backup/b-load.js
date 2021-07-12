const { MessageEmbed } = require('discord.js');
const backup = require('discord-backup')

module.exports = {
    name: 'b-load',
    description: "Load a backup in a server",
    categories: "Backup",
    userPerms: ['ADMINISTRATOR'],
    botPerms: ["ADMINISTRATOR"],
    usage: '<Backup ID>',
    aliases: ['backup-load']
}

module.exports.run = async(sime, message, args, lang) => {
  if(message.guild.ownerID !== message.author.id) return message.channel.send("Only Server Owner can use this command")
  const backupID = args.join(' ');
  if(lang == "en") {
  if(!backupID) return message.lineReply("Please provide Backup ID (ID must be a number)");
  const msg = await message.channel.send(`**Please be patient, I'm loading a backup on your server...**`);
  backup.load(backupID, message.guild).then(() => {
    return message.author.send("Backup Loaded Successfully...")
  })
  .catch(err => { 
    message.author.send(new MessageEmbed()
      .setTitle("An error occured")
      .setFooter("An error occured when I'm trying to load a backup")
      .setDescription(`\`\`\`${err}\`\`\``)
      .setColor("RED")
    )
  })
  } else if(lang == "vi") {
    if(!backupID) return message.lineReply("Bạn phải nhập ID của bản sao lưu (ID phải là một dãy số)");
  const msg = await message.channel.send(`**Tôi đang khôi phục máy chủ của bạn từ bản sao lưu**`);
  backup.load(backupID, message.guild).then(() => {
    return message.author.send("Khôi phục thành công")
  })
  .catch(err => { 
    message.author.send(new MessageEmbed()
      .setTitle("Lỗi")
      .setFooter("Có một lỗi xảy ra khi tôi đang khôi phục máy chủ của bạn")
      .setDescription(`\`\`\`${err}\`\`\``)
      .setColor("RED")
    )
  })
  }
}