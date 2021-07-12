const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'enable',
    usage: '<Command>',
    description: "Enable a command",
    example: `enable role`,
    userPerms: ["ADMINISTRATOR"],
    categories: 'Setup',
}

module.exports.run = async(sime, message, args, lang) => {
  if(lang == "en") {
    const choice = args[0];
    if(!choice) return message.lineReply("You need to provide command name");
    const command = await sime.commands.get(choice.toLowerCase())
    if(!command) return message.lineReply(`There is no command called **${choice.toLowerCase()}**`)
    if(command.name == "disable" || command.name == "enable") return message.lineReply("`disable` and `enable` command can't be disabled or enabled")
    const disableList = await sime.mongo.get(`disabled_${message.guild.id}`)
    if(!disableList || !disableList.find(c => c == command.name)) return message.lineReply(`**${command.name}** command is not disabled`);
    const newFilter = disableList.filter(c => c !== command.name)
    await sime.mongo.set(`disabled_${message.guild.id}`, newFilter);
    message.lineReply(`**${command.name}** command has been enabled`)
  } else if(lang == "vi") {
    const choice = args[0];
    if(!choice) return message.lineReply("Bạn phải ghi lệnh cần bật");
    const command = await sime.commands.get(choice.toLowerCase())
    if(!command) return message.lineReply(`Tôi không tìm thấy lệnh nào gọi là **${choice.toLowerCase()}**`)
    if(command.name == "disable" || command.name == "enable") return message.lineReply("Bạn không thể tắt hoặc bật lệnh `disable` và `enable`")
    const disableList = await sime.mongo.get(`disabled_${message.guild.id}`)
    if(!disableList || !disableList.find(c => c == command.name)) return message.lineReply(`Lệnh **${command.name}** đã không bị tắt trước đó`);
    const newFilter = disableList.filter(c => c !== command.name)
    await sime.mongo.set(`disabled_${message.guild.id}`, newFilter);
    message.lineReply(`Lệnh **${command.name}** đã được bật thành công`)
  }
}