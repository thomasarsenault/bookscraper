var express = require('express');
const rp = require('request-promise');
const cheerio = require('cheerio');
let websiteToIllegallyScrapeFrom = "https://www.goodreads.com"
var app = express()
var PORT = 3005;

app.get('/', function(req, res) {
    res.status(200).send('Hello world');
});

app.get('/getBookInfo/:title', function(req, res) {
    // console.log(scrapeBookInfo(req.params.title));
    // res.status(200).send(scrapeBookInfo(req.params.title))

    let title = req.params.title;
    let authorName = "";
    let bookTitle = "";
    let bookCover = "";

    const options = {
        uri: websiteToIllegallyScrapeFrom + `/search?q=` + title,
        transform: function (body) {
          return cheerio.load(body);
        }
      };

    rp(options).then(($) => {

    const optionsBookURL = {
        uri: websiteToIllegallyScrapeFrom + $(".bookTitle")[0].attribs.href,
        transform: function (body) {
            return cheerio.load(body);
        }
        };

        rp(optionsBookURL).then(($) => {
            let authorName = $(".authorName")[0].children[0].children[0].data;
            // console.log($(".authorName")[0].children[0].children[0].data)
            
            let bookTitle = $("#bookTitle")[0].children[0].data.replace("\n", "").trim();
            // console.log($("#bookTitle")[0].children[0].data.replace("\n", "").trim())

            let bookCover = $("#coverImage")[0].attribs.src;
            // console.log($("#coverImage")[0].attribs.src)

            res.status(200).send({status: 'success', authorName: authorName, bookTitle: bookTitle, bookCover: bookCover});

        }).catch((err) => {
            console.log(err);
            res.status(500).send( {status: 'failed'} )
        })

    }).catch((err) => {
        console.log(err);
        res.status(500).send( {status: 'failed'} )        
    })


});

app.listen(PORT, function() {
    console.log('Server is running on PORT:',PORT);
});