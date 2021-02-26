const fs = require('fs');
const https = require('https');

const source = fs.readFileSync('./index-template.html', 'utf-8');
const formatPrice = (price) => {
    const currencyFormat = new Intl.NumberFormat('ru-RU', {
        style: 'currency',
        currency: 'RUB',
        maximumSignificantDigits: 6,
    }).format(price);

    return currencyFormat.substr(0, currencyFormat.length - 2);
};

https.get('https://api.coindesk.com/v1/bpi/currentprice/rub.json', (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        const parsedData = JSON.parse(d);

        console.log(parsedData);

        const output = source.replace(/BTC_PRICE/g, formatPrice(Math.floor(parsedData.bpi.RUB.rate_float * 0.2)));

        fs.writeFileSync('./site/index.html', output);
    });
}).on('error', (e) => {
    console.error(e);
});
