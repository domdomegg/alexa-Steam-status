'use strict';

const Alexa = require('alexa-sdk');
const common = require('./common.js');

const APP_IDs = {
    'amzn1.ask.skill.d2ec9cb5-4cba-41eb-985f-bcce52766503': 'CSGO',
    'amzn1.ask.skill.845b31b3-4a68-40c0-b374-148525a4cbae': 'DOTA',
    'amzn1.ask.skill.819a9773-f077-47fe-b8f0-498a6aa770f2': 'TF2',
    'amzn1.ask.skill.a7f36a2b-aafb-46f2-8987-463e39860963': 'STEAM',
}

const handlers = {
    'GetStatus': function () {
        let SERVICE = APP_IDs[this.event.session.application.applicationId];
        let LOCALE = this.event.request.locale.substring(0,2);

        console.log('Service: ' + SERVICE + ', Locale: ' + LOCALE);

        switch(SERVICE) {
            case 'CSGO':
                common.getCSGOStatus(LOCALE, (response) => {
                    this.emit(':tell', response);
                });
                break;
            case 'DOTA':
                common.getDotaStatus(LOCALE, (response) => {
                    this.emit(':tell', response);
                });
                break;
            case 'TF2':
                common.getTF2Status(LOCALE, (response) => {
                    this.emit(':tell', response);
                });
                break;
            case 'STEAM':
                common.getSteamStatus(LOCALE, (response) => {
                    this.emit(':tell', response);
                });
        }
    },
    'SteamStatus': function () {
        // For compatibility with Steam version which has its own intent
        this.emit('GetStatus');
    },
    'LaunchRequest': function () {
        // If opened without explicit intent, give status
        this.emit('GetStatus');
    },
    'Unhandled': function () {
        // Given the app doesn't do anything else, redirect any unhandled intents to just give the status
        this.emit('GetStatus');
    },
    'AMAZON.YesIntent': function () {
        // Probably handling from help
        this.emit('GetStatus');
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
        let SERVICE = APP_IDs[this.event.session.application.applicationId];

        // Get help text from common.js
        this.emit(':ask', common.help(this.event.request.locale.substring(0,2), SERVICE));
    },
};

// Register handlers
exports.handler = function (event, context) {
    const alexa = Alexa.handler(event, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
};
