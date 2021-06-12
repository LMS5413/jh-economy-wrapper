const mysql = require('mysql')
const color = require('colors');
module.exports = class Economy { 
    constructor(db, ip, user, passwd) {
        if(typeof(db) !== 'string' || typeof(ip) !== 'string' || typeof(user) !== 'string' || typeof(passwd) !== 'string') {
           return console.log(color.red(`Tem algo que não é string! \nDB: ${typeof(db) !== 'string' ? color.red('Não é string'):color.green('É uma string')} \nUSER: ${typeof(user) !== 'string' ? color.red('Não é string'):color.green('É uma string')}\nIP: ${typeof(ip) !== 'string' ? color.red('Não é string'):color.green('É uma string')}\nSENHA: ${typeof(passwd) !== 'string' ? color.red('Não é string'):color.green('É uma string')}`))
        }
        /*

        Conexão com a MYSQL

        */
        this.con = mysql.createConnection({
            host: ip,
            password: passwd,
            user: user,
            database: db
        })
        this.con.connect((err) => {
            if (err) throw err
        })
    }
    money(nick) {
        return new Promise(res => {
            this.con.query(`SELECT * FROM JH_Economy WHERE LowerCaseNick = '${nick.toLowerCase()}'`, function (error, results, fields) {
                if (error) throw error;
                let money = results[0].Money
                res(money)
            })
        })
    }
    all(type) {
        return new Promise(res => {
            this.con.query(`SELECT * FROM JH_Economy`, function (error, results, fields) {
                if (error) throw error;
                let money = results
                if(!type) return res( 'Você não botou nada! tipos validos: \'nick\', \'quantia\'')
                if(typeof(type) !== 'string') res( 'Você pode colocar apenas STRING! tipos validos: \'nick\', \'quantia\'')
                if(type === 'nick') {
                    return res(money.map(x => x.RealNick))
                } else if (type === 'quantia') {
                    return res(money.map(x => x.Money))
                }
            })
        })
    }
    top() {
        return new Promise(res => {
            this.con.query(`SELECT * FROM JH_Economy`, function (error, results, fields) {
                if(error) throw error
        const users = results.sort((a, b) => (b.Money + b.Money) - (a.Money + a.Money)).filter(value => (value.Money + value.Money) > 0)
            let top = users.map(async (value, index) => `🎉 ${index + 1}° ` + `${value.RealNick} tem uma quantia de ${parseInt(value.Money)} coins!`).slice(0, 10)
            res(Promise.all(top))
            })
        })
    }
    setcoins(nick, coins) {
        if(typeof(nick) !== 'string') throw 'Você pode colocar apenas STRING!'
        if(typeof(coins) !== 'number') throw 'Você pode colocar apenas NUMBER!'
        return new Promise(res => {
        this.con.query(`SELECT * FROM JH_Economy WHERE LowerCaseNick = '${nick.toLowerCase()}'`, (error, results, fields) => { 
            if(error) throw error
            if(results && results[0]) {
                if(error) throw error
                if(coins < 0) return res(color.red('Atenção! Você não pode botar um valor negativo!'))
                this.con.query(`UPDATE JH_Economy SET Money = ${coins} WHERE LowerCaseNick = '${nick.toLowerCase()}'`, (error2, results2, fields2)  => { 
                    if (error2) throw error2
                    res(color.green(`ROWS ALTERADOS: ${results2.changedRows}\nSERVER STATUS ${results2.serverStatus}\nDEBUUGER: ${results2.message} `) + color.red(`\n \n*Caso no jh economy esteja desativado a opção \'MYSQL SYNC\' e provavel que demora atualizar!`))
                })
            }
        })
    })
    }
    givecoins(nick, coins) {
        if(typeof(nick) !== 'string') throw 'Você pode colocar apenas STRING!'
        if(typeof(coins) !== 'number') throw 'Você pode colocar apenas NUMBER!'
        return new Promise(res => {
        this.con.query(`SELECT * FROM JH_Economy WHERE LowerCaseNick = '${nick.toLowerCase()}'`, (error, results, fields) => { 
            if(results && results[0]) {
                if(coins < 0) return res(color.red('Atenção! Você não pode botar um valor negativo!'))
                this.con.query(`UPDATE JH_Economy SET Money = ${results[0].Money + coins} WHERE LowerCaseNick = '${nick.toLowerCase()}'`, (error2, results2, fields2)  => { 
                    if (error2) throw error2
                    res(color.green(`ROWS ALTERADOS: ${results2.changedRows}\nSERVER STATUS ${results2.serverStatus}\nDEBUUGER: ${results2.message} `) + color.red(`\n \n*Caso no jh economy esteja desativado a opção \'MYSQL SYNC\' e provavel que demora atualizar!`))
                })
            }
        })
    })
    }
    removecoins(nick, coins) {
        if(typeof(nick) !== 'string') throw 'Você pode colocar apenas STRING!'
        if(typeof(coins) !== 'number') throw 'Você pode colocar apenas NUMBER!'
        return new Promise(res => {
        this.con.query(`SELECT * FROM JH_Economy WHERE LowerCaseNick = '${nick.toLowerCase()}'`, (error, results, fields) => { 
            if(results && results[0]) {
                if(coins < 0) return res(color.red('Atenção! Você não pode botar um valor negativo!'))
                if(results[0] - coins < 0) return res(color.red('Atenção! Caso remova essa quantia no final a quantidade do jogador IRA FICAR NEGATIVA!'))
                this.con.query(`UPDATE JH_Economy SET Money = ${results[0].Money - coins} WHERE LowerCaseNick = '${nick.toLowerCase()}'`, (error2, results2, fields2)  => { 
                    if (error2) throw error2
                    res(color.green(`ROWS ALTERADOS: ${results2.changedRows}\nSERVER STATUS ${results2.serverStatus}\nDEBUUGER: ${results2.message} `) + color.red(`\n \n*Caso no jh economy esteja desativado a opção \'MYSQL SYNC\' e provavel que demora atualizar!`))
                })
            }
        })
    })
    }
}
