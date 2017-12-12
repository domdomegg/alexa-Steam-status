'use strict';

const https = require('https');
const i18n = require('i18n');

// Docs at https://steamgaug.es/docs
const sgapi_url = 'https://steamgaug.es/api/v2'

// Configure internationalization settings
i18n.configure({
  locales: ['en'],
  directory: __dirname + '/locales',
  defaultLocale: 'en'
});

// Returns textual status from Steam Gauges API service object
function getServiceStatus(service) {
    if(service.online == 1) {
        return i18n.__('online');
    }
    return i18n.__('down');
}

// Gets JSON data from a HTTPS source.
function getData(url, callback) {
    https.get(url, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            callback(JSON.parse(data));
        });
    }).on('error', (err) => {
        console.error('Error getting data: ', err);
        callback(null);
    });
}

// Returns speech to callback function with current steam status
module.exports = {
    getSteamStatus: function (locale, callback) {
        i18n.setLocale(locale);

        getData(sgapi_url, (data) => {
            if(data == null) {
                // In case https request failed
                callback(i18n.__('Sorry, I couldn\'t get Steam\'s status.'));
            }

            if(data.SteamCommunity.online == 1
              && data.ISteamClient.online == 1
                && data.SteamStore.online == 1
                && data.ISteamUser.online == 1) {
                // In the case everything is working
                callback(i18n.__('The Steam client, community, store and user API are all online.'));
            } else {
                // Get textual service status
                let client_status   = getServiceStatus(data.ISteamClient);
                let community_status= getServiceStatus(data.SteamCommunity);
                let store_status    = getServiceStatus(data.SteamStore);
                let userapi_status  = getServiceStatus(data.ISteamUser);

                callback(i18n.__(
                    'The Steam client is %s, the community is %s, the store is %s and the user API is %s.', 
                    client_status, community_status, store_status, userapi_status
                ));
            }
        });
    },
    help: function (locale) {
        i18n.setLocale(locale);
        return i18n.__('HELP_TEXT');
    },
    stop: function (locale) {
        i18n.setLocale(locale);
        return i18n.__('STOP_TEXT');
    }
}