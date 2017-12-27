# Steam Status (unofficial Alexa skill)

Alexa skill to check the Steam Status using the [steamgaug.es API](https://steamgaug.es/docs). Demonstrates internationalization using the [i18n](https://www.npmjs.com/package/i18n) package and uses a `common.js` so can easily be ported to other systems e.g. Actions on Google, FB messenger.

Available on the [Amazon Alexa skills store](https://www.amazon.com/Adam-Jones-Steam-Status-unofficial/dp/B0787HW1Z1/)

## Structure

`src` contains all the code, which is written in nodejs.

Most of the logic is handled in `common.js`, which returns a speech string. `alexa.js` contains all the Alexa-specific code, including where we set the handlers (NB: change the handler in the Lambda Management Console from `index.handler` to `alexa.handler` for this to work).

`branding` contains logos, made in Inkscape.

## License

The code in `src` is MIT licensed

## Disclaimer

This app is not sponsored by, endorsed by or otherwise affiliated with Steam or Valve Corporation.
