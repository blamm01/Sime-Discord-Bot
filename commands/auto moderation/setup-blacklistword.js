const messageembed = require('discord.js').MessageEmbed;
const embed = new messageembed()
const schema = require('../../models/automoderation')
const permsList = [
  "ADMINISTRATOR",
  "CREATE_INSTANT_INVITE",
  "KICK_MEMBERS",
  "BAN_MEMBERS",
  "MANAGE_CHANNELS",
  "MANAGE_GUILD",
  "ADD_REACTIONS",
  "VIEW_AUDIT_LOG",
  "PRIORITY_SPEAKER",
  "STREAM",
  "VIEW_CHANNEL",
  "SEND_MESSAGES",
  "SEND_TTS_MESSAGES",
  "MANAGE_MESSAGES",
  "EMBED_LINKS",
  "ATTACH_FILES",
  "READ_MESSAGE_HISTORY",
  "MENTION_EVERYONE",
  "USE_EXTERNAL_EMOJIS",
  "VIEW_GUILD_INSIGHTS",
  "CONNECT",
  "SPEAK", 
  "MUTE_MEMBERS", 
  "DEAFEN_MEMBERS",
  "MOVE_MEMBERS",
  "USE_VAD",
  "CHANGE_NICKNAME",
  "MANAGE_NICKNAMES",
  "MANAGE_ROLES",
  "MANAGE_WEBHOOKS",
  "MANAGE_EMOJIS",
]

module.exports = {
  name: 'setup-blacklistword',
  description: "Setup Blacklist Word Module",
  cooldonw: 15,
  categories: "Auto Moderation",
  example: 'setup-blacklistword',
  userPerms: ["ADMINISTRATOR"]
}

module.exports.run = async (sime, message, args) => {
  const ques1 = new messageembed()
    .setTitle(`Setup 1/4`)
    .setDescription(`Please mention a role to be whitelisted`)
    .setColor("BLUE");
  const ques2 = new messageembed()
    .setTitle(`Setup 2/4`)
    .setColor("BLUE")
    .setDescription(`Please mention a channel to be whitelisted`)
  const ques3 = new messageembed()
    .setTitle(`Setup 3/4`)
    .setDescription(`Please provide moderation action if someone say blacklisted word | Action: warn | delete | mute | kick | ban | unmute`)
    .setColor("BLUE")
  const ques4 = new messageembed()
    .setTitle(`Setup 4/4`)
    .setDescription(`Please provide permissions to be whitelisted. Check https://discord.js.org/#/docs/main/stable/class/Permissions?scrollTo=s-FLAGS for all permissions`)
    .setColor("BLUE")
  const data = await schema.find({ Guild: message.guild.id })
  data.map(async(d) => d.delete())
  if(await sime.mongo.has(`blacklistWordRole_${message.guild.id}`)) {
    await sime.mongo.delete(`blacklistWordRole_${message.guild.id}`) 
  }
  if(await sime.mongo.has(`blacklistWordChannel_${message.guild.id}`)) {
    await sime.mongo.delete(`blacklistWordChannel_${message.guild.id}`) 
  }
  if(await sime.mongo.has(`blacklistWordAction_${message.guild.id}`)) {
    await sime.mongo.delete(`blacklistWordAction_${message.guild.id}`) 
  }
  if(await sime.mongo.has(`blacklistWordPermission_${message.guild.id}`)) {
    await sime.mongo.delete(`blacklistWordPermission_${message.guild.id}`) 
  }
  message.channel.send(ques1)
  const filter = (msg) => msg.author.id === message.author.id;
  const roleCollector = await message.channel.createMessageCollector(filter)
  roleCollector.on('collect', async (msg) => {
    roleCollector.stop('done')
    let role = await msg.mentions.roles.first() || message.guild.roles.cache.find(r => r.id == msg.content) || message.guild.roles.cache.find(r => r.name === msg.content)
    if (!role) {
      message.channel.send(`I can't find that role. Skipping...`)
      role= "No role"
      await sime.mongo.push(`blacklistWordRole_${message.guild.id}`, role) 
    } else { 
       await sime.mongo.push(`blacklistWordRole_${message.guild.id}`, role.id) 
      }
    message.channel.send(ques2)
    const channelCollector = await message.channel.createMessageCollector(filter)
    channelCollector.on('collect', async (msg2) => {
      channelCollector.stop('done')
      let channel = await msg2.mentions.channels.first() || message.guild.channels.cache.find(r => r.id == msg2.content) || message.guild.channels.cache.find(r => r.name === msg2.content)
    if (!channel) {
      message.channel.send(`I can't find that channel. Skipping...`)
      channel= "No channel"
      await sime.mongo.push(`blacklistWordChannel_${message.guild.id}`, channel)
    } else { 
       await sime.mongo.push(`blacklistWordChannel_${message.guild.id}`, channel.id) 
      }
      message.channel.send(ques3)
    const actionCollector = await message.channel.createMessageCollector(filter)
    actionCollector.on('collect', async (msg1) => {
      var right = 0
      actionCollector.stop('done')
      if(msg1.content.toLowerCase() == "warn") {
        right = 1;
        await sime.mongo.set(`blacklistWordAction_${message.guild.id}`, "warn")
      } else if(msg1.content.toLowerCase() == "mute") {
        right = 1;
        await sime.mongo.set(`blacklistWordAction_${message.guild.id}`, "mute")
      } else if(msg1.content.toLowerCase() == "unmute") {
        right = 1;
        await sime.mongo.set(`blacklistWordAction_${message.guild.id}`, "unmute")
      } else if(msg1.content.toLowerCase() == "kick") {
        right = 1;
        await sime.mongo.set(`blacklistWordAction_${message.guild.id}`, "kick")
      } else if(msg1.content.toLowerCase() == "delete") {
        right = 1;
        await sime.mongo.set(`blacklistWordAction_${message.guild.id}`, "delete")
      } else if(msg1.content.toLowerCase() == "ban") {
        right = 1;
        await sime.mongo.set(`blacklistWordAction_${message.guild.id}`, "ban")
      }
      if(right == 0) {
        message.channel.send(`I can't define the action provided. Automatically set moderation action to delete`)
        right = 1;
        await sime.mongo.set(`blacklistWordAction_${message.guild.id}`, "delete")
      }
      message.channel.send(ques4)
      const permsCollector = await message.channel.createMessageCollector(filter)
    permsCollector.on('collect', async (msg3) => {
      permsCollector.stop('done')
      if(!(permsList).includes(msg3.content.toUpperCase())) {
        message.channel.send(`I can't define the action provided. Automatically set whitelisted permissions to \`ADMINISTRATOR\``)
        await sime.mongo.set(`blacklistWordPermission_${message.guild.id}`, "ADMINISTRATOR")
      } else {
        await sime.mongo.set(`blacklistWordPermission_${message.guild.id}`, msg3.content.toUpperCase())
      }
      new schema({
        Guild: message.guild.id,
        Role: role.id,
        Channel: channel.id
      }).save()
      message.channel.send(new messageembed().setTitle(`Blacklisted Word Enabled`).setDescription(`Whitelisted Role: **${role}**\nWhitelisted Channel: **${channel}**\nModeration Action: **${await sime.mongo.get(`blacklistWordAction_${message.guild.id}`)}**\nWhitelisted Permission: **${await sime.mongo.get(`blacklistWordPermission_${message.guild.id}`)}**\n\n**Use \`blacklistword-set\` to edit blacklisted words**`).setColor("GREEN"))
    })
    })
  })
})
}