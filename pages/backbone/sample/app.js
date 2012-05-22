
//router
var App = Backbone.Router.extend({
    collection: null,
    initialize: function(){
        this.collection = new Collection ();
       // this.collection.fetch();
    },
    routes: {
        '': 'home',
        'hash1' : 'action1',
        'hash2/:id' : 'action2',
    },
    home: function(){  alert("home") ; },
    action1: function(){
       alert("act 1");
        var model = new Model({
            name: 'XXX',
            attr1: ''
        });
        
        var view = new View({
            model: model,
            collection: this.collection
        });
        
        $('#container').empty().append(view.render().el);
    
    },
    action2: function(id){}
});

//Model & Collection
//model
var Model = Backbone.Model.extend({
    defaults: {
      name: null,
      attr1: ''
    },
    validate:function(attrs){
            if(attrs.name == '') {
                return "error";
            }
    },
    initialize: function(){alert('create Model')}
});

//Collection
var Collection = Backbone.Collection.extend({
    model: Model,
    initialize: function(){alert('create Collection')}
});


//View
var View = Backbone.View.extend({
   template: _.template($("#view-template").html()),
   render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
   },
   events: {
    'click select': 'callback'
   },
   callback: function(){
   
   } 
});


var  App2 = Backbone.Router.extend({
    routes: {
        '': 'home'
    }, 
    home: function(){  alert("home") ; }

});
$(function(){
    var router  = new App();
   // router.navigate('home', {trigger: true});
    Backbone.history.start();
});

