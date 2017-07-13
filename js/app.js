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
        console.log("-------------------------------------------4");
        const LOCAL_BUNDLE_FULL = RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files/index.android.bundle_' + packageInfo.version;
        const LOCAL_BUNDLE_PATH = RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files/index.android.bundle.path_' + packageInfo.version;
        const SERVER_BUNDLE_FULL = "http://apetools.cn/bundle/" + packageInfo.name + "/" + Platform.OS + "/full/" + packageInfo.version + "/index.android.bundle";
        const SERVER_BUNDLE_PATH = "http://apetools.cn/bundle/" + packageInfo.name + "/" + Platform.OS + "/path/" + packageInfo.version + "/index.android.bundle";
        const LOCAL_BUNDLE = RNFetchBlob.fs.dirs.SDCardApplicationDir + '/files/index.android.bundle';

        let oldBundleText = '';
        /** 没有下载过bundle文件，下载全版本*/
        await RNFetchBlob.fs.exists(LOCAL_BUNDLE_FULL)
            .then((exists) => {
                console.log("-------------------------------------------5");
                if (exists) {
                    console.log("loadBundleFileFull exists", exists);
                    return Promise.resolve();
                } else {
                    console.log("loadBundleFileFull !exists", exists);
                    console.log("SERVER_BUNDLE_FULL", SERVER_BUNDLE_FULL);
                    console.log("LOCAL_BUNDLE_FULL", LOCAL_BUNDLE_FULL);
                    return new Promise(function (resolver, reject) {
                        RNFetchBlob.config({
                            // response data will be saved to this path if it has access right.
                            fileCache: true,
                            path: LOCAL_BUNDLE_FULL
                        }).fetch('GET', SERVER_BUNDLE_FULL, {
                            //some headers ..
                        }).then((res) => {
                            console.log("-------------------------------------------51");
                            // the path should be dirs.DocumentDir + 'path-to-file.anything'
                            //oldBundleText = fs.readFileSync(LOCAL_BUNDLE_FULL, 'utf-8');
                            //TODO edit oldBundleText
                            oldBundleText = "";
                            console.log('loadBundleFileFull saved to ', res.path());
                            return resolver(true);
                        }).catch((error) => {
                            console.log('load SERVER_BUNDLE_FULL error: ', error);
                            return reject(error);
                        });
                    });
                }
            }).then(() => {
                console.log("-------------------------------------------6");
                return new Promise(function (resolver, reject) {
                    RNFetchBlob.fs.readFile(LOCAL_BUNDLE_FULL, "utf8")
                        .then((res) => {
                            console.log("-------------------------------------------61 res " + res);
                            return resolver(res);
                        })
                        .catch((error) => {
                            console.log("-------------------------------------------62 error " + error);
                            return reject();
                        });
                });
            }).then((text) => {
                console.log("-------------------------------------------7");
                console.log("text: ", text);
                oldBundleText = text;
            }).then(() => {
                console.log("-------------------------------------------8");
                /** 下载path*/
                RNFetchBlob.config({
                    // response data will be saved to this path if it has access right.
                    fileCache: true,
                    path: LOCAL_BUNDLE_PATH
                }).fetch('GET', SERVER_BUNDLE_PATH, {
                    //some headers ..
                }).then((res) => {
                    console.log("-------------------------------------------9");
                    console.log('loadBundleFilePath saved to ', res.path());
                    console.log("LOCAL_BUNDLE_PATH", LOCAL_BUNDLE_PATH);
                    let patchText = "";
                    /** merge*/
                    let patches = dmp.patch_fromText(patchText);
                    let results = dmp.patch_apply(patches, oldBundleText);
                    let mergeText = results[0];
                    console.log("oldBundleText: ", oldBundleText);
                    console.log("mergeText: ", mergeText);
                    RNFetchBlob.fs.writeFile(LOCAL_BUNDLE, mergeText, 'utf8"').then(() => {
                        console.log("-------------------------------------------91");
                    });
                }).then((res) => {
                    console.log("-------------------------------------------10");
                    console.log("writeFile res", res);
                    this.setState({isLoading: false}, function () {
                        // do something with new state
                    });
                }).catch((error) => {
                    console.log('---2 error: ', error);
                    this.setState({isLoading: false}, function () {
                        // do something with new state
                    });
                });
            }).catch((error) => {
                console.log('-----1 catch error: ', error);
            });
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
                <View style={{flex: 1, paddingTop: 20}}>
                    <ActivityIndicator />
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}></StatusBar>
                <WebView
                    ref={WEB_VIEW_REF}
                    source={ {uri: packageInfo.webRoot}}
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
