## Setting Up Project

These tools need to be installed on your local machine, you will need them to run the project:

**Installing brew**
```
/usr/bin/ruby -e “$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```
**Installing nvm**

Node Version Manager. `nvm` allows to manage multiple versions of Node.
Use installation instructions from https://github.com/creationix/nvm#install-script.

Sample command:
```
curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.11/install.sh | bash
```

**Install node**

We use `11.13.0`. Install it and make it the default as follows:
```
nvm install 11.13.0
nvm alias default 11.13.0
nvm use 11.13.0
```

**Install avn**

Automatic Version Switching for Node. This packages allow to switch Node versions
based on a `.node-version` file inside the project. With `avn` the switch
will happen automatically:

```
npm install -g avn avn-nvm
avn setup
```

**Install watchman**

Watchman is a tool by Facebook for watching changes in the filesystem.
```
brew update
brew install watchman
```

**Install React Native CLI**

Node comes with npm, which lets you install the React Native command line interface
```
npm install -g react-native-cli
```

**Java Development Kit**

React Native requires version 8 of the Java SE Development Kit (JDK). You may download and install `OpenJDK` from [AdoptOpenJDK](https://adoptopenjdk.net/) or or your system packager. You may also Download and [install Oracle JDK 8 if desired](https://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html).

**Android Studio**

* [Download](https://developer.android.com/studio/) installer
* Install
* Create Virtual Device (Google Nexus 5, API 24)

Add android platform tools in PATH

```
export ANDROID_HOME=/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/tools:$ANDROID_HOME/platform-tools
```

**XCode**
Install from AppStore

**Install Node dependencies with NPM**

```
npm install
```

**Run App in simulator**

*Start development server*
```
npm run start
```

[starting simulators](https://medium.com/@daspinola/setting-up-android-and-ios-emulators-22d82494deda)

*Android emulator*

* Launch emulator using avd manager* for [more info](https://developer.android.com/studio/run/emulator) on how to start emulator    

* Run the app in emulator
```
npm run android
```

*IOS emulator*

* Make sure u have simulator for `iPhone 8`
* Run the app in iphone 8 simulator
```
npm run iphone
```

**Running UnitTests**
```
npm run test
```

**Versioning**

We use [npm version](https://docs.npmjs.com/cli/version) for versioning our code. It will automatically update version of both android and ios
We are using [react-native-version](https://github.com/stovmascript/react-native-version) for updating versions

To create a patch release
```
 npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git]
 git push --follow-tags
```

**Creating QA build android**
```
cd android
./gradlew clean buildQaDebug -x lint
cd ..
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
cd android
./gradlew assembleQaDebug
```

android apk will be  available in android/app/build/outputs/apk/qa/debug/

### Useful articles/links
* Style Guides
    * [Javascript - airbnb style guide](https://github.com/airbnb/javascript)
    * [React - airbnb style guide](https://github.com/airbnb/javascript/tree/master/react)
* [Splash Screen](https://medium.com/@appstud/add-a-splash-screen-to-a-react-native-app-810492e773f9)
* Components
    * [Native Base](https://docs.nativebase.io/Components.html#Components)
    * [Icons](https://github.com/oblador/react-native-vector-icons)
* Navigation/Router
    * [React native router flux](https://github.com/aksonov/react-native-router-flux/blob/master/docs/API.md)
* Directory and file Structure
    * [State-View Pattern](https://asleepysamurai.com/articles/organizing-your-react-redux-codebase)
    * [ducks pattern](https://www.freecodecamp.org/news/scaling-your-redux-app-with-ducks-6115955638be/)
    * Group by Application Feature
* [Story Book](https://storybook.js.org/docs/guides/guide-react-native/) - Very useful tool for developing individual screens very fast.
    * [Tutorial](https://www.reactnativeschool.com/building-a-component-library/build-a-button-component)
* [i18next](https://react.i18next.com/latest/using-with-hooks)
    * [Tutorial](https://www.youtube.com/watch?v=L2vaocDlg-s)
    * [List of locales](https://gist.github.com/ndbroadbent/b1e96c4e0137223c53d0410e060b9fc0)
    * [Interpolation/Pass params](https://www.i18next.com/translation-function/interpolation)
* CheatSheat
    * [FlexBox](https://medium.com/wix-engineering/the-full-react-native-layout-cheat-sheet-a4147802405c)
* UnitTesting
    * [Jest mocks](https://medium.com/@rickhanlonii/understanding-jest-mocks-f0046c68e53c)
    
* Some useful articles
    * [Performance Limitations of React Native and How to Overcome Them](https://medium.com/@talkol/performance-limitations-of-react-native-and-how-to-overcome-them-947630d7f440)
    * [Building React Native app for multiple environments](https://medium.com/@ywongcode/building-multiple-versions-of-a-react-native-app-4361252ddde5)

* Branching
    * [git flow](https://nvie.com/posts/a-successful-git-branching-model/)
    * [github flow](https://guides.github.com/introduction/flow/)
    * **[gitlab flow](https://docs.gitlab.com/ee/workflow/gitlab_flow.html)**(we use this with)
    * [When to go for which workflow](https://stackoverflow.com/questions/18188492/what-are-the-pros-and-cons-of-git-flow-vs-github-flow)
* E2E
    * [Detox](https://github.com/wix/react-native-crash-course/blob/master/docs/App.e2e.md)
* [How to add fonts](https://medium.com/@kswanie21/custom-fonts-in-react-native-tutorial-for-ios-android-76ceeaa0eb78)        
