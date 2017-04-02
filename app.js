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
    'Please tell us about a time where you failed or struggled. How do you handle setbacks?': 'It\'s tempting to avoid going in-depth into this one, or to portray yourself as the victim in an unfair situation. However, DON\'T make excuses or try to justify your actions if they did not result in a good outcome. Be honest and acknowledge your mistakes, then provide solid examples of how you have improved. This will show the interviewer that you are mature and self-aware, and that you are able to learn from your errors and setbacks.',
    'Who is someone that you admire? Why?': 'This is a way for the interviewer to ask "What qualities do you admire, and how will that make you a better employee?" Take this opportunity to highlight some of your own strengths and values, using your chosen role model as a reference.',
    'Where do you see yourself in 10 years? What are your career goals?': 'Employers want to know how you\'ll fit into the company, and what roles you see yourself playing in the organization\'s future (or if you\'ll even be there in the future!) It might be beneficial to mention the experiences and qualifications that have shaped your goals. If you can show that you\'ve put some thought into your career path, you\'ll come across as a motivated, mature individual.'
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