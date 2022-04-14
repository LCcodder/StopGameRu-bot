// importing
const scrapperConfig = require('./scrapper_config.json'),
    botConfig = require('./bot_config.json')
    Discord = require('discord.js'),
    Scrapper = require('./Scrapper')

// converte to miliseconds function
const getTime = (timeInHours) => {
    if (timeInHours <= 0 || typeof(timeInHours) != 'number') {
        return  1 * 3600000
    } 
    if (timeInHours > 24 && typeof(timeInHours) == 'number') {
        return 24 * 3600000
    }
    return timeInHours * 3600000
}

// getting sending time
const sendingTime = getTime(botConfig.callback.callbackRepeat)
const mainURL = "https://stopgame.ru/news/all/p1"

// creating parser class with properties from .json file
const Parser = new Scrapper(mainURL, true)


// creating discord class
botConfig.cfg.intents = new Discord.Intents(botConfig.cfg.intents)
const bot = new Discord.Client(botConfig.cfg)
bot.login(botConfig.token);


// function for setting response time for server quotes
const delayResponse = ms => {
    return new Promise(r => setTimeout(() => r(), ms));
}


// ready message in console
bot.on('ready', (client) => {
    console.log('Bot working...')
    
})

bot.once('messageCreate', (message) => {
    // loop cycle with time interval
    message.channel.send("Starting callback...")
    setInterval(() => Parser.parseAsync(message, []), sendingTime)    
    
})