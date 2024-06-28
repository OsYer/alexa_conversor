/* *
 * This sample demonstrates handling intents from an Alexa skill using the Alexa Skills Kit SDK (v2).
 * Please visit https://alexa.design/cookbook for additional examples on implementing slots, dialog management,
 * session persistence, api calls, and more.
 * */
const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const sprintf = require('i18next-sprintf-postprocessor');

const languageStrings = {
    en: {
        translation: {
            WELCOME_MESSAGE: 'Welcome to the Unit Converter! You can ask to convert units. For example, you can say, "Convert 10 yards to feet." How can I help you?',
            HELP_MESSAGE: 'You can ask me to convert units between yards, inches, and feet. How can I assist you?',
            GOODBYE_MESSAGE: 'Goodbye from the Unit Converter!',
            REFLECTOR_MESSAGE: 'You just triggered %s.',
            FALLBACK_MESSAGE: 'Sorry, I didn\'t understand that. Please make sure to use correct unit names and try again.',
            ERROR_MESSAGE: 'Sorry, there was an error. Please try again.',
            CONVERT_MESSAGE: 'The conversion from %s %s to %s is %s %s.'
        }
    },
    es: {
        translation: {
            WELCOME_MESSAGE: '¡Bienvenido al Convertidor de Unidades! Puedes pedir convertir unidades. Por ejemplo, puedes decir, "Convierte 10 metros a centímetros." ¿Cómo te puedo ayudar?',
            HELP_MESSAGE: 'Puedes pedirme que convierta unidades entre centímetros, metros y kilómetros. ¿Cómo te puedo asistir?',
            GOODBYE_MESSAGE: '¡Adiós desde el Convertidor de Unidades!',
            REFLECTOR_MESSAGE: 'Acabas de activar %s.',
            FALLBACK_MESSAGE: 'Lo siento, no he entendido la solicitud. Por favor, asegúrate de usar nombres de unidades correctos e inténtalo de nuevo.',
            ERROR_MESSAGE: 'Lo siento, hubo un error. Por favor, inténtalo de nuevo.',
            CONVERT_MESSAGE: 'La conversión de %s %s a %s es %s %s.'
        }
    }
};

const conversionRates = {
    en: {
        yards: { inches: 36, feet: 3 },
        inches: { yards: 1/36, feet: 1/12 },
        feet: { yards: 1/3, inches: 12 }
    },
    es: {
        centímetros: { metros: 0.01, kilómetros: 0.00001 },
        metros: { centímetros: 100, kilómetros: 0.001 },
        kilómetros: { centímetros: 100000, metros: 1000 }
    }
};

const ConvertUnitsIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
               Alexa.getIntentName(handlerInput.requestEnvelope) === 'ConvertUnitsIntent';
    },
    handle(handlerInput) {
        const locale = handlerInput.requestEnvelope.request.locale;
        const language = locale.split('-')[0];
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();

        const cantidad = handlerInput.requestEnvelope.request.intent.slots.cantidad.value;
        let unidadOrigen = handlerInput.requestEnvelope.request.intent.slots.unidadOrigen.value.toLowerCase();
        let unidadDestino = handlerInput.requestEnvelope.request.intent.slots.unidadDestino.value.toLowerCase();

        const conversionRate = conversionRates[language][unidadOrigen][unidadDestino];

        if (!conversionRate) {
            const speakOutput = requestAttributes.t('ERROR_MESSAGE');
            return handlerInput.responseBuilder
                .speak(speakOutput)
                .getResponse();
        }

        const convertedAmount = cantidad * conversionRate;
        const speakOutput = requestAttributes.t('CONVERT_MESSAGE', cantidad, unidadOrigen, unidadDestino, convertedAmount.toFixed(2), unidadDestino);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {  
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('WELCOME_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const HelloWorldIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'HelloWorldIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Hello World!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('HELP_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('GOODBYE_MESSAGE');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const requestAttributes = handlerInput.attributesManager.getRequestAttributes();
        const speakOutput = requestAttributes.t('FALLBACK_MESSAGE');
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = `You just triggered ${intentName}`;

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};

const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = 'Sorry, I had trouble doing what you asked. Please try again.';
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope.request)}`);
    }
};

const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
    }
};

const LocalizationInterceptor = {
    process(handlerInput) {
        const localizationClient = i18n.use(sprintf).init({
            lng: handlerInput.requestEnvelope.request.locale,
            fallbackLng: 'en',
            overloadTranslationOptionHandler: sprintf.overloadTranslationOptionHandler,
            resources: languageStrings,
            returnObjects: true
        });

        const attributes = handlerInput.attributesManager.getRequestAttributes();
        attributes.t = function (...args) {
            return localizationClient.t(...args);
        };
    }
};

exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        ConvertUnitsIntentHandler,
        HelloWorldIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        FallbackIntentHandler,
        SessionEndedRequestHandler,
        IntentReflectorHandler)
    .addErrorHandlers(
        ErrorHandler)
    .addRequestInterceptors(
        LocalizationInterceptor,
        LoggingRequestInterceptor)
    .addResponseInterceptors(
        LoggingResponseInterceptor)
    .withCustomUserAgent('sample/unit-converter/v1.2')
    .lambda();
