// importing metadata and analytics modules
const { Metadata, Analytics, Logs } = require('./analitycs/Analytics')
    
// importing other modules
const botConfig = require('./bot_config.json')
    Discord = require('discord.js'),
    Scrapper = require('./scrapper/Scrapper'),
    Mailer = require('./analitycs/Mailer'),
    require('dotenv').config()
  

// creating parser class with properties
const mainURL = "https://stopgame.ru/news/all/p1"
const Parser = new Scrapper(mainURL, false)


// setting commands
const botCommandList = [["getfresh", "getkw", "getmetadata"]]
const botCommandsMessage = botConfig.commandsMessage


// creating discord bot class
botConfig.cfg.intents = new Discord.Intents(botConfig.cfg.intents)
const bot = new Discord.Client(botConfig.cfg)
bot.login(botConfig.token);


// initialising metadata class with current time 
let initializedTime = new Date();
let metadata = new Metadata(initializedTime)


// getting maximum metadata object size
const maxUsersMetadataCount = metadata.checkSendingCount(botConfig.mailer.analyticsPersonsCount)


// ready message in console
bot.on('ready', (client) => {
    console.log('Bot working...')
})


// creating metadata of users array
let usersArray = []

bot.on('messageCreate', (message) => {
    

    // checking for message by bot
    if (message.author.bot) return;
    

    // ssending analytics when metadata array reachs specified value
    if (usersArray.length >= maxUsersMetadataCount) {
        try {
            // gets metadata launched time
            let createdTime = metadata.getMetadataStartTime()

            // gets analytics
            let analize = new Analytics(usersArray, createdTime)
            let mailMessage = analize.getTotalAnalitycs()
    
            // sending analytics
            let mail = new Mailer(process.env.PASS, process.env.ADRESS)
            mail.mailSend(mailMessage)
    
            // deleting used objects and variables
            delete analize, mailMessage, mail
            
            // emptying array
            usersArray = []

        } catch (e) {
            console.log(e)
        }
    }


    // grabbing metadata
    if (botCommandList[0].includes(message.content)) {
        let requestedTime = new Date()
        // updating users metadata
        let currentUserData = metadata.getUserData(message.author, requestedTime, message.content)
        usersArray.push(currentUserData)
    }

    

    // checking for keywords message
    if (message.content.toLowerCase().includes(botCommandList[0][1])) { 
        // slicing keywords
        let keyWords = message.content.slice(6).toLowerCase()

        Parser.parseAsync([], keyWords).then((result) => {
            message.channel.send(result)
        })
        return
    }

    if (message.content.toLowerCase().includes(botCommandList[0][2]) && message.author.tag == botConfig.serverAdmin) {
        // sends exact user's logs in this bot
        let userNickname = message.content.slice(12)
        let logs = new Logs(usersArray)
        message.channel.send(logs.getUserLogs(userNickname))
        return
    }

    if (message.content.toLowerCase().includes(botCommandList[0][0])) {
        if (message.content.includes("-")) {
            
            // getting last page
            let pagesTo = message.content.slice(message.content.indexOf("-") + 1)
            // getting first page
            let pagesFrom = message.content.slice(9, message.content.indexOf("-"))

            Parser.parseAsync([pagesFrom, pagesTo]).then((result) => {
                message.channel.send(result)
            })
            return
        }

        // checking for 'no-page' in the end
        if(message.content === 'getfresh') {
           
            Parser.parseAsync([1, 3]).then((result) => {
                message.channel.send(result)
            })
            return
        }


        // checking for page index and setting default values
        let pagesParse = parseInt(message.content.slice(-1), 10)
        Parser.parseAsync([pagesParse, pagesParse]).then((result) => {
            message.channel.send(result)
        })
        return  

    }

    // sending commands list when nothing matches
    message.channel.send(botCommandsMessage)
    
})
