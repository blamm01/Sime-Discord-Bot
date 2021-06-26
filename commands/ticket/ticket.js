const schema = require('../../models/ticket');
const schema1 = require('../../models/ticket-choices');
const {
    MessageEmbed,
    MessageAttachment
} = require('discord.js')
const fs = require('fs')

module.exports = {
    name: 'ticket',
    description: "Create a ticket",
    example: `ticket`,
    categories: 'Ticket',
    botPerms: ["MANAGE_CHANNELS"]
}

module.exports.run = async (sime, message, args) => {
    const p = await sime.prefix(message)
    schema1.find({
        Guild: message.guild.id
    }, async(err, data) => {
    schema.findOne({
        Guild: message.guild.id
    }, async (err, Data) => {
        if (!Data || !Data.Role || !Data.Category || !message.guild.roles.cache.find(r => r.id == Data.Role) || !message.guild.channels.cache.find(c => c.id == Data.Category && c.type == 'category')) return message.lineReply(`Sorry, this server is not setup ticket module correctly. Ask Server Administrator to setup ticket using \`ticket-setting\` and \`ticket-choices\` first.`);
        let amount = 0
        data.map((d) => {
            if(d.emoji !== "Not Set" ) amount = amount + 1
        });
        if (amount == 0) return message.lineReply(`Make sure there is at least 1 choice in this server`);
        const supportRole = await message.guild.roles.cache.find(r => r.id == Data.Role)
        const embed = new MessageEmbed()
            .setTitle(`Choices Selection`)
            .setThumbnail(message.author.displayAvatarURL({
                dynamic: true
            }))
            .setTimestamp()
            .setColor("RANDOM")
            .setFooter(`You have 1 minute`)
        amount = 0
        data.map((d) => {
            amount = amount + 1
            embed.addField(`${amount}.`, `**${d.Reaction}** for **${d.Content}**`)
        })
        const msg = await message.lineReply(embed)
        data.map(async (d) => {
            try {
                await msg.react(d.Reaction)
            } catch (err) {
                message.lineReply(new MessageEmbed().setTitle(`An error occured`).setFooter(`An error occured when I'm trying to add reaction`).setDescription(`\`\`\`${err}\`\`\``).setColor("RED"))
            }
        })
        let type;
        const reactionCollector = msg.createReactionCollector((reaction, user) => user.id == message.author.id, { time: 60000 });
        reactionCollector.on('collect', async(reaction) => {
            type = await schema1.findOne({ Guild: message.guild.id, Reaction: reaction.emoji })
            await msg.delete()
            reactionCollector.stop('done')
        })
        reactionCollector.on('end', async(collected, reason) => {
            if(reason.toLowerCase() == 'time') {
                return message.lineReply(`You didn't react to emoji. Cancelling`)
            } else {
                const role = message.guild.roles.cache.get(data.Role) || "No Support Role"
                const channel = await message.guild.channels.create(`ticket-${message.author.id}`, {
                    type: 'text',
                    topic: `Ticket for ${message.author.tag} (${message.author.id}) with the support topic: ${type.Content}`,
                    nsfw: false,
                    parent: Data.Category,
                    reason: `A ticket is created to support ${message.author.tag} with support topic ${type.Content}`
                })
                channel.createOverwrite(sime.user.id, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    MANAGE_PERMISSIONS: true,
                    MANAGE_CHANNELS: true,
                    READ_MESSAGES: true
                })
                channel.createOverwrite(supportRole.id, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    READ_MESSAGES: true
                })
                channel.createOverwrite(message.author.id, {
                    VIEW_CHANNEL: true,
                    SEND_MESSAGES: true,
                    READ_MESSAGES: true
                })
                channel.createOverwrite(message.guild.id, {
                    VIEW_CHANNEL: false,
                    SEND_MESSAGES: false,
                    READ_MESSAGES: false
                })
                channel.send(`Welcome to your ticket ${message.author}. Please be patient, staff will be with you soon. ||${supportRole}||`)
                channel.send(`Here are commands you may need`, new MessageEmbed().setDescription(`\`${p}close\`: Close the ticket\n\`${p}delete\`: Delete the ticket\n\`${p}transcript\`: Get the ticket's transcript`).setColor("ORANGE"))
                const transcript = [];
                const channelCollector = channel.createMessageCollector((m) => !m.bot)
                channelCollector.on('collect', async(m) => {
                    if(m.content.toLowerCase().startsWith(`${p}close`)) {
                        channel.send(`This ticket will be closed in 5 seconds...`)
                        setTimeout(async function() {
                        channel.updateOverwrite(message.author.id, {
                            VIEW_CHANNEL: false,
                            READ_MESSAGES: false,
                            SEND_MESSAGES: null
                        })}, 5000)
                    } else if(m.content.toLowerCase().startsWith(`${p}delete`)) {
                        channelCollector.stop('done');
                        channel.send(`This ticket will be deleted in 5 seconds...`)
                        await fs.writeFileSync(`./Transcript/transcript-${message.guild.id}-${message.author.id}.txt`, transcript.join("\n"));
                        const attachment = new MessageAttachment(fs.createReadStream(`./Transcript/transcript-${message.guild.id}-${message.author.id}.txt`))
                        channel.send(attachment)
                        setTimeout(async() => channel.delete(`Ticket Deleted by ${message.author.tag}`), 5000)
                    } else if(m.content.toLowerCase().startsWith(`${p}transcript`)) {
                        await fs.writeFileSync(`./Transcript/transcript-${message.guild.id}-${message.author.id}.txt`, transcript.join("\n"));
                        const attachment = new MessageAttachment(fs.createReadStream(`./Transcript/transcript-${message.guild.id}-${message.author.id}.txt`))
                        await channel.send(attachment)
                    }
                    transcript.push(`${m.author.tag} : ${m.content}`)
                })
            }
        })
})
    })
}