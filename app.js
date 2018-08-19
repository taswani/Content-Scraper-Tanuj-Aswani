const request = require('request');
const cheerio = require('cheerio');
const json2csv = require('json2csv').Parser;
const fs = require('fs');
const dir = './data';
const date = new Date();
let homeURL = 'http://shirts4mike.com/';
let entryPoint = homeURL + 'shirts.php';
let errorMessage1 = `Sorry! Can't connect to ${homeURL} due to a connection error (error code: `;
let shirtLinks = [];
let imgLinks = [];
let productTitles = [];
let shirtPrices = [];
let dates = [];
let objsJSON = [];

function toCSV (json) {
  const fields = ['Name', 'Price', 'ImageURL', 'URL', 'Time'];
  const json2csvParser = new json2csv({fields});
  const csv = json2csvParser.parse(json);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  fs.writeFile(`data/${date.toISOString().slice(0, 10)}.csv`, csv, function(error) {
    console.log('File saved.')
  })
};

request(entryPoint, function(error, response, body) {
  if (error) {
    console.log(errorMessage1 + `${error.code}).`);
    fs.appendFileSync('scraper-error.log', `[${date}] <${errorMessage1}${error.code}).>\n`);
  } else {
    const $ = cheerio.load(body);
    $('ul.products li').each(function(index) {
      let productTitle = $(this).find('a');
      productTitle = $(productTitle).html();
      productTitles.push($(productTitle).attr("alt"));
      let productLink = $(this);
      productLink = $(productLink).html();
      shirtLinks.push($(productLink).attr("href"));
      let productImg = $(this).find('a');
      productImg = $(productImg).html();
      imgLinks.push($(productImg).attr("src"));
    });
    request(homeURL + shirtLinks[0], function(err, resp, body) {
      const $ = cheerio.load(body);
      let productPrice = $('.shirt-details span').text();
      shirtPrices.push(productPrice);
      dates.push(date.toISOString().slice(0, 19));
      request(homeURL + shirtLinks[1], function(err, resp, body) {
        const $ = cheerio.load(body);
        let productPrice = $('.shirt-details span').text();
        shirtPrices.push(productPrice);
        dates.push(date.toISOString().slice(0, 19));
        request(homeURL + shirtLinks[2], function(err, resp, body) {
          const $ = cheerio.load(body);
          let productPrice = $('.shirt-details span').text();
          shirtPrices.push(productPrice);
          dates.push(date.toISOString().slice(0, 19));
          request(homeURL + shirtLinks[3], function(err, resp, body) {
            const $ = cheerio.load(body);
            let productPrice = $('.shirt-details span').text();
            shirtPrices.push(productPrice);
            dates.push(date.toISOString().slice(0, 19));
            request(homeURL + shirtLinks[4], function(err, resp, body) {
              const $ = cheerio.load(body);
              let productPrice = $('.shirt-details span').text();
              shirtPrices.push(productPrice);
              dates.push(date.toISOString().slice(0, 19));
              request(homeURL + shirtLinks[5], function(err, resp, body) {
                const $ = cheerio.load(body);
                let productPrice = $('.shirt-details span').text();
                shirtPrices.push(productPrice);
                dates.push(date.toISOString().slice(0, 19));
                request(homeURL + shirtLinks[6], function(err, resp, body) {
                  const $ = cheerio.load(body);
                  let productPrice = $('.shirt-details span').text();
                  shirtPrices.push(productPrice);
                  dates.push(date.toISOString().slice(0, 19));
                  request(homeURL + shirtLinks[7], function(err, resp, body) {
                    const $ = cheerio.load(body);
                    let productPrice = $('.shirt-details span').text();
                    shirtPrices.push(productPrice);
                    dates.push(date.toISOString().slice(0, 19));
                    for (let i = 0; i < 8; i++) {
                      objsJSON[i] = {Name: productTitles[i], Price: shirtPrices[i], ImageURL: homeURL + imgLinks[i], URL: homeURL + shirtLinks[i], Time: dates[i]};
                    }
                    toCSV(objsJSON);
                  })
                })
              })
            })
          })
        })
      })
    })
  }
});
