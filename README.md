# Skippbox mobile

Mobile app for Skippbox made with React Native.


### How to run the app

Install node dependencies:

```
npm install
```

Install React Native cli:

```
npm install -g react-native-cli
```

Run the packager:

```
npm start
```

#### iOS

Install ios dependencies:

```
gem install cocoapods
cd iOS/ && pod install
```

Run the app on iOS for dev:
(you need Xcode installed on your mac)

```
react-native run-ios
```

#### Android

The easiest way is to run the app directly from Android Studio (add `cabin/android` as an existing project).

Or you can use `react-native run-android` if you already have an emulator launched or a device connected (to launch one is `path/to/android/sdk/emulator -avd <emulator name>`)
