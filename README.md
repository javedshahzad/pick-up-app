
# Pick-up-app - Ionic 6 and angular 14


## Using this project

#### Node

This project is tested on latest stable version of Node 14 and above Make sure you have a node version close to this.

You can download the correct version from the [download page](https://nodejs.org/en/download/) for node.


To verify the node installation, open a new terminal window and run:

```
$ node --version
$ npm --version
```

#### Cordova

You must have cordova installed prior to this. Install Cordova using


```
$ npm install -g cordova
```

The `ios-sim` and `ios-deploy` are utilities that deploy apps to the iOS simulator and iOS devices during development. They can be installed globally with npm.

```
$ npm install -g ios-sim
$ brew install ios-deploy
```

#### Install angular

```
$ npm install -g @angular/cli

```

#### Ionic

Install Ionic globally using

```
$ npm install -g ionic
```

## Installation of this project

* Extract the zip file you received after purchase

* Install npm dependecies

```
$ npm install
```
* Install Resources
```
$ ionic cordova resources
```


* Add Platform (whichever required)
```
$ ionic cordova platform add android

$ ionic cordova platform add ios
```

in few cases, you might need to install the latest platform

```
$ ionic cordova platform add android@latest

$ ionic cordova platform add ios@latest
```

## Run app on local server

```
$ ionic serve
```
This will run app in your browser

## Run app on device

```
$ ionic cordova prepare android

$ ionic cordova prepare ios
```

You can run the apps on device or Simulators from Android Studio/Xcode for Android / iOS.

Or you can run directly from CLI

``` 
$ ionic cordova run android

$ ionic cordova run ios
```
