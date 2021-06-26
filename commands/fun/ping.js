module.exports = {
    name: 'ping',
    description: "Get Bot's Latency",
    example: `ping`,
    categories: 'Fun',
}

module.exports.run = (sime, message, args) => {
    message.lineReply(`🏓 Pong ! \`${sime.ws.ping} ms\``)
}