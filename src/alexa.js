'use strict';

const Alexa = require('alexa-sdk');
const common = require('./common.js');

const handlers = {
    'SteamStatus': function () {
        // Get steam status - looks different from others as relies on a callback
        common.getSteamStatus(this.event.request.locale.substring(0,2), (response) => {
            this.emit(':tell', response);
        });
    },
    'LaunchRequest': function () {
        // If opened without explicit intent, give Steam status
        this.emit('SteamStatus');
    },
    'Unhandled': function () {
        // Given the app doesn't do anything else, redirect any unhandled intents to just give the status
        this.emit('SteamStatus');
    },
    'AMAZON.YesIntent': function () {
        // Probably handling from help
        this.emit('SteamStatus');
    },

    'AMAZON.StopIntent': function () {
        // Get stop text from common.js
        this.emit(':tell', common.stop(this.event.request.locale.substring(0,2)));
    },
    'SessionEndedRequest': function () {
        // Should do the same thing as stop
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.CancelIntent': function () {
        // Cancel should do the same thing as stop
        this.emit('AMAZON.StopIntent');
    },
    'AMAZON.NoIntent': function () {
        // Should do the same thing as stop
        this.emit('AMAZON.StopIntent');
    },

    'AMAZON.HelpIntent': function () {
        // Get help text from common.js
        this.emit(':ask', common.help(this.event.request.locale.substring(0,2)));
    },
};

// Register handlers
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers);
    alexa.execute();
};
