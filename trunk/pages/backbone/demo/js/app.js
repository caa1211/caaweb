
//Router---------------
var App = Backbone.Router.extend({
    users: null, 
    initialize: function(){
        this.users = new Users();
        this.users.fetch();
        console.log(this.users);
    }, 
    routes: {
        '': 'home',
        'add' : 'addState',
        'edit/:name' : 'editState'
    },
    home: function(){
        console.log('home');
     
        var tView = new TableView({
            collection: this.users
            });
         $("#container").empty().append(tView.render().el);
        
    },
    addState: function(){
        console.log('add');
        var user = new User({
            name: '', 
            phone: ''
        });
        
        var addView = new AddView({
            model: user,
            collection: this.users
        });
        
        addView.on('done', function(){
            this.users.add(user);
            this.navigate('', {trigger: true});
        }, this);
        
        $("#container").empty().append(addView.render().el);
         
    }, 
    editState: function(id){
      console.log('editState ' + id);
      var user = this.users.get(id);
         
      var addView = new AddView({
        model: user,
        collection: this.users
      });
      addView.on('done', function () {
        this.navigate('', { trigger: true });
      }, this);
      $('#container').empty().append(addView.render().el);
       
    }
});

//Collection & Model-----------
var User = Backbone.Model.extend({
    defaults: {
      id: null,
      name: '',
      phone: ''
    },
    localStorage: new Backbone.LocalStorage('g'),
    validate: function(attrs) {
      if (attrs.name === '') {
        return "'name' cannot be empty";
      }
      
      if (attrs.phone === '') {
        return "'phone' cannot be empty";
      }
      
    }
});

var Users = Backbone.Collection.extend({
    model: User,
    localStorage: new Backbone.LocalStorage('g')
});


//View-----------
var TableView = Backbone.View.extend({
  
  template: _.template($("#tableView-template").html()),
  render: function(){

    this.$el.html(this.template());
    var $tBody = this.$el.find('tbody');
    this.collection.forEach(function(model){
    console.log('collection');
        var itemView = new ItemView({
            model: model
        }, this);
        
        $tBody.append(itemView.render().el);
    });
    
  
    return this;
  }
});

var ItemView = Backbone.View.extend({
  template: _.template($("#itemView-template").html()),
  tagName: 'tr',
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
});

var AddView = Backbone.View.extend({
  template: _.template($("#addView-template").html()),
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  },
  events: {
    'click #submitBtn': 'addUser'
  }, 
  addUser: function(e){
    e.preventDefault();
    
    this.model.off('error');
    this.model.on('error', function(model, error){
        alert(error);
    });
     
    this.model.on('sync', function(){
        console.log('sync');
        this.trigger('done');
    }, this);
       
    this.model.save({
        name: $("input[name=name]", this.el).val(),
        phone: $("input[name=phone]", this.el).val()
    });
    
  }
  
});

//--init--------------------

$(function(){
    new App();
   // router.navigate('home', {trigger: true});
    Backbone.history.start();
});