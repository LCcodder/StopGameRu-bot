# **This is a Discord bot based on node.js**

## This bot parses the [stopgame.ru](https://stopgame.ru/) site and sends news about games to the channel
___


To use this bot you need to clone the repository (libraries are already installed), insert your discord bot token in "bot_config.json" file. Next, you need to set the parameters in the "scrapper_config.json" and "mailer_config.json" files:


___
## *How it works*
### Default mode (*Manual command entry mode*)
####  Commands: 
>***1)*** ***'getfresh'*** - sends fresh news (you alse can setup this like ***'getfresh 2'*** or ***'getfresh 5-7'*** and it will sends indicated by you news page)

>***2)*** ***'getkw + your keyword'*** - sends news by your keyword (Example: ***'getkw cyberpunk'***)
>>  You can also set multiple keywords: ***'getkw cyberpunk;xbox;fortnite'***

>***3)*** ***'getmetadata'*** — sends your whole bot logs in on message (You can also view logs for each person: ***'getmetadata nicolexbruce'***) 
>> can use **ONLY** user, which specified in
*"bot_config.json"* file: `"serverAdmin": "mmmmmm#2646",`

### Callback mode
>***1)*** Just sends you a news message, which can be specified with parameters *(scroll below)*
___

## *How to setup?*
### Firstly
+ Clone repository in your directory *(dependences not required)*
+ Set your bot token in *bot_config.json* file: `"token": "OTU4NzQxNzcfdsfdsgfdghjg233454g456gfh4hY"`. You can get it [here](https://discord.com/developers/applications).
+ Set your email credentials in .env file for analytics send (not necessary).
+ Set analytics send addreess in *bot_config.json* file: `"adressTo": "toprobocopid@gmail.com"` (not necessary).
+ Set analytics


### Default mode

> ***1)*** Setup your analytics send (not necessary) in */analytics/mailer_config.json*: `"adress":"toprobocopid@gmail.com",
"analyticsPersonsCount": 20`

> ***2)*** Then just launch **defaultClient.js** and enjoy 
### Callback mode


>***1)*** If you need keywords search you can setup them in *scrapper_config.json* file: `"callbackKeyWords": "cyberpunk",`
>> Or you can setup multiple keywords like: `"callbackKeyWords": "cyberpunk;xbox;playstation",`
>>> Or just set `"none"` of you don't want them

>***2)*** Setup the number of hours after which the message will be sent in same file: `"callbackRepeat": 1`

>***3)*** Launch **callbackClient.js** and wait 

___
## *How to use?*
### Open cloned repository directory and write those comands in console:

#### *For callback client:*
```
node callbackClient.js
```
#### *For default client:*
```
node defaultClient.js
```

___
# Tech specs
## *Build 1.0:*
+ node.js `v16.14.2.`
+ axios `0.26.1`
+ cheerio `1.0.0-rc.10`
+ discord.js `13.6.0`
+ dotenv `16.0.0`
+ express `4.17.3`
+ install `0.13.0`
+ nodemailer `6.7.3` 
+ nodemon `2.0.15`
 
___
# Made with :heart: by [*LCcodder*](https://github.com/LCcodder)
