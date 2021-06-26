const weather = require('weather-js')
const discord = require('discord.js')

module.exports = {
    name: 'weather',
    description: "Shows weather information of a city",
    example: `weather Hanoi`,
    categories: 'Fun',
    usage: '<City>',
}

module.exports.run = async(sime, message, args) => {
    const we = args.join(" ")
    if(!we) return message.lineReply(`Please specify a location`)
    weather.find({search: we, degreeType: 'C'}, function (error, result){
        // 'C' can be changed to 'F' for farneheit results
        if(error) return message.channel.send(error);

        if(result === undefined || result.length === 0) return message.channel.send(`You specified invalid location`);

        var current = result[0].current;
        var location = result[0].location;

        const weatherinfo = new discord.MessageEmbed()
        .setDescription(`**${current.skytext}**`)
        .setAuthor(`Weather forecast for ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor(0x111111)
        .addField('Timezone', `UTC${location.timezone}`, true)
        .addField('Degree Type', 'Celsius', true)
        .addField('Temperature', `${current.temperature}°`, true)
        .addField('Wind', current.winddisplay, true)
        .setColor("RANDOM")
        .addField('Feels like', `${current.feelslike}°`, true)
        .addField('Humidity', `${current.humidity}%`, true)


        message.channel.send(weatherinfo)
        })
    }