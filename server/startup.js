// start up function that creates entries in the Websites databases.
Meteor.startup(function () {
// Code to run on server at startup
// Fixtures
if (!Websites.findOne()){
    console.log("No websites yet. Creating starter data.");
      Websites.insert({
        title:"Goldsmiths Computing Department",
        url:"http://www.gold.ac.uk/computing/",
        description:"This is where this course was developed.",
        createdOn:new Date(),
        vote: 0
    });
     Websites.insert({
        title:"University of London",
        url:"http://www.londoninternational.ac.uk/courses/undergraduate/goldsmiths/bsc-creative-computing-bsc-diploma-work-entry-route",
        description:"University of London International Programme.",
        createdOn:new Date(),
        vote: 0
    });
     Websites.insert({
        title:"Coursera",
        url:"http://www.coursera.org",
        description:"Universal access to the world’s best education.",
        createdOn:new Date(),
        vote: 0
    });
    Websites.insert({
        title:"Google",
        url:"http://www.google.com",
        description:"Popular search engine.",
        createdOn:new Date(),
        vote: 0
    });
}

var cheerio = Meteor.npmRequire('cheerio');

Meteor.methods({
    // Load Url
    getContentsByUrl: function (url) {
        try {
            var result = HTTP.call("GET", url),
                data,
                title,
                description;

            if (result.statusCode === 200) {
                data = cheerio.load(result.content);
                title = data('title').text().trim();
                description = data('meta[name=description]').attr('content');

                return {
                    'title': (title === undefined) ? '' : title,
                    'description': (description === undefined) ? '' : description
                };
            }
            return false;
        } catch (e) {
            // Got a network error, time-out or HTTP error in the 400 or 500 range.
            return false;
        }
    }
});

});