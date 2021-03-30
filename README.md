
# Demia mobile app

Demia is a communication app for students. It's currently on the [Apple Appstore](https://apps.apple.com/us/app/demia-classroom/id1522217932).

![app screenshots](https://firebasestorage.googleapis.com/v0/b/tickets-79e75.appspot.com/o/web_assets%2Fws-bg-showcase.png?alt=media&token=ef048646-b9b4-448e-8ee9-02bdc0361fae)

  

### Inspiration

We heard a lot of complaints during the start of the global pandemic about distanced learning. The initial idea was a plugin to zoom that synced with this app that allowed teachers to interact with students durring class, but we realized it would proably take to long to make so I focused on something students could use under any circumstance.

  

### Why are you releasing the code to your app?

For educational purposes. It took me a half a year to become confident with react-native. I previously wrote iOS apps in swift. This project is pretty easy to understand and the backend uses google firebase so it's super easy to set up.
  
  

## Prerequisites

Honestly, there's a lot of setup. Apple developer and Firebase stuff takes up a big chunk of it.

  

- Xcode version `11` is needed.

- [Apple developer account](https://developer.apple.com/)

- [react native](https://reactnative.dev/docs/environment-setup) environment setup

- [firebase command line tool](https://firebase.google.com/docs/functions/get-started?authuser=0#set-up-node.js-and-the-firebase-cli)

- initialize firebase functions

- [Firebase project](https://console.firebase.google.com/)

- add firestore, storage, and authentication

- [Algolia project](https://www.algolia.com/)

- Twilio account (optional)

- Stripe account (optional)

  

## Installation

  

#### 1. Clone the project

  

```bash

git clone git@github.com:007jedgar/pres.git

```

```bash

cd pres

```

#### 2. install dependencies

```bash

yarn install

```

#### *or*

```bash

npm install

```

#### 3. Firebase Setup

Follow the [react-native-firebase guide](https://rnfirebase.io/#generating-ios-credentials) on generating your firebase project's `GoogleService-Info.plist` file. Add it to your ios projects folder `ios/pres/[here]`

  
  

#### 4. install pod dependencies and link assets

```bash

cd ios && pod install

```
To link fonts
```bash
npx react-native link
```
  

## Initialization

  

### App

Navigate to `src/apiKeys.json` and add your api keys for Algolia, GoogleWebClient, and stripe (optional).

```json

{

"alogoliaSearchableKey": "your-algolia-searchable-key",

"googleWebClientId": "your-google-web-client-id-here",

}

```

### Cloud Functions

Navigate from root to `functions/index.js`

Add your firebase cloud functions environment variables. Below is a list of environment variables used in cloud functions

```

twilio.authtoken

algolia.apikey

algolia.appid

stripe.testkey

```

  

Example api token configuration:

```bash

firebase functions:config:set twilio.authtoken="yourAuthToken"

```

#### Next

Change the twilio api key and firebase databaseURL to your own.

```javascript

const  twilio  =  require('twilio')('your-unsecret-twilio-key', env.twilio.authtoken);

admin.initializeApp({

credential: admin.credential.applicationDefault(),

databaseURL:  "your-firebase-database-url-here"

})

// This is what called my algolia indexes throughout my app

const  user_index  = client.initIndex('classroom_user')

const  ta_index  = client.initIndex('teacher_assistants')

```

If a cloud function isn't working correctly, its most likely a bug in my code, but I'd also **check the api key or service key associated with the cloud function.**

#### Deploy cloud functions

```bash
firebase deploy --only functions
```

## Sign in with Apple

Please follow this [environment setup](https://github.com/invertase/react-native-apple-authentication/blob/master/docs/INITIAL_SETUP.md) closely.

Ensure the "Apple" sign-in provider is enabled on the [Firebase Console](https://console.firebase.google.com/project/_/authentication/providers).

  

## Google sign in

Ensure the "Google" sign-in provider is enabled on the [Firebase Console](https://console.firebase.google.com/project/_/authentication/providers). And that you have the google client id correct.

## Push notifications

Use this [react-native-firebase guide](https://rnfirebase.io/messaging/usage/ios-setup)

  

- Configuring your app in xcode

- [Registering a key](https://rnfirebase.io/messaging/usage/ios-setup#1-registering-a-key)

- [Registering an App Identifier](https://rnfirebase.io/messaging/usage/ios-setup#2-registering-an-app-identifier)

- [Generating a provisioning profile](https://rnfirebase.io/messaging/usage/ios-setup#3-generating-a-provisioning-profile)

  

## Dynamic Links

Use this [react-native-firebase guide](https://rnfirebase.io/dynamic-links/usage#firebase-setup)

- Set up a dynamic link in your firebase console.

- Connect apple developer creds to firebase console

  

## Running the app

My `package.json` file has this line

```json

"ios": "react-native run-ios --simulator=\"iPhone 11 Pro Max\"",

```

so when I run...

```bash

npm run ios

```

...my app runs the *iPhone of my choice.* There have been times when the npx react-native cli doesn't run successfully. Instead of immediately trying to debug, I open the project in xcode `cd ios && open pres.xcworkspace` and `run` from xcode interface.

  

## Troubleshooting

- Check firebase database, storage, and auth rules

- Check xcode/iOS app permissions

- Try running `npm run build:ios`

- Check apple developer signing team

  

Feel free to message me or submit an issue if you're having problems. This version isn't the one that's live on the appstore, but I should be able to at least send you in the right direction.

  

## Contributing

If you have any feature requests for the live appstore app or changes to the doc contact me!

  

## What's coming next?

I'm curently working on software that will allow students to turn their notes into flash cards, convert textbooks to audio books, make syllabi into digital callendar events, and allow students to make their own bots that plug into their demia classrooms.

  

## Contact

Easiest ways to reach out to me

email: jedgardev@gmail.com  

## License

[Mozilla Public License 2.0](https://choosealicense.com/licenses/mpl-2.0/)