'use strict';

const https = require('https');
const i18n = require('i18n');

// Docs at https://steamgaug.es/docs
const sgapi_url = 'https://steamgaug.es/api/v2'

// Configure internationalization settings
i18n.configure({
  locales: ['en', 'de', 'ja'],
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
    getTF2Status: function (locale, callback) {
        i18n.setLocale(locale);

        getData(sgapi_url, (data) => {
            if(data == null) {
                // In case https request failed
                callback(i18n.__('Sorry, I couldn\'t get TF2\'s status.'));
            }

            if(data.IEconItems['440'].online == 1
              && data.ISteamGameCoordinator['440'].online == 1) {
                // In the case everything is working
                callback(i18n.__('The TF2 game coordinator and items API are both online.'));
            } else {
                // Get textual service status
                let gc_status   = getServiceStatus(data.ISteamGameCoordinator['440']);
                let items_status= getServiceStatus(data.IEconItems['440']);

                callback(i18n.__(
                    'The TF2 game coordinator is %s and the items API is %s.', 
                    gc_status, items_status
                ));
            }
        });
    },
    getDotaStatus: function (locale, callback) {
        i18n.setLocale(locale);

        getData(sgapi_url, (data) => {
            if(data == null) {
                // In case https request failed
                callback(i18n.__('Sorry, I couldn\'t get Dota\'s status.'));
            }

            // Build callback speech
            let callback_speech = '';

            if(data.IEconItems['570'].online == 1
              && data.ISteamGameCoordinator['570'].online == 1) {
                // In the case everything is working
                callback_speech += (i18n.__('The Dota game coordinator and items API are both online.'));
            } else {
                // Get textual service status
                let gc_status   = getServiceStatus(data.ISteamGameCoordinator['570']);
                let items_status= getServiceStatus(data.IEconItems['570']);

                callback_speech += (i18n.__(
                    'The Dota game coordinator is %s and the items API is %s.', 
                    gc_status, items_status
                ));
            }

            if(data.ISteamGameCoordinator['570'].stats
                && data.ISteamGameCoordinator['570'].stats.players_searching) {
                callback_speech += ' ';
                callback_speech += (i18n.__('There are currently %s players searching.',
                    data.ISteamGameCoordinator['570'].stats.players_searching))
            }

            callback(callback_speech);
        });
    },
    getCSGOStatus: function (locale, callback) {
        i18n.setLocale(locale);

        getData(sgapi_url, (data) => {
            if(data == null) {
                // In case https request failed
                callback(i18n.__('Sorry, I couldn\'t get CSGO\'s status.'));
            }

            // Build callback speech
            let callback_speech = '';

            if(data.IEconItems['730'].online == 1
              && data.ISteamGameCoordinator['730'].online == 1) {
                // In the case everything is working
                callback_speech += (i18n.__('The CSGO game coordinator and items API are both online.'));
            } else {
                // Get textual service status
                let gc_status   = getServiceStatus(data.ISteamGameCoordinator['730']);
                let items_status= getServiceStatus(data.IEconItems['730']);

                callback_speech += (i18n.__(
                    'The CSGO game coordinator is %s and the items API is %s.', 
                    gc_status, items_status
                ));
            }

            if(data.ISteamGameCoordinator['730'].stats
                && data.ISteamGameCoordinator['730'].stats.players_searching) {
                callback_speech += ' ';
                callback_speech += (i18n.__('Currently %s of the %s online players are searching, with an average wait time of %s seconds.',
                    data.ISteamGameCoordinator['730'].stats.players_searching,
                    data.ISteamGameCoordinator['730'].stats.players_online,
                    Math.round(data.ISteamGameCoordinator['730'].stats.average_wait / 1000)
                    ))
            }

            callback(callback_speech);
        });
    },
    // game should be one of ['STEAM', 'TF2', 'DOTA', 'CSGO']
    help: function (locale, game) {
        i18n.setLocale(locale);
        return i18n.__(game + '_HELP_TEXT');
    },
    stop: function (locale) {
        i18n.setLocale(locale);
        return i18n.__('STOP_TEXT');
    }
}
