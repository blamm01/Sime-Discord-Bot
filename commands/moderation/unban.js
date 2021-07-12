const ms = require('ms')
const logging = require('../../models/logging.js')
const { WebhookClient, MessageEmbed } = require('discord.js')
module.exports = {
    name: 'unban',
    usage: '<Member (ID, Username, Username#Tag)>',
    description: "Unbans a member",
    example: `unban 842723556998512690`,
    botPerms: ['BAN_MEMBERS'],
    userPerms: ['BAN_MEMBERS'],
    categories: 'Moderation',
    modRole: true
}

module.exports.run = async(sime, message, args) => {
    const user = args.join(' ') || args[0];
    if(!user) return message.lineReply("You need to provide User ID to unban")

    const bans = await message.guild.fetchBans();

    if(!bans || bans.size == 0) return message.lineReply("There is no member was banned before");

    let User = bans.find(b => b.user.id == user) || bans.find(b => b.user.tag == user) || bans.find(b => b.user.username == user);

    if(!User) return message.lineReply(`I can't find any member called **${user}**`);
    
    message.guild.members.unban(User.user)
      .then(() => {
        message.lineReply(`🔨 Unbanned **${User.user.tag}**`)
      })
      .catch(err => {
        return message.channel.send(new MessageEmbed().setTitle("An error occured").setFooter("An error occured when I'm trying to unban that user").setDescription(`\`\`\`${err}\`\`\``))
      })

    try {
      User.user.send(`✅ You have been unbanned in **${message.guild.name}**`)
    } catch(e) {
      console.log(`I can't DM ${User.user.id}`)
    }

    const data = await logging.findOne({ Guild: message.guild.id })
    if(!data || !data.Channel || !data.WebhookID || !data.WebhookToken) return;
    const webhookclient = new WebhookClient(
    	data.WebhookID,
        data.WebhookToken
    )
    webhookclient.send({
        embeds: [{
            title: "Unban",
            description: `**${message.author.tag}** unbanned **${User.user.tag}**`,
            color: "GREEN",
        }]
    })
    	.catch(err => { console.log(err); data.delete() })
}