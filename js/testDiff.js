var diff_match_patch = require('./diff_match_patch_uncompressed.js');

var text1 = "hahah";
var text2 = "heihei";

var dmp = new diff_match_patch();
var patch_text = '';

function diff_launch() {
    var diff = dmp.diff_main(text1, text2, true);
    var patch_list = dmp.patch_make(text1, text2, diff);
    patch_text = dmp.patch_toText(patch_list);
    console.log("patch_text " + patch_text);
}

function patch_launch() {
    var patches = dmp.patch_fromText(patch_text);
    var results = dmp.patch_apply(patches, text1);
    var finalText = results[0];
    console.log("finalText ", finalText);
    results = results[1];
    for (var x = 0; x < results.length; x++) {
        if (results[x]) {
            console.log("Ok");
        } else {
            console.log("Fail");
        }
    }
}

diff_launch();
patch_launch();