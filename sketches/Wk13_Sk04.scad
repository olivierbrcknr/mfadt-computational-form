
// Seeed Studio BasePlate generator

sizeX = 1;
sizeY = 1;

sideLength = 20; // in mm
PCBheight = 1.5;

holeDiameter = 2.54;
holePadding = 1;
punchSize = holeDiameter + holePadding*2 + 0.2;

module GrovePlug( posX = sideLength*0.25, posY = 1.5 ){
    
    plugWall = 0.5;
    plugW = 10;
    plugD = 5;
    plugH = 8;
    
    plugCutOutW = 6;
    plugCutOutD = 1.5;
    
    pinSize = 0.8;
    pinHeight = 4;
    pinDist = 1.9;

    translate( [posX, posY, PCBheight - 0.01]) {
        color("white"){
            
            difference(){
                cube( [plugW,plugD,plugH] );
            
                union(){
                    
                    translate( [plugWall,plugWall,plugWall] ) cube( [plugW-plugWall*2,plugD-plugWall*2 - plugCutOutD,plugH] );
                    
                    translate( [(plugW-plugCutOutW)/2,plugD-plugCutOutD,0] ) cube( [ plugCutOutW, plugCutOutD*1.1, plugH*1.1 ] ); 
                    translate( [(plugW-plugCutOutW)/2 + plugWall,plugD-plugCutOutD-plugWall*2,plugH/2] ) cube( [ plugCutOutW - plugWall*2, plugCutOutD*1.1, plugH*1.1 ] ); 
                    
                    
                    tinyCutOut = (plugW-plugCutOutW)/2-plugWall*2;
                    
                    translate( [plugWall,plugWall,plugWall] ) cube( [tinyCutOut,plugD-plugWall*2,plugH] );
                    translate( [plugW-plugWall-tinyCutOut,plugWall,plugWall] ) cube( [tinyCutOut,plugD-plugWall*2,plugH] );
                    
                }
            }
        }
        
        color("#CCC"){
            
            pinShiftX = ( plugW - pinDist*3 ) / 2;
            
            translate( [pinShiftX,plugD/2 - plugCutOutD/2,pinHeight/2+PCBheight+plugWall] ){
                
                for( i = [0:3] ){
                    
                    translate( [i*pinDist,0,0] ) cube( [pinSize,pinSize,pinHeight], center = true );
                }
            }
            
        }
    }
}

module Hole( n = 1, is_adding = false ){
    
    
    if( is_adding == true ){
        
        if( n % 2 == 0 ){
            cylinder( h = PCBheight, d = punchSize, $fn=100, center = true );
            
        }
    }else{
    
        if( n % 2 == 0 ){
            cylinder( h = PCBheight*2, d = holeDiameter, $fn=100, center = true );
            
        }else{
            cylinder( h = PCBheight*2, d = punchSize, $fn=100, center = true );
        }
    }
}

module SeeedBasePlate( x = 1, y = 1 ){
    
    color("#5d9bc5"){
        
        difference(){
            union(){
               
                // base plate
                cube( [ x*sideLength, y*sideLength, PCBheight ], center = false );
                
                // add padding Elments
                for( col = [ 1 : x ] ){
                                        
                        translate( [ col * sideLength - sideLength/2,  0, PCBheight/2 ] ) Hole( n = col, is_adding = true );
                        translate( [ col * sideLength - sideLength/2,  sideLength * y, PCBheight/2 ] ) Hole( n = col, is_adding = true );
                                            
                }
                for( row = [ 1 : y ] ){
                        translate( [ 0,  row * sideLength - sideLength/2, PCBheight/2 ] ) Hole( n = row+1, is_adding = true  );
                        translate( [ x * sideLength,  sideLength * row - sideLength/2, PCBheight/2 ] )  Hole( n = row+1, is_adding = true  );

                }
            }
            
            // cutouts
            union(){
                
                // holes in additional elements
                for( col = [ 1 : x ] ){
                        translate( [ col * sideLength - sideLength/2,  0, PCBheight/2 ] ) Hole( n = col );
                        translate( [ col * sideLength - sideLength/2,  sideLength * y, PCBheight/2 ] )  Hole( n = col );

                }
                for( row = [ 1 : y ] ){
                        translate( [ 0,  row * sideLength - sideLength/2, PCBheight/2 ] ) Hole( n = row+1 );
                        translate( [ x * sideLength,  sideLength * row - sideLength/2, PCBheight/2 ] )  Hole( n = row+1 );

                }
                
            }
        }
    }
}




SeeedBasePlate( x = sizeX, y = sizeY );
GrovePlug();