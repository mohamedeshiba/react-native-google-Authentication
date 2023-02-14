# react-native-google-Authentication
This repo is an example on how to run a react-native google authentication 
## Steps
1. Clone the repo.
2. Open the terminal and yarn to add the needed packages.
3. In the `app.json` file make sure to make the `bundleIdentifier` in the ios field and `package` in the android to be the same name.
4. Go to `https://console.developers.google.com/apis/credentials`, then go to Credentials Page and Create an app for your project if you haven't already.
5. Once that's done, click `Create Credentials` and then "OAuth client ID".
6. You will have 4 options : 
* expoClientId: Proxy client ID for use in the Expo Go on iOS and Android.
* iosClientId: iOS native client ID for use in standalone and bare workflow.
* androidClientId: Android native client ID for use in standalone, bare workflow.
* webClientId: Expo web client ID for use in the browser.
7. In ios client -> `Bundle ID`: Must match the value of ios.bundleIdentifier in your app.json.
8. In android client -> `Package name`: Must match the value of android.package in your app.json.
9. You can do the development in the Expo Go app using the expoClientId but this won't provide you with a refresh token in the response, in addition this will not work on the build apps. 
10. In the standalone apps don't forget to put the correct clientId based on the device.
11. To run the app as a standalone android app, build the project using the following command `eas build -p android --profile development`.
12. Follow the link provided and once the apk is ready download it on the device.
13. Run the command `expo start --dev-client` to run the standalone app in the dev environment.
