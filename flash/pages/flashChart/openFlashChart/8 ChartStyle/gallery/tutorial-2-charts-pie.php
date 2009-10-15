<?php

include '../../php-ofc-library/open-flash-chart.php';

$title = new title( 'Cows go mooo' );

$pie = new pie();

//mouse over animation
$pie->alpha(0.5)
    ->add_animation( new pie_fade() )
    ->add_animation( new pie_bounce(5) )
    //->start_angle( 270 )
    ->start_angle( 0 )
    ->colours(array("#d01f3c","#356aa0","#C79810"));
    
    
$pie->set_start_angle( 35 );
$pie->set_animate( true );
$pie->set_tooltip( '#val# of #total#<br>#percent# of 100%' );
$pie->set_values( array(2,3,6,3,5,3) );

$chart = new open_flash_chart();
$chart->set_title( $title );
$chart->add_element( $pie );


$chart->x_axis = null;

echo $chart->toPrettyString();


?>