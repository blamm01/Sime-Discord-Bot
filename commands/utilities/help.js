const { MessageEmbed } = require('discord.js')
const { readdirSync } = require('fs')
const rp = require("reconlx").ReactionPages;

module.exports = {
    name: 'help',
    description: "Shows all commands of the bot",
    example: 'help ban',
    usage: '[Command]',
    botPerms: ["EMBED_LINKS"],
    userPerms: [],
    categories: 'Utilities',
}

module.exports.run = async(sime, message, args) => {
    const prefix = await sime.prefix(message)
    let arg = args.join(" ").toLowerCase();
    if(!args[0]) {
        let categories = [];
        readdirSync("./commands/").forEach((dir) => {
            const commands = readdirSync(`./commands/${dir}/`).filter((file) =>
              file.endsWith(".js")
            );
    
            const cmds = commands.map((command) => {
              let file = require(`../../commands/${dir}/${command}`);
    
              if (!file.name) return "No Command";
    
              let name = file.name.replace(".js", "");
    
              return `\`${name}\``;
            });
    
            let data = new Object();
    
            data = {
              name: dir,
              value: `${prefix}help ${dir}`,
              inline: true
            };
    
            categories.push(data);
          });
        message.lineReply(new MessageEmbed()
            .setTitle(`Categories`)
            .addFields(categories)
            .setFooter(`All Commands: ${sime.commands.size}`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true} ))
            .setColor("RANDOM")
        )
    } else if(arg) {
        if(arg && sime.categories.some(c => arg === c)) {
        let cmds = [];
        readdirSync(`./commands/${arg}`).filter(f => f.endsWith('.js')).forEach((file) => {
            let command = require(`../../commands/${arg}/${file}`);
            cmds.push(command);
        })
        let Emb = '';
        cmds.forEach((cmd) => Emb+=`**${cmd.name}**: ${cmd.description}\n`)
        message.lineReply(new MessageEmbed()
          .setTitle(`Category: ${arg}`)
          .setDescription(Emb)
          .setFooter(`All Commands: ${sime.commands.size}`)
          .setThumbnail(message.author.displayAvatarURL({ dynamic: true} ))
          .setColor("RANDOM")
        )
    } else if(arg && sime.commands.get(arg) || sime.aliases.get(arg)) {
    const cmd = sime.commands.get(args.join(" "))
    message.lineReply(new MessageEmbed()
            .setTitle(`Command Information`)
            .addField(`Name`, cmd.name)
            .addField(`Description`, cmd.description || "No Description")
            .addField(`Usage`, `${cmd.usage}` || "No Usage")
            .addField(`Aliases`,  cmd.aliases
            ? `\`${cmd.aliases.join("` `")}\``
            : "No Aliases")
            .addField(`Example`, prefix + cmd.example || "No Example")
            .addField(`User Permissions | Bot Permissions`, `\`${cmd.userPerms
                ? `\`${cmd.userPerms.join("` `")}\``
                : "No User Permissions"}\`` + " | " + `\`${cmd.botPerms
                    ? `\`${cmd.botPerms.join("` `")}\``
                    : "No Bot Permissions"}\``)
            .addField(`Categories`, cmd.categories)
            .setFooter(`All Commands: ${sime.commands.size}`)
            .setThumbnail(message.author.displayAvatarURL({ dynamic: true} ))
            .setColor("RANDOM")
    )
} else {
  message.lineReply(new MessageEmbed()
    .setTitle("Error")
    .setFooter(`All Commands: ${sime.commands.size}`)
    .setThumbnail(message.author.displayAvatarURL({ dynamic: true} ))
    .setColor("RED")
    .setDescription(`There is no command/category called **${arg}**. Use \`help\` command without any arguements`)
  )
}
    }
}