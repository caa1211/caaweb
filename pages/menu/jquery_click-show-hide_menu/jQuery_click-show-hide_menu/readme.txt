========
INSTALL
========

1. Unzip the package, retaining the folder structure.

2. Rename "YOUR_TEMPLATE" folders to match the name of your custom template. Copy files to your existing zencart folder. No core files are overwritten.

3. In Admin > Tools > Layout Boxes Controller, you should now have a new sidebox called sideboxes/YOUR_TEMPLATE/categories_css.php. Enable it and disable the standard categories sidebox.

4. Add the following lines to /includes/templates/YOUR_TEMPLATE/css/stylesheet.css: .js ul.jqNavigation {display: none; } ul.jqNavigation li ul { display: none; }

5. Add the following code to /includes/templates/YOUR_TEMPLATE/common/html_header.php:

<script type="text/javascript" src="includes/templates/YOUR_THEME/jscript/jquery-1.3.2.min.js"></script>
<script type="text/javascript">
document.getElementsByTagName('html')[0].className = 'js';
</script>

5. Currently configured to go up to 5 subcategories deep, but can be set to however deep you desire by modifying $max_level var in categories_ul_generator.php.


========
CREDITS:
========

jQuery Click-(Animate)-Show-(Animate)-Hide Menu by Mark Jones, 2009. mark.jones@bluebit.co.uk

This plugin is a modified version of CSS Click-Show-Hide Menu by Cameron Clark, many thanks.

CSS Click-Show-Hide Menu Based on:

  CSS Flyout Category Menu mod for ZenCart by DrByte, 2004. See notes below.
  http://www.zen-cart.com/index.php?main_page=product_contrib_info&cPath=40_52&products_id=75

  mygosuMenu 1.2.0b by Cezary Tomczak, 2003,2004. See notes in categories_css.js.
  http://gosu.pl/dhtml/mygosumenu.html

Integrated and modified by Cameron Clark, Prolifique, 2008. cameron@prolifique.com


#####################################
#                                   #
#     CSS Flyout Category Menu      #
#       by DrByte 2004-07-11        #
#     for Zen Cart v1.2.x/1.3.x     #
# donations to: paypal@zen-cart.com #
#                                   #
#####################################

========
COMPATIBILITY:
========
This contribution should work fine in any Zen Cart v1.2.x or v1.3.0 installation
