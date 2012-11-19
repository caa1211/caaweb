

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


var AddViewItem = Backbone.View.extend({
    initialize: function(param){
        this.model = param.model;
        this.parentView = param.parentView;
    },
    template: _.template($("#addPortletItem-template").html()),
    render: function(){
        var that = this;
        this.$el.html(this.template(this.model));
        this.$el.click(function(){
		   that.parentView.trigger('addPortlet', that.model);
        });
        return this;
    }
});

//--Dashboard
var AddView = Backbone.View.extend({
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
            var addViewItem = new AddViewItem({model: t, parentView: that});
            $dropMenu.append(addViewItem.render().el);
        });
        
        if(this.allowList.length == 0){
             this.$el.css("visibility", "hidden");
        }
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
    menuContainer: "",
    portletDefine: {},
    initialize: function(param){
        $.extend(this.opts, param);
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
    getPortletDefine: function(){
        var that = this;
		$.getJSON(that.opts.url, function(json){
            that.portletDefine = json;
			that.addView = new AddView({model: that});
            that.trigger("getPortletDefine_done");
        });  
    }
});


var DashboardCtrler = Backbone.Router.extend({
	uiContainer: {
        menuContainer: "addPortletCtl",
        ddPanelContainer: "columns",
        userName : "userName"
    },
	dashboardOpts:{
        user: "",
        role: "",
        url: ""
	},
	dashboardModel: null,
	$ddPanelObj: null,
    initialize: function(){},
	addPortlet: function(modelDefine){
	    var that = this;
	    var portlet = new PortletModel(modelDefine);
	    //var checkExistedModel = that.findModelInCollectionById(modelDefine.id);
	    var pltid = modelDefine.pltid;
	    if(pltid == undefined){
		  //##new portlet!!
		   var cid = portlet.cid;
		   pltid = modelDefine.id+"_"+cid;
		  
	    }else{
		  //## restoring portlet
	    }
	    portlet.set('id', pltid);
	    portlet.fetch();
	    portlet.on("done", function(){
	    var model = this;
	    var opts = {
				pltid: pltid,
				name: model.attributes.name,
				params: model.attributes.params,
				url: model.attributes.url
			};
			that.$ddPanelObj.addPortlet2( model.view.$el, [0, 0], opts);
	    });
		this.dashboardModel.add(portlet); 
	},
	restoreData:{
		portletPool:{},
		portletPosMap:[]
	},
	restorePortlet: function(){
		var that = this;
	    var portletPoolStr = localStorage.getItem('portletPool');
        var portletPosMapStr = localStorage.getItem('portletPosMap');
        var portletPool = null;
        var portletPosMap = null; 
		if(portletPoolStr!=null && portletPosMapStr!=null){
            try{
                that.restoreData.portletPool = JSON.parse(portletPoolStr);
                that.restoreData.portletPosMap = JSON.parse(portletPosMapStr);
				//debugger;
               // $ddPanelObj.restorePortlet(portletPosMap, portletPool);
            }catch(e){
            }
        }
	},
	getPortletDefine_done: function(){
		var that = this;
		var uiContainer = this.uiContainer;
		var collection = this.dashboardModel;
		$("#"+ uiContainer.menuContainer).append(collection.addView.render().$el);
		collection.addView.on("addPortlet", function(modelDefine){
			that.addPortlet(modelDefine);
		});
		
		that.restorePortlet();
	},
	initUI: function(){
		var that = this;
	    var uiContainer = that.uiContainer;
		that.$ddPanelObj = $('#' + uiContainer.ddPanelContainer).zyDDPanel();
		$("#"+ uiContainer.userName).html(  that.dashboardOpts.user );
	},
	getUserOptionDone: function(){
		var that = this;
		var dashboardOpts = that.dashboardOpts;
		that.initUI();
		that.dashboardModel = new DashboardModel(dashboardOpts);
		that.dashboardModel.getPortletDefine();//get portletDefine
		that.dashboardModel.on("getPortletDefine_done", function(){ that.getPortletDefine_done(); });
	},
	fetch: function(opts){
		var that = this;
		//call ajax to get dashboardOpts
	    var opts = {
			user: "Caa",
			role: "admin", //admin or user
			url: "./portletDefine.json"
		};
		$.extend(that.dashboardOpts, opts);
		that.getUserOptionDone();
	}
});

$(function(){

	var dashboardCtrler = new DashboardCtrler();
	dashboardCtrler.fetch();
    
 
});