/*
var ss = new Backbone.LocalStorage('userList');
ss.records.push({"id":"u1", "name": "Jose", "phone": 0978541236});
ss.records.push({"id":"u2", "name": "Jerry", "phone": 0945254789});
ss.records.push({"id":"u3", "name": "Roger", "phone": 0911777789});
ss.records.push({"id":"u4", "name": "Eric", "phone": 0911999789});
ss.records.push({"id":"u5", "name": "Fliex", "phone": 0911254234});
ss.records.push({"id":"u6", "name": "Dan", "phone": 0934254759});
ss.save()
debugger;
*/

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


//Router---------------
var App = Backbone.Router.extend({
    users: null, 
    initialize: function(){
        this.users = new Users();
        this.users.fetch();
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
    editState: function(name){
       console.log('editState' + name);
    }
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
    this.$el.html(this.template());
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