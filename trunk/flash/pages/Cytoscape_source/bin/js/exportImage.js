// This is the part where I set up the three adapters.
// Please choose the one you need and discard others.
// I did this because I observed that in some frameworks (especially ExtJS),
// using the standard DOM modifiers breaks up the framework's inner workings.
 
OFC = {}
 
OFC.prototype = {
    name: "Prototype",
    version: function(src) { return $(src).get_version() },
    rasterize: function (src, dst) { $(dst).replace(new Element("img", {src: Control.OFC.image(src)})) },
    image: function(src) {return "data:image/png;base64," + $(src).get_img_binary()},
    popup: function(src) {
        var img_win = window.open('', 'Charts: Export as Image')
        with(img_win.document) {
            write("<html><head><title>Charts: Export as Image<\/title><\/head><body><img src='" + Control.OFC.image(src) + "' /><\/body><\/html>") }
     }
}
 
OFC.jquery = {
    name: "jQuery",
    version: function(src) { return $('#'+ src)[0].get_version() },
    rasterize: function (src, dst) { $('#'+ dst).replaceWith(Control.OFC.image(src)) },
    image: function(src) { return "<img src='data:image/png;base64," + $('#'+src)[0].get_img_binary() + "' />"},
    popup: function(src) {
        var img_win = window.open('', 'Charts: Export as Image')
        with(img_win.document) {
            write('<html><head><title>Charts: Export as Image<\/title><\/head><body>' + Control.OFC.image(src) + '<\/body><\/html>') }
     }
}
 
OFC.none = {
    name: "pure DOM",
    version: function(src) { return document.getElementById(src).get_version() },
    rasterize: function (src, dst) {
      var _dst = document.getElementById(dst)
      e = document.createElement("div")
      e.innerHTML = Control.OFC.image(src)
      _dst.parentNode.replaceChild(e, _dst);
    },
    image: function(src) {return "<img src='data:image/png;base64," + document.getElementById(src).get_img_binary() + "' />"},
    popup: function(src) {
        var img_win = window.open('', 'Charts: Export as Image')
        with(img_win.document) {
            write("<html><head><title>Charts: Export as Image<\/title><\/head><body>" + Control.OFC.image(src) + "<\/body><\/html>") }
     }
}
 
// Using an object as namespaces is JS Best Practice. I like the Control.XXX style.
if (!Control) {var Control = {}}
 
// By default, right-clicking on OFC and choosing "save image locally" calls this function.
// You are free to change the code in OFC and call my wrapper (Control.OFC.your_favorite_save_method)
function save_image() { Control.OFC.popup('img_chart_1') }
 