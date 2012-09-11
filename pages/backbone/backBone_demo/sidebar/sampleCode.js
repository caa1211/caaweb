    1. ###
    <script type="text/template" id="tableView-template"> </script>
    <script type="text/template" id="itemView-template">
    <script type="text/template" id="addView-template">
    
    2. ###
    <script src="js/app.js"></script>
    
    3. ###
//Router--------------------------------
var App = Backbone.Router.extend({
    routes: {
        '': 'home',
        'add' : 'addState',
        'edit/:name' : 'editState'
    },
    home: function(){
        console.log('home');
    },
    addState: function(){
        console.log('add');
    }, 
    editState: function(id){
         console.log('edit ' + id);
    }
});

//Dom Ready--------------------------------
$(function(){
    new App();
    Backbone.history.start();
});

    4. ###
//View--------------------------------
var TableView = Backbone.View.extend({
  template: _.template($("#tableView-template").html()),
  render: function(){
    this.$el.html(this.template());
    return this;
  }
});

   5. ###
    home: function(){
        console.log('home');
        
        var tView = new TableView();
        $("#container").empty().append(tView.render().el);
         
    }
    
    6. ###
    users: null, 
    initialize: function(){
        this.users = new Users();
        this.users.fetch();
        console.log(this.users);
    },
    ---------------
    
var App = Backbone.Router.extend({
    users: null, 
    initialize: function(){
        this.users = new Users();
        //this.users.fetch();
    },
    
    
//Model-------------------------------
    //Model-------------------------------
var User = Backbone.Model.extend({
    defaults: {
      id: null,
      name: '',
      phone: ''
    }
});

    //Collection
var Users = Backbone.Collection.extend({
    model: User
});
    
    7. ###
        localStorage: new Backbone.LocalStorage('g')
    
    8. ###
            var tView = new TableView({
            collection: this.users
        });
        
    9. ###

    var $tBody = this.$el.find('tbody');
    this.collection.forEach(function(model){
    console.log('collection');
        var itemView = new ItemView();
        $tBody.append(itemView.render().el);
    });

    10. ###
var ItemView = Backbone.View.extend({
  template: _.template($("#itemView-template").html()),
  render: function(){
    this.$el.html(this.template());
    return this;
  }
});
    
    
        11. ###
 var itemView = new ItemView({
            model: model
        });
    --------------------
  render: function(){
    this.$el.html(this.template(this.model.toJSON()));
    return this;
  }
    --------------------
            <tr>
            <td><%= name %></td>
            <td><%= phone %></td>
            
    12. ###        
    tagName: 'tr',
        
    13. ###
var AddView = Backbone.View.extend({
  template: _.template($("#addView-template").html()),
  render: function(){
    this.$el.html(this.template());
    return this;
  }
});
   --------------------
        var addView = new AddView();
        $("#container").empty().append(addView.render().el);
        
///
 <a id='addBtn' href='#add'>add</a>
 
 
 14. ###
         var user = new User();
        
        var addView = new AddView({
            Model: user
        });
        --------------------
 ,
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

  ---------------------
        addView.on('done', function(){
            this.users.add(user);
            this.navigate('', {trigger: true});
        }, this);
        
        $("#container").empty().append(addView.render().el);
        
   15. ###
   
        var user = this.users.get(id);
        
        var addView = new AddView({
            model: user
        });
        
        addView.on('done', function(){
            //this.users.add(user);
            this.navigate('', {trigger: true});
        }, this);
        
        $("#container").empty().append(addView.render().el);
      --------------------------

  <input type="text" name="name" id="name" value="<%= name %>"/>
  
    16. ###
    ,
    validate: function(attrs) {
      if (attrs.name === '') {
        return "'name' cannot be empty";
      }
      
      if (attrs.phone === '') {
        return "'phone' cannot be empty";
      }
      
    }
  
  
  
  
                