const request = require('request'); //Requiring the request module for the http requests being made.
const cheerio = require('cheerio'); //Requiring the cheerio module for the DOM traversal of the response body.
const json2csv = require('json2csv').Parser; //Requiring the json2csv module to change the data from JSON to CSV.
const fs = require('fs'); //Requiring the fs module for writing data to the necessary files.
const dir = './data'; //Providing a variable to create a data directory and store our csv files in.
const date = new Date(); //Calling the date class in order to provide our timestamps throughout our files.
let homeURL = 'http://shirts4mike.com/'; //Creating a variable in order to hold the url for the homepage of Mike's Shirts.
let entryPoint = homeURL + 'shirts.php'; //Creating a variable to append all the scraped links onto.
let errorMessage1 = `Sorry! Can't connect to ${homeURL} due to a connection error (error code: `; //Providing a base error message for lack of connection.
let shirtLinks = []; //Initializing an array to store all the shirt links in.
let imgLinks = []; //Initializing an array to store all the image links in.
let productTitles = []; //Initializing an array to store all the product titles in.
let shirtPrices = []; //Initializing an array to store all the shirt prices in.
let dates = []; //Initializing an array to store all the dates/timestamps in.
let objsJSON = []; //Initializing an array to store all the JSON objects in once the requests are made.


//Function that creates a directory for data, and creates a csv to store within that data folder.
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


//Requests being made in order to load the response into cheerio.
//Using cheerio, we traverse the body of the response using JQuery to scrape all the necessary data from the response.
//After pulling the data we need, we push it to the corresponding array.
//Once all requests are made (async), we loop through all the arrays to add the information to a JSON object array we initialized earlier.
//If the internet is turned off, or the request throws an error due to page being down, there will be a console message displaying the error and code.
//This error will also create a scraper-error log, and if it exists it will append the error message to the bottom of the file.
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
                    toCSV(objsJSON); // Calling the function we made earlier to write objsJSON to CSV.
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
