const weather = require('weather-js')
const discord = require('discord.js')

module.exports = {
    name: 'weather',
    description: "Shows weather information of a city",
    example: `weather Hanoi`,
    categories: 'Fun',
    usage: '<City>',
}

module.exports.run = async(sime, message, args, lang) => {
  if(lang == "en") {
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
  } else if(lang == "vi") {
    const we = args.join(" ")
    if(!we) return message.lineReply(`Bạn phải nhập một địa điểm`)
    weather.find({search: we, degreeType: 'C'}, function (error, result){
        // 'C' can be changed to 'F' for farneheit results
        if(error) return message.channel.send(error);

        if(result === undefined || result.length === 0) return message.channel.send(`Bạn đã nhập một địa điểm không tồn tại`);

        var current = result[0].current;
        var location = result[0].location;

        const weatherinfo = new discord.MessageEmbed()
        .setDescription(`**${current.skytext}**`)
        .setAuthor(`Dự báo thời tiết cho ${current.observationpoint}`)
        .setThumbnail(current.imageUrl)
        .setColor(0x111111)
        .addField('Múi giờ', `UTC${location.timezone}`, true)
        .addField('Loại nhiệt độ', 'Celsius', true)
        .addField('Nhiệt độ', `${current.temperature}°`, true)
        .addField('Gió', current.winddisplay, true)
        .setColor("RANDOM")
        .addField('Cảm thấy như', `${current.feelslike}°`, true)
        .addField('Độ ẩm', `${current.humidity}%`, true)


        message.channel.send(weatherinfo)
        })
  }
    }