const mysql = require('mysql')
const color = require('colors');
module.exports = class Economy { 
    constructor(db, ip, user, passwd) {
        /*

        Conexão com a MYSQL

        */
        this.con = mysql.createConnection({
            host: ip,
            password: passwd,
            user: user,
            database: db
        })
        /*

        Tenta uma conexão, mal sucedido ele retorna o erro

        */
        this.con.connect((err) => {
            if (err) throw err
        })
    }
        /*

        Função com a propriedade .money
        
        */
    money(nick) {
        return new Promise(res => {
            this.con.query(`SELECT * FROM JH_Economy WHERE LowerCaseNick = '${nick.toLowerCase()}'`, function (error, results, fields) {
                if (error) throw error;
                let money = results[0].Money
                res(money)
            })
        })
    }
        /*

        Função com a propriedade .all
        
        */
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
           /*

        Função com a propriedade .top
        
        */
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
            /*

        Função com a propriedade .givecoins
        
        */
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
        /*

        Função com a propriedade .removecoins
        
        */
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
