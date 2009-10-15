<?php

include '../../php-ofc-library/open-flash-chart.php';

$data_1 = array();

for( $i=0; $i<6.2; $i+=0.2 )
{
  $data_1[] = (sin($i) * 1.9) + 7;
}

$title = new title( "Waves go wobble" );

$line_1 = new line();
$line_1->set_values( $data_1 );
$line_1->set_width( 2 );


$y = new y_axis();
$y->set_range( 0, 10, 2 );


$chart = new open_flash_chart();
$chart->set_title( $title );
$chart->add_element( $line_1 );
$chart->set_y_axis( $y );

echo $chart->toPrettyString();

?>