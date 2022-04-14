const nodemailer = require('nodemailer'),
    mailerConfig = require('../bot_config.json')

// simple mailer for sending analytics
class Mailer {
    constructor(password, email) {
        this.password = password
        this.email = email
        
        this.transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: this.email,
                pass: this.password,
            }
        })
    }
    static #getMailOptions(content) {
        return {
            from: mailerConfig.mailer.adressTo,
            to: mailerConfig.mailer.adressTo,
            subject: 'Analitycs from StopGameGuru',
            text: content.toString(),
        }
    }
    mailSend(content) {
        this.transporter.sendMail(Mailer.#getMailOptions(content), error => {
            console.log(error)
        })
    }
}

module.exports = Mailer