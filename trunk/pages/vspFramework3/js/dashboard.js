

/*PORTLET Define

   {
        "id": "CPEPortlet",
        "name": "CPE Portlet",
        "url": "portlet/portletGPE/portlet.php",
        "params":{
            "otherVals": 10
             
        },
        "acl":{
            "admin": [1, 1, 1], 
            "user": [1, 1, 1]
        }
   }

*/
      
            
//--Portlet
var PortletView = Backbone.View.extend({
/*
    loadTemplateAsync: function(tmpId){
        var promise = promises[tmpId] || $.get("/templates/" + tmpId + ".html");
        promises[tmpId] = promise;
        return promise;
    },
    loadTemplate : function(templateId, callback){
        var tmpId = templateId.replace("#", "");
        var promise = loadTemplateAsync(tmpId);
        promise.done(function(template){
          callback.call(this, $(template));
        });
    }
 */
 template: "",
 portletView: "portlet.html",
 portletModule: "module",
 tagName: "li",
 render: function(){
    var that = this;
    var url = this.model.get("url");
    var viewUrl = url+ that.portletView;
    var promise = $.get(viewUrl);
    var moduleUrl = url+"/"+ that.portletModule;
    
    promise.done(function(template){

        that.template = _.template(template);
        var param = that.model.toJSON();
        var config = that.model.get('config');
        var deps = that.model.get('deps');
        param.id =  param.id +"_"+ that.cid;
        var htmlStr = that.template(param);
        that.$el.html(htmlStr);
        that.$el.id = param.id ;
        that.$el.attr('id', param.id);
        that.$el.addClass("widget ui-widget");

        require([ moduleUrl ], function(_module) {
            _module.init(that.$el, config);
        });

        that.trigger("done");
    });
 } 
});

var PortletModel = Backbone.Model.extend({
    defaults: {
      id: null,
      name: '',
      url:"",
      params:{},
      acl: {}
    },
    initialize: function(param, collectionOpts){
       if(collectionOpts == undefined){
            
       }
    },
    validate: function(attrs){},
    fetch: function(){
        var that = this;
        this.view = new PortletView({model: this});
        this.view.render();
        this.view.on('done', function(){
             that.trigger("done");
        });
    }
});



var PortletItemView = Backbone.View.extend({
    initialize: function(param){
        this.model = param.model;
        this.parentView = param.parentView;
    },
    template: _.template($("#addPortletItem-template").html()),
    render: function(){
        var that = this;
        this.$el.html(this.template(this.model));
        this.$el.click(function(){
            that.parentView.model.addPortlet(that.model);
        });
        return this;
    }
});

//--Dashboard
var DashboardView = Backbone.View.extend({
    initialize: function(param){
        this.model = param.model;
    },
    //tagName: 'tr',
    template: _.template($("#addPortlet-template").html()),
    allowList: [],
    render: function(){
        var that = this;
        this.allowList = this.model.filterRole(0, 1); //filter the adding list
        this.$el.html(this.template());
        var $dropMenu =  this.$el.find(".dropdown-menu");
        
        $.each(this.allowList, function(i, t){
            var itemView = new PortletItemView({model: t, parentView: that});
            $dropMenu.append(itemView.render().el);
        });
        
        if(this.allowList.length == 0){
             this.$el.css("visibility", "hidden");
        }
        
        /*
        this.$el.click(function(e){
           var $item = $(e.target);
           
           var porletid = $item.attr("pltid"); 
       
           if(typeof porletid != "undefined"){
                this.model.addPortlet(porletid);
           }
        });
        */
        return this;
    }
});



var DashboardModel = Backbone.Collection.extend({
    model: PortletModel,
    opts:{
         user: "",
         role: "",
         url: ""
    },
    uiContainer:{
        menuContainer: "",
        ddPanelContainer: "",
        userName: ""
    },
    menuContainer: "",
    $ddPanelObj: {},
    portletDefine: {},
    initialize: function(param, uiContainer){
        $.extend(this.opts, param);
        $.extend(this.uiContainer, uiContainer);
    },
    getPortletDefine: function(done){
        var that = this;
        $.getJSON(this.opts.url, function(json){
            that.portletDefine = json;
            done(); 
        });
    },
    filterRole: function(index, flag){
        var role = this.opts.role;
        var allowList = [];
        $.each(this.portletDefine, function(i, t){
           try{
                if(t.acl[role][index] == flag){
                    allowList.push(t);
                }
            }catch(e){
                alert('no allow role!');
            }
        });
        return allowList;
    },
    addPortlet: function(portletDef){
       var that = this;
       var portlet = new PortletModel(portletDef);
       portlet.fetch();
       portlet.on("done", function(){
           var model = this;
           that.$ddPanelObj.addPortlet2(  model.view.$el, [0, 0], model.attributes);
       });
       this.add(portlet);
    },
    fetch: function(){
        var that = this;
        var uiCntr = that.uiContainer;
        that.$ddPanelObj = $('#' + uiCntr.ddPanelContainer).zyDDPanel();
        
        this.getPortletDefine(function(){
            //Append Portlet menu
            that.view = new DashboardView({model: that});
            //Append Portlet menu
            $("#"+ uiCntr.menuContainer).append(that.view.render().$el);
            //todo: get user setting
            //var portlet = new Portlet();
        });    
    }
});



$(function(){

    //todo: get dashboardOpts by ajax api
    var dashboardOpts = {
        user: "Caa",
        role: "admin", //admin or user
        url: "./portletDefine.json"
    };
    
    var uiContainer = {
        menuContainer: "addPortletCtl",
        ddPanelContainer: "columns",
        userName : "userName"
    };
    $("#"+ uiContainer.userName).html( dashboardOpts.user );
    
    //var _dashboardOpts =  $.extend({}, defaultOpts, dashboardOpts);
    var dashboardObj = new DashboardModel(dashboardOpts, uiContainer);
    
    dashboardObj.fetch();
 
});