// anonymous-access-limit.js
// Test that the the rate limit is 500 requests/hour/IP and that it resets after an hour

const fetch = require('node-fetch')

const endpoint = "https://api.wikimedia.org/core/v1/mediawiki/page/User:EProdromou_(WMF)"
const NINETY_MINUTES = 90 * 60 * 1000

let requests = []

let start = Date.now()
let counter = 0

let id = setInterval(() => {
    const tick = Date.now()
    counter++
    let iter = counter
    if (tick - start >= NINETY_MINUTES) {
        clearInterval(id)
        // console.dir(requests)
    } else {
        fetch(endpoint, {headers: {'User-Agent': 'APIGatewayRateLimitTest/0.1'}})
        .then((response) => {
            const value = [iter, response.status, tick, Date.now()]
            console.dir(value)
            requests.push(value)
            // I think we have to do this to drain the response
            return response.text()
        })
        .then((text) => {
            console.dir(text)
        })
        .catch((err) => {
            console.error(err)
        })
    }
}, 500)