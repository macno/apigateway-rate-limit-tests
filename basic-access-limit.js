// anonymous-access-limit.js
// Test that the the rate limit is 500 requests/hour/IP and that it resets after an hour

const fetch = require('node-fetch')
const token = require('./basictoken.json')

const endpoint = "https://api.wikimedia.org/core/v1/mediawiki/page/User:EProdromou_(WMF)"
const THREE_HOURS = 3 * 60 * 60 * 1000

let start = Date.now()
let counter = 0

const headers = {'User-Agent': 'APIGatewayRateLimitTest/0.1', 'Authorization': `Bearer ${token}`}

let id = setInterval(() => {
    const tick = Date.now()
    if (tick - start >= THREE_HOURS) {
        clearInterval(id)
    } else {
        fetch(endpoint, {headers: headers})
        .then((response) => {
            const value = [counter++, response.status, tick, Date.now()].join(',')
            console.log(value)
            // I think we have to do this to drain the response
            return response.text()
        })
        .then((text) => {
            // console.dir(text)
        })
        .catch((err) => {
            console.error(err)
        })
    }
}, 500)