const fs = require('fs');
const config = require('./config.json');
const mongoose = require('mongoose');
const { Database } = require("quickmongo");
const prefixSchema = require('./models/prefixes');
const message = require('./events/message');
const levelSetting = require('./models/level');
const muteRole = require('./models/muteRole');
const punishinfo = require('./models/punishment')
const memberRole = require('./models/memberRole')
const logging = require('./models/logging')
const Topgg = require("@top-gg/sdk")
const authorizationRoles = require('./models/authorization-roles')
const moment = require('moment')
const server_counting = require('./models/server-counting')
const user_counting = require('./models/user-counting')
const { DiscordTogether } = require('discord-together');
const modMail = require('./models/modmail');
const autoModeration = require('./models/automoderation')
const db = require('quick.db');
const ms = require('ms');
const memberRoleSchema = require('./models/memberRole');
const Levels = require('discord-xp');
const muteRoleSchema = require('./models/muteRole');
const customCommand = require('./models/customcommands');
const levelSchema = require('./models/leveling');
const punishDatabase = require('./models/punishment');
const chatBot = require('./models/chatbot');
const fetch = require('node-fetch');
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
const mongo = new Database(process.env.MONGO_DB);
mongoose.connect(
  process.env.MONGO_DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true
  })

Levels.setURL(process.env.MONGO_DB)

const { AutoPoster } = require('topgg-autoposter')

const Discord = require('discord.js')
require('discord-reply');
const sime = new Discord.Client({
  disableMentions: 'everyone'
})
require('discord-buttons')(sime)

const ap = AutoPoster('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijg0MzA3MzQ1MzcwODAxNzcxNiIsImJvdCI6dHJ1ZSwiaWF0IjoxNjI0MzYxMTA4fQ.mMuyKFjeJnKRKr44SQiHtSKXekO2teQHdyNE-tf4rgU', sime)


const distube = require('distube');
const player = new distube(sime, {
  leaveOnEmpty: true,
  leaveOnFinish: true,
  leaveOnStop: false
});

module.exports = sime;

/* Math */
sime.math = function(type, a, b) {
  let result
  if (type == '+') {
    result = a + b
  } else if (type == '-') {
    result = a - b
  } else if (type == 'x') {
    result = a * b
  } else if (type == ':') {
    result = a / b
  }
  return result
}

sime.discordTogether = new DiscordTogether(sime);
sime.Levels = Levels
sime.config = config
sime.mongo = mongo
sime.snipes = new Discord.Collection()
sime.commands = new Discord.Collection();
sime.aliases = new Discord.Collection();
sime.categories = fs.readdirSync("./commands/");
["command"].forEach(handler => {
  require(`./handlers/${handler}`)(sime);
});

const {
  GiveawaysManager
} = require('discord-giveaways'); //npm i discord-giveaways
sime.giveaways = new GiveawaysManager(sime, {
  storage: './giveaways.json',
  updateCountdownEvery: 3000, // 5000 in seconds is 5 seconds
  default: {
    botsCanWin: false,
    embedColor: '#FF0000',
    reaction: '🎉'
  }
})

/* QuickMongo Event */
mongo.on("ready", () => {
  console.log("quickmongo: Mongo Connected");
});

/* Custom Prefix */
sime.prefix = async function(message) {
  let custom;

  const data = await prefixSchema.findOne({
    Guild: message.guild.id
  });

  if (data) {
    custom = data.Prefix;
  } else {
    custom = config.prefix;
  }
  return custom;
};

/* Distube Event */
player
  .on("playSong", (message, queue, song) => message.lineReply(
    `Playing \`${song.name}\` - \`${song.formattedDuration}\`\nRequested by: ${song.user}`
  ))
  .on("addList", (message, queue, playlist) => {
    message.lineReply(`Added **${song.name}** - **${song.formattedDuration}** to playlist`)
  })
  .on("empty", (message) => {
    message.lineReply(`Leaving Channel: No one in voice channel`)
  })
  .on('error', (message, error) => {
    message.lineReply(new Discord.MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${error}\`\`\``).setColor("RED"))
  })
  .on("finish", (message) => {
    message.lineReply(`Leaving Channel: Queue Empty`)
  })
  .on('noRelated', (message) => {
    message.lineReply(`Leaving Channel: Queue Empty | No Related Song`)
  })
  .on("playList", (message, queue, playlist, song) => {
    message.lineReply(
      `Playing \`${playlist.name}\` playlist - \`${playlist.songs.length}\` songs\nNow Playing: \`${song.name}\` - \`${song.formattedDuration}`
    )
      .on("initQueue", (queue) => {
        queue.autoplay = false;
        queue.volume = 100;
      })
  })

sime.player = player;
sime.distube = distube;

/* Punishment ID */
sime.punishid = function generateRandomString(length) {
  var chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ11121314151617181920';
  var random_string = '';
  if (length > 0) {
    for (var i = 0; i < length; i++) {
      random_string += chars.charAt(Math.floor(Math.random() * chars.length));
    }
  }
  return random_string
}

/* Login to the bot */
sime.login(process.env.BOT_TOKEN)

/* Command Handler in ./handlers/command */

/* Event Handler */
fs.readdir('./events', (err, files) => {
  if (err) return console.log(`An error occured: ${typeof err == String}`);
  files.forEach(file => {
    if (!file.endsWith('.js')) return console.log(`File ${file} isn't a event !`);
    const event = require(`./events/${file}`);
    let eventName = file.split('.')[0];
    console.log(`${file}: Loaded event: ${eventName}`)
    sime.on(eventName, event.bind(null, sime));
  })
})

/* Top.gg Event */
ap.on('posted', () => {
  console.log('Stats posted to top.gg')
})

/* Custom Command Event */
sime.on('message', async (message) => {
  if (!message.guild || message.author.bot) return
  const p = await sime.prefix(message)
  const args = message.content.slice(p.length).trim().split(/ +/g);
  const cmd = args.shift().toLowerCase();
  customCommand.findOne({
    Guild: message.guild.id,
    Command: cmd
  }, async (err, data) => {
    if (!data) return;
    message.channel.send(data.Response)
  })
})

/* Rank Up */
sime.on('message', async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const levelData = await levelSetting.findOne({ Guild: message.guild.id })
  if (!levelData) return;
  const randomAmountOfXp = Math.floor(Math.random() * 29) + 1; // Min 1, Max 30
  const hasLeveledUp = await Levels.appendXp(message.author.id, message.guild.id, randomAmountOfXp);
  if (hasLeveledUp) {
    const channel = message.guild.channels.cache.get(levelData.Channel) || message.channel
    const rankUpMessage = levelData.Text
    const user = await Levels.fetch(message.author.id, message.guild.id);
    const requireXP = await sime.Levels.xpFor(user.level + 1)
    channel.send(levelData.Text.replace(/{user}/, message.author).replace(/{xp}/, user.xp).replace(/{level}/, user.level).replace(/{requireXP}/, requireXP))
  }
})

/* ModMail Events */
sime.on('message', async (message) => {
  if (message.channel.type == 'dm' && message.author.bot == false) {
    if (!db.has(`modmail_${message.author.id}`)) {
      var memberGuilds = [];
      sime.guilds.cache.map(async guild => {
        const member = await guild.members.cache.get(message.author.id)
        if (member) {
          const Data = await modMail.findOne({ Guild: guild.id })
          if (Data) memberGuilds.push(guild)
        }
      })
      let embed = new Discord.MessageEmbed()
        .setDescription(`Specify a Server ID to open a modmail | Or send the invalid server ID to close`)
        .setColor("RANDOM")

      let msg = await message.channel.send(embed)
      db.set(`modmail_${message.author.id}`, `Choosing`);
      let msgFilter = m => m.author.id === message.author.id;

      let collected = await msg.channel.awaitMessages(msgFilter, { max: 1 });

      let guild = await sime.guilds.cache.find(g => g.id === collected.first().content);

      if (!guild) {
        message.lineReply(`:x: Invalid Server ID, You left the specified Server or I have been kicked from that server. Cancelling the command...`);
        db.delete(`modmail_${message.author.id}`, guild);
        return
      }

      const DataGuild = await modMail.findOne({ Guild: guild.id })
      if (!DataGuild) {
        message.lineReply(`Server **${guild.name}** isn't enabled modmail system.`);
        db.delete(`modmail_${message.author.id}`);
        return
      }

      message.lineReply(new Discord.MessageEmbed()
        .setTitle(`ModMail Opened`)
        .setThumbnail(guild.iconURL({ dynamic: true }))
        .setColor("GREEN")
        .setDescription(`Please wait, we will be with you soon`)
      );

      await db.set(`modmail_${message.author.id}`, guild.id)

      const Data = await modMail.findOne({ Guild: guild.id })

      const Category = await guild.channels.cache.find(c => c.id == Data.Category && c.type == 'category')
      const Role = await guild.roles.cache.find(c => c.id == Data.Role) || 'No Support Role';

      const modChannel = await guild.channels.create(`modmail-${message.author.id}`, {
        type: "text",
        topic: `A Modmail for ${message.author.tag}`,
        nsfw: false,
        parent: Category,
        reason: `A Modmail for ${message.author.tag}`
      })

      if (Category) {
        await modChannel.setParent(Category.id, {
          reason: "Set The Category of ModMail..."
        })
      }

      await modChannel.createOverwrite(sime.user.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGES: true,
        MANAGE_CHANNELS: true,
      })

      if (Role !== 'No Support Role') await modChannel.updateOverwrite(Role.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGES: true,
      })

      await modChannel.createOverwrite(message.author.id, {
        VIEW_CHANNEL: true,
        SEND_MESSAGES: true,
        READ_MESSAGES: true
      })

      const everyone = guild.roles.everyone;

      await modChannel.updateOverwrite(everyone.id, {
        VIEW_CHANNEL: false,
        SEND_MESSAGES: false,
        READ_MESSAGES: false
      })

      modChannel.send(`||${Role}|| **${message.author.tag}** created a modmail. Remember, use the \`${config.prefix}close\` to close the thread`)

      const channelCollector = await modChannel.createMessageCollector((m) => !m.author.bot)
      const dmChannelCollector = await message.author.dmChannel.createMessageCollector((m) => !m.author.bot)
      channelCollector.on('collect', async m => {
        if (m.content.toLowerCase().startsWith(`${config.prefix}close`)) {
          modChannel.send(`Thread will be closed after 5 second...`)
          message.author.send(`Thread will be closed after 5 second...`)
          setTimeout(async function() {
            channelCollector.stop('done');
            dmChannelCollector.stop('done')
            await db.delete(`modmail_${message.author.id}`)
            modChannel.delete(`Thread Closed by ${m.author.tag}`)
          }, 5000)
        }
        m.channel.send(new Discord.MessageEmbed().setTitle(`Message Sent`).setColor("GREEN").setDescription(m.content).setThumbnail(guild.iconURL({ dynamic: true })))
        message.author.send(new Discord.MessageEmbed().setTitle(`Message Received`).setColor("ORANGE").setDescription(m.content).setThumbnail(guild.iconURL({ dynamic: true })))
      })
      dmChannelCollector.on('collect', async m => {
        message.author.send(new Discord.MessageEmbed().setTitle(`Message Sent`).setColor("GREEN").setDescription(m.content).setThumbnail(guild.iconURL({ dynamic: true })))
        modChannel.send(new Discord.MessageEmbed().setTitle(`Message Received`).setColor("ORANGE").setDescription(m.content).setThumbnail(guild.iconURL({ dynamic: true })))
      })

    }
  }
})

/* Blacklisted Word Event */
sime.on('message', async (message) => {
  if (message.channel.type == 'dm') return;
  const currentWords = await sime.mongo.get(`blacklistedWord_${message.guild.id}`)
  let blacklist = true
  if (!currentWords) return;
  if (currentWords.length == 0) return sime.mongo.delete(`blacklistedWord_${message.guild.id}`)
  let haveBlacklistBefore = 0
  const splittedMsgs = message.content.split(' ')
  await Promise.all(
    splittedMsgs.map(async (m) => {
      if (!(await sime.mongo.get(`blacklistedWord_${message.guild.id}`)).includes(m)) {
        if (haveBlacklistBefore == 0) {
          blacklist = false
        } else if (haveBlacklistBefore >= 1) {
          blacklist = true
        }
      } else {
        blacklist = true
        haveBlacklistBefore = 1
      }
    })
  )
  if (await sime.mongo.has(`blacklistWordPermission_${message.guild.id}`)) {
    var perms = await sime.mongo.get(`blacklistWordPermission_${message.guild.id}`)
    if (!(permsList).includes(perms.toUpperCase())) {
      await sime.mongo.set(`blacklistWordPermission_${message.guild.id}`, "ADMINISTRATOR")
      perms = await sime.mongo.get(`blacklistWordPermission_${message.guild.id}`)
    }
    console.log(perms)
    if (message.member.permissions.has(perms.toUpperCase())) {
      blacklist = false
    }
  }
  const data = await autoModeration.findOne({ Guild: message.guild.id })
  if (data) {
    if (data.Channel) {
      data.Channel.map(async (c) => {
        const ch = await message.guild.channels.cache.find(channel => channel.id == c)
        console.log(ch)
        if (!ch) {
          const newChannel = data.Channel.filter(chh => chh !== c)
          data.Channel = newChannel
          data.save()
        } else {
          if (ch == message.channel) {
            blacklist = false
          }
        }
      })
    }
    if (data.Role) {
      data.Role.map(async (r) => {
        const role = await message.guild.roles.cache.find(rol => rol.id == r)
        if (!role) {
          const newRole = data.Role.filter(chh => chh !== r)
          data.Role = newRole
          data.save()
        } else {
          if (message.member.roles.cache.has(role.id)) {
            blacklist = false
          } else {

          }
        }
      })
    }
  }
  const action = await sime.mongo.get(`blacklistWordAction_${message.guild.id}`) || "delete";
  if (blacklist == false) return;
  const punish = sime.punishid(10);
  if (action == 'delete') {
    let msg = await message.channel.send(`🔨 Hey ${message.author}, Your message **${message.id}** has been deleted because it includes Filtered Words`)
    setTimeout(async function() {
      if (await message.channel.messages.fetch(msg.id) == true) {
        await msg.delete()
      }
    }, 5000)
    message.delete()
  } else if (action == 'ban') {
    let msg = await message.channel.send(`🔨 Hey ${message.author}, Your message **${message.id}** includes Filtered Words. You will be banned in 5 seconds`)
    message.delete()
    var banned = false
    setTimeout(async function() {
      try {
        message.member.ban({
          reason: "Filtered Words"
        })
        banned = true
      } catch (err) {
        banned = false
        message.channel.send(`🔨 I can't ban **${message.author.tag}**`)

      }
      if (banned == false) return;
      message.channel.send(`🔨 I have banned **${message.author.tag}**`)
      if (await message.channel.messages.fetch(msg.id) == true) {
        await msg.delete()
      }
    }, 5000)
  } else if (action == 'kick') {
    let msg = await message.channel.send(`🔨 Hey ${message.author}, Your message **${message.id}** includes Filtered Words. You will be kicked in 5 seconds`).then(msg => msg.delete({ timeout: 5000 }))
    message.delete()
    var banned = false
    setTimeout(async function() {
      try {
        message.member.kick("Filtered Words")
        banned = true
      } catch (err) {
        banned = false
        message.channel.send(`🔨 I can't kick **${message.author.tag}**`)

      }
      if (banned == false) return;
      message.channel.send(`🔨 I have kicked **${message.author.tag}**`)
      if (await message.channel.messages.fetch(msg.id) == true) {
        await msg.delete()
      }
    }, 5000)
  } else if (action == 'mute') {
    let msg = await message.channel.send(`🔨 Hey ${message.author}, Your message **${message.id}** includes Filtered Words. You will be muted in 5 seconds`).then(msg => msg.delete({ timeout: 5000 }))
    message.delete()
    var banned = false
    setTimeout(async function() {
      const Data = await muteRoleSchema.findOne({ Guild: message.guild.id })
      if (!Data || !message.guild.roles.cache.find(r => r.id == Data.Role)) return message.channel.send(`🔨 I can't find muted role`)
      const muteRole = await message.guild.roles.cache.find(r => r.id == Data.Role)
      try {
        message.member.roles.add(muteRole.id, `Filtered Words`)
        new punishDatabase({
          Guild: message.guild.id,
          ID: punish,
          User: message.member.id,
          Moderator: sime.user.id,
          Reason: "Filtered Words",
          Type: "Mute",
          At: moment.utc(Date.now()).format("MM/DD/YYYY")
        }).save()
        memberRoleSchema.findOne({ Guild: message.guild.id }, async (err, data) => {
          let roleMember;
          if (!data) {
            roleMember = 'null'
          } else if (data) {
            roleMember = await message.guild.roles.cache.get(data.Role)
            if (!roleMember) roleMember = 'null';
          }
          if (roleMember !== 'null') {
            if (message.member.roles.cache.get(roleMember.id)) {
              message.member.roles.remove(roleMember)
            }
          }
        })
        banned = true
      } catch (err) {
        banned = false
        message.channel.send(`🔨 I can't mute **${message.author.tag}**`)

      }
      if (banned == false) return;
      message.channel.send(`🔨 I have muted **${message.author.tag}**`)
      if (await message.channel.messages.fetch(msg.id) == true) {
        await msg.delete()
      }
    }, 5000)
  } else if (action == 'unmute') {
    let msg = await message.channel.send(`🔨 Hey ${message.author}, Your message **${message.id}** includes Filtered Words. You will be unmuted in 5 seconds`).then(msg => msg.delete({ timeout: 5000 }))
    message.delete()
    var banned = false
    setTimeout(async function() {
      const data = await muteRoleSchema.findOne({ Guild: message.guild.id })
      if (!data || !message.guild.roles.cache.find(r => r.id == Data.Role)) return message.channel.send(`🔨 I can't find muted role`)
      const muteRole = await message.guild.roles.cache.find(r => r.id == Data.Role)
      try {
        message.member.roles.remove(muteRole.id, `Filtered Words`)
        punishDatabase.find({ Guild: message.guild.id, User: member.id }, async (err, data) => {
          if (data) {
            data.map((d) => d.delete())
          }
        })
        banned = true
      } catch (err) {
        banned = false
        message.channel.send(`🔨 I can't unmute **${message.author.tag}**`)

      }
      if (banned == false) return;
      message.channel.send(`🔨 I have unmuted **${message.author.tag}**`)
      if (await message.channel.messages.fetch(msg.id) == true) {
        await msg.delete()
      }
    }, 5000)
  } else if (action == 'warn') {
    let msg = await message.channel.send(`🔨 Hey ${message.author}, Your message **${message.id}** includes Filtered Words. You will be warned in 5 seconds`)
    message.delete()
    var banned = false
    setTimeout(async function() {
      try {
        new punishDatabase({
          Guild: message.guild.id,
          ID: punish,
          User: message.member.user.id,
          Moderator: sime.user.id,
          Reason: "Filtered Words",
          Type: 'Warn',
          At: moment.utc(Date.now()).format("MM/DD/YYYY")
        }).save()
        banned = true
      } catch (err) {
        banned = false
        message.channel.send(`🔨 I can't warn **${message.author.tag}**`)

      }
      if (banned == false) return;
      message.channel.send(`🔨 I have warned **${message.author.tag}**`)
      if (await message.channel.messages.fetch(msg.id) == true) {
        await msg.delete()
      }
    }, 5000)
  }
})
/* Snipe Event */
sime.on('messageDelete', async (message) => {
  if (!message.guild || message.channel.type == 'dm') return
  let snipes = sime.snipes.get(message.channel.id) || []
  if (snipes.length > 5) snipes = snipes.slice(0, 4)
  if (message.attachments.size >= 1) {
    snipes.unshift({
      msg: message,
      image: message.attachments.first().url,
      time: Date.now()
    })
  } else if (message.attachments.size == 0) {
    snipes.unshift({
      msg: message,
      image: null,
      time: Date.now()
    })
  }

  await sime.snipes.set(message.channel.id, snipes)
})

/* Anti Make Changes Event */
sime.on('channelCreate', async (channel) => {
  const da = await sime.mongo.get(`antiMakeChanges_${channel.guild.id}`) || false
  if(da == false) return;
  channel.guild.fetchAuditLogs()
    .then(async (audit) => {
      const member = await channel.guild.members.cache.get(audit.entries.first().executor.id)
      if (!member) return channel.delete(`I can't define who created this channel. Auto deleting...`)
      if(member.id == sime.user.id) return
      const Data = await authorizationRoles.findOne({ Guild: channel.guild.id })
      if(Data) {
      if (Data.Role) {
      Data.Role.map(async (r) => {
        const role = await channel.guild.roles.cache.find(rol => rol.id == r)
        if (!role) {
          const newRole = Data.Role.filter(chh => chh !== r)
          Data.Role = newRole
          Data.save()
        } else {
          if (member.roles.cache.get(role.id)) {
            if(await sime.mongo.has(`antiMakeChangesWhitelisted_${member.id}_${channel.guild.id}`)) {
            } else {
              await sime.mongo.set(`antiMakeChangesWhitelisted_${member.id}_${channel.guild.id}`, false)
              }
          } else {

          }
        }
      })
    }
      }
  const Data12 = await sime.mongo.get(`antiMakeChangesWhitelisted_${member.id}_${channel.guild.id}`) || true
  if(Data12 == true) {
    if(await sime.mongo.has(`antiMakeChangesWhitelisted_${member.id}_${channel.guild.id}`)) {
      await sime.mongo.delete(`antiMakeChangesWhitelisted_${member.id}_${channel.guild.id}`)
    }
    channel.delete(`Anti Make Changes - ${member.user.id} is not allowed to make changes`)
    member.user.send(new Discord.MessageEmbed().setTitle(`Anti Make Changes`).setDescription(`You can't create a channel because you don't have Authorization Role.`).setColor("RED"))
  } else if(Data12 == false) {
    if(await sime.mongo.has(`antiMakeChangesWhitelisted_${member.id}_${channel.guild.id}`)) {
      await sime.mongo.delete(`antiMakeChangesWhitelisted_${member.id}_${channel.guild.id}`)
    }
  }
    })
})

/* Counting Event */
sime.on('message', async(message) => {
  if(!message.guild) return
  const ServerData = await server_counting.findOne({ Guild: message.guild.id })
  const UserData = await user_counting.findOne({ Guild: message.guild.id, Member: message.member.id })
  if(!ServerData || message.channel.id !== ServerData.Channel) return;
  if(parseInt(message.content) !== ServerData.Number) return message.delete()
  if(UserData) {
    UserData.Number++;
    UserData.save()
  } else {
    new user_counting({
      Guild: message.guild.id,
      Member: message.member.id,
      Number: 1
    }).save()
  }
  ServerData.Number++;
  ServerData.save()
})