// This loads the environment variables from the .env file
require('dotenv-extended').load();

var builder = require('botbuilder');
var restify = require('restify');
var Store = require('./store');
var spellService = require('./spell-service');

// Setup Restify Server
var server = restify.createServer();
server.listen(process.env.port || process.env.PORT || 3978, function () {
    console.log('%s listening to %s', server.name, server.url);
});
// Create connector and listen for messages
var connector = new builder.ChatConnector({
    appId: '79568fc1-ab9a-459a-a8d3-0a611f8735c6',
    appPassword: '8x90gUVp8OyOhBxoDdDc1MB'
});
server.post('/api/messages', connector.listen());

var bot = new builder.UniversalBot(connector, function (session) {
    session.send('Sorry, I did not understand \'%s\'. Type \'help\' if you need assistance.', session.message.text);
});

// You can provide your own model by specifing the 'LUIS_MODEL_URL' environment variable
// This Url can be obtained by uploading or creating your model from the LUIS portal: https://www.luis.ai/
var recognizer = new builder.LuisRecognizer(process.env.LUIS_MODEL_URL);
bot.recognizer(recognizer);

var questions = {
    'How do you handle setbacks':"Suggestions for setbacks",
    'What are your greatest weakness':'Suggestions for greatest weakness',
    'What is your career goal': 'suggestions for career goal'
};
var questionsArray = Object.keys(questions);


var counter = 0;

bot.dialog('StartInterview', function (session, args, next) {
    // questions.sort(function(a,b) {return 0.5-Math.random()});
            session.send(questionsArray[0]);
            // session.endDialog();
    }).triggerAction({
    matches: 'StartInterview'
});



bot.dialog('Good', function (session, args, next) {
    session.send('This is a good answer');
    session.send(questions[questionsArray[0]]);
    session.send(questionsArray[1]);
    // session.beginDialog('StartInterview');
}).triggerAction({
    matches: 'Good'
});

bot.dialog('Bad', function(session, args, next) {
    session.send('This is a bad answer');
    session.send(questions[questionsArray[0]]);
    session.send(questionsArray[1]);
    // session.beginDialog('StartInterview');
}).triggerAction({
    matches: 'Bad'
});


// bot.dialog('SearchHotels', [
//     function (session, args, next) {
//         session.send('Welcome to the Hotels finder! We are analyzing your message: \'%s\'', session.message.text);

//         // try extracting entities
//         var cityEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'builtin.geography.city');
//         var airportEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'AirportCode');
//         if (cityEntity) {
//             // city entity detected, continue to next step
//             session.dialogData.searchType = 'city';
//             next({ response: cityEntity.entity });
//         } else if (airportEntity) {
//             // airport entity detected, continue to next step
//             session.dialogData.searchType = 'airport';
//             next({ response: airportEntity.entity });
//         } else {
//             // no entities detected, ask user for a destination
//             builder.Prompts.text(session, 'Please enter your destination');
//         }
//     },
//     function (session, results) {
//         var destination = results.response;

//         var message = 'Looking for hotels';
//         if (session.dialogData.searchType === 'airport') {
//             message += ' near %s airport...';
//         } else {
//             message += ' in %s...';
//         }

//         session.send(message, destination);

//         // Async search
//         Store
//             .searchHotels(destination)
//             .then(function (hotels) {
//                 // args
//                 session.send('I found %d hotels:', hotels.length);

//                 var message = new builder.Message()
//                     .attachmentLayout(builder.AttachmentLayout.carousel)
//                     .attachments(hotels.map(hotelAsAttachment));

//                 session.send(message);

//                 // End
//                 session.endDialog();
//             });
//     }
// ]).triggerAction({
//     matches: 'SearchHotels',
//     onInterrupted: function (session) {
//         session.send('Please provide a destination');
//     }
// });

// bot.dialog('ShowHotelsReviews', function (session, args) {
//     // retrieve hotel name from matched entities
//     var hotelEntity = builder.EntityRecognizer.findEntity(args.intent.entities, 'Hotel');
//     if (hotelEntity) {
//         session.send('Looking for reviews of \'%s\'...', hotelEntity.entity);
//         Store.searchHotelReviews(hotelEntity.entity)
//             .then(function (reviews) {
//                 var message = new builder.Message()
//                     .attachmentLayout(builder.AttachmentLayout.carousel)
//                     .attachments(reviews.map(reviewAsAttachment));
//                 session.endDialog(message);
//             });
//     }
// }).triggerAction({
//     matches: 'ShowHotelsReviews'
// });

// bot.dialog('Help', function (session) {
//     session.endDialog('Hi! Try asking me things like \'search hotels in Seattle\', \'search hotels near LAX airport\' or \'show me the reviews of The Bot Resort\'');
// }).triggerAction({
//     matches: 'Help'
// });



// Spell Check
if (process.env.IS_SPELL_CORRECTION_ENABLED === 'true') {
    bot.use({
        botbuilder: function (session, next) {
            spellService
                .getCorrectedText(session.message.text)
                .then(function (text) {
                    session.message.text = text;
                    next();
                })
                .catch(function (error) {
                    console.error(error);
                    next();
                });
        }
    });
}
