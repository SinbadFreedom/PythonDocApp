import React, {Component} from 'react';
import {
    AppRegistry,
    WebView,
    StatusBar,
    StyleSheet,
    View,
    BackHandler,
    ToastAndroid
} from 'react-native';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1FB9FF',
        borderWidth: 0
    },
});

const WEB_VIEW_REF = "webView";
const WEB_ROOT = "http://apetools.cn/html_python/";

const STAGE_STATE_0 = 0;
const STAGE_STATE_1 = 1;
const STAGE_STATE_2 = 2;

class PythonDocApp extends Component {

    constructor(props) {
        super(props);
        this.state = {};

        //// 每1000毫秒对showText状态做一次取反操作
        //setInterval(() => {
        //    this.setState(previousState => {
        //        return {showText: !previousState.showText};
        //    });
        //}, 1000);
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.backHandler);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandler);
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

    render() {
        return (
            <View style={styles.container}>
                <StatusBar hidden={true}></StatusBar>
                <WebView
                    ref={WEB_VIEW_REF}
                    source={ {uri : WEB_ROOT}}
                    onNavigationStateChange={this.onNavigationStateChange.bind(this)}
                />
            </View>
        );
    }

    onNavigationStateChange(navState) {
        this.setState({
            backButtonEnabled: navState.canGoBack
            //forwardButtonEnabled: navState.canGoForward,
            //url: navState.url,
            //status: navState.title,
            //loading: navState.loading,
            //scalesPageToFit: true
        });
    }

}

AppRegistry.registerComponent('PythonDocApp', () => PythonDocApp);
