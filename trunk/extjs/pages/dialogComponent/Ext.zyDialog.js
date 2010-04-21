/**
 * @class Ext.ux.aboutDialog
 * @extends Ext.window
 * @cfg isXXL {Boolean} (Optional) true if about Dialog will look more larger(for some skins/thmem).
 * @cfg AppName {String} Application Name
 * @cfg AppVersion {String}  Application Version
 * @cfg AppText {String}  Text to display about App.
 * @cfg AppLinkHref {String}  The App. URL to open with new Window.
 * @cfg AppLinkText {String}  The App. URL to display text,must be started with 'http://'
 * @cfg showExtJS {Boolean} (Optional) true if show the text about ExtJS
 * @cfg ExtVersion {String} (Optional) the version of Ext
 * @cfg icon {String} (Optional) App. icon path ,size in 15x15 is better
 * @cfg picture {String}  The picture on dialog's left,size in 15x15 is better
 **/
Ext.ux.aboutDialog = Ext.extend(Ext.Window, {
    modal: true,
    resizable: false,
    title: "关于deepCMS",
    width: 488,
    height: Ext.isIE?350:343,
    //default config
    isXXL: false,
    showExtJS: true,
    ExtVersion: '3.0',
    initComponent: function(){
        this.html = {
            tag: 'table',
            style: 'border:2px solid white;background:#f4f4f4',
            children: {
                tag: 'tr',
                children: [{
                    tag: 'td',
                    valign: 'top',
                    style: 'background-color:white;',
                    children: {
                        tag: 'img',
                        //                  height:316,
                        src: this.picture
                    }
                }, {
                    tag: 'td',
                    valign: 'top',
                    children: [{
                        tag: 'div',
                        cls: 'aboutDlg',
                        html: '<p style="text-align:right;" mce_style="text-align:right;">' +
                        '当前版本：' +
                        this.AppVersion +
                        '<br />Powered by ExtJs UI Engine<br />Ext All in One Lib:Ext.ux.Helper v0.3' +
                        '</p>' +
                        '<p>' +
                        'Extjs and Extjs logos and trademarks of Ext JS, LLC.All rights reserved.<br />' +
                        this.AppText +
                        '</p><br />' +
                        '<p>' +
                        'deepCMS采用<a rel="license" target="_blank" href="http://creativecommons.org/licenses/LGPL/2.1/deed.zh" mce_href="http://creativecommons.org/licenses/LGPL/2.1/deed.zh">' +
                        'CC-GNU LGPL协议</a>进行许可。' +
                        '</p>'
                    }, {
                        tag: 'div',
                        cls: 'aboutDlg_btn',
                        html: String.format('<br />' +
                        '<button style="width:75%;margin-right:8px;">' +
                        ' Upgrde/Support：{0}</button>' +
                        '<button>OK</button>', this.AppLinkText)
                    }]
                }]
            }
        }
        Ext.ux.aboutDialog.superclass.initComponent.call(this);
        this.on('render', this.myRender, this, {delay: 10});
    },
    //@overloaded
    myRender: function(){
        this.getEl().child('button:first').on('click', function(){
            window.open(this);
        }, this.AppLinkHref);
        this.body.child('button:last').on('click', function(){this.close();}, this);
    }
});