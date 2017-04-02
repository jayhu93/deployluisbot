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
    appId: process.env.MICROSOFT_APP_ID,
    appPassword: process.env.MICROSOFT_APP_PASSWORD
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
    'How do you handle setbacks?': 'Suggestions for setbacks',
    'What are your greatest weaknesses?': 'Suggestions for greatest weaknesses',
    'What are your career goals?': 'Suggestions for career goals'
};




var questionsArray = Object.keys(questions);
questionsArray.sort( function(a, b) { return 0.5 - Math.random() });

var counter = 0;

bot.dialog('StartInterview', function (session, args, next) {
    session.send('Okay! Let me ask you a few questions.');
    if (counter < questionsArray.length)
        session.send(questionsArray[counter]);
    else {
        session.send('Congratulations. You have completed the interview. Thank you for your time.');
        counter = 0;
    }
    }).triggerAction({
    matches: 'StartInterview'
});

bot.dialog('Greeting', function (session, args, next) {
    session.send('Hello, I am Robodachi! Would you like me to help you with your interview?')
}).triggerAction({
    matches: 'Greeting'
});


bot.dialog('Good', function (session, args, next) {
    session.send('This is a great answer! However, here are some other suggestions! ' + questions[questionsArray[counter]]);
    session.send(questionsArray[++counter]);
    if (counter >= questionsArray.length) {
        session.send('Congratulations. You have completed the interview. Thank you for your time.');
        counter = 0;
    }
    // session.beginDialog('StartInterview');
}).triggerAction({
    matches: 'Good'
});

bot.dialog('Bad', function(session, args, next) {
    session.send('Okay, this might not be the best answer, here are some suggestions to improve your answer. ' + questions[questionsArray[counter]]);
    session.send(questionsArray[++counter]);
    if (counter >= questionsArray.length) {
        session.send('Congratulations. You have completed the interview. Thank you for your time.');
        counter = 0;
    }
    // session.beginDialog('StartInterview');
}).triggerAction({
    matches: 'Bad'
});