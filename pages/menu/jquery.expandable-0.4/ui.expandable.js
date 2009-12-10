/*
 * Expandable, a jQuery plugin to dynamically group and hide web content
 * Copyright (C) 2009  Marc Diethelm
 * License: (GPL 3, http://www.gnu.org/licenses/gpl-3.0.txt) see license.txt
 */

(function($)
{

	// BUG:
	// worksforme? nested expanders: icon of inner expander way too low, header to tall (innerHeight is wrong!)

	// TO DO:
	// create a mechanism using css to make expandable invisible before creation (but have height); use .css() to make it visible when finished (as I did with new-nav in my portfolio)
	// option: content css [add inline]
	// use line-height on title... (if not empty)
	// customizable icon on right side of header (throbber, add icon, etc) with onclick callback

	// going UI will break the callback arg#2

	$.fn.expandable = function()
	{

		//console.log(typeof $.ui);

		var action;
		var userOptions = {};

		if ( arguments.length == 1 ) {

			action = ( arguments[0].constructor == String ? arguments[0] : null );
			userOptions = ( arguments[0].constructor == Object ? arguments[0] : null );
		} else if ( arguments.length == 2 ) {

			action = ( arguments[0].constructor == String ? arguments[0] : null );
			userOptions = arguments[1];
		}



		// apply options vs. settings

        //if (userOptions) {
        //    var options = $.extend({}, $.fn.expandable.defaults, userOptions);
        //}

        var options = $.extend({}, $.fn.expandable.defaults, userOptions);


		return this.each( function() {

			if (action == "destroy") { // this certainly is not the way it's done. But I don't know better for now, and it works.
				// restore original element
				$(this).removeClass("ui-widget ui-expandable ui-expandable-open");

				$(".ui-widget-content", this).remove().contents().appendTo(this);

				if ( $(this).data("elTitle") ) {
					$(".ui-widget-header", this).unbind("click").remove();
					$(this).prepend( $(this).data("elTitle") );
				}

				return this;

			} else if (action == "close") {

				this.closeExpandable();
				return this;

			} else if (action == "open") {

				this.openExpandable(null, options); // hack for restore onload, with arg "open" and one-time options (eg: {duration: 0})
				return this;
			}


			$(this).hide() // hide everything quickly
			.addClass("ui-expandable ui-widget");

			var title = "";

			// user has created a title child. replaced later.
			if ( $(".ui-expandable-title", this).length > 0 ) {
				var $title = $(".ui-expandable-title", this).eq(0).remove();
				title = $title.text();
				$(this).data("elTitle", $title);
				delete $title;
			}

			title = options.title || title;

			// wrap the content in an animatable box
			if ( $(".ui-widget-content", this).length == 0 ) {

				//$(this).wrapInner('<div class="ui-widget-content ui-helper-clearfix"></div>'); // fails if there is no content. jQuery bug #3552
				// workaround (same as my patch to jQuery trunk)
				var html = '<div class="ui-widget-content ui-helper-clearfix"></div>';
				var $this = jQuery( this );

				if ( $this.contents().length ) {
					$this.contents().wrapAll( html );
				} else {
					$this.html( html );
				}
			}

			var $content = $(".ui-widget-content", this);

			if ( options.startopen ) {
				$(this).addClass("ui-expandable-open");
			} else {
				$content.hide();
			}

			if ( options.uiIconClosed && options.uiIconOpen ) {
				//console.log("ui closed = %s, ui open = %s, %s", options.uiIconClosed, options.uiIconOpen, $(this).attr("id"))
				var iconstartclass = ( options.startopen ? options.uiIconOpen : options.uiIconClosed );
				var iconclosedclass = options.uiIconClosed;
				var iconopenclass = options.uiIconOpen;
			} else {
				//console.log("default icon (non UI), %s", $(this).attr("id"))
				var iconstartclass = ( options.startopen ? "icon-open" : "icon-closed" );
				var iconclosedclass = "icon-closed";
				var iconopenclass = "icon-open";
			}

			var extra_icon = "";

			if ( options.extraIcon ) {
				extra_icon = " ui-icon " + options.extraIcon;
			}

			//var $title = $('<div class="ui-state-default ui-widget-header" title="'+options.tooltip+'"><div class="ui-icon '+iconstartclass+'"></div><div class="ui-expandable-title">'+title+'</div></div>');


			var $title = $(
				'<div class="ui-state-default ui-widget-header" title="'+options.tooltip+'">' +
				'	<div class="ui-expandable-icon ui-icon '+iconstartclass+'"></div>' +
				'	<div class="ui-expandable-title">'+title+'</div>' +
				'	<div class="ui-expandable-extraIcon'+extra_icon+'"></div>' +
				'</div>'
			);

			$(".ui-widget-header", this).length ? $(".ui-widget-header", this).replaceWith($title) : $(this).prepend($title);

			$(this).show(); // show the finished expander

			// adjust vertical position of the icon to look nice // produces weird bug in nested expanders, grr.
			var $icon = $(".ui-icon", this);
			//$title.css("background-color", "red");
			//$icon.css("background-color", "yellow");
			var y_offset = Math.floor((($title.innerHeight() - $icon.height()) / 2 ));
			//console.log("title innerHeight = %i", $title.innerHeight());
			//console.log("title height = %i", $title.height());
			//console.log($title.get(0));
			if (y_offset > 0) {
				$icon.css("margin-top", y_offset);
			}


			// I wish I understood the scope complexities better...
			// maybe it can be cleaned up...
			var $expandable = $(this);
			var $self = this; // actually it should be self not $self, but self is the window

			if (options.close) {
				this._close = options.close; // I need 'this' in the callback to be the one from this scope. // ...use call
			};

			if (options.open) {
				this._open = options.open;
			}


			$title.bind("click", null, function(event)
			{ // register clicks on title

				if ( $expandable.hasClass("ui-expandable-open") ) {

					$self.closeExpandable(event);

				} else {

					$self.openExpandable(event, options);
				};
			});


			this.closeExpandable = function(_event)
			{

				$(".ui-expandable-icon", $title).removeClass(iconopenclass).addClass(iconclosedclass);

				// closing now
				$content.animate(options.animationClose, options.duration, options.easing, function () {

					$expandable.removeClass("ui-expandable-open");
					// user callback
					if (options.close) {
						$self._close(_event, options);
					}
				});
			};


			this.openExpandable = function(_event, options)
			{

				$(".ui-expandable-icon", $title).removeClass(iconclosedclass).addClass(iconopenclass);

				// opening now
				$content.animate(options.animationOpen, options.duration, options.easing, function()
				{

					$expandable.addClass("ui-expandable-open");
					// user callback
					if (options.open) {
						$self._open(_event, options);
					}
				});
			};


			$title.hover(
				function() {
					$(this)
					.removeClass("ui-state-default")
					.addClass("ui-state-hover");
				},
				function() {
					$(this)
					.removeClass("ui-state-hover")
					.addClass("ui-state-default");
				}
			);

			return this;

		});

	};



	$.fn.expandable.defaults = {
		startopen: false,
		title: null,
		tooltip: "Click to expand",
		uiIconClosed: "ui-icon-triangle-1-e",
		uiIconOpen: "ui-icon-triangle-1-s",
		/*uiIconClosed: null,
		uiIconOpen: null,*/
		animationClose: { height: "hide" },
		animationOpen: { height: "show" },
		duration: 500,
		easing: "swing",
		open: null, // callbacks: also not the way it's done it seems... (but works alright)
		close: null,
		extraIcon: null
	};


})(jQuery);
