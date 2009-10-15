<?php

include_once '../../php-ofc-library/open-flash-chart.php';

$x_labels = array('Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');

$title = new title( "Our New House Schedule" );

$hbar = new hbar( '#86BBEF' );
$hbar->set_tooltip( 'Months: #val#' );
$hbar->append_value( new hbar_value(0,4) );
$hbar->append_value( new hbar_value(4,8) );

$h = new hbar_value(8,11);
$h->set_tooltip( "#left# to #right#<br>{$x_labels[8]} to {$x_labels[11]} (#val# months)" );
$hbar->append_value( $h );

$chart = new open_flash_chart();
$chart->set_title( $title );
$chart->add_element( $hbar );

$x = new x_axis();
$x->set_offset( false );
$x->set_labels_from_array( $x_labels );
$chart->set_x_axis( $x );

$y = new y_axis();
$y->set_offset( true );
$y->set_labels( array( "Make garden look sexy","Paint house","Move into house" ) );
$chart->add_y_axis( $y );

echo $chart->toPrettyString();



?>