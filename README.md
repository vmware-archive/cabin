# Cabin, the mobile app for [Kubernetes](https://kubernetes.io)

Cabin is a Mobile application for Kubernetes, made with [React Native](https://facebook.github.io/react-native/). 

## Screencast

It is full of neat features, check out the screencast below by clicking on the image:

[![screencast](https://img.youtube.com/vi/z54uH2gDmso/0.jpg)](https://www.youtube.com/watch?v=z54uH2gDmso)

## Run Locally Using Simulators

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

### iOS

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

### Android

The easiest way is to run the app directly from Android Studio (add `cabin/android` as an existing project).

Or you can use `react-native run-android` if you already have an emulator launched or a device connected (to launch one is `path/to/android/sdk/emulator -avd <emulator name>`)

## Get Cabin

Install Cabin for iOS or Android on the application stores:

* [iTunes](https://itunes.apple.com/us/app/cabin-manage-kubernetes-applications/id1137054392?mt=8)
* [Play store](https://play.google.com/store/apps/details?id=com.skippbox.cabin&hl=en)

## Contributing

Check our contributing [guidelines](CONTRIBUTING.md) and send your pull requests.

## Issues

If you face any issues with Cabin, please create an [issue](https://github.com/bitnami/cabin/issues)

**Note** that to preserve as much history as possible we imported a good number of issues from our private repo and the cabin-issues repository.

## Code of Conduct

Cabin abides by the Kubernetes [Code of Conduct](code-of-conduct.md)

## Sponsor

Cabin is brought to you thanks to [Bitnami](https://bitnami.com). Cabin was developed by Skippbox and joined the Bitnami portfolio of Kubernetes products after Skippbox's [acquisition](https://thenewstack.io/skippbox-enterprise-building-kubernetes-bitnami/).

