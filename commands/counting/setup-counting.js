const schema = require('../../models/server-counting')
const { MessageEmbed } = require('discord.js')
const schema1 = require('../../models/user-counting')

module.exports = {
    name: 'setup-counting',
    description: "Setup counting for this server",
    categories: "Counting",
    userPerms: ['ADMINISTRATOR'],
    example: 'setup-counting',
    botPerms: ["MANAGE_MESSAGES"]
}

module.exports.run = async(sime, message, args) => {
    let confirmEmbed = new MessageEmbed()
      .setTitle("Confirmation | Step 1/2")
      .setDescription(`You are setup Counting Module. Remember, if you have setup this module before, all the data (Counting Channel, Counted Number) will be reseted.\n\nReply with **yes** to continue, or reply anything without **yes** to cancel`)
      .setColor("ORANGE").setTimestamp().setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    let cancelEmbed = new MessageEmbed().setTitle(`Cancelled | Step 1/2`).setDescription(`I have cancelled the setup !`).setColor("RED").setTimestamp().setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
    let step2 = new MessageEmbed().setTitle(`Channel | Step 2/2`).setColor("RANDOM").setTimestamp().setThumbnail(message.author.displayAvatarURL({ dynamic: true })).setDescription(`Please mention channel to set as Counting Channel. This channel will be set as Counting Channel if you mentioned invalid channel`)
  let msg = await message.channel.send(confirmEmbed)
  let filter = (msg) => msg.author.id == message.author.id
  const options = {
    max: 1
  };
  let confirm = await message.channel.awaitMessages(filter, options);
  if(confirm.first().content !== "yes" && confirm.first().content !== "y") {
    await msg.delete()
    await message.channel.send(cancelEmbed)
    return confirm.first().delete()
  }
  let msg2 = await message.channel.send(step2)
  msg.delete()
  confirm.first().delete()
  const Data = await schema.findOne({ Guild: message.guild.id })
  if(Data) await Data.delete()
  const Data1 = await schema1.find({ Guild: message.guild.id })
  if(Data1) await Data1.map(async(D) => D.delete())
  let channel = await message.channel.awaitMessages(filter, options);
  const ch = await channel.first().mentions.channels.first() || message.guild.channels.cache.get(channel.first().content) || message.guild.channels.cache.find(c => c.name == channel.first().content) || message.channel;
  new schema({
    Guild: message.guild.id,
    Channel: ch.id,
    Number: 1
  }).save()
  msg2.delete()
  channel.first().delete()
  message.channel.send(new MessageEmbed().setTitle(`Setup Completed`).setDescription(`Channel: ${ch}\n\nCounted: 0`).setColor("GREEN"))
}