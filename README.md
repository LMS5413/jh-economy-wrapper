# jh-economy-wrapper

#A simple wrapper for JH_Economy

#Usage

```javascript 
  econ = new econ('ip', 'username', 'passwd') //MYSQL Information
  econ.money('alvaro0900').then(async money => {
    console.log(await money) //String
})```
