'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    WebView,
    StatusBar,
    StyleSheet,
    View,
    BackHandler,
    ToastAndroid,
    Text,
    Button,
    ActivityIndicator,
    PermissionsAndroid,
    Platform
} from 'react-native';


import RNFetchBlob from 'react-native-fetch-blob';

const packageInfo = require("../package.json");

const diff_match_patch = require("./diff_match_patch_uncompressed.js");
const dmp = new diff_match_patch();

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1FB9FF',
        borderWidth: 0
    },
    alignCenter: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 8,
    },
});

const WEB_VIEW_REF = "webView";

class DocApp extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true
        };
    }

    componentDidMount() {
        if (Platform.OS === 'android') {
            BackHandler.addEventListener('hardwareBackPress', this.backHandler);
            this.requestAndroidPermission();
        }
        this.loadBundleFileFull();
    }

    loadBundleFileFull = async () => {
        const LOCAL_BUNDLE = RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files/index.android.bundle';
        const SERVER_BUNDLE_FULL = "http://apetools.cn/bundle/" + packageInfo.name + "/" + Platform.OS + "/full/" + packageInfo.version + "/index.android.bundle";
        const SERVER_BUNDLE_PATH = "http://apetools.cn/bundle/" + packageInfo.name + "/" + Platform.OS + "/path/" + packageInfo.version + "/index.android.bundle";

        let bundleText = '';
        let pathText = '';
        /** 没有下载过bundle文件，下载全版本*/
        await RNFetchBlob.fs.exists(LOCAL_BUNDLE)
            .then((exists) => {
                return new Promise(function (resolver, reject) {
                    console.log("[ 1 LOCAL_BUNDLE exists: ]", exists);
                    if (exists) {
                        /** read from local*/
                        console.log("[ 3 LOCAL_BUNDLE exists: ]", exists);
                        RNFetchBlob.fs.readFile(LOCAL_BUNDLE, "utf8")
                            .then((bundleFile) => {
                                bundleText = bundleFile;
                                console.log(" 4 [readFile bundleFile: ] " + bundleFile.length);
                                resolver();
                            })
                            .catch((error) => {
                                console.log("[ 5 readFile oldBundleText: error ] " + error);
                                reject(error);
                            });
                    } else {
                        /** fecth from web*/
                        console.log(" 2 SERVER_BUNDLE_FULL", SERVER_BUNDLE_FULL);
                        fetch(SERVER_BUNDLE_FULL, {method: 'GET'})
                            .then((response) => {
                                console.log("[ 6 load response._bodyInit ] ", response._bodyInit.length);
                                bundleText = response._bodyInit;
                                resolver();
                            })
                            .catch((error)=> {
                                console.log(" 7 SERVER_BUNDLE_FULL error: ", error);
                                reject(error);
                            });
                    }
                });
            }).then(() => {
                /** download path*/
                console.log("[ 8 read SERVER_BUNDLE_PATH : ] ", SERVER_BUNDLE_PATH);
                return new Promise(function (resolver, reject) {
                    fetch(SERVER_BUNDLE_PATH, {method: 'GET'})
                        .then((response) => {
                            console.log("[ 9 load SERVER_BUNDLE_PATH response._bodyInit ] ", response._bodyInit.length);
                            pathText = response._bodyInit;
                            resolver();
                        })
                        .catch((error)=> {
                            console.log("[ 10 load SERVER_BUNDLE_PATH: error ] " + error);
                            reject(error);
                        });
                });
            }).then(() => {
                return new Promise(function (resolver, reject) {
                    /** merge*/
                    let patches = dmp.patch_fromText(pathText);
                    let results = dmp.patch_apply(patches, bundleText);
                    let mergeText = results[0];
                    console.log("[ 11 mergePath oldBundleText: ] ", bundleText);
                    console.log("[ 12 mergePath mergeText: ] ", mergeText);
                    RNFetchBlob.fs.writeFile(LOCAL_BUNDLE, mergeText, 'utf8"')
                        .then(() => {
                            console.log("[ 13 mergePath patchText OK! ] ");
                            resolver();
                        })
                        .catch((error) => {
                            console.log("[ 14 mergePath patchText error: ] ", error);
                            reject(error);
                        });
                });
            }).then(() => {
                console.log("[ 15 isLoading state] ");
                this.setState({isLoading: false}, function () {
                })
            }).catch((error) => {
                //TODO error restart
                console.log('[ 00 catch error: ]', error);
            })
    };

    componentWillUnmount() {
        if (Platform.OS === 'android') {
            BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
        }
    }

    backHandler = () => {
        if (this.state.backButtonEnabled) {
            this.refs[WEB_VIEW_REF].goBack();
            return true;
        } else {
            if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
                /** 最近2秒内按过back键，可以退出应用*/
                return false;
            }
            this.lastBackPressed = Date.now();
            ToastAndroid.show('再按一次退出应用', ToastAndroid.SHORT);
            return true
        }
    };

    requestAndroidPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
                {
                    'title': '需要读写权限',
                    'message': '启禀皇上:本应用需要存储权限存储数据'
                }
            );
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                console.log("You can use WRITE_EXTERNAL_STORAGE")
            } else {
                console.log("WRITE_EXTERNAL_STORAGE permission denied")
            }
        } catch (err) {
            console.warn(err)
        }
    };

    render() {
        if (this.state.isLoading) {
            return (
                <View style={styles.alignCenter}>
                    <ActivityIndicator size="large"/>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}></StatusBar>
                <WebView
                    ref={WEB_VIEW_REF}
                    source={ {uri: packageInfo.webRoot + "/?channel=" + packageInfo.channel}}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                />
            </View>
        );
    }

    onNavigationStateChange(navState) {
        this.setState({
            backButtonEnabled: navState.canGoBack
        });
    }
}

AppRegistry.registerComponent(packageInfo.name, () => DocApp);
