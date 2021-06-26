const messageembed = require('discord.js').MessageEmbed;
const schema = require('../../models/authorization-roles')

module.exports = {
  name: 'authorization-add',
  description: "Add role to whitelisted roles (whitelisted from bot)",
  categories: "Anti Make Changes",
  example: 'authorization-add Administrators',
  usage: '<Role>',
  userPerms: ["ADMINISTRATOR"],
  aliases: ['authorize-add']
}

module.exports.run = async (sime, message, args) => {
  const da = await sime.mongo.get(`antiMakeChanges_${message.guild.id}`) || false
  if(da == false) return message.channel.send("This server is not enabled Anti Make Changes module")
  const role = await message.mentions.roles.first() || message.guild.roles.cache.get(args[0]) || message.guild.roles.cache.find(r => r.name == args[0])
  if(!role) return message.channel.send(`You need mention role first !`)
  if(message.member.roles.highest.position <= message.guild.me.roles.highest.position && message.author.id !== message.guild.owner.id) return message.channel.send(`You can't use this command because your highest role is lower or equal Sime's highest role`)
  const Data = await schema.findOne({ Guild: message.guild.id })
  const filter = (msg) => msg.author.id == message.author.id;
  message.channel.send(new messageembed().setTitle("Confirmation").setDescription(`You are adding role ${role} to authorization roles. Remember, members with this role will be whitelisted from the bot\n\nReply **yes** to continue`).setColor("ORANGE"))
  const collector = await message.channel.createMessageCollector(filter)
  collector.on('collect', async(m) => {
    collector.stop('done')
    if(m.content !== "yes" && m.content !== "y") return message.channel.send("Cancelled")
    if(!Data) {
      new schema({
        Guild: message.guild.id,
        Role: role.id
      }).save()
      message.channel.send(`Role ${role.name} has been added to Authorization Roles`)
    } else {
      if(Data.Role.includes(role.id)) return message.channel.send(`Role ${role.name} is in Authorization Roles already`)
      Data.Role.push(role.id)
      Data.save()
      message.channel.send(`Role ${role.name} has been added to Authorization Roles`)
    }
  })
  collector.on('end', async(collected) => {
    if(collected.size == 0) return message.channel.send(`You didn't reply, cancelling...`)
    collector.stop('time')
  })
}