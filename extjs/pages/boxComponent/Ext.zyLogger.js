Ext.ns('Ext.ux.Logger');
Ext.ux.Logger = Ext.extend(Ext.BoxComponent, {
    tpl: new Ext.Template("<li class='x-log-entry x-log-{0:lowercase}-entry'>", "<div class='x-log-level'>", "{0:capitalize}", "</div>", "<span class='x-log-time'>", "{2:date('H:i:s.u')}", "</span>", "<span class='x-log-message'>", "{1}", "</span>", "</li>"),
    autoEl: {
        tag: 'ul',
        cls: 'x-logger'
    },
    
    autoHide: false,
    onMove:function (){alert('');},
    onRender: function(){
        Ext.ux.Logger.superclass.onRender.apply(this, arguments);
        this.contextMenu = new Ext.menu.Menu({
            items: [new Ext.menu.CheckItem({
                id: 'debug',
                text: 'Debug',
                checkHandler: Ext.ux.Logger.prototype.onMenuCheck,
                scope: this
            }), new Ext.menu.CheckItem({
                id: 'info',
                text: 'Info',
                checkHandler: Ext.ux.Logger.prototype.onMenuCheck,
                scope: this
            }), new Ext.menu.CheckItem({
                id: 'warning',
                text: 'Warning',
                checkHandler: Ext.ux.Logger.prototype.onMenuCheck,
                scope: this
            }), new Ext.menu.CheckItem({
                id: 'error',
                text: 'Error',
                checkHandler: Ext.ux.Logger.prototype.onMenuCheck,
                scope: this
            })]
        });
        this.el.on('contextmenu', this.onContextMenu, this);
    },
    onContextMenu: function(e){
        this.contextMenu.logger = this;
        this.contextMenu.showAt(e.getXY());
        e.preventDefault()

    },
    onMenuCheck: function(checkItem, state){
        var logger = checkItem.parentMenu.logger;
        var cls = 'x-log-show-' + checkItem.id;
        if (state) {
            logger.el.addClass(cls);
        }
        else {
            logger.el.removeClass(cls);
        }
    },
    debug: function(msg){
        this.tpl.insertFirst(this.el, ['debug', msg, new Date()]);
        this.el.scrollTo("top", 0, true);
    },
    info: function(msg){
        this.tpl.insertFirst(this.el, ['info', msg, new Date()]);
        this.el.scrollTo("top", 0, true);
    },
    warning: function(msg){
        this.tpl.insertFirst(this.el, ['warning', msg, new Date()]);
        this.el.scrollTo("top", 0, true);
    },
    error: function(msg){
        this.tpl.insertFirst(this.el, ['error', msg, new Date()]);
        this.el.scrollTo("top", 0, true);
    }
});
