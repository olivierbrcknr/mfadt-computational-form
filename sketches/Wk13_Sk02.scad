

$castleSides = 4;
$castleRadius = 30;
$castleMargin = 20;

$castleBaseHeight = 20;

midRadius = $castleRadius + $castleMargin;
outerRadius = $castleRadius + $castleMargin*3;

isEven = $castleSides % 2 == 0;
echo("is even: ", isEven);

// one tower
module tower( towerHeight = 20, towerRadius = 5 ){
    
    roofHeight = 20;
    windowHeight = 3;
    baseHeight = 4;
    
    union(){
        // main
        difference() {
            cylinder(h = towerHeight,r = towerRadius,center = false, $fn=8 );
            
            union(){
                translate([ 0, 0, towerHeight-windowHeight*2]){
                    for(windows = [0 : 3])rotate( [0,0, 360/4 * windows + 360/16] ) translate([0,towerRadius,0]) cube(size = [1.5,3,windowHeight], center = true);
                            
                        
                  
                }
            }
        }

        // base    
        cylinder(h = baseHeight,r = towerRadius*1.2,center = false, $fn=8 );
        // roof
        translate( [0,0,towerHeight] ) cylinder(h = roofHeight, r1 = towerRadius * 1.2, r2 = 0, center = false);
    }
}

module towerWithBridge( towerHeight = $castleBaseHeight, towerRadius = 5, bridgeLength = 20 ){
    
    translate( [0,towerRadius/4,towerHeight-6] ) rotate( [0,-15,180] ) cube( [  bridgeLength * 1.2, towerRadius/2 , 5 ] );
    
    tower( towerHeight = towerHeight, towerRadius = towerRadius );
}



// build castle
union(){
    
    castleBaseRoofHeight = 10;
    
    //center
    rotate( [  0,0, 360 / ($castleSides*4)  ] ){
        
        
        
        cylinder(h = $castleBaseHeight,r = $castleRadius, center = false, $fn=$castleSides*2 );
        translate([0,0,$castleBaseHeight]) cylinder(h = castleBaseRoofHeight,r1 = $castleRadius*1.1,r2=$castleRadius*0.8, center = false, $fn=$castleSides*2 );
        
        translate([0,0,$castleBaseHeight + castleBaseRoofHeight]) cylinder(h = $castleBaseHeight,r = $castleRadius*0.8, center = false, $fn=$castleSides*2 );
        
        // top floor
        translate([0,0,$castleBaseHeight * 2 + castleBaseRoofHeight]){ 
            cylinder(h = $castleBaseHeight,r = $castleRadius*0.5, center = false, $fn=$castleSides );
        
            for( side = [0:$castleSides-1] ){
                
                angle = 360 / $castleSides * side;
                
                rotate( [0,0,angle] ){
                        translate( [$castleRadius*0.5,0,0] ){
                            tower( towerHeight = $castleBaseHeight );
                        }
                }   
            }
        }
        
        // top roof
        translate([0,0,$castleBaseHeight * 3 + castleBaseRoofHeight]) cylinder(h = $castleBaseHeight*3,r1 = $castleRadius*0.6, r2 = 0, center = false, $fn=$castleSides );
     
        // mid
        union(){
            difference(){
                cylinder(h = $castleBaseHeight,r = midRadius, center = false, $fn=$castleSides*2 );
                
                cylinder(h = $castleBaseHeight * 3,r = midRadius - 5, center = true, $fn=$castleSides*2 );
                
            }
            
            for( side = [0:$castleSides*2-1] ){
                
                angle = 360 / ($castleSides*2) * side;
                
                rotate( [0,0,angle] ){
                        translate( [midRadius,0,0] ){
                            towerWithBridge( towerHeight = $castleBaseHeight*2, bridgeLength = midRadius - $castleRadius*0.7  );
                        }
                }   
            }
            
        }


       
     
    }
    
    
    
    // outer
    xShift = midRadius*sin( 180 / ($castleSides*2) );
    bL = outerRadius - midRadius;
    
    for( side = [0:$castleSides-1] ){
        
        angle = 360 / $castleSides * side;
        
        rotate( [0,0,angle] ) translate( [outerRadius,xShift,0] ) towerWithBridge( bridgeLength = bL );
        
        mirror( [0,1,0] ) rotate( [0,0,angle] ) translate( [outerRadius,xShift,0] ) towerWithBridge( bridgeLength = bL );
        
    }
    
    
}