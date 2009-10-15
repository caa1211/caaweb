<?php

include '../../php-ofc-library/open-flash-chart.php';

$animation_1= isset($_GET['animation_1'])?$_GET['animation_1']:'pop';
$delay_1    = isset($_GET['delay_1'])?$_GET['delay_1']:0.5;
$cascade_1    = isset($_GET['cascade_1'])?$_GET['cascade_1']:1;
$animation_2= isset($_GET['animation_2'])?$_GET['animation_2']:'fade-in';
$delay_2    = isset($_GET['delay_2'])?$_GET['delay_2']:1;
$cascade_2    = isset($_GET['cascade_2'])?$_GET['cascade_2']:1;

$title = new title( date("D M d Y") );

$bar = new bar_glass();
$bar->set_colour('#ff0000');
$bar->set_values( array(9,8,7,6,5,4,3,2,1) );
$bar->set_on_show(new bar_on_show($animation_1, $cascade_1, $delay_1));


$bar2 = new bar_glass();
$bar2->set_values( array(5,6,5,7,3,4,3,5) );
$bar2->set_on_show(new bar_on_show($animation_2, $cascade_2, $delay_2));


$chart = new open_flash_chart();
$chart->set_title( $title );
$chart->add_element( $bar );
$chart->add_element( $bar2 );

echo $chart->toPrettyString();

?>