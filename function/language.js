async function lang(sime, guild, channel) {
  let lang1 = await sime.mongo.get(`language_${guild.id}`)
  if(!lang1) {
    await sime.mongo.set(`language_${guild.id}`, `en`)
    return channel.send("**[BETA] Automatically reset Server's Language to English. Please run `language` command if you want to change Server's Language**")
  }
  lang1 = await sime.mongo.get(`language_${guild.id}`)
  if(lang1 !== "en" && lang1 !== "vi") {
    await sime.mongo.set(`language_${guild.id}`, `en`)
    return channel.send("**[BETA] Automatically reset Server's Language to English. Please run `language` command if you want to change Server's Language**")
  }
  lang1 = await sime.mongo.get(`language_${guild.id}`)
  return lang1
}

module.exports = { lang }