

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

});

var PortletModel = Backbone.Model.extend({
    defaults: {
      id: null,
      name: 'AA',
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
    menuContainer: "",
    portletDefine: {},
    initialize: function(param){
        $.extend(this.opts, param);
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
       var portlet = new PortletModel(portletDef);
       portlet.fetch();
       this.add(portlet);
    },
    fetch: function(){
        var that = this;
        this.getPortletDefine(function(){
            
            //todo: build portlet adding menu
            that.view = new DashboardView({model: that});
            
            
            //hard code
            $("#"+ that.menuContainer).append(that.view.render().el);

            //todo: get user setting
            //var portlet = new Portlet();
            

        });    
    }
});



$(function(){

    //todo: get dashboardOpts by ajax api
    var dashboardOpts = {
        user: "caa",
        role: "admin",
        url: "./portletDefine.json"
    };
    var menuContainer = "addPortletCtl";
    //var _dashboardOpts =  $.extend({}, defaultOpts, dashboardOpts);
    var dashboardObj = new DashboardModel(dashboardOpts);
    dashboardObj.menuContainer = menuContainer;
    dashboardObj.fetch();
 
});