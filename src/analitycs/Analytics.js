class Analytics {
    constructor(totalMetadata, createdTime) {
        this.totalMetadata = totalMetadata
        this.createdTime = createdTime
    }
    getTotalRequests() {
        // returns total requests
        return "Total requests: " + this.totalMetadata.length.toString()
    }
    getAvgCreatedTime () {
        // getting average account created time
        let totalYears = 0
        this.totalMetadata.forEach(element => {
            totalYears += element.accountCreatTime.getFullYear()
        });
        return "Accounts average age: " + parseInt(totalYears / this.totalMetadata.length, 10).toString()
    }
    getAvgRequestsHours () {
        // getting average request time
        let totalHours = 0
        this.totalMetadata.forEach(element => {
            totalHours += element.requestTime.getHours()
        })
        return "Average request submission time: " + parseInt(totalHours / this.totalMetadata.length, 10).toString()
    }
    getAvgCommands () {
        let keywordsCommands = 0
        let defaultCommands = 0
        let metadataToGetRequests = 0

        // getting total commands values
        for (let i = 0; i < this.totalMetadata.length; i++) {
            let currentCommand = this.totalMetadata[i].botCommand
            if (currentCommand.includes('getfresh')) {
                defaultCommands += 1 
            }
            if (currentCommand.includes('getkw')) {
                keywordsCommands += 1
            }
            if (currentCommand.includes('getmetadata')) {
                metadataToGetRequests += 1
            }
        }
        
        // making values in percents
        let keywordsCommandsPercent = parseInt((keywordsCommands + defaultCommands) / 100 * keywordsCommands, 10) 
        let defaultCommandsPercent = parseInt(100 - keywordsCommandsPercent, 10)

        return "Keywords commands: " + keywordsCommandsPercent.toString() + "%\n" + "Default commands: " + defaultCommandsPercent.toString() + "%\n" + "Metadata get requests: " + metadataToGetRequests.toString() + "\n"
    }
    getTotalAnalitycs () {
        // gets global analytics in string for email
        let analise = new Analytics(this.totalMetadata, this.createdTime)
        let result = ""
        result += this.createdTime.toString() + "\n"
        result += analise.getTotalRequests() + "\n"
        result += analise.getAvgCreatedTime() + "\n"
        result += analise.getAvgRequestsHours() + "\n"
        result += analise.getAvgCommands() + "\n"
        
        return result
    }
}


class Logs {

    constructor(logsTotalMetadata) {
        this.logsTotalMetadata = logsTotalMetadata
    }

    getUserLogs (userName) {

        let totalUsersLog = ""

        // brute forces whole metadata roollback and returns exact user data
        for (var i = 0; i < this.logsTotalMetadata.length; i++) {
            if (this.logsTotalMetadata[i].userNickname.includes(userName)) {
                totalUsersLog += Logs.#createLog(this.logsTotalMetadata[i]) 
            }
        }

        // returns shortened logs under 2000 symbols
        return Logs.#lengthShortenLogs(totalUsersLog)
        
    }

    static #lengthShortenLogs (content) {
        // shorten symbols under 2000
        if (content.length > 2000) return content.slice(0, 2000)
        return content
    }

    static #createLog (userMetadata) {
        
        let logsString = ''

        // returns user metadata as string value 
        logsString += "User: " + userMetadata.userNickname.toString() + "\n"
        logsString += "Requested command: " + userMetadata.botCommand + "\n"
        logsString += "Requested at: " + userMetadata.requestTime.toString() + "\n"
        logsString += "ID: " + userMetadata.userId.toString() + "\n" 
        logsString += "Account created at: " + userMetadata.accountCreatTime.toString() + "\n"
        logsString += "Avatar: " + userMetadata.userAvatar + "\n\n"
        
        return logsString
    }
}

class Metadata {
    constructor (initializedTime) {
        this.initializedTime = initializedTime
    }

    // returns metadata initialization time
    getMetadataStartTime () {
        return this.initializedTime.toString()
    }

    getUserData = (data, requestTime, botCommand) => {
        // returns data for analitycs
        
        return {
            botCommand: botCommand,
            requestTime: requestTime,
            userNickname: data.tag,
            userId: data.id.toString(), 
            accountCreatTime: data.createdAt,
            userAvatar: "https://cdn.discordapp.com/avatars/" + data.id.toString() + "/" + data.avatar.toString() + ".webp?size=128",
        }
    }

    checkSendingCount (count) {
        // checking max sending metadata count
        switch (typeof(count)) {
            case "number": break
            default: return 50
        }
        if (count < 10) return 50
        return count
    }
}
module.exports = {Metadata, Analytics, Logs}