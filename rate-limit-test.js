// rate-limit-test.js [duration [tokenfile [interval]]]
// duration: length of test, in seconds
// tokenfile: file containing an access token
// interval: request interval, in milliseconds

const fetch = require('node-fetch')
const fs = require('fs')

const endpoints = [
    "https://api.wikimedia.org/core/v1/mediawiki/page/User:EProdromou_(WMF)/bare",
    "https://api.wikimedia.org/core/v1/mediawiki/page/Core_Platform_Team/bare",
    "https://api.wikimedia.org/core/v1/wikipedia/en/page/User:EvanProdromou/bare",
    "https://api.wikimedia.org/feed/v1/wikipedia/en/featured/2020/09/16",
    "https://api.wikimedia.org/core/v1/wikivoyage/fr/page/Guide_linguistique_grec/bare",
    "https://api.wikimedia.org/core/v1/wikiquote/de/page/John_Quincy_Adams/bare",
    "https://api.wikimedia.org/core/v1/wikibooks/ja/page/%E6%AD%AF%E5%AD%A6/bare",
    "https://api.wikimedia.org/core/v1/wikiversity/ar/page/%D9%83%D9%84%D9%8A%D8%A9_%D8%A7%D9%84%D8%B9%D9%84%D9%88%D9%85_%D8%A7%D9%84%D8%A5%D8%B3%D9%84%D8%A7%D9%85%D9%8A%D8%A9/bare",
    "https://api.wikimedia.org/core/v1/wikinews/ru/page/%D0%A3%D0%BA%D1%80%D0%B0%D0%B8%D0%BD%D0%B0_%D0%BE%D1%82%D0%BC%D0%B5%D0%BD%D0%B8%D0%BB%D0%B0_%D0%B7%D0%B0%D0%BF%D1%80%D0%B5%D1%82_%D0%BD%D0%B0_%D0%B2%D1%8A%D0%B5%D0%B7%D0%B4_%D0%B4%D0%BB%D1%8F_%D0%B8%D0%BD%D0%BE%D1%81%D1%82%D1%80%D0%B0%D0%BD%D1%86%D0%B5%D0%B2/bare",
    "https://api.wikimedia.org/core/v1/wikidata/page/Wikidata:Introduction/bare"
]

const THREE_HOURS = 3 * 60 * 60 * 1000

let start = Date.now()
let counter = 0

let tokenFile = null
let token = null
let duration = THREE_HOURS
let interval = 500

if (process.argv.length > 2) {
    duration = parseInt(process.argv[2], 10) * 1000
    if(isNaN(duration)) {
       console.error('Invalid duration');
       process.exit(1);
    }
}

if (process.argv.length > 3) {
    interval = parseInt(process.argv[3], 10)
    if(isNaN(interval)) {
       console.error('Invalid interval');
       process.exit(1);
    }
}

if (process.argv.length > 4) {
    tokenFile = process.argv[4]
    token = fs.readFileSync(tokenFile, {encoding: "utf-8"})
}

const headers = {'User-Agent': 'APIGatewayRateLimitTest/0.1'}

if (token) {
    headers['Authorization'] = `Bearer ${token}`
}

let id = setInterval(() => {
    const tick = Date.now()
    if (tick - start >= duration) {
        clearInterval(id)
    } else {
        const i = Math.floor(Math.random() * Math.floor(endpoints.length))
        const endpoint = endpoints[i]
        fetch(endpoint, {headers: headers})
        .then((response) => {
            const value = [counter++, response.status, tick, Date.now()].join(',')
            if (response.status !== 200 && response.status !== 429) {
                console.error(`Bad status for ${endpoint}: ${response.status}`)
            }
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
}, interval)