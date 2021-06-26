const sime = require('../index');
const Discord = require('discord.js');
const express = require('express')
const app = express()
const port = process.env.PORT || 5000
const path = require('path')

module.exports = async(sime) => {
    console.log(`Logged in as ${sime.user.tag}`)
    await sime.user.setActivity(`${sime.guilds.cache.size} servers`)
    await sime.user.setStatus("dnd")
    app.listen(port, () => console.log(`${sime.user.username} 's Website is listening on port ${port}`))
    app.get('/' , (req, res) => {
      res.sendFile(path.join(__dirname, "..", "botPages", "mainPage.html"))
    })
    app.get('/commands' , (req, res) => {
      res.sendFile(path.join(__dirname, "..", "botPages", "404.html"))
    })
    app.get('/premium' , (req, res) => {
      res.sendFile(path.join(__dirname, "..", "botPages", "404.html"))
    })
    app.get('/invite', (req, res) => {
      res.redirect('https://discord.com/oauth2/authorize?client_id=843073453708017716&scope=bot&permissions=470084735')
    })
    app.get('/support', (req, res) => {
      res.redirect('https://discord.gg/wchWg5Aayt')
    })
    app.use(function(req, res) {
  res.status(404).sendFile(path.join(__dirname, "..", "botPages", "404.html"))
})
}