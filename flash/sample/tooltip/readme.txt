Here is another class that I just wrote which creates a tooltip using the drawing API. All you do is create a single instance and then use the ¡§showTip()¡¨ method to show it and change the text. You send the fill and stroke colors in hex format to the constructor. See the usage below:

[as]var tt:Tooltip = new Tooltip(0xFFFFEC,0¡Ñ000000);
butt1.onRollOver = function() {
tt.showTip(¡¨Button 1 Tip¡¨);
}
butt1.onRollOut = function() {
tt.removeTip();
}[/as]
