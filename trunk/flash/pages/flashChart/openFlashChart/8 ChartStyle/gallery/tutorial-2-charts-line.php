<?php

include '../../php-ofc-library/open-flash-chart.php';

//animation defined b
$animation = array();
$delay = array();
$cascade = array();
for($i=1; $i<4; $i++)
{
    $animation[]    = isset($_GET["animation_$i"])?$_GET["animation_$i"]:'pop-up';
    $delay[]        = isset($_GET["delay_$i"])?$_GET["delay_$i"]:0.5;
    $cascade[]    = isset($_GET["cascade_$i"])?$_GET["cascade_$i"]:1;
}

$data_1 = array();
$data_2 = array();
$data_3 = array();

for( $i=0; $i<12.1; $i+=0.2 )
{
  $data_1[] = (sin($i) * 1.9) + 7;
  $data_2[] = (sin($i) * 1.9);
  $data_3[] = (sin($i) * 1.9) - 7;
}

$data_4= array(1,2,1,3,5,null,null,null) ;

//animation definede


$data_1 = array();

for( $i=0; $i<6.2; $i+=0.2 )
{
  $data_1[] = (sin($i) * 1.9) + 7;
}

$title = new title( "Waves go wobble" );

$line_1 = new line();
$line_1->set_values( $data_1 );
$line_1->set_width( 2 );
$line_1->on_show(new line_on_show($animation[0], $cascade[0], $delay[0]));

// ------- LINE 2 -----
$d = new solid_dot();
$d->size(3)->halo_size(1)->colour('#3D5C56');

$line_2 = new line();
$line_2->set_default_dot_style($d);
$line_2->set_values( $data_2 );
$line_2->set_width( 2 );
$line_2->set_colour( '#3D5C56' );



$y = new y_axis();
$y->set_range( 0, 10, 2 );





$chart = new open_flash_chart();
$chart->set_title( $title );
$chart->add_element( $line_1 );
$chart->add_element( $line_2 );

$chart->set_y_axis( $y );


echo $chart->toPrettyString();

?>