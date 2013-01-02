
var alertFallback = false;
if (typeof console === "undefined" || typeof console.log === "undefined") {
    console = {};
    if (alertFallback) {
        console.log = function (msg) {
            alert(msg);
        };
    } else {
         console.log = function () {};
    }
}

var vspUtils = {};
vspUtils.ajaxSetup = function(){
    jQuery.support.cors = true;
};


