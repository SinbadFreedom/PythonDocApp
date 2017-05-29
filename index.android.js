'use strict';

import React, {Component} from 'react';
import {
    AppRegistry,
    StatusBar,
    WebView,
    StyleSheet,
    View,
    Image,
    ViewPagerAndroid,
    BackHandler
} from 'react-native';

import {ViewPagerScrollState} from 'ViewPagerAndroid';

var BGCOLOR = ['#fdc08e', '#fff6b9', '#99d1b7', '#dde5fe', '#f79273'];
var IMAGE_URIS = [
    'http://apod.nasa.gov/apod/image/1410/20141008tleBaldridge001h990.jpg',
    'http://apod.nasa.gov/apod/image/1409/volcanicpillar_vetter_960.jpg',
    'http://apod.nasa.gov/apod/image/1409/m27_snyder_960.jpg',
    'http://apod.nasa.gov/apod/image/1409/PupAmulti_rot0.jpg',
    'http://apod.nasa.gov/apod/image/1510/lunareclipse_27Sep_beletskycrop4.jpg',
];

var PythonDocApp = React.createClass({
                                         statics: {
                                             title: '<ViewPagerAndroid>',
                                             description: 'Container that allows to flip left and right between child views.'
                                         },
                                         getInitialState: function () {
                                             return {
                                                 page: 0,
                                                 animationsAreEnabled: true,
                                                 scrollEnabled: true,
                                                 progress: {
                                                     position: 0,
                                                     offset: 0,
                                                 },
                                             };
                                         },

                                         onPageSelected: function (e) {
                                             this.setState({page: e.nativeEvent.position});
                                         },

                                         onPageScroll: function (e) {
                                             this.setState({progress: e.nativeEvent});
                                         },

                                         onPageScrollStateChanged: function (state: ViewPagerScrollState) {
                                             this.setState({scrollState: state});
                                         },

                                         move: function (delta) {
                                             var page = this.state.page + delta;
                                             this.go(page);
                                         },

                                         go: function (page) {
                                             if (this.state.animationsAreEnabled) {
                                                 this.viewPager.setPage(page);
                                             } else {
                                                 this.viewPager.setPageWithoutAnimation(page);
                                             }

                                             this.setState({page});
                                         },

                                         render: function () {
                                             var pages = [];
                                             for (var i = 0; i < IMAGE_URIS.length; i++) {
                                                 var pageStyle = {
                                                     backgroundColor: BGCOLOR[i % BGCOLOR.length],
                                                     alignItems: 'center',
                                                     padding: 20,
                                                 };
                                                 pages.push(
                                                     <View key={i} style={pageStyle} collapsable={false}>
                                                         <Image
                                                             style={styles.image}
                                                             source={{uri: IMAGE_URIS[i % BGCOLOR.length]}}
                                                         />
                                                     </View>
                                                 );
                                             }

                                             pages.push(
                                                 <View style={styles.container}>
                                                     <StatusBar hidden={true}></StatusBar>
                                                     <WebView source={ {uri : 'http://139.59.45.254/html/'}}
                                                              onNavigationStateChange={(event) =>{console.log("onNavigationStateChange: " + event)}}
                                                              onMessage={(event) => {console.log(" onMessage " + event.nativeEvent)}}>
                                                     </WebView>
                                                     {/*<WebView source={require("./html/index.html")}/>*/}
                                                 </View>
                                             );

                                             return (
                                                 <View style={styles.container}>
                                                     <ViewPagerAndroid
                                                         style={styles.viewPager}
                                                         initialPage={0}
                                                         scrollEnabled={this.state.scrollEnabled}
                                                         onPageScroll={this.onPageScroll}
                                                         onPageSelected={this.onPageSelected}
                                                         onPageScrollStateChanged={this.onPageScrollStateChanged}
                                                         pageMargin={10}
                                                         ref={viewPager => { this.viewPager = viewPager; }}>
                                                         {pages}
                                                     </ViewPagerAndroid>
                                                 </View>
                                             );
                                         },
                                     });

var styles = StyleSheet.create({
                                   container: {
                                       flex: 1,
                                       backgroundColor: 'white',
                                   },
                                   image: {
                                       width: 300,
                                       height: 200,
                                       padding: 20,
                                   },
                                   viewPager: {
                                       flex: 1,
                                   },
                               });

BackHandler.addEventListener('hardwareBackPress', function() {
    console.log("-----------------");
    // this.onMainScreen and this.goBack are just examples, you need to use your own implementation here
    // Typically you would use the navigator here to go to the last state.
    // return true;
    // if (!this.onMainScreen()) {
    //     this.goBack();
    //     return true;
    // }
    // return false;
    return true;
});

AppRegistry.registerComponent('PythonDocApp', () => PythonDocApp);