const schema = require('../../models/server-counting')
const schema1 = require('../../models/user-counting')
const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'count-leaderboard',
    description: "Counting Leaderboard :)",
    categories: "Counting",
    example: 'count-leaderboard',
    aliases: ['counting-leaderboard','counting-lb','count-lb']
}

module.exports.run = async(sime, message, args) => {
  const Data = await schema.findOne({ Guild: message.guild.id })
  if(!Data) return message.lineReply(`This server is not setup Counting Module`)
  const data = await schema1.find({ Guild: message.guild.id })
  const sort = data.sort((a, b) => b.Number - a.Number);

  let i = 1;

  if(data.length > 10 ){
                const chunks = twochunk(sort, 10);
                const arry = [];

                for(chunk of chunks) {
                    const chunking = chunk.map((v) => `**${i++}.** **<@${v.Member}>** | Counted ${v.Number}`).join('\n\n');
                    arry.push(
                        new MessageEmbed()
                        .setTitle('Leaderboard in ' + message.guild.name).setColor('RANDOM').setThumbnail(message.guild.iconURL({ dynamic: true }))
                        .setDescription(chunking)
                    )
                }
                ReactionPages(message, arry, true)
  }  else {
                const mapping = sort.map((v) => `**${i++}.** **<@${v.Member}>** | Counted ${v.Number}`).join('\n\n')
                message.channel.send(
                    new MessageEmbed()
                        .setTitle(`Counting Leaderboard`).setThumbnail(message.guild.iconURL({ dynamic: true })).setColor('RANDOM')
                        .setDescription(mapping)
                )
            }
}

function twochunk(arr, size) {
    var array = [];
    for(var i = 0; i < arr.length; i += size) {
        array.push(arr.slice(i, i+size));
    }
    return array;
}