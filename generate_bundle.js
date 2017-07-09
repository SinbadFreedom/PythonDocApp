'use strict';

/**
 * Created by sinbad on 2017/7/9.
 */
const fs = require("fs");
const path = require("path");
const exec = require('child_process').exec;

const packageInfo = require("./package.json");
const VERSION_ASSETS_DEST_FOLDER = '../BundleFile/' + packageInfo.name + "/android/full/" + packageInfo.version;
const VERSION_BUNDLE_OUTPUT_FILE = VERSION_ASSETS_DEST_FOLDER + "/index.android.bundle";

function mkdirsSync(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    } else {
        if (mkdirsSync(path.dirname(dirname))) {
            console.log("mkdir : ", dirname);
            fs.mkdirSync(dirname);
            return true;
        }
    }
}

mkdirsSync(VERSION_ASSETS_DEST_FOLDER);

const cmdStr = "set BABEL_DISABLE_CACHE=1 babel-node script.js && react-native bundle --entry-file index.android.js --bundle-output "
               + VERSION_BUNDLE_OUTPUT_FILE
               + " --platform android --assets-dest " + VERSION_ASSETS_DEST_FOLDER + " --dev false";

console.log("cmdStr: ", cmdStr);
exec(cmdStr, function (error, stdout, stderr) {
    if (error) {
        console.log('error:', error);
    } else {
        console.log("stdout: ", stdout);
    }
});

/** generate latest bundle file*/
const LATEST_ASSETS_DEST_FOLDER = '../BundleFile/' + packageInfo.name + "/android/latest";
const LATEST_BUNDLE_OUTPUT_FILE = LATEST_ASSETS_DEST_FOLDER + "/index.android.bundle";

let latestFolderExist = fs.existsSync(LATEST_ASSETS_DEST_FOLDER);
if (!latestFolderExist) {
    mkdirsSync(LATEST_ASSETS_DEST_FOLDER);
}

/** latest bundle*/
const cmdStr1 = "set BABEL_DISABLE_CACHE=1 babel-node script.js && react-native bundle --entry-file index.android.js --bundle-output " + LATEST_BUNDLE_OUTPUT_FILE
                + " --platform android --assets-dest " + LATEST_ASSETS_DEST_FOLDER + " --dev false";

exec(cmdStr1, function (error, stdout, stderr) {
    if (error) {
        console.log('error:', error);
    } else {
        console.log("stdout: ", stdout);
    }
});
