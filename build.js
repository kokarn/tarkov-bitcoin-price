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

https.get('https://tarkov-tools.com/graphql?query={%20item(id:%20%2259faff1d86f7746c51718c9c%22)%20{%20sellFor%20{%20source%20price%20}%20}%20}', (res) => {
    console.log('statusCode:', res.statusCode);
    console.log('headers:', res.headers);

    res.on('data', (d) => {
        const parsedData = JSON.parse(d);

        console.log(parsedData);

        const therapistPrice = parsedData.data.item.sellFor.find(price => price.source === 'therapist');
        const output = source.replace(/BTC_PRICE/g, formatPrice(therapistPrice.price));

        fs.writeFileSync('./site/index.html', output);
    });
}).on('error', (e) => {
    console.error(e);
});
