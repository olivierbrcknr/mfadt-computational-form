

$unit = 10;
$heightFactor = 1;
$solarPanels = 2;
$dishInsetFactor = 2.5;
$radiusDishFactor = 1.4;

$height = $unit * $heightFactor;

$radius = $unit/2;
$radius2 = $radius*0.8;
$radius3 = $radius*0.6;

$radiusBig = $radius*$radiusDishFactor;
$radiusSphere = $radiusBig * $dishInsetFactor;

$angle = asin( $radiusBig / $radiusSphere ) * 2;
$shpereOffset = $radiusSphere * cos( $angle * 0.5 );
$antennaOffset = $height/2 + $unit*0.4 - ( $radiusSphere - $shpereOffset );


// Dish
color( "#EEE" ){
    translate([0,0,$height/2+$unit*0.4]) {
        
        difference() {
           
           union() {
                cylinder(h=$unit*0.2, r=$radiusBig, center=true);
                translate([0,0,$unit*-0.4]) {
                    cylinder(h=$unit*0.3, r1=$radius2, r2=$radiusBig, center=false);
                }
            } 
            translate([0,0,$shpereOffset]) {
                sphere($radiusSphere);
            }
        }
    }
    
}


// black satellite elements
color( "#555" ) { 
    
    // big part
    union() {
        cylinder(h=$height, r=$radius, center=true);
        translate([0,0,$height/-2 - $unit*0.2]) {
            cylinder(h=$unit*0.2, r1=$radius2, r2=$radius, center=false);
        }
    }
    
    // small part
    translate([0,0,$height/-2 - $unit*0.4]) {
        union() {
            cylinder(h=$unit*0.4, r=$radius2, center=true);
            translate([0,0,$unit*-0.4]) {
                cylinder(h=$unit*0.2, r1=$radius3, r2=$radius2, center=false);
            }
        }
    }
}

// wood elements
color( "#DCB579" ) { 
    
    // dish antenna
    translate([0,0,$antennaOffset]) {
        union() {
            cylinder( h=$unit*0.2, r=$radius*0.2, center=false );
            translate([0,0,$unit*0.2]) {
                sphere($radius*0.2);
            }
        }
    }
    
    // solar panels
    for(panelNumber = [1 : 1 : $solarPanels]){
        
        deg_a = 360 / $solarPanels * panelNumber;
        
        rotate(a = deg_a) { 
            translate( [0,$radius + $unit*0.8,0] ){
                cube([$unit*0.3,$unit*1.6,$unit*0.7],true);
            }
        }
    }

 
}