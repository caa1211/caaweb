/*
 * ux.Media.Flex 2.1.2
 * Copyright(c) 2008-2009, Active Group, Inc.
 * licensing@theactivegroup.com
 * 
 * http://licensing.theactivegroup.com
 */

     
 Ext.namespace('Ext.ux.plugin');
 Ext.onReady(function(){
    
   
    var CSS = Ext.util.CSS;
    if(CSS){ 
        CSS.getRule('.x-hide-nosize') || //already defined?
            CSS.createStyleSheet('.x-hide-nosize{height:0px!important;width:0px!important;border:none!important;zoom:1;}.x-hide-nosize * {height:0px!important;width:0px!important;border:none!important;zoom:1;}');
        CSS.refreshCache();
    }
    
});

(function(){

      var El = Ext.Element, A = Ext.lib.Anim, supr = El.prototype; 
      var VISIBILITY = "visibility",
        DISPLAY = "display",
        HIDDEN = "hidden",
        NONE = "none";
        
      var fx = {};
    
      fx.El = {
	      	     
            
	       setDisplayed : function(value) {
                var me=this;
                me.visibilityCls ? (me[value !== false ?'removeClass':'addClass'](me.visibilityCls)) :
	                supr.setDisplayed.call(me, value);
                return me;
	        },
            
            
	        isDisplayed : function() {
	            return !(this.hasClass(this.visibilityCls) || this.dom.style[DISPLAY] == NONE);
	        },
	        // private
	        fixDisplay : function(){
	            var me = this;
	            supr.fixDisplay.call(me);
                me.visibilityCls && me.removeClass(me.visibilityCls); 
	        },
	
	        
	        isVisible : function(deep) {
	            return this.visible || 
                   (!this.isStyle(VISIBILITY, HIDDEN) && 
                       this.visibilityCls ? !this.hasClass(this.visibilityCls) :!this.isStyle(DISPLAY, NONE));
	        }
	    };
        
        //Add basic capabilities to the Ext.Element.Flyweight class
        Ext.override(El.Flyweight, fx.El);

     
 Ext.ux.plugin.VisibilityMode = function(opt) {

    Ext.apply(this, opt||{});
    
    var CSS = Ext.util.CSS;

    if(CSS && !Ext.isIE && this.fixMaximizedWindow !== false && !Ext.ux.plugin.VisibilityMode.MaxWinFixed){
        //Prevent overflow:hidden (reflow) transitions when an Ext.Window is maximize.
        CSS.updateRule ( '.x-window-maximized-ct', 'overflow', '');
        Ext.ux.plugin.VisibilityMode.MaxWinFixed = true;  //only updates the CSS Rule once.
    }
    
   };


  Ext.extend(Ext.ux.plugin.VisibilityMode , Object, {

       
      bubble              :  true,

      
      fixMaximizedWindow  :  true,
     
      

      elements       :  null,

      

      visibilityCls   : 'x-hide-nosize',

      
      hideMode  :   'nosize' ,

      ptype     :  'uxvismode', 
      
      init : function(c) {

        var hideMode = this.hideMode || c.hideMode,
            plugin = this,
            bubble = Ext.Container.prototype.bubble,
            changeVis = function(){

	            var els = [this.collapseEl, this.actionMode].concat(plugin.elements||[]);
	
	            Ext.each(els, function(el){
		            plugin.extend( this[el] || el );
	            },this);
	
	            var cfg = {
                    visFixed  : true,
                    animCollapse : false,
                    animFloat   : false,
		            hideMode  : hideMode,
		            defaults  : this.defaults || {}
	            };
	
	            cfg.defaults.hideMode = hideMode;
	            
	            Ext.apply(this, cfg);
	            Ext.apply(this.initialConfig || {}, cfg);
            
            };

         c.on('render', function(){

            // Bubble up the layout and set the new
            // visibility mode on parent containers
            // which might also cause DOM reflow when
            // hidden or collapsed.
            if(plugin.bubble !== false && this.ownerCt){

               bubble.call(this.ownerCt, function(){
                  this.visFixed || this.on('afterlayout', changeVis, this, {single:true} );
               });
             }

             changeVis.call(this);

          }, c, {single:true});

     },
     
     extend : function(el, visibilityCls){
        el && Ext.each([].concat(el), function(e){
            
	        if(e && e.dom){
                 if('visibilityCls' in e)return;  //already applied or defined?
	             Ext.apply(e, fx.El);
	             e.visibilityCls = visibilityCls || this.visibilityCls;
	        }
        },this);
        return this;
     }

  });
  
  Ext.preg && Ext.preg('uxvismode', Ext.ux.plugin.VisibilityMode );
  
  Ext.provide && Ext.provide('uxvismode');
})();



(function(){

    //remove null and undefined members from an object and optionally URL encode the results
    var compactObj =  function(obj, encodeIt){
            var out = obj && Ext.isObject(obj)? {} : obj;
            if(out && Ext.isObject(out)){
	            for (var member in obj){
	               (obj[member] === null || obj[member] === undefined) || (out[member] = obj[member]);
	            }
            }
            return encodeIt ? 
                 ((out && Ext.isObject(out)) ? Ext.urlEncode(out) : encodeURI(out))
                 : out;
        };
        
    
    Ext.ns('Ext.ux.plugin');
    
    
   

    Ext.ux.Media = function(config){
         this.toString = this.asMarkup;  //Inline rendering support for this and all subclasses
         Ext.apply(this,config||{});
         this.initMedia();
    };
    var ux = Ext.ux.Media;
    
    
    var stateRE = /4$/i;

    if(parseFloat(Ext.version) < 2.1){ throw "Ext.ux.Media and sub-classes are not License-Compatible with your Ext release.";}

    Ext.ux.Media.prototype = {
        
         hasVisModeFix : !!Ext.ux.plugin.VisibilityMode, 
         
         mediaObject     : null,

         
         mediaCfg        : null,
         mediaVersion    : null,
         requiredVersion : null,

         
         unsupportedText : null,

         

         hideMode      : !Ext.isIE?'nosize':'display',

         animCollapse  :  Ext.enableFx && Ext.isIE,

         animFloat     :  Ext.enableFx && Ext.isIE,

         autoScroll    : true,

         bodyStyle     : {position: 'relative'},

        
         initMedia      : function(){ },

         
         disableCaching  : false,

         _maxPoll        : 200,

         
         getMediaType: function(type){
             return ux.mediaTypes[type];
         },

         
         assert : function(v,def){
              v= typeof v === 'function'?v.call(v.scope||null):v;
              return Ext.value(v ,def);
         },

        
         assertId : function(id, def){
             id || (id = def || Ext.id());
             return id;
         },

        
         prepareURL : function(url, disableCaching){
            var parts = url ? url.split('#') : [''];
            if(!!url && (disableCaching = disableCaching === undefined ? this.disableCaching : disableCaching) ){
                var u = parts[0];
                if( !(/_dc=/i).test(u) ){
                    var append = "_dc=" + (new Date().getTime());
                    if(u.indexOf("?") !== -1){
                        u += "&" + append;
                    }else{
                        u += "?" + append;
                    }
                    parts[0] = u;
                }
            }
            return parts.length > 1 ? parts.join('#') : parts[0];
         },

          
         prepareMedia : function(mediaCfg, width, height, ct){

             mediaCfg = mediaCfg ||this.mediaCfg;

             if(!mediaCfg){return '';}

             var m= Ext.apply({url:false,autoSize:false}, mediaCfg); //make a copy

             m.url = this.prepareURL(this.assert(m.url,false),m.disableCaching);

             if( m.mediaType){

                 var value,tag, p, El = Ext.Element.prototype;
                 var media = Ext.apply({}, this.getMediaType(this.assert(m.mediaType,false)) || false );
                 var params = compactObj(Ext.apply(media.params||{},m.params || {}));
                 for(var key in params){

                    if(params.hasOwnProperty(key)){
                      m.children || (m.children = []);
                      p = this.assert(params[key],null);
                      p && (p = compactObj(p, m.encodeParams !== false));
                      tag = 
                        {tag:'param'
                         ,name:key
                         ,value: p 
                       };
                       (tag.value == key) && delete tag.value;
                       p && m.children.push(tag);

                    }
                 }
                 delete   media.params;

                 //childNode Text if plugin/object is not installed.
                 var unsup = this.assert(m.unsupportedText|| this.unsupportedText || media.unsupportedText,null);
                 if(unsup){
                     m.children || (m.children = []);
                     m.children.push(unsup);
                 }

                 if(m.style && typeof m.style != "object") { throw 'Style must be JSON formatted'; }

                 m.style = this.assert(Ext.apply(media.style || {}, m.style || {}) , {});
                 delete media.style;

                 m.height = this.assert(height || m.height || media.height || m.style.height, null);
                 m.width  = this.assert(width  || m.width  || media.width || m.style.width ,null);

                 m = Ext.apply({tag:'object'},m,media);

                 //Convert element height and width to inline style to avoid issues with display:none;
                 if(m.height || m.autoSize)
                 {
                    Ext.apply(m.style, {
                        //Ext 2 & 3 compatibility -- Use the defaultUnit from the Component's el for default
                      height:(Ext.Element.addUnits || El.addUnits).call(this.mediaEl, m.autoSize ? '100%' : m.height ,El.defaultUnit||'px')});
                 }
                 if(m.width || m.autoSize)
                 {
                    Ext.apply(m.style, {
                        //Ext 2 & 3 compatibility -- Use the defaultUnit from the Component's el for default
                      width :(Ext.Element.addUnits || El.addUnits).call(this.mediaEl, m.autoSize ? '100%' : m.width ,El.defaultUnit||'px')});
                 }

                 m.id   = this.assertId(m.id);
                 m.name = this.assertId(m.name, m.id);

                 m._macros= {
                   url       : m.url || ''
                  ,height    : (/%$/.test(m.height)) ? m.height : parseInt(m.height,10)||null
                  ,width     : (/%$/.test(m.width)) ? m.width : parseInt(m.width,10)||null
                  ,scripting : this.assert(m.scripting,false)
                  ,controls  : this.assert(m.controls,false)
                  ,scale     : this.assert(m.scale,1)
                  ,status    : this.assert(m.status,false)
                  ,start     : this.assert(m.start, false)
                  ,loop      : this.assert(m.loop, false)
                  ,volume    : this.assert(m.volume, 20)
                  ,id        : m.id
                 };

                 delete   m.url;
                 delete   m.mediaType;
                 delete   m.controls;
                 delete   m.status;
                 delete   m.start;
                 delete   m.loop;
                 delete   m.scale;
                 delete   m.scripting;
                 delete   m.volume;
                 delete   m.autoSize;
                 delete   m.autoScale;
                 delete   m.params;
                 delete   m.unsupportedText;
                 delete   m.renderOnResize;
                 delete   m.disableCaching;
                 delete   m.listeners;
                 delete   m.height;
                 delete   m.width;
                 delete   m.encodeParams;
                 return m;
              }else{
                 var unsup = this.assert(m.unsupportedText|| this.unsupportedText || media.unsupportedText,null);
                 unsup = unsup ? Ext.DomHelper.markup(unsup): null;
                 return String.format(unsup || 'Media Configuration/Plugin Error',' ',' ');
             }
           },

           
         asMarkup  : function(mediaCfg){
              return this.mediaMarkup(this.prepareMedia(mediaCfg));
         },

          
         mediaMarkup : function(mediaCfg){
            mediaCfg = mediaCfg || this.mediaCfg;
            if(mediaCfg){
                 var _macros = mediaCfg._macros;
                 delete mediaCfg._macros;
                 var m = Ext.DomHelper.markup(mediaCfg);
                 if(_macros){
                   var _m, n;
                    for ( n in _macros){
                      _m = _macros[n];
                      if(_m !== null){
                           m = m.replace(new RegExp('((%40|@)'+n+')','g'),_m+'');
                      }
                    }
                  }
                  
                  return m;
            }
         },

         
         setMask  : function(el) {
             var mm;
             if((mm = this.mediaMask)){
                    mm.el || (mm = this.mediaMask = new Ext.ux.IntelliMask(el,mm));
                    mm.el.addClass('x-media-mask');
             }

         },
         
          refreshMedia  : function(target){
                 if(this.mediaCfg) {this.renderMedia(null,target);}
                 return this;
          },

          
          renderMedia : function(mediaCfg, ct, domPosition , w , h){
              if(!Ext.isReady){
                  Ext.onReady(this.renderMedia.createDelegate(this,Array.prototype.slice.call(arguments,0)));
                  return;
              }
              var mc = (this.mediaCfg = mediaCfg || this.mediaCfg) ;
              ct = Ext.get(this.lastCt || ct || (this.mediaObject?this.mediaObject.dom.parentNode:null));
              this.onBeforeMedia.call(this, mc, ct, domPosition , w , h);
              if(ct){
                  this.lastCt = ct;
                  if(mc && (mc = this.prepareMedia(mc, w, h, ct))){
                     this.setMask(ct);
                     this.mediaMask && this.autoMask && this.mediaMask.show();
                     this.clearMedia().writeMedia(mc, ct, domPosition || 'afterbegin');
                  }
              }
              this.onAfterMedia(ct);
          },

          
          writeMedia : function(mediaCfg, container, domPosition ){
              var ct = Ext.get(container);
              if(ct){
                domPosition ? Ext.DomHelper.insertHtml(domPosition,ct.dom,this.mediaMarkup(mediaCfg))
                  :ct.update(this.mediaMarkup(mediaCfg));
              }
          },

          
          clearMedia : function(){
            var mo;
            if(Ext.isReady && (mo = this.mediaObject)){
                mo.remove(true,true);
            }
            this.mediaObject = null;
            return this;
          },

           
          resizeMedia   : function(comp, w, h){
              var mc = this.mediaCfg;
              if(mc && this.boxReady && mc.renderOnResize && (!!w || !!h)){
                  // Ext.Window.resizer fires this event a second time
                  if(arguments.length > 3 && (!this.mediaObject || mc.renderOnResize )){
                      this.refreshMedia(this[this.mediaEl]);
                  }
              }

          },

          
          onBeforeMedia  : function(mediaCfg, ct, domPosition, width, height){

            var m = mediaCfg || this.mediaCfg, mt;

            if( m && (mt = this.getMediaType(m.mediaType)) ){
                m.autoSize = m.autoSize || mt.autoSize===true;
                var autoSizeEl;
                //Calculate parent container size for macros (if available)
                if(m.autoSize && (autoSizeEl = Ext.isReady?
                    //Are we in a layout ? autoSize to the container el.
                     Ext.get(this[this.mediaEl] || this.lastCt || ct) :null)
                 ){
                  m.height = this.autoHeight ? null : autoSizeEl.getHeight(true);
                  m.width  = this.autoWidth ? null : autoSizeEl.getWidth(true);
                }

             }
             this.assert(m.height,height);
             this.assert(m.width ,width);
             mediaCfg = m;

          },

          
          onMediaLoad : function(e){
               if(e && e.type == 'load'){
                  this.fireEvent('mediaload',this, this.mediaObject );

                  if(this.mediaMask && this.autoMask){ this.mediaMask.hide(); }

               }
          },
          
          onAfterMedia   : function(ct){
               var mo;
               if(this.mediaCfg && ct && (mo = this.mediaObject =
                       new (this.elementClass || Ext.ux.Media.Element)(ct.child('.x-media', true) ))
                       && mo.dom
                       ){
                   mo.ownerCt = this;

                   var L; //Reattach any DOM Listeners after rendering.
                   if(L = this.mediaCfg.listeners ||null){
                      mo.on(L);  //set any DOM listeners
                    }
                   this.fireEvent('mediarender',this, this.mediaObject );

                    //Load detection for non-<object> media (iframe, img)
                   if(mo.dom.tagName !== 'OBJECT'){
                      mo.on({
                       load  :this.onMediaLoad
                      ,scope:this
                      ,single:true
                     });
                   } else {
                       //IE, Opera possibly others, support a readyState on <object>s
                       this._countPoll = 0;
                       this.pollReadyState( this.onMediaLoad.createDelegate(this,[{type:'load'}],0));
                   }

               }
              if(this.autoWidth || this.autoHeight){
                this.syncSize();
              }
          },

          
         pollReadyState : function( cb, readyRE){

            var media = this.getInterface();
            if(media && 'readyState' in media){
                (readyRE || stateRE).test(media.readyState) ? cb() : arguments.callee.defer(10,this,arguments);
            }
         },

          
          getInterface  : function(){
              return this.mediaObject?this.mediaObject.dom||null:null;
          },

         detectVersion  : Ext.emptyFn,

         

         autoMask   : false
    };

    var componentAdapter = {

        init         : function(){

            this.getId = function(){
                return this.id || (this.id = "media-comp" + (++Ext.Component.AUTO_ID));
            };

            this.html = this.contentEl = this.items = null;
             
            //Attach the Visibility Fix (if available) to the current instance
            if(this.hideMode == 'nosize'){
               this.hasVisModeFix ? 
                  new Ext.ux.plugin.VisibilityMode({ 
                      elements: ['bwrap','mediaEl'],
                      hideMode:'nosize'}).init(this) 
                   //default to 'display' of the plugin is not available
                  : (this.hideMode = 'display');
            } 

            this.initMedia();

            //Inline rendering support for this and all subclasses
            this.toString = this.asMarkup;

            this.addEvents(

              
                'mediarender',
               

                'mediaload');

            if(this.mediaCfg.renderOnResize ){
                this.on('resize', this.resizeMedia, this);
            }


        },
        afterRender  : function(ct){

            //set the mediaMask
            this.setMask(this[this.mediaEl] || ct);
            
            componentAdapter.setAutoScroll.call(this);
            
            if(!this.mediaCfg.renderOnResize ){
                this.renderMedia(this.mediaCfg,this[this.mediaEl] || ct);
            }

        },
        
        beforeDestroy  :  function(){
            this.clearMedia();
            Ext.destroy(this.mediaMask, this.loadMask);
            this.lastCt = this.mediaObject = this.renderTo = this.applyTo = this.mediaMask = this.loadMask = null;

        },
         
        setAutoScroll   : function(){
            if(this.rendered){
                this.getContentTarget().setOverflow(!!this.autoScroll ? 'auto':'hidden');
            }
        },
        
        getContentTarget : function(){
            return this[this.mediaEl];
        }
    };

    

    Ext.ux.Media.Component= Ext.extend ( Ext.BoxComponent, {

        ctype         : "Ext.ux.Media.Component",

        
        mediaEl         : 'el',
        
        autoScroll    : true,

        autoEl  : {tag:'div',style : { overflow: 'hidden', display:'block',position: 'relative'}},

        cls     : "x-media-comp",

        mediaClass    : Ext.ux.Media,
        constructor   : function(config){
          //Inherit the ux.Media class
          Ext.apply(this , config, this.mediaClass.prototype );
          ux.Component.superclass.constructor.apply(this, arguments);
        },
        
        initComponent   : function(){
            ux.Component.superclass.initComponent.apply(this,arguments);
            componentAdapter.init.apply(this,arguments);
        },
        
        afterRender  : function(ct){
            ux.Component.superclass.afterRender.apply(this,arguments);
            componentAdapter.afterRender.apply(this,arguments);
         },
         
        beforeDestroy   : function(){
            componentAdapter.beforeDestroy.apply(this,arguments);
            this.rendered && ux.Component.superclass.beforeDestroy.apply(this,arguments);
         },
        doAutoLoad : Ext.emptyFn,
        
        getContentTarget : componentAdapter.getContentTarget,
        //Ext 2.x does not have Box setAutoscroll
        setAutoScroll : componentAdapter.setAutoScroll
        
    });

    Ext.reg('uxmedia', Ext.ux.Media.Component);
    Ext.reg('media', Ext.ux.Media.Component);

    

    Ext.ux.Media.Panel = Ext.extend( Ext.Panel,  {

        cls           : "x-media-panel",

        ctype         : "Ext.ux.Media.Panel",
         
        autoScroll    : false,

          
        mediaEl       : 'body',

        mediaClass    : Ext.ux.Media,

        constructor   : function(config){
	         //Inherit the ux.Media class
	          Ext.apply(this , this.mediaClass.prototype );
	          ux.Panel.superclass.constructor.apply(this, arguments);
        },

        
        initComponent   : function(){
            ux.Panel.superclass.initComponent.apply(this,arguments);
            componentAdapter.init.apply(this,arguments);
        },
        
        afterRender  : function(ct){
            ux.Panel.superclass.afterRender.apply(this,arguments);
            componentAdapter.afterRender.apply(this,arguments);
         },
         
        beforeDestroy  : function(){
            componentAdapter.beforeDestroy.apply(this,arguments);
            this.rendered && ux.Panel.superclass.beforeDestroy.apply(this,arguments);
         },
        doAutoLoad : Ext.emptyFn,
        
        getContentTarget : componentAdapter.getContentTarget,

        setAutoScroll : componentAdapter.setAutoScroll

    });


    Ext.reg('mediapanel', Ext.ux.Media.Panel);
    

    Ext.ux.Media.Portlet = Ext.extend ( Ext.ux.Media.Panel , {
       anchor       : '100%',
       frame        : true,
       collapseEl   : 'bwrap',
       collapsible  : true,
       draggable    : true,
       autoWidth    : true,
       ctype        : "Ext.ux.Media.Portlet",
       cls          : 'x-portlet x-media-portlet'

    });

    Ext.reg('mediaportlet', Ext.ux.Media.Portlet);

   

    Ext.ux.Media.Window = Ext.extend( Ext.Window ,{

        
        constructor   : function(){
          Ext.applyIf(this , this.mediaClass.prototype );
          ux.Window.superclass.constructor.apply(this, arguments);
        },

         cls           : "x-media-window",
         
         autoScroll    : false,
         
         ctype         : "Ext.ux.Media.Window",

         mediaClass    : Ext.ux.Media,

          
         mediaEl       : 'body',

        
        initComponent   : function(){
            ux.Window.superclass.initComponent.apply(this,arguments);
            componentAdapter.init.apply(this,arguments);
        },

        
        afterRender  : function(){
            ux.Window.superclass.afterRender.apply(this,arguments);  //wait for sizing
            componentAdapter.afterRender.apply(this,arguments);
         },
         
        beforeDestroy   : function(){
            componentAdapter.beforeDestroy.apply(this,arguments);
            this.rendered && ux.Window.superclass.beforeDestroy.apply(this,arguments);
         },

        doAutoLoad : Ext.emptyFn,
        
        getContentTarget : componentAdapter.getContentTarget,

        setAutoScroll : componentAdapter.setAutoScroll

    });

    Ext.reg('mediawindow', ux.Window);

    Ext.ns('Ext.capabilities');
    Ext.ns('Ext.ux.Media.plugin');
    
    var CAPS = (Ext.capabilities.hasAudio || 
       (Ext.capabilities.hasAudio = function(){
                
                var aTag = !!document.createElement('audio').canPlayType,
                    aAudio = ('Audio' in window) ? new Audio('') : {},
                    caps = aTag || ('canPlayType' in aAudio) ? { tag : aTag, object : ('play' in aAudio)} : false,
                    mime,
                    chk,
                    mimes = {
                            mp3 : 'audio/mpeg', //mp3
                            ogg : 'audio/ogg',  //Ogg Vorbis
                            wav : 'audio/x-wav', //wav 
                            basic : 'audio/basic', //au, snd
                            aif  : 'audio/x-aiff' //aif, aifc, aiff
                        };
                    
                    if(caps && ('canPlayType' in aAudio)){
                       for (chk in mimes){ 
                            caps[chk] = (mime = aAudio.canPlayType(mimes[chk])) != 'no' && (mime != '');
                        }
                    }                     
                    return caps;
            }()));
            
     Ext.iterate || Ext.apply (Ext, {
     
        iterate : function(obj, fn, scope){
            if(Ext.isEmpty(obj)){
                return;
            }
            if(Ext.isIterable(obj)){
                Ext.each(obj, fn, scope);
                return;
            }else if(Ext.isObject(obj)){
                for(var prop in obj){
                    if(obj.hasOwnProperty(prop)){
                        if(fn.call(scope || obj, prop, obj[prop]) === false){
                            return;
                        };
                    }
                }
            }
        },
        isIterable : function(v){
            //check for array or arguments
            if(Ext.isArray(v) || v.callee){
                return true;
            }
            //check for node list type
            if(/NodeList|HTMLCollection/.test(toString.call(v))){
                return true;
            }
            //NodeList has an item and length property
            //IXMLDOMNodeList has nextNode method, needs to be checked first.
            return ((v.nextNode || v.item) && Ext.isNumber(v.length));
        },
        
        isObject : function(v){
            return v && typeof v == "object";
        }
     });
    
     
    Ext.ux.Media.plugin.AudioEvents = Ext.extend(Ext.ux.Media.Component,{
    
       autoEl  : {tag:'div' },
       
       cls: 'x-hide-offsets',
       
       disableCaching : false,
       
       
       audioEvents : {},
       
       
       volume     : .5,
       
       ptype      : 'audioevents',
       
       
       initComponent : function(){
          this.mediaCfg || 
          
          (this.mediaCfg = {
              mediaType : 'WAV',
              start     : true,
              url       : ''
          });
          Ext.ux.Media.plugin.AudioEvents.superclass.initComponent.apply(this,arguments);
          
          this.addEvents(
          
           'beforeaudio');
           
           this.setVolume(this.volume);
       },
       
       
       init : function( target ){
        
            this.rendered || this.render(Ext.getBody());
            
            if(target.dom || target.ctype){
                var plugin = this;
                Ext.iterate(this.audioEvents || {}, 
                 function(event){
                   
                    if(target.events && !target.events[event]) return;
                    
                    
                    Ext.applyIf(target, {
                       audioPlugin : plugin,
                       audioListeners : {},
                       
                       
                       removeAudioListener : function(audioEvent){
                          if(audioEvent && this.audioListeners[audioEvent]){ 
                               this.removeListener && 
                                 this.removeListener(audioEvent, this.audioListeners[audioEvent], this);
                               delete this.audioListeners[audioEvent];
                          }
                       },
                       
                       removeAudioListeners : function(){
                          var c = [];
                          Ext.iterate(this.audioListeners, function(audioEvent){c.push(audioEvent)});
                          Ext.iterate(c, this.removeAudioListener, this);
                       },
                       
                       addAudioListener : function(audioEvent){
                           if(this.audioListeners[audioEvent]){
                               this.removeAudioListener(audioEvent);
                           }
                           this.addListener && 
                             this.addListener (audioEvent, 
                               this.audioListeners[audioEvent] = function(){
                               this.audioPlugin.onEvent(this, audioEvent);
                             }, this);
                        
                       } ,

                       enableAudio : function(){
                          this.audioPlugin && this.audioPlugin.enable();
                       },
                       
                       disableAudio : function(){
                          this.audioPlugin && this.audioPlugin.disable();
                       },
                       
                       setVolume : function(volume){
                          this.audioPlugin && this.audioPlugin.setVolume(volume);
                       }
                    });
                    
                    target.addAudioListener(event);
                    
                },this);
            }
       },
       
       
       setVolume   : function(volume){
            var AO = this.audioObject, v = Math.max(Math.min(parseFloat(volume)||0, 1),0);
            this.mediaCfg && (this.mediaCfg.volume = v*100);
            this.volume = v;
            AO && (AO.volume = v);
            return this;
       },
       
       
       onEvent : function(comp, event){
           if(!this.disabled && this.audioEvents && this.audioEvents[event]){
              if(this.fireEvent('beforeaudio',this, comp, event) !== false ){
                  this.mediaCfg.url = this.audioEvents[event];

                  if(CAPS.object){  //HTML5 Audio support?
                        this.audioObject && this.audioObject.stop && this.audioObject.stop();
                        if(this.audioObject = new Audio(this.mediaCfg.url || '')){
                            this.setVolume(this.volume);
                            this.audioObject.play && this.audioObject.play();
                        }
                  } else {
                        var O = this.getInterface();
                        if(O){ 
                            if(O.object){  //IE ActiveX
                                O= O.object;
	                            ('Open' in O) && O.Open(this.mediaCfg.url || '');
	                            ('Play' in O) && O.Play();
                            }else {  //All Others - just rerender the tag
                                this.refreshMedia();      
                            }
                            
                        }
                  }
              }
              
           }
       }
    
    });
    
    Ext.preg && Ext.preg('audioevents', Ext.ux.Media.plugin.AudioEvents);

    Ext.onReady(function(){
        //Generate CSS Rules if not defined in markup
        var CSS = Ext.util.CSS, rules=[];

        CSS.getRule('.x-media', true) || (rules.push('.x-media{width:100%;height:100%;outline:none;overflow:hidden;}'));
        CSS.getRule('.x-media-mask') || (rules.push('.x-media-mask{width:100%;height:100%;overflow:hidden;position:relative;zoom:1;}'));

        //default Rule for IMG:  h/w: auto;
        CSS.getRule('.x-media-img') || (rules.push('.x-media-img{background-color:transparent;width:auto;height:auto;position:relative;}'));

        // Add the new masking rule if not present.
        CSS.getRule('.x-masked-relative') || (rules.push('.x-masked-relative{position:relative!important;}'));

        if(!!rules.length){
             CSS.createStyleSheet(rules.join(''));
             CSS.refreshCache();
        }

    });

    Ext.override(Ext.Element, {

         
         mask : function(msg, msgCls){

              if(this.getStyle("position") == "static"){
                  this.addClass("x-masked-relative");
              }

             this._mask ||
                 (this._mask = Ext.DomHelper.append(this.dom, {cls:"ext-el-mask"}, true));


             if(!this.select('iframe,frame,object,embed').elements.length){
                 this.addClass("x-masked");  //causes element re-init after reflow (overflow:hidden)
             }

             //may have been hidden previously (and not removed)
             this._mask.setDisplayed(true);

             if(typeof msg == 'string'){
                  this._maskMsg || 
                    (this._maskMsg = Ext.DomHelper.append(this.dom, {
                        style:"visibility:hidden",
                        cls: msgCls ? "ext-el-mask-msg " + msgCls : "ext-el-mask-msg", 
                        cn:{tag:'div', html: msg}
                        }, true));
                  
                  this._maskMsg.center(this).setVisible(true);
             }

             //Adjust Mask Height for IE strict
             if(Ext.isIE && !(Ext.isIE7 && Ext.isStrict) && this.getStyle('height') == 'auto'){ // ie will not expand full height automatically
                  this._mask.setSize(undefined, this.getHeight());
             }
             return this._mask;
         },

         
         unmask : function(remove){

            if(this._maskMsg ){

                this._maskMsg.setVisible(false);
                if(remove !== false){
                    this._maskMsg.remove(true);
                    delete this._maskMsg;
                 }
            }

            if(this._mask ) {
                 this._mask.setDisplayed(false);
                 if(remove !== false){
                     this._mask.remove(true);
                     delete this._mask;
                 }
             }

             this.removeClass(["x-masked", "x-masked-relative"]);

         },

        

        remove : function(cleanse, deep){
              if(this.dom){
                this.unmask(true);
                this.removeAllListeners();    //remove any Ext-defined DOM listeners
                if(cleanse){ this.cleanse(true, deep); }
                Ext.removeNode(this.dom);
                this.dom = null;  //clear ANY DOM references
              }
         },

        
        cleanse : function(forceReclean, deep){
            if(this.isCleansed && forceReclean !== true){
                return this;
            }

            var d = this.dom, n = d.firstChild, nx;
             while(d && n){
                 nx = n.nextSibling;
                 if(deep){
                         Ext.fly(n, '_cleanser').cleanse(forceReclean, deep);
                         }
                 Ext.removeNode(n);
                 n = nx;
             }
             delete Ext.Element._flyweights['_cleanser']; //orphan reference cleanup
             this.isCleansed = true;
             return this;
         }
    });

    
    Ext.ux.Media.Element = Ext.extend ( Ext.Element , {

        
        
        constructor   : function( element ) {

            if(!element ){ return null; }

            var dom = typeof element == "string" ? d.getElementById(element) : element.dom || element ;

            if(!dom ){ return null; }

            
            this.dom = dom;
            
            this.id = dom.id || Ext.id(dom);

            Ext.Element.cache[this.id] = this;

        },

        
        mask : function(msg, msgCls){

            this.maskEl || (this.maskEl = this.parent('.x-media-mask') || this.parent());

            return this.maskEl.mask.apply(this.maskEl, arguments);

        },
        unmask : function(remove){

            if(this.maskEl){
                this.maskEl.unmask(remove);
                this.maskEl = null;
            }
        }


    });

    Ext.ux.Media.prototype.elementClass  =  Ext.ux.Media.Element;

    
    Ext.ux.IntelliMask = function(el, config){

        Ext.apply(this, config);
        this.el = Ext.get(el);

    };

    Ext.ux.IntelliMask.prototype = {

        

         removeMask  : false,

        
        msg : 'Loading Media...',
        
        msgCls : 'x-mask-loading',


        
        zIndex : null,

        
        disabled: false,

        
        active: false,

        
        autoHide: false,

        
        disable : function(){
           this.disabled = true;
        },

        
        enable : function(){
            this.disabled = false;
        },

        
        show: function(msg, msgCls, fn, fnDelay ){

            var opt={}, autoHide = this.autoHide;
            fnDelay = parseInt(fnDelay,10) || 20; //ms delay to allow mask to quiesce if fn specified

            if(typeof msg == 'object'){
                opt = msg;
                msg = opt.msg;
                msgCls = opt.msgCls;
                fn = opt.fn;
                autoHide = typeof opt.autoHide != 'undefined' ?  opt.autoHide : autoHide;
                fnDelay = opt.fnDelay || fnDelay ;
            }
            if(!this.active && !this.disabled && this.el){
                var mask = this.el.mask(msg || this.msg, msgCls || this.msgCls);

                this.active = !!this.el._mask;
                if(this.active){
                    if(this.zIndex){
                        this.el._mask.setStyle("z-index", this.zIndex);
                        if(this.el._maskMsg){
                            this.el._maskMsg.setStyle("z-index", this.zIndex+1);
                        }
                    }
                }
            } else {fnDelay = 0;}

            //passed function is called regardless of the mask state.
            if(typeof fn === 'function'){
                fn.defer(fnDelay ,opt.scope || null);
            } else { fnDelay = 0; }

            if(autoHide && (autoHide = parseInt(autoHide , 10)||2000)){
                this.hide.defer(autoHide+(fnDelay ||0),this );
            }

            return this.active? {mask: this.el._mask , maskMsg: this.el._maskMsg} : null;
        },

        
        hide: function(remove){
            if(this.el){
                this.el.unmask(remove || this.removeMask);
            }
            this.active = false;
            return this;
        },

        // private
        destroy : function(){this.hide(true); this.el = null; }
     };




Ext.ux.Media.mediaTypes = {

     
       
      WAV : 
            Ext.apply(
            { tag      : 'object'
             ,cls      : 'x-media x-media-wav'
             ,data      : "@url"
             ,type     : 'audio/x-wav'
             ,loop  : false
             ,params  : {

                  filename     : "@url"
                 ,displaysize  : 0
                 ,autostart    : '@start'
                 ,showControls : '@controls'
                 ,showStatusBar:  false
                 ,showaudiocontrols : '@controls'
                 ,stretchToFit  : false
                 ,Volume        : "@volume"
                 ,PlayCount     : 1

               }
           },Ext.isIE?{
               classid :"CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95" //default for WMP installed w/Windows
               ,codebase:"http" + ((Ext.isSecure) ? 's' : '') + "://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701"
               ,type:'application/x-oleobject'
               }:
               {src:"@url"}),
       
        

       PDF : Ext.apply({  //Acrobat plugin thru release 8.0 all crash FF3
                tag     : 'object'
               ,cls     : 'x-media x-media-pdf'
               ,type    : "application/pdf"
               ,data    : "@url"
               ,autoSize:true
               ,params  : { src : "@url"}
               },Ext.isIE?{
                   classid :"CLSID:CA8A9780-280D-11CF-A24D-444553540000"
                   }:false),


      
      PDFFRAME  : {
                  tag      : 'iframe'
                 ,cls      : 'x-media x-media-pdf-frame'
                 ,frameBorder : 0
                 ,style    : { 'z-index' : 2}
                 ,src      : "@url"
                 ,autoSize :true
        },

       

      WMV : Ext.apply(
              {tag      :'object'
              ,cls      : 'x-media x-media-wmv'
              ,type     : 'application/x-mplayer2'
              //,type   : "video/x-ms-wmv"
              ,data     : "@url"
              ,autoSize : true
              ,params  : {

                  filename     : "@url"
                 ,displaysize  : 0
                 ,autostart    : "@start"
                 ,showControls : "@controls"
                 ,showStatusBar: "@status"
                 ,showaudiocontrols : true
                 ,stretchToFit  : true
                 ,Volume        :"@volume"
                 ,PlayCount     : 1

               }
               },Ext.isIE?{
                   classid :"CLSID:22d6f312-b0f6-11d0-94ab-0080c74c7e95" //default for WMP installed w/Windows
                   ,codebase:"http" + ((Ext.isSecure) ? 's' : '') + "://activex.microsoft.com/activex/controls/mplayer/en/nsmp2inf.cab#Version=5,1,52,701"
                   ,type:'application/x-oleobject'
                   }:
               {src:"@url"}
             ),
                   
       APPLET  : {
                  tag      :'object'
                 ,cls      : 'x-media x-media-applet'
                 ,type     : 'application/x-java-applet'
                 ,unsupportedText : {tag : 'p', html:'Java is not installed/enabled.'}
                 ,params : {
                   url : '@url',
                   archive : '',  //the jar file
                   code    : '' //the Java class
                  }
       },
       
       "AUDIO-OGG"   : {
           tag      : 'audio',
           controls : '@controls',
           src      : '@url'
       },
       
       "VIDEO-OGG"   : {
           tag      : 'video',
           controls : '@controls',
           src      : '@url'
       },

     
       SWF   :  Ext.apply({
                  tag      :'object'
                 ,cls      : 'x-media x-media-swf'
                 ,type     : 'application/x-shockwave-flash'
                 ,scripting: 'sameDomain'
                 ,standby  : 'Loading..'
                 ,loop     :  true
                 ,start    :  false
                 ,unsupportedText : {cn:['The Adobe Flash Player is required.',{tag:'br'},{tag:'a',cn:[{tag:'img',src:'http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'}],href:'http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash',target:'_flash'}]}
                 ,params   : {
                      movie     : "@url"
                     ,menu      : "@controls"
                     ,play      : "@start"
                     ,quality   : "high"
                     ,allowscriptaccess : "@scripting"
                     ,allownetworking : 'all'
                     ,allowfullScreen : false
                     ,bgcolor   : "#FFFFFF"
                     ,wmode     : "opaque"
                     ,loop      : "@loop"
                    }

                },Ext.isIE?
                    {classid :"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                     codebase:"http" + ((Ext.isSecure) ? 's' : '') + "://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"
                    }:
                    {data     : "@url"}),
      
       SCRIBD :  Ext.apply({
                  tag      :'object'
                 ,cls      : 'x-media x-media-scribd'
                 ,type     : 'application/x-shockwave-flash'
                 ,scripting: 'always'
                 ,standby  : 'Loading..'
                 ,loop     :  true
                 ,start    :  false
                 ,unsupportedText : {cn:['The Adobe Flash Player is required.',{tag:'br'},{tag:'a',cn:[{tag:'img',src:'http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'}],href:'http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash',target:'_flash'}]}
                 ,params   : {
                      movie     : "@url"
                     ,menu      : "@controls"
                     ,play      : "@start"
                     ,quality   : "high"
                     ,menu      : true
                     ,scale     : 'showall'
                     ,salign    : ' '
                     ,allowscriptaccess : "@scripting"
                     ,allownetworking : 'all'
                     ,allowfullScreen : true
                     ,bgcolor   : "#FFFFFF"
                     ,wmode     : "opaque"
                     ,loop      : "@loop"
                    }

                },Ext.isIE?
                    {classid :"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                     codebase:"http" + ((Ext.isSecure) ? 's' : '') + "://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=9,0,0,0"
                    }:
                    {data     : "@url"}),
                    
      

        JWP :  Ext.apply({
              tag      :'object'
             ,cls      : 'x-media x-media-swf x-media-flv'
             ,type     : 'application/x-shockwave-flash'
             ,data     : "@url"
             ,loop     :  false
             ,start    :  false
             //ExternalInterface bindings
             ,boundExternals : ['sendEvent' , 'addModelListener', 'addControllerListener', 'addViewListener', 'getConfig', 'getPlaylist']
             ,params   : {
                 movie     : "@url"
                ,flashVars : {
                               autostart:'@start'
                              ,repeat   :'@loop'
                              ,height   :'@height'
                              ,width    :'@width'
                              ,id       :'@id'
                              }
                }

        },Ext.isIE?{
             classid :"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"
            ,codebase:"http" + ((Ext.isSecure) ? 's' : '') + "://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=8,0,0,0"
            }:false),


        
        QT : Ext.apply({
                       tag      : 'object'
                      ,cls      : 'x-media x-media-quicktime'
                      ,type     : "video/quicktime"
                      ,style    : {position:'relative',"z-index":1 ,behavior:'url(#qt_event_source)'}
                      ,scale    : 'aspect'  // ( .5, 1, 2 , ToFit, Aspect )
                      ,unsupportedText : '<a href="http://www.apple.com/quicktime/download/">Get QuickTime</a>'
                      ,scripting : true
                      ,volume   : '50%'   //also 0-255
                      ,data     : '@url'
                      ,params   : {
                           src          : Ext.isIE?'@url': null
                          ,href        : "http://quicktime.com"
                          ,target      : "_blank"
                          ,autoplay     : "@start"
                          ,targetcache  : true
                          ,cache        : true
                          ,wmode        : 'opaque'
                          ,controller   : "@controls"
                      ,enablejavascript : "@scripting"
                          ,loop         : '@loop'
                          ,scale        : '@scale'
                          ,volume       : '@volume'
                          ,QTSRC        : '@url'

                       }

                     },Ext.isIE?
                          { classid      :'clsid:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B'
                           ,codebase     :"http" + ((Ext.isSecure) ? 's' : '') + '://www.apple.com/qtactivex/qtplugin.cab#version=7,2,1,0'

                       }:
                       {
                         PLUGINSPAGE  : "http://www.apple.com/quicktime/download/"

                    }),

        


        QTEVENTS : {
                   tag      : 'object'
                  ,id       : 'qt_event_source'
                  ,cls      : 'x-media x-media-qtevents'
                  ,type     : "video/quicktime"
                  ,params   : {}
                  ,classid      :'clsid:CB927D12-4FF7-4a9e-A169-56E4B8A75598'
                  ,codebase     :"http" + ((Ext.isSecure) ? 's' : '') + '://www.apple.com/qtactivex/qtplugin.cab#version=7,2,1,0'
                 },

        

        WPMP3 : Ext.apply({
                       tag      : 'object'
                      ,cls      : 'x-media x-media-audio x-media-wordpress'
                      ,type     : 'application/x-shockwave-flash'
                      ,data     : '@url'
                      ,start    : true
                      ,loop     : false
                      ,boundExternals : ['open','close','setVolume','load']
                      ,params   : {
                           movie        : "@url"
                          ,width        :'@width'  //required
                          ,flashVars : {
                               autostart    : "@start"
                              ,controller   : "@controls"
                              ,enablejavascript : "@scripting"
                              ,loop         :'@loop'
                              ,scale        :'@scale'
                              ,initialvolume:'@volume'
                              ,width        :'@width'  //required
                              ,encode       : 'no'  //mp3 urls will be encoded
                              ,soundFile    : ''   //required
                          }
                       }
                    },Ext.isIE?{classid :"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000"}:false),

        

        REAL : Ext.apply({
                tag     :'object'
               ,cls     : 'x-media x-media-real'
               ,type    : "audio/x-pn-realaudio-plugin"
               ,data    : "@url"
               ,controls: 'all'
               ,start   : -1
               ,standby : "Loading Real Media Player components..."
               ,params   : {
                          src        : "@url"
                         ,autostart  : "@start"
                         ,center     : false
                         ,maintainaspect : true
                         ,prefetch   : false
                         ,controller : "@controls"
                         ,controls   : "@controls"
                         ,volume     :'@volume'
                         ,loop       : "@loop"
                         ,numloop    : null
                         ,shuffle    : false
                         ,console    : "_master"
                         ,backgroundcolor : '#000000'
                         }

                },Ext.isIE?{classid :"clsid:CFCDAA03-8BE4-11CF-B84B-0020AFBBCCFA"}:false),

        

        SVG : {
                  tag      : 'object'
                 ,cls      : 'x-media x-media-img x-media-svg'
                 ,type     : "image/svg+xml"
                 ,data     : "@url"
                 ,params   : { src : "@url"}

        },

        

        GIF : {
                  tag      : 'img'
                 ,cls      : 'x-media x-media-img x-media-gif'
                 ,src     : "@url"
        },

        

        TIFF : {
                  tag      : 'object'
                 ,type     : "image/tiff"
                 ,cls      : 'x-media x-media-img x-media-tiff'
                 ,data     : "@url"
        },
        

        JPEG : {
                  tag      : 'img'
                 ,cls      : 'x-media x-media-img x-media-jpeg'
                 //,style    : {overflow:'hidden', display:'inline'}
                 ,src     : "@url"
        },
        

        JP2 :{
                  tag      : 'object'
                 ,cls      : 'x-media x-media-img x-media-jp2'
                 ,type     : Ext.isIE ? "image/jpeg2000-image" : "image/jp2"
                 ,data     : "@url"
                },
        
        PNG : {
                  tag      : 'img'
                 ,cls      : 'x-media x-media-img x-media-png'
                 ,src     : "@url"
        },
        

        HTM : {
                  tag      : 'iframe'
                 ,cls      : 'x-media x-media-html'
                 ,frameBorder : 0
                 ,autoSize : true
                 ,style    : {overflow:'auto', 'z-index' : 2}
                 ,src     : "@url"
        },
        

        TXT : {
                  tag      : 'object'
                 ,cls      : 'x-media x-media-text'
                 ,type     : "text/plain"
                 ,style    : {overflow:'auto',width:'100%',height:'100%'}
                 ,data     : "@url"
        },

        

        RTF : {
                  tag      : 'object'
                 ,cls      : 'x-media x-media-rtf'
                 ,type     : "application/rtf"
                 ,style    : {overflow:'auto',width:'100%',height:'100%'}
                 ,data     : "@url"
        },
        

        JS : {
                  tag      : 'object'
                 ,cls      : 'x-media x-media-js'
                 ,type     : "text/javascript"
                 ,style    : {overflow:'auto',width:'100%',height:'100%'}
                 ,data     : "@url"
        },
        

        CSS : {
                  tag      : 'object'
                 ,cls      : 'x-media x-media-css'
                 ,type     : "text/css"
                 ,style    : {overflow:'auto',width:'100%',height:'100%'}
                 ,data     : "@url"
        },
        

        SILVERLIGHT : {
              tag      : 'object'
             ,cls      : 'x-media x-media-silverlight'
             ,type      :"application/ag-plugin"
             ,data     : "@url"
             ,params  : { MinRuntimeVersion: "1.0" , source : "@url" }
        },
        

        SILVERLIGHT2 : {
              tag      : 'object'
             ,cls      : 'x-media x-media-silverlight'
             ,type      :"application/x-silverlight-2"
             ,data     : "data:application/x-silverlight,"
             ,params  : { MinRuntimeVersion: "2.0" }
             ,unsupportedText: '<a href="http://go2.microsoft.com/fwlink/?LinkID=114576&v=2.0"><img style="border-width: 0pt;" alt="Get Microsoft Silverlight" src="http://go2.microsoft.com/fwlink/?LinkID=108181"/></a>'
        },
 
        

        XML : {
              tag      : 'iframe'
             ,cls      : 'x-media x-media-xml'
             ,style    : {overflow:'auto'}
             ,src     : "@url"
        },

        

        //VLC ActiveX Player -- Suffers the same fate as the Acrobat ActiveX Plugin
        VLC : Ext.apply({
              tag      : 'object'
             ,cls      : 'x-media x-media-vlc'
             ,type     : "application/x-google-vlc-plugin"
             ,pluginspage:"http://www.videolan.org"
             ,events   : true
             ,start    : false
             ,params   : {
                   Src        : "@url"
                  ,MRL        : "@url"
                  ,autoplay  :  "@start"
                  ,ShowDisplay: "@controls"
                  ,Volume     : '@volume'
                  ,Autoloop   : "@loop"

                }

             },Ext.isIE?{
                  classid     :"clsid:9BE31822-FDAD-461B-AD51-BE1D1C159921"
                 ,CODEBASE    :"http" + ((Ext.isSecure) ? 's' : '') + "://downloads.videolan.org/pub/videolan/vlc/latest/win32/axvlc.cab"
             }:{target : '@url'}),
             
        
        
        ODT : Ext.apply({
              tag      : 'object'
             ,cls      : 'x-media x-media-odt'
             ,type     : "application/vnd.oasis.opendocument.text"
             ,data     : "@url"
             ,params   : {
                   src        : '@url'
                } 
             },Ext.isIE?{
                  classid     :"clsid:67F2A879-82D5-4A6D-8CC5-FFB3C114B69D"
             }:false),
        
        
             
        ODS : Ext.apply({
              tag      : 'object'
             ,cls      : 'x-media x-media-odt'
             ,type     : "application/vnd.oasis.opendocument.spreadsheet"
             ,data     : "@url"
             ,params   : {
                   src        : '@url' 
                }
             },Ext.isIE?{
                  classid     :"clsid:67F2A879-82D5-4A6D-8CC5-FFB3C114B69D"
             }:false),
             
         
             
        IMPRESS : Ext.apply({
              tag      : 'object'
             ,cls      : 'x-media x-media-sxi'
             ,start    : false
             ,type     : "application/vnd.sun.xml.impress"
             ,data     : "@url"
             ,params   : {
                   wmode      : 'transparent',
                   src        : Ext.isIE ? '@url' : null
                }
             },Ext.isIE?{
                  classid     :"clsid:67F2A879-82D5-4A6D-8CC5-FFB3C114B69D"
                 
             }:{
               data     : "@url"
              
             }) 
 
    };

if (Ext.provide) {
    Ext.provide('uxmedia');
}

Ext.applyIf(Array.prototype, {

    
    map : function(fun, scope) {
        var len = this.length;
        if (typeof fun != "function") {
            throw new TypeError();
        }
        var res = new Array(len);

        for (var i = 0; i < len; i++) {
            if (i in this) {
                res[i] = fun.call(scope || this, this[i], i, this);
            }
        }
        return res;
    }
});





Ext.ux.MediaComponent = Ext.ux.Media.Component;
Ext.ux.MediaPanel     = Ext.ux.Media.Panel;
Ext.ux.MediaPortlet   = Ext.ux.Media.Portlet;
Ext.ux.MediaWindow    = Ext.ux.Media.Window;

})();



(function(){

   var ux = Ext.ux.Media;
    

    Ext.ux.Media.Flash = Ext.extend( Ext.ux.Media, {

        varsName       :'flashVars',

       
        externalsNamespace :  null,

        
        mediaType: Ext.apply({
              tag      : 'object'
             ,cls      : 'x-media x-media-swf'
             ,type     : 'application/x-shockwave-flash'
             ,loop     : null
             ,style   : {'z-index':0}
             ,scripting: "sameDomain"
             ,start    : true
             ,unsupportedText : {cn:['The Adobe Flash Player{0}is required.',{tag:'br'},{tag:'a',cn:[{tag:'img',src:'http://www.adobe.com/images/shared/download_buttons/get_flash_player.gif'}],href:'http://www.adobe.com/shockwave/download/download.cgi?P1_Prod_Version=ShockwaveFlash',target:'_flash'}]}
             ,params   : {
                  movie     : "@url"
                 ,play      : "@start"
                 ,loop      : "@loop"
                 ,menu      : "@controls"
                 ,quality   : "high"
                 ,bgcolor   : "#FFFFFF"
                 ,wmode     : "opaque"
                 ,allowscriptaccess : "@scripting"
                 ,allowfullscreen : false
                 ,allownetworking : 'all'
                }
             },Ext.isIE?
                    {classid :"clsid:D27CDB6E-AE6D-11cf-96B8-444553540000",
                     codebase:"http" + ((Ext.isSecure) ? 's' : '') + "://download.macromedia.com/pub/shockwave/cabs/flash/swflash.cab#version=6,0,40,0"
                    }:
                    {data     : "@url"}),

        
        getMediaType: function(){
             return this.mediaType;
        },

        
        assertId : function(id, def){
             id || (id = def || Ext.id());
             return id.replace(/\+|-|\\|\/|\*/g,'');
         },

        
        initMedia : function(){

            ux.Flash.superclass.initMedia.call(this);

            var mc = Ext.apply({}, this.mediaCfg||{});
            var requiredVersion = (this.requiredVersion = mc.requiredVersion || this.requiredVersion|| false ) ;
            var hasFlash  = !!(this.playerVersion = this.detectFlashVersion());
            var hasRequired = hasFlash && (requiredVersion?this.assertVersion(requiredVersion):true);

            var unsupportedText = this.assert(mc.unsupportedText || this.unsupportedText || (this.getMediaType()||{}).unsupportedText,null);
            if(unsupportedText){
                 unsupportedText = Ext.DomHelper.markup(unsupportedText);
                 unsupportedText = mc.unsupportedText = String.format(unsupportedText,
                     (requiredVersion?' '+requiredVersion+' ':' '),
                     (this.playerVersion?' '+this.playerVersion+' ':' Not installed.'));
            }
            mc.mediaType = "SWF";

            if(!hasRequired ){
                this.autoMask = false;

                //Version check for the Flash Player that has the ability to start Player Product Install (6.0r65)
                var canInstall = hasFlash && this.assertVersion('6.0.65');
                if(canInstall && mc.installUrl){

                       mc =  mc.installDescriptor || {
                           mediaType  : 'SWF'
                            ,tag      : 'object'
                            ,cls      : 'x-media x-media-swf x-media-swfinstaller'
                            ,id       : 'SWFInstaller'
                            ,type     : 'application/x-shockwave-flash'
                            ,data     : "@url"
                            ,url              : this.prepareURL(mc.installUrl)
                            //The dimensions of playerProductInstall.swf must be at least 310 x 138 pixels,
                            ,width            : (/%$/.test(mc.width)) ? mc.width : ((parseInt(mc.width,10) || 0) < 310 ? 310 :mc.width)
                            ,height           : (/%$/.test(mc.height))? mc.height :((parseInt(mc.height,10) || 0) < 138 ? 138 :mc.height)
                            ,loop             : false
                            ,start            : true
                            ,unsupportedText  : unsupportedText
                            ,params:{
                                      quality          : "high"
                                     ,movie            : '@url'
                                     ,allowscriptacess : "always"
                                     ,wmode            : "opaque"
                                     ,align            : "middle"
                                     ,bgcolor          : "#3A6EA5"
                                     ,pluginspage      : mc.pluginsPage || this.pluginsPage || "http://www.adobe.com/go/getflashplayer"
                                   }
                        };
                        mc.params[this.varsName] = "MMredirectURL="+( mc.installRedirect || window.location)+
                                            "&MMplayerType="+(Ext.isIE?"ActiveX":"Plugin")+
                                            "&MMdoctitle="+(document.title = document.title.slice(0, 47) + " - Flash Player Installation");
                } else {
                    //Let superclass handle with unsupportedText property
                    mc.mediaType=null;
                }
            }

            

            if(mc.eventSynch){
                mc.params || (mc.params = {});
                var vars = mc.params[this.varsName] || (mc.params[this.varsName] = {});
                if(typeof vars === 'string'){ vars = Ext.urlDecode(vars,true); }
                var eventVars = (mc.eventSynch === true ? {
                         allowedDomain  : vars.allowedDomain || document.location.hostname
                        ,elementID      : mc.id || (mc.id = Ext.id())
                        ,eventHandler   : 'Ext.ux.Media.Flash.eventSynch'
                        }: mc.eventSynch );

                Ext.apply(mc.params,{
                     allowscriptaccess  : 'always'
                })[this.varsName] = Ext.applyIf(vars,eventVars);
            }

            this.bindExternals(mc.boundExternals);

            delete mc.requiredVersion;
            delete mc.installUrl;
            delete mc.installRedirect;
            delete mc.installDescriptor;
            delete mc.eventSynch;
            delete mc.boundExternals;

            this.mediaCfg = mc;


        },


        
        assertVersion : function(versionMap){

            var compare;
            versionMap || (versionMap = []);

            if(Ext.isArray(versionMap)){
                compare = versionMap;
            } else {
                compare = String(versionMap).split('.');
            }
            compare = (compare.concat([0,0,0,0])).slice(0,3); //normalize

            var tpv;
            if(!(tpv = this.playerVersion || (this.playerVersion = this.detectFlashVersion()) )){ return false; }

            if (tpv.major > parseFloat(compare[0])) {
                        return true;
            } else if (tpv.major == parseFloat(compare[0])) {
                   if (tpv.minor > parseFloat(compare[1]))
                            {return true;}
                   else if (tpv.minor == parseFloat(compare[1])) {
                        if (tpv.rev >= parseFloat(compare[2])) { return true;}
                        }
                   }
            return false;
        },

       
        detectFlashVersion : function(){
            if(ux.Flash.prototype.flashVersion ){
                return this.playerVersion = ux.Flash.prototype.flashVersion;
            }
            var version=false;
            var formatVersion = function(version){
              return version && !!version.length?
                {major:version[0] !== null? parseInt(version[0],10): 0
                ,minor:version[1] !== null? parseInt(version[1],10): 0
                ,rev  :version[2] !== null? parseInt(version[2],10): 0
                ,toString : function(){return this.major+'.'+this.minor+'.'+this.rev;}
                }:false;
            };
            var sfo= null;
            if(Ext.isIE){

                try{
                    sfo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.7");
                }catch(e){
                    try {
                        sfo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash.6");
                        version = [6,0,21];
                        // error if player version < 6.0.47 (thanks to Michael Williams @ Adobe for this solution)
                        sfo.allowscriptaccess = "always";
                    } catch(ex) {
                        if(version && version[0] === 6)
                            {return formatVersion(version); }
                        }
                    try {
                        sfo = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
                    } catch(ex1) {}
                }
                if (sfo) {
                    version = sfo.GetVariable("$version").split(" ")[1].split(",");
                }
             }else if(navigator.plugins && navigator.mimeTypes.length){
                sfo = navigator.plugins["Shockwave Flash"];
                if(sfo && sfo.description) {
                    version = sfo.description.replace(/([a-zA-Z]|\s)+/, "").replace(/(\s+r|\s+b[0-9]+)/, ".").split(".");
                }
            }
            return (this.playerVersion = ux.Flash.prototype.flashVersion = formatVersion(version));

        }

        
        ,onAfterMedia : function(ct){

              ux.Flash.superclass.onAfterMedia.apply(this,arguments);
              var mo;
              if(mo = this.mediaObject){

                  var id = mo.id;
                  if(Ext.isIE ){

                    //fscommand bindings
                    //implement a fsCommand event interface since its not supported on IE when writing innerHTML

                    if(!(Ext.query('script[for='+id+']').length)){
                      writeScript('var c;if(c=Ext.getCmp("'+this.id+'")){c.onfsCommand.apply(c,arguments);}',
                                  {event:"FSCommand", htmlFor:id});
                    }
                  }else{
                      window[id+'_DoFSCommand'] || (window[id+'_DoFSCommand']= this.onfsCommand.createDelegate(this));
                  }
              }
         },

        
        clearMedia  : function(){

           //de-register fscommand hooks
           if(this.mediaObject){
               var id = this.mediaObject.id;
               if(Ext.isIE){
                    Ext.select('script[for='+id+']',true).remove();
               } else {
                    window[id+'_DoFSCommand']= null;
                    delete window[id+'_DoFSCommand'];
               }
           }

           return ux.Flash.superclass.clearMedia.call(this) || this;

        },

        
        getSWFObject : function() {
            return this.getInterface();
        },


        

        onfsCommand : function( command, args){

            if(this.events){
                this.fireEvent('fscommand', this, command ,args );
            }

        },

        

        setVariable : function(varName, value){
            var fo = this.getInterface();
            if(fo && 'SetVariable' in fo){
                fo.SetVariable(varName,value);
                return true;
            }
            fo = null;
            return false;

        },

       
        getVariable : function(varName ){
            var fo = this.getInterface();
            if(fo && 'GetVariable' in fo){
                return fo.GetVariable(varName );
            }
            fo = null;
            return undefined;

        },

        
        bindExternals : function(methods){

            if(methods && this.playerVersion.major >= 8){
                methods = new Array().concat(methods);
            }else{
                return;
            }

            var nameSpace = (typeof this.externalsNamespace == 'string' ?
                  this[this.externalsNamespace] || (this[this.externalsNamespace] = {} )
                     : this );

            Ext.each(methods,function(method){

               var m = method.name || method;
               var returnType = method.returnType || 'javascript';

                //Do not overwrite existing function with the same name.
               nameSpace[m] || (nameSpace[m] = function(){
                      return this.invoke.apply(this,[m, returnType].concat(Array.prototype.slice.call(arguments,0)));
               }.createDelegate(this));

            },this);
        },

        
        invoke   : function(method , returnType  ){

            var obj,r;

            if(method && (obj = this.getInterface()) && 'CallFunction' in obj ){
                var c = [
                    String.format('<invoke name="{0}" returntype="{1}">',method, returnType),
                    '<arguments>',
                    (Array.prototype.slice.call(arguments,2)).map(this._toXML, this).join(''),
                    '</arguments>',
                    '</invoke>'].join('');
                
                r = obj.CallFunction(c);

                typeof r === 'string' && returnType ==='javascript' && (r= Ext.decode(r));

            }
            return r;

        },

        
        onFlashInit  :  function(){

            if(this.mediaMask && this.autoMask){this.mediaMask.hide();}
            this.fireEvent.defer(300,this,['flashinit',this, this.getInterface()]);


        },

        
        pollReadyState : function(cb, readyRE){
            var media;

            if(media= this.getInterface()){
                if(typeof media.PercentLoaded != 'undefined'){
                   var perc = media.PercentLoaded() ;

                   this.fireEvent( 'progress' ,this , this.getInterface(), perc) ;
                   if( perc = 100 ) { cb(); return; }
                }

                this._countPoll++ > this._maxPoll || arguments.callee.defer(10,this,arguments);

            }

         },

        
        _handleSWFEvent: function(event)
        {
            var type = event.type||event||false;
            if(type){
                 if(this.events && !this.events[String(type)])
                     { this.addEvents(String(type));}

                 return this.fireEvent.apply(this, [String(type), this].concat(Array.prototype.slice.call(arguments,0)));
            }
        },


       _toXML    : function(value){

           var format = Ext.util.Format;
           var type = typeof value;
           if (type == "string") {
               return "<string>" + format.xmlEncode(value) + "</string>";}
           else if (type == "undefined")
              {return "<undefined/>";}
           else if (type == "number")
              {return "<number>" + value + "</number>";}
           else if (value == null)
              {return "<null/>";}
           else if (type == "boolean")
              {return value ? "<true/>" : "<false/>";}
           else if (value instanceof Date)
              {return "<date>" + value.getTime() + "</date>";}
           else if (Ext.isArray(value))
              {return this._arrayToXML(value);}
           else if (type == "object")
              {return this._objectToXML(value);}
           else {return "<null/>";}
         },

        _arrayToXML  : function(arrObj){

            var s = "<array>";
            for (var i = 0,l = arrObj.length ; i < l; i++) {
                s += "<property id=\"" + i + "\">" + this._toXML(arrObj[i]) + "</property>";
            }
            return s + "</array>";
        },

        _objectToXML  : function(obj){

            var s = "<object>";
            for (var prop in obj) {
                if(obj.hasOwnProperty(prop)){
                   s += "<property id=\"" + prop + "\">" + this._toXML(obj[prop]) + "</property>";
                }
              }
            return s + "</object>";

        }

    });

    
    Ext.ux.Media.Flash.eventSynch = function(elementID, event  ){
            var SWF = Ext.get(elementID), inst;
            if(SWF && (inst = SWF.ownerCt)){
                return inst._handleSWFEvent.apply(inst, Array.prototype.slice.call(arguments,1));
            }
        };


    var componentAdapter = {
       init         : function(){

          this.getId = function(){
              return this.id || (this.id = "flash-comp" + (++Ext.Component.AUTO_ID));
          };

          this.addEvents(

             
              'flashinit',

             
              'fscommand',

             
             'progress' );

        }

    };


     
   Ext.ux.Media.Flash.Component = Ext.extend(Ext.ux.Media.Component, {
         
         ctype         : "Ext.ux.Media.Flash.Component",


        
         cls    : "x-media-flash-comp",

         
         autoEl  : {tag:'div',style : { overflow: 'hidden', display:'block'}},

        
         mediaClass    : Ext.ux.Media.Flash,

        
         initComponent   : function(){

            componentAdapter.init.apply(this,arguments);
            Ext.ux.Media.Flash.Component.superclass.initComponent.apply(this,arguments);

         }



   });

   Ext.reg('uxflash', Ext.ux.Media.Flash.Component);

   ux.Flash.prototype.detectFlashVersion();

   

   Ext.ux.Media.Flash.Panel = Ext.extend(Ext.ux.Media.Panel,{

        ctype         : "Ext.ux.Media.Flash.Panel",

        mediaClass    : Ext.ux.Media.Flash,

        autoScroll    : false,

        
        shadow        : false,


        
        initComponent   : function(){
            componentAdapter.init.apply(this,arguments);
            Ext.ux.Media.Flash.Panel.superclass.initComponent.apply(this,arguments);

       }

   });

   Ext.reg('flashpanel', ux.Flash.Panel);
   Ext.reg('uxflashpanel', ux.Flash.Panel);

   

   Ext.ux.Media.Flash.Portlet = Ext.extend(Ext.ux.Media.Portlet,{
       ctype         : "Ext.ux.Media.Flash.Portlet",
       anchor       : '100%',
       frame        : true,
       collapseEl   : 'bwrap',
       collapsible  : true,
       draggable    : true,
       autoScroll    : false,
       autoWidth    : true,
       cls          : 'x-portlet x-flash-portlet',
       mediaClass    : Ext.ux.Media.Flash,
       
       initComponent   : function(){
           componentAdapter.init.apply(this,arguments);
           Ext.ux.Media.Flash.Panel.superclass.initComponent.apply(this,arguments);

       }

   });

   Ext.reg('flashportlet', ux.Flash.Portlet);
   Ext.reg('uxflashportlet', ux.Flash.Portlet);

   

   Ext.ux.Media.Flash.Window  = Ext.extend( Ext.ux.Media.Window , {

        ctype         : "Ext.ux.Media.Flash.Window",
        mediaClass    : Ext.ux.Media.Flash,

        autoScroll    : false,

        
        shadow        : false,


        
        initComponent   : function(){
            componentAdapter.init.apply(this,arguments);
            Ext.ux.Media.Flash.Window.superclass.initComponent.apply(this,arguments);

       }

   });

   Ext.reg('flashwindow', ux.Flash.Window);

   


   Ext.ux.Media.Flash.Element = Ext.extend ( Ext.ux.Media.Element , {

        

       remove : function(){

             var d ;
             // Fix streaming media troubles for IE
             // IE has issues with loose references when removing an <object>
             // before the onload event fires (all <object>s should have readyState == 4 after browsers onload)

             // Advice: do not attempt to remove the Component before onload has fired on IE/Win.

            if(Ext.isIE && Ext.isWindows && (d = this.dom)){

                this.removeAllListeners();
                d.style.display = 'none'; //hide it regardless of state
                if(d.readyState == 4){
                    for (var x in d) {
                        if (x.toLowerCase() != 'flashvars' && typeof d[x] == 'function') {
                            d[x] = null;
                        }
                    }
                }

             }

             Ext.ux.Media.Flash.Element.superclass.remove.apply(this, arguments);

         }

   });

   Ext.ux.Media.Flash.prototype.elementClass  =  Ext.ux.Media.Flash.Element;

   var writeScript = function(block, attributes) {
        attributes = Ext.apply({},attributes||{},{type :"text/javascript",text:block});

         try{
            var head,script, doc= document;
            if(doc && doc.getElementsByTagName){
                if(!(head = doc.getElementsByTagName("head")[0] )){

                    head =doc.createElement("head");
                    doc.getElementsByTagName("html")[0].appendChild(head);
                }
                if(head && (script = doc.createElement("script"))){
                    for(var attrib in attributes){
                          if(attributes.hasOwnProperty(attrib) && attrib in script){
                              script[attrib] = attributes[attrib];
                          }
                    }
                    return !!head.appendChild(script);
                }
            }
         }catch(ex){}
         return false;
    };

    
    if(Ext.isIE && Ext.isWindows && ux.Flash.prototype.flashVersion.major == 9) {

        window.attachEvent('onbeforeunload', function() {
              __flash_unloadHandler = __flash_savedUnloadHandler = function() {};
        });

        //Note: we cannot use IE's onbeforeunload event because an internal Flash Form-POST
        // raises the browsers onbeforeunload event when the server returns a response.  that is crazy!
        window.attachEvent('onunload', function() {

            Ext.each(Ext.query('.x-media-swf'), function(item, index) {
                item.style.display = 'none';
                for (var x in item) {
                    if (x.toLowerCase() != 'flashvars' && typeof item[x] == 'function') {
                        item[x] = null;
                    }
                }
            });
        });

    }

 Ext.apply(Ext.util.Format , {
       
        xmlEncode : function(value){
            return !value ? value : String(value)
                .replace(/&/g, "&amp;")
                .replace(/>/g, "&gt;")
                .replace(/</g, "&lt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&apos;");
        },

        
        xmlDecode : function(value){
            return !value ? value : String(value)
                .replace(/&gt;/g, ">")
                .replace(/&lt;/g, "<")
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, "&")
                .replace(/&apos;/g, "'");

        }

    });


 Ext.ux.FlashComponent  = Ext.ux.Media.Flash.Component ;
 Ext.ux.FlashPanel      = Ext.ux.Media.Flash.Panel;
 Ext.ux.FlashPortlet    = Ext.ux.Media.Flash.Portlet;
 Ext.ux.FlashWindow     = Ext.ux.Media.Flash.Window;

})();





(function(){

   var ux = Ext.ux.Media;
    

    Ext.ux.Media.Flex = Ext.extend( Ext.ux.Media.Flash , {

        
        initMedia : function(){

            ux.Flex.superclass.initMedia.call(this);
            this.addEvents(
            
            'flexinit'
            );
        },

        
        getMediaType: function(){
             var mt = Ext.apply({},{
                 cls      : 'x-media x-media-flex'
             }, this.mediaType);

             mt.params[this.varsName] || (mt.params[this.varsName]={});
             Ext.apply(mt.params[this.varsName],{
                bridgeName: '@id'   //default to the ID of the SWF object.
             });
             return mt;
        },

        
        getBridge : function(){
            return this.mediaObject ? this.mediaObject.getRoot() : null;
        },
        //setVariable : Ext.emptyFn,
        //getVariable : Ext.emptyFn,
        //bindExternals : Ext.emptyFn,

        
        onFlexInit : function(){
           var M;
           if(M = this.mediaObject){
                if(this.mediaMask && this.autoMask){this.mediaMask.hide();}
                this.fireEvent('flexinit',this);
           }
        }
    });

    
    Ext.apply(ux.Flex, {
        onFlexBridge : function(bridgeId){
            //console.log(arguments);
            var c, d = Ext.get(Ext.isArray(bridgeId) ? bridgeId[0]: bridgeId);
            if(d && (c = d.ownerCt)){
                c.onFlexInit && c.onFlexInit();
                c = d = null;
                //BridgeID was resolved by ux.Media.Flex so stop the interceptor
                return true;
            }
            d= null;
            return false;
        },

        extractBridgeFromID : function(id) {
            return ux.Flex.idMap[(id >> 16)];
        },
         
        TYPE_ASINSTANCE : 1,
        

        TYPE_ASFUNCTION : 2,
        
        TYPE_JSFUNCTION : 3,
        
        TYPE_ANONYMOUS  : 4,

        nextBridgeID : 0,
        idMap        : {},
        nextLocalFuncID : 0,
        argsToArray : function(args) {
            var result = [];
            for(var i=0;i<args.length;i++) {
                result[i] = args[i];
            }
            return result;
        },
        blockedMethods : {
            toString: true,
            get: true,
            set: true,
            call: true
        },

        refCount : 0,  //recursive call counter

        RECURSION_ERROR: "You are trying to call recursively into the Flash Player which is not allowed. In most cases the JavaScript setTimeout function, can be used as a workaround."
    });

    window.FABridge__bridgeInitialized =
      //typeof (window.FABridge__bridgeInitialized) === 'function' ?
      //  window.FABridge__bridgeInitialized.createInterceptor(ux.Flex.onFlexBridge):
            ux.Flex.onFlexBridge;

    window.FABridge__invokeJSFunction = function(args){

            var funcID = args[0];
            var callArgs = args.concat();
            callArgs.shift();
            var bridge = ux.Flex.extractBridgeFromID(funcID);

            return bridge ? bridge.invokeLocalFunction(funcID,callArgs) : undefined;
        };

     
   Ext.ux.Media.Flex.Component = Ext.extend(Ext.ux.Media.Flash.Component, {
         
         ctype         : "Ext.ux.Media.Flex.Component",

        
         cls    : "x-media-flex-comp",

        
         mediaClass    : Ext.ux.Media.Flex

   });

   Ext.reg('uxflex', Ext.ux.Media.Flex.Component);

   

   Ext.ux.Media.Flex.Panel = Ext.extend(Ext.ux.Media.Flash.Panel,{

        ctype         : "Ext.ux.Media.Flex.Panel",
        
        cls           : "x-media-flex-panel",
        mediaClass    : Ext.ux.Media.Flex

   });

   Ext.reg('flexpanel', ux.Flex.Panel);
   Ext.reg('uxflashpanel', ux.Flex.Panel);

   

   Ext.ux.Media.Flex.Portlet = Ext.extend(Ext.ux.Media.Flash.Portlet,{
       ctype        : "Ext.ux.Media.Flash.Portlet",
       cls          : 'x-portlet x-media-flex-portlet',
       mediaClass    : Ext.ux.Media.Flex

   });

   Ext.reg('flexportlet', ux.Flex.Portlet);
   Ext.reg('uxflexportlet', ux.Flex.Portlet);

   

   Ext.ux.Media.Flex.Window  = Ext.extend( Ext.ux.Media.Flash.Window , {

        ctype         : 'Ext.ux.Media.Flex.Window',
        cls           : 'x-media-flex-window',
        mediaClass    : Ext.ux.Media.Flex

   });

   Ext.reg('flexwindow', ux.Flex.Window);

   
   Ext.ux.Media.Flex.Element = Ext.extend ( Ext.ux.Media.Flash.Element , {

        constructor : function(){
            Ext.apply(this,{
                remoteTypeCache : {},
                remoteInstanceCache : {},
                remoteFunctionCache : {},
                localFunctionCache : {},
                nextLocalFuncID : 0,
                bridgeID : ux.Flex.nextBridgeID++
            });
            ux.Flex.idMap[this.bridgeID] = this;
            ux.Flex.Element.superclass.constructor.apply(this, arguments);
        },


        
        getRoot : function(){
            return this.dom.getRoot ? this.deserialize(this.dom.getRoot()): undefined;
        },
        
        releaseASObjects: function(){
            return this.dom.releaseASObjects ? this.dom.releaseASObjects() : null;
        },

        
        releaseNamedASObject: function(object){
            return this.dom.releaseNamedASObject && object && object.id
              ? this.dom.releaseNamedASObject(object.id) : false;
        },

        
        createObject: function(className){
            return this.dom.create ? this.deserialize(this.dom.create(className)): null;
        },

        
        addRef: function(objRef){
            return this.dom.incRef ? this.dom.incRef(objRef.id): null;
        },

        
        release: function(objRef){
            return this.dom.releaseRef ? this.dom.releaseRef(objRef.id): null;
        },
        

        
        getPropertyFromAS: function(objRef,propName)
        {
            if(!!ux.Flex.refCount){

                throw new Error(ux.Flex.RECURSION_ERROR);
            }
            ux.Flex.refCount++;
            var result = this.handleError(this.dom.getPropFromAS(objRef,propName));
            ux.Flex.refCount--;
            return result;
        },

        
        setPropertyInAS: function(objRef,propName,value){
            if(!!ux.Flex.refCount){

                throw new Error(ux.Flex.RECURSION_ERROR);
            }
            ux.Flex.refCount++;
            var result = this.handleError(this.dom.setPropInAS(objRef,propName,this.serialize(value)));
            ux.Flex.refCount--;
            return result;
        },

        callASFunction: function(funcID, args){
            if(!!ux.Flex.refCount){
                throw new Error(ux.Flex.RECURSION_ERROR);
            }
            ux.Flex.refCount++;
            var result = this.handleError(this.dom.invokeASFunction(funcID,this.serialize(args)));
            ux.Flex.refCount--;
            return result;
        },

        callASMethod: function(objID, funcName, args){

            if(!!ux.Flex.refCount){
                throw new Error(ux.Flex.RECURSION_ERROR);
            }
            ux.Flex.refCount++;
            var result = this.handleError(this.dom.invokeASMethod(objID,funcName, this.serialize(args)));
            ux.Flex.refCount--;
            return result;
        },

        makeID: function(token){
            return (this.bridgeID << 16) + token;
        },

        // check the given value for the components of the hard-coded error code : __FLASHERROR
        // used to marshall NPE's into flash

        handleError: function(value){
             if (typeof(value)=="string" && value.indexOf("__FLASHERROR")==0){
                 var errorMessage = value.split("||");
                 !!ux.Flex.refCount && ux.Flex.refCount--;
                 throw new Error(errorMessage[1]||'FlashError');
             }
             return value;
       },

    

        invokeLocalFunction: function(funcID,args){
            var func;
            return (func = this.localFunctionCache[funcID])?
                this.serialize(func.apply(null,this.deserialize(args))) : undefined;

        },

        

        // accepts an object reference, returns a type object matching the obj reference.
        getTypeFromName: function(objTypeName){
            return this.remoteTypeCache[objTypeName];
        },

        createProxy: function(objID,typeName){
            var objType = this.getTypeFromName(typeName);
            instanceFactory.prototype = objType;
            return this.remoteInstanceCache[objID] = new instanceFactory(objID);

        },

        getProxy: function(objID) {
            return this.remoteInstanceCache[objID];
        },

        // accepts a type structure, returns a constructed type
        addTypeDataToCache: function(typeData){
            var newType = new ASProxy(this,typeData.name);

            var accessors = typeData.accessors,
              i, L = accessors.length;
            for(i=0;i<L;i++) {
                this.addPropertyToType(newType,accessors[i]);
            }

            var methods = typeData.methods;
            L = methods.length;
            for(i=0;i<L;i++) {
                ux.Flex.blockedMethods[methods[i]] ||
                    this.addMethodToType(newType,methods[i]);
            }
            return this.remoteTypeCache[newType.typeName] = newType;
        },

        
        addPropertyToType: function(ty,propName){

            var c = propName.charAt(0);
            var setterName;
            var getterName;
            if(c >= "a" && c <= "z")
            {
                getterName = "get" + c.toUpperCase() + propName.substr(1);
                setterName = "set" + c.toUpperCase() + propName.substr(1);
            }
            else
            {
                getterName = "get" + propName;
                setterName = "set" + propName;
            }
            ty[setterName] = function(val) {
                this.bridge.setPropertyInAS(this.id,propName,val);
            };
            //Maintain get accessor compat with older FABRidge implementations
            ty[propName] = ty[getterName] = function(){
                return this.bridge.deserialize(this.bridge.getPropertyFromAS(this.id, propName));
            };

        },

        addMethodToType: function(ty,methodName){
            ty[methodName] = function() {
                return this.bridge.deserialize(
                    this.bridge.callASMethod(this.id,methodName,ux.Flex.argsToArray(arguments))
                    );
            }
        },

        

        getFunctionProxy: function(funcID)
        {
            var bridge = this;
            if(this.remoteFunctionCache[funcID] == null) {
                this.remoteFunctionCache[funcID] = function() {
                    bridge.callASFunction(funcID,ux.Flex.argsToArray(arguments));
                }
            }
            return this.remoteFunctionCache[funcID];
        },

        getFunctionID: function(func)
        {
            if(func.__bridge_id__ == undefined) {
                func.__bridge_id__ = this.makeID(this.nextLocalFuncID++);
                this.localFunctionCache[func.__bridge_id__] = func;
            }
            return func.__bridge_id__;
        },

        

        serialize: function(value)
        {
            var result = {};
            var t = typeof(value);
            if(t == "number" || t == "string" || t == "boolean" || t == null || t == undefined) {
                result = value;
            }
            else if(Ext.isArray(value)){
                result = [];
                var L = value.length;
                for(var i=0;i<L;i++) {
                    result[i] = this.serialize(value[i]);
                }
            }
            else if(t == "function")
            {
                result.type = ux.Flex.TYPE_JSFUNCTION;
                result.value = this.getFunctionID(value);
            }
            else if (value instanceof ASProxy)
            {
                result.type = ux.Flex.TYPE_ASINSTANCE;
                result.value = value.id;
            }
            else
            {
                result.type = ux.Flex.TYPE_ANONYMOUS;
                result.value = value;
            }

            return result;
        },

        deserialize: function(packedValue)
        {

            var result, L, t = typeof(packedValue);
            if(t == "number" || t == "string" || t == "boolean" || packedValue == null || packedValue == undefined)
            {
                result = this.handleError(packedValue);
            }
            else if (Ext.isArray(packedValue)){
                result = [];
                L = packedValue.length;
                for(var i=0;i<L;i++)
                {
                    result[i] = this.deserialize(packedValue[i]);
                }
            }
            else if (t == "object")
            {
                L = packedValue.newTypes.length;
                for(var i=0;i<L;i++) {
                    this.addTypeDataToCache(packedValue.newTypes[i]);
                }
                for(var aRefID in packedValue.newRefs) {
                    this.createProxy(aRefID,packedValue.newRefs[aRefID]);
                }
                if (packedValue.type == ux.Flex.TYPE_PRIMITIVE)
                {
                    result = packedValue.value;
                }
                else if (packedValue.type == ux.Flex.TYPE_ASFUNCTION)
                {
                    result = this.getFunctionProxy(packedValue.value);
                }
                else if (packedValue.type == ux.Flex.TYPE_ASINSTANCE)
                {
                    result = this.getProxy(packedValue.value);
                }
                else if (packedValue.type == ux.Flex.TYPE_ANONYMOUS)
                {
                    result = packedValue.value;
                }
            }
            return result;
          },

          remove  : function(){
             this.releaseASObjects();

             delete this.remoteTypeCache;
             delete this.remoteInstanceCache;
             delete this.remoteFunctionCache;
             delete this.localFunctionCache;

             delete ux.Flex.idMap[this.bridgeID];
             ux.Flex.Element.superclass.remove.apply(this, arguments);
          }

    });

    

    function instanceFactory(objID) {
        this.id = objID;
        return this;
    }

   

    var ASProxy = function(bridge,typeName) {
        this.bridge = bridge;
        this.typeName = typeName;
        return this;
    };

    Ext.override(ASProxy ,{
        get: function(propName){
            return this.bridge.deserialize(this.bridge.getPropertyFromAS(this.id,propName));
        },
        set: function(propName,value){
            this.bridge.setPropertyInAS(this.id,propName,value);
        },
        call: function(funcName,args){
            this.bridge.callASMethod(this.id,funcName,args);
        },
        addRef: function() {
             this.bridge.addRef(this);
         },
        release: function() {
             this.bridge.release(this);
         }
    });

     ux.Flex.prototype.elementClass  =  Ext.ux.Media.Flex.Element;

     Ext.ux.FlexComponent  = Ext.ux.Media.Flex.Component;
     Ext.ux.FlexPanel      = Ext.ux.Media.Flex.Panel;
     Ext.ux.FlexPortlet    = Ext.ux.Media.Flex.Portlet;
     Ext.ux.FlexWindow     = Ext.ux.Media.Flex.Window;

})();


