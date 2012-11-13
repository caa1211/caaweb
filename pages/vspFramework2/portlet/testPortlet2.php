


<script>

;(function(){

var key = "<?php echo $_GET['key'];?>";
$("#portlet_" + key).on("setting", function(){
    alert("setting portlet " + key);
});

$("#portlet_" + key).on("refresh", function(){
    alert("refresh portlet " + key);
});

})();

</script>


<li class="widget ui-widget  noRefresh noClose" id="portlet_<?php echo $_GET['key'];?>">
    <div class="widget-head ui-widget-header ui-corner-all" style="background: url('cmps/jquery-ui/css/dot-luv/images/ui-bg_diagonals-thick_8_333333_40x40.png') repeat scroll 50% 50% blue;">
        <h3>BBB Widget <?php echo $_GET['key'];?> </h3>
        </div>

    
        <div class="widget-content ui-widget-content">
        
        <div style="display: none;" class="edit-box well">
            <div class="">BBB Widget Setting</div>
            <div class="label label-info">Heads up!</div>
            <div class="controls controls-row">
            <input class="span4" type="text" placeholder=".span4">
            <input class="span1" type="text" placeholder=".span1">
            </div>
        </div>
    
    
           <p> eu dui auctor tempor. Morbi laoreet eleifend dolor. Suspendisse pede odio, accumsan vitae, auctor non, suscipit at, ipsum. Cras varius sapien vel lectus.</p>
           <p> eu dui auctor tempor. Morbi laoreet eleifend dolor. Suspendisse pede odio, accumsan vitae, auctor non, suscipit at, ipsum. Cras varius sapien vel lectus.</p>
           <p> eu dui auctor tempor. Morbi laoreet eleifend dolor. Suspendisse pede odio, accumsan vitae, auctor non, suscipit at, ipsum. Cras varius sapien vel lectus.</p>
             
        </div>
</li>



