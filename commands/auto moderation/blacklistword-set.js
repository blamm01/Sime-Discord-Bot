const messageembed = require('discord.js').MessageEmbed;
const options = [
  "add",
  "remove",
  "view",
  "removeall"
]

module.exports = {
  name: 'blacklistword-set',
  description: "Settings Word on Blacklist Words Module",
  categories: "Auto Moderation",
  example: 'blacklistword-set add fuc',
  usage: '<Add/Remove/RemoveAll/View> [Word (For Add and Remove options)]',
  userPerms: ["ADMINISTRATOR"],
  aliases: ['blacklistword-settings','blacklistword-setting']
}

module.exports.run = async (sime, message, args) => {
  const option = args[0]
  if(!option || !(options).includes(option.toLowerCase())) return message.lineReply(`You need provide option first ! Option: add | remove | removeall | view`)
  const currentWords = await sime.mongo.get(`blacklistedWord_${message.guild.id}`)
  console.log(currentWords)
  if(option.toLowerCase() == 'add') {
    const word = args.slice(1).join(" ") || args[1]
    if(!word) return message.lineReply(`You need provide word to add`);
    if(currentWords) {
      await sime.mongo.push(`blacklistedWord_${message.guild.id}`, word.toLowerCase())
    } else {
      await sime.mongo.push(`blacklistedWord_${message.guild.id}`, word.toLowerCase())
    }
    message.lineReply(`Added **\`${word.toLowerCase()}\`** to Blacklisted Words`)
  } else if(option.toLowerCase() == 'remove') {
    const word = args.slice(1).join(" ") || args[1]
    if(!word) return message.lineReply(`You need provide word to remove`);
    if(!await sime.mongo.get(`blacklistedWord_${message.guild.id}`)) {
      message.lineReply(`There is no words in Blacklisted Words`)
      return
      };
      if(!currentWords.includes(word.toLowerCase())) return message.lineReply(`**\`${word.toLowerCase()}\`** isn't in Blacklisted Words`)
      const newWordsList = currentWords.filter(c => c !== word.toLowerCase())
     await sime.mongo.set(`blacklistedWord_${message.guild.id}`, newWordsList)
     if(await sime.mongo.get(`blacklistedWord_${message.guild.id}`).length == 0) await sime.mongo.delete(`blacklistedWord_${message.guild.id}`)
    message.lineReply(`Removed **\`${word.toLowerCase()}\`** from Blacklisted Words`)
} else if(option.toLowerCase() == 'view') {
    if(!await sime.mongo.get(`blacklistedWord_${message.guild.id}`)) {
      message.lineReply(`There is no words in Blacklisted Words`)
      return
      };
      if(await sime.mongo.get(`blacklistedWord_${message.guild.id}`).length == 0) {
      await sime.mongo.delete(`blacklistedWord_${message.guild.id}`)
      message.lineReply(`There is no words in Blacklisted Words`)
      return
      };
      message.channel.send(new messageembed().setTitle(`Blacklisted Words`).setDescription(`\`${currentWords.join("` `")}\``).setColor("RED"))
} else if(option.toLowerCase() == 'removeall') {
    if(!await sime.mongo.get(`blacklistedWord_${message.guild.id}`)) {
      message.lineReply(`There is no words in Blacklisted Words`)
      return
      };
      if(await sime.mongo.get(`blacklistedWord_${message.guild.id}`).length == 0) {
      await sime.mongo.delete(`blacklistedWord_${message.guild.id}`)
      message.lineReply(`Deleted all blacklisted words`)
      return
      };
      await sime.mongo.delete(`blacklistedWord_${message.guild.id}`)
      message.lineReply(`Deleted all blacklisted words`)
      return
}
}