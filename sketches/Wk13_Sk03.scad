

$castleSides = 4;
$castleRadius = 30;
$castleMargin = 20;

$castleBaseHeight = 20;
castleBaseRoofHeight = 10;

midRadius = $castleRadius + $castleMargin;
outerRadius = $castleRadius + $castleMargin*3;

isEven = $castleSides % 2 == 0;
echo("is even: ", isEven);


module wall( length = 20, s = 1 ){

    wallCubeCount = floor( length / (s*2) );
    wallCubeSpacing = (length - (wallCubeCount+0.5)*s) / wallCubeCount;

    for( p = [0 : length] ){
        translate([ 0, p * (wallCubeSpacing + s), 0 ]) cube(size = [s,s,s], center = false);
    }
}

module towerBalcony( h=4, r=8, fn=8, cubeSize=1 ){
    cylinder(h = h,r = r,center = false, $fn=fn );
    
    wallRadius = r * cos( 180 / fn ) - cubeSize;
    balconySideLength = r*sin( 180 / fn );
        
    for( side = [0:fn-1] ){
        
        angle = 360 / fn * side + (360/fn)/2;
        // [r-1.5*cubeSize, -1*balconySideLength + cubeSize/2 ,h]
        
        rotate( [0,0,angle] ) translate( [wallRadius,-1*balconySideLength,h] ) wall( length = balconySideLength, s = cubeSize );
              
    }
    
    
}

// one tower
module tower( towerHeight = 20, towerRadius = 5 ){
    
    roofHeight = 20;
    windowHeight = 3;
    baseHeight = 4;
    
    towerWindowCount = floor( towerHeight / $castleBaseHeight );
    
    union(){
        // main
        difference() {
            cylinder(h = towerHeight,r = towerRadius,center = false, $fn=8 );
            
            union(){
                for( stories = [ 0 : (towerWindowCount-1) ] ){
                    
                    
                    
                    translate([ 0, 0, towerHeight-windowHeight*2 - stories*$castleBaseHeight]){
                        for(windows = [0 : 3])rotate( [0,0, 360/4 * windows + 360/16] ) translate([0,towerRadius,0]) cube(size = [1.5,3,windowHeight], center = true);
                    }
                }
            }
        }

        // base    
        cylinder(h = baseHeight,r = towerRadius*1.2,center = false, $fn=8 );
        // roof
        translate( [0,0,towerHeight] ) cylinder(h = roofHeight, r1 = towerRadius * 1.2, r2 = 0, center = false);
        
        
        // balcony
        if( towerHeight > ( $castleBaseHeight + castleBaseRoofHeight ) ){
            
            translate( [0,0, towerHeight - baseHeight*3 ] ){
                towerBalcony( h = baseHeight, r = towerRadius*1.4  );
            }
        }
    }
}

module towerWithBridge( towerHeight = $castleBaseHeight, towerRadius = 5, bridgeLength = 20 ){
    
    translate( [0,towerRadius/4,towerHeight-6] ) rotate( [0,-15,180] ) cube( [  bridgeLength * 1.2, towerRadius/2 , 5 ] );
    
    tower( towerHeight = towerHeight, towerRadius = towerRadius );
}



// build castle
union(){
    
    //center
    rotate( [  0,0, 360 / ($castleSides*4)  ] ){
        
        
        
        cylinder(h = $castleBaseHeight,r = $castleRadius, center = false, $fn=$castleSides*2 );
        translate([0,0,$castleBaseHeight]) cylinder(h = castleBaseRoofHeight,r1 = $castleRadius*1.05,r2=$castleRadius*0.8, center = false, $fn=$castleSides*2 );
        
        // roof windows
//        for( side = [ 0 : $castleSides*2-1 ] ){
//            
//            currentR = $castleRadius*1.05;
//            
//            windowSize = 3;
//            
//            midRoofRadius =  currentR * cos( 180 / $castleSides*2 );
//            midRoofSideLength = currentR * sin( 180 / $castleSides*2 );
//                
//            
//            windowCols = floor( midRoofSideLength / windowSize );
//                        
//        }
        
        
        translate([0,0,$castleBaseHeight + castleBaseRoofHeight]) cylinder(h = $castleBaseHeight,r = $castleRadius*0.8, center = false, $fn=$castleSides*2 );
        
        translate([0,0,$castleBaseHeight * 2 + castleBaseRoofHeight - 2]) towerBalcony( h = 4, r = $castleRadius*0.9, fn = $castleSides*2  );
        
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
        translate([0,0,$castleBaseHeight * 3 + castleBaseRoofHeight]) {
            
                cylinder(h = $castleBaseHeight*1.5,r1 = $castleRadius*0.6, r2 = 0, center = false, $fn=$castleSides );
            
            translate( [0,0,$castleBaseHeight/2] ){
                cylinder(h = $castleBaseHeight*0.7,r1 = 0, r2 = $castleRadius*0.3, center = false, $fn=$castleSides );
                translate([0,0,$castleBaseHeight*0.7]) cylinder(h = $castleBaseHeight*0.7, r1 = $castleRadius*0.3, r2 = 0, center = false, $fn=$castleSides );
                
                translate([0,0,$castleBaseHeight]) cylinder(h = $castleBaseHeight/2, r = $castleRadius*0.15, center = false, $fn=$castleSides );
            }
            
            translate( [0,0,$castleBaseHeight*1.5] ){
                cylinder(h = $castleBaseHeight*0.7,r1 = 0, r2 = $castleRadius*0.3, center = false, $fn=$castleSides );
                translate([0,0,$castleBaseHeight*0.7]) cylinder(h = $castleBaseHeight, r1 = $castleRadius*0.3, r2 = 0, center = false, $fn=$castleSides );
                            }
          
        }
        
     
        // mid ring
        union(){
            difference(){
                cylinder(h = $castleBaseHeight,r = midRadius, center = false, $fn=$castleSides*2 );
                
                
                union(){
                    cylinder(h = $castleBaseHeight * 3,r = midRadius - 5, center = true, $fn=$castleSides*2 );
                    
                    entranceDoorWidth = 10;
            entranceDoorHeight = $castleBaseHeight/2;
            
            for( side = [0:$castleSides-1] ){
                
                        angle = 360 / $castleSides * side - ( 360 / $castleSides )/4;
                        
                        rotate( [0,0,angle] ){
                                translate( [midRadius - 5,0,0] ){
                                    
                                    
                  
                                    cube( [10,entranceDoorWidth,entranceDoorHeight*2], center = true );
                                    translate( [0,0,entranceDoorHeight] ) rotate([0,90,0]) cylinder( h = 10, d = entranceDoorWidth, center = true, $fn=50  );
                                }
                        }   
                    }
                    
                    
                }
                
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