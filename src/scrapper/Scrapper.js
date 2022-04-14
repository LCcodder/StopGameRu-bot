const axios = require('axios');
    cheerio = require('cheerio');
    config = require('../bot_config.json')
class KeyWord {
    constructor (keywords) {
        this.keyWords = keywords
    }

    // default: 5, 12, 40, 100
    // callback: 12, 20, 150, 150
    consensusEnum (maxArrayLength, maxWordsLength, maxSumOfSymbols, normaliseValue) {
        let keyWord = new KeyWord(this.keyWords)
        let wordsArray = keyWord.getKeywords()
        // maximum objects in array exeption
        if (wordsArray.length > maxArrayLength) return "Consensus error";
        let sumOfSymbols = 0
        for (let i = 0; i < wordsArray.length; i++) {
            // maximum symbols in 1 object exeption
            if(wordsArray[i].length > maxWordsLength) return "Consensus error";
            sumOfSymbols += wordsArray[i].length
        }
        // maximum symbols total in array exeption
        if (sumOfSymbols > maxSumOfSymbols) return "Consensus error";
        return parseInt(2.3 / sumOfSymbols * normaliseValue)
    }

    getKeywords () {
        
        let keywords = this.keyWords
        // checking keywords for emptiness
        switch(keywords) {
            case undefined: 
                return []
            default:
                break
         }
        let keyWordsArray = []
        let eachKeyword = ""
        // making keywords array by matching special symbol
        for (let i = 0; i < keywords.length; i++) {
        
            if (keywords[i] != ";") {
                eachKeyword += keywords[i]
            } 
            if (keywords[i] == ";" || i == keywords.length - 1) {
                keyWordsArray.push(eachKeyword)
                eachKeyword = ""
            }
        
        }
        
        return keyWordsArray
    }

    
}

class Scrapper {
    constructor (url, boolCallbackKeyWords) {
        this.mainURL = url
        this.boolCallbackKeyWords = boolCallbackKeyWords
           
        if(this.boolCallbackKeyWords) {

            // getting keywords from json
            this.callbackKeyWords = config.callback.callbackKeyWords

            // checking keywords
            switch(this.callbackKeyWords) {
                case "none":
                    this.callbackKeyWords = null
                case "":
                    this.callbackKeyWords = null
                case undefined:
                    this.callbackKeyWords = null
                default:
                    this.callbackKeyWords == config.callback.callbackKeyWords
            }
        }
        
        
    }
    
    static #lengthShortening(content) {
        // symbols count sort
        if (content.length >= 2000) {
                
            content = content.slice(0, 2000)
            
            for (let i = 2000; i <= content.length; i = i - 1) {
                content = content.slice(0, i)
                if (content.slice(-1) == ';') return content;
            }
            
        }
        return content
    }

    async parseAsync (message, [fromPage, toPage], keywords) {
        // debug
        var time = performance.now();

        let consensusExeption
        let keywordsArray = []

        
        if (this.boolCallbackKeyWords == true) {
            keywords = this.callbackKeyWords
            // checking if keywords exists with 'callback'
            if (keywords != null) {
                let keyword = new KeyWord(keywords)

                // getting consensus status with 'callback' params
                consensusExeption = keyword.consensusEnum(12, 20, 150, 120)
                console.log(consensusExeption + " pages will be scrapped")

                switch (typeof(consensusExeption)) {
                    case "string":
                        message.channel.send(consensusExeption)
                        return
                    case "number":
                        
                        fromPage = 1,
                        // assigns consensus status when passing validation
                        toPage = consensusExeption
                        // converte keywords string to array
                        keywordsArray = keyword.getKeywords()
                        break
                    default:
                        message.channel.send("Unpredictable consensus status")
                        return
                }
            } else {
                // assings empty array if keywords does not exists
                keywordsArray = []
                fromPage = 1
                toPage = 3
            }
        }

        // checking if keywords exists with 'no-callback'
        if ( keywords != undefined && this.boolCallbackKeyWords == false) {
            
            let keyword = new KeyWord(keywords)
            // getting consensus status with 'no-callback' params
            consensusExeption = keyword.consensusEnum(5, 12, 40, 100)
            console.log(consensusExeption)
            // switching status
            switch (typeof(consensusExeption)) {
                case "string":
                    message.channel.send(consensusExeption)
                    return
                case "number":
                    fromPage = 1,
                    // assigns consensus status when passing validation
                    toPage = consensusExeption
                    // converte keywords string to array
                    keywordsArray = keyword.getKeywords()
                    break
                default:
                    // this never gonna happened )))
                    message.channel.send("Unpredictable consensus status")
                    return
            }
        }

        let src = this.mainURL
        
        // async getting main source 
        const getHTML = async (url) => {
            const {data} = await axios.get(url);
            return cheerio.load(data);
        };
        const $ = await getHTML(src);

        // cutting sourse URL for pagenation
        let pagelessSrc = src.slice(0, 30)
        let result = ""
        const cuttedSrc = src.slice(0, 19)

        // getting pagenation params
        let i = fromPage
        const pages = toPage

        // speed up code with regular construction
        while(result.length < 2000) {
            parser: for (i; i <= pages; i++) {

                // changing URL for pagenation
                let newSrc = pagelessSrc + i.toString()
            
                // async getting main source Promise 
                const selector = await getHTML(newSrc)
            
                // matching
                selector(".caption").each((i, el) => {
                
                    // caption
                    let currentCaption = selector(el).find('a').text()
                    // url
                    let captionURL = cuttedSrc + selector(el).find('a').attr('href')
                
                    // keyword status checking
                    if (keywordsArray[0] == undefined) {
                        
                        result += currentCaption.slice(0, -1) + ";\n"
                        result += captionURL + "\n"      
                    }
                    if ( keywordsArray[0] != undefined) {
                        // bruteforce keyword array (fuck binary tree, it's 2 language brainfuck)
                        for (let y = 0; y < keywordsArray.length; y++) {
                            // matching
                            if (currentCaption.toLowerCase().includes(keywordsArray[y])) {
                                result += currentCaption.slice(0, -1) + ";\n"
                                result += captionURL + "\n"
                            }
                        }    
                    } 
                }) 
            }
            // break if for cycle ends
            break
        }


        // making less or same than 2000 symbols 
        result = Scrapper.#lengthShortening(result)

        // errors exeption
        switch (result) {
            case '':
                result = "Nothing matched, try another time"
                break
            case undefined:
                result = "An error was occurred"
                break
            case null:
                result = "An error was occurred"
                break
            default:
                result = result
        }

        // debug
        time = performance.now() - time;
        console.log('lead time = ' + time  + " ms");
        
        // sending result via discord api
        try {
            message.channel.send(result)
        } catch (e) {
            console.log(e)
        }
        
        
    }

}

module.exports = Scrapper