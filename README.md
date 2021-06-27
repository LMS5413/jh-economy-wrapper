# jh-economy-wrapper

# A simple wrapper for JH_Economy

# Usage

```javascript 
  econ = new econ('db', 'ip', 'username', 'passwd') //MYSQL Information
  econ.money('alvaro0900').then(async money => {
    console.log(await money) //String
})

# Documentation https://brleonardo790.gitbook.io/jh-economy-wrapper/
