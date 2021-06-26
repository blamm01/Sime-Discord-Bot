const schema = require('../../models/ticket');
const schema1 = require('../../models/ticket-choices');
const {
    MessageEmbed
} = require('discord.js')

module.exports = {
    name: 'ticket-choices',
    description: "Settings the ticket choices",
    example: `ticket-choices add 😄 Apply`,
    categories: 'Ticket',
    usage: '<Add/Delete/List>',
    userPerms: ["ADMINISTRATOR"]
}

module.exports.run = async (sime, message, args) => {
    await schema.findOne({
        Guild: message.guild.id
    }, async (err, Data) => {
        const query = args[0]
        if (!query || !(["add", "remove", "view"]).includes(query.toLowerCase())) return message.lineReply(`You need provide option first. Option: Add | Remove | View`);

        function isCustomEmoji(emoji) {
            return emoji.split(":").length == 1 ? false : true
        }
        if (!Data) return message.lineReply(`This server is not setup correctly. Use \`ticket-setting\` command before using this command`)
        if (query.toLowerCase() == 'add') {
            const content = args.slice(2).join(" ")
            let reaction = args[1]
            if (!args[1]) return message.lineReply(`You need provide emoji.`)
            if (!content) return message.lineReply(`You need provide content.`)
            if (isCustomEmoji(reaction)) {
                reaction = message.guild.emojis.cache.find(e => e.name == args[1]) || message.guild.emojis.cache.find(e => e.id == args[1])
            }
            if (!reaction) return message.lineReply(`You need provide valid emoji. If the reaction is custom, so please provide emoji name`);
            try {
                message.react(reaction)
            } catch (e) {
                return message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${e}\`\`\``).setColor("RED"))
            }
            await schema1.findOne({
                Guild: message.guild.id,
                Reaction: reaction
            }, async (err, data) => {
                if (data) {
                    data.delete()
                }
            })
            new schema1({
                Guild: message.guild.id,
                Reaction: reaction,
                Content: content
            }).save()
            message.lineReply(`Added **${reaction}** as option **${content}**`)
        } else if (query.toLowerCase() == 'remove') {
            let reaction = args[1]
            if (!args[1]) return message.lineReply(`You need provide emoji.`)
            if (isCustomEmoji(reaction)) {
                reaction = message.guild.emojis.cache.find(e => e.name == args[1]) || message.guild.emojis.cache.find(e => e.id == args[1])
            }
            if (!reaction) return message.lineReply(`You need provide valid emoji. If the reaction is custom, so please provide emoji name`);
            try {
                message.react(reaction)
            } catch (e) {
                return message.lineReply(new MessageEmbed().setTitle(`An error occured`).setDescription(`\`\`\`${e}\`\`\``).setColor("RED"))
            }
            await schema1.findOne({
                Guild: message.guild.id,
                Reaction: reaction
            }, async (err, data) => {
                if (!data) return message.lineReply(`There is no option is **${reaction}**`)
                data.delete()
                message.lineReply(`Removed **${reaction}** as option **${content}**`)
            })
        } else if (query.toLowerCase() == 'view') {
            await schema1.find({
                Guild: message.guild.id
            }, async (err, data) => {
                let amount = 0
                data.map((d) => amount = amount + 1)
                if (amount == 0) return message.lineReply(`There is no option for this server`)
                amount = 0
                const embed = new MessageEmbed()
                    .setTitle(`Ticket Options`)
                    .setColor("RANDOM")
                data.map((d) => {
                    amount = amount + 1;
                    embed.addField(`${amount}. ${d.Reaction}`, d.Content, true)
                })
                message.lineReply(embed)
            })
        }
    })
}