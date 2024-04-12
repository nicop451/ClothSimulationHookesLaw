class Spring {
    constructor(k,d,restLength,a,b,tearLength){
      this.k = k;
      this.d = d;
      this.restLength = restLength;
      this.a = a;
      this.b = b;
      this.distance = p5.Vector.dist(this.b.pos, this.a.pos) -this.restLength;
      this.tearLength = tearLength;
      
    }
    
    update() {
      
      
      this.distance = p5.Vector.mag(p5.Vector.sub(this.b.pos, this.a.pos)) - this.restLength;
  
      
      //Calculate Spring Force -k* spring direction vector * x
      
  
      let force = p5.Vector.sub(this.b.pos, this.a.pos);
      let x = force.mag() - this.restLength;
      force.normalize();
      force.mult(this.k * x);
      this.a.applyForce(force);
      force.mult(-1);
      this.b.applyForce(force);
      
      
      
       //damp force
    
      // let springVector_normalized_a = p5.Vector.normalize(p5.Vector.sub(this.a.pos, this.b.pos));
      
      // let springVector_normalized_b = p5.Vector.normalize(p5.Vector.sub(this.a.pos, this.b.pos));
      
  //     let a_velo_normalized = p5.Vector.normalize(this.a.vel);
  //     let b_velo_normalized = p5.Vector.normalize(this.b.vel);
      
      
      
  //     let vel_corrolation = p5.Vector.dot(this.a.vel, this.b.vel);
      
  
  //     let dampingForce_a = p5.Vector.mult(this.a.vel,-this.d);//*-vel_corrolation);
  //     //this.a.applyForce(dampingForce_a);
  
  //     let dampingForce_b = p5.Vector.mult(this.b.vel.mult(-1),-this.d);//*-vel_corrolation);
      //this.b.applyForce(dampingForce_b);
    
      //console.log(vel_corrolation);
      
    }
      
    //Handles All Visual Aspects of Spring and Draws It-------------------------------------
    show() 
    { 
      function MapStretchToColor(length, restLength, maxLength) 
      {
         var r = round(abs(map(length, restLength, maxLength, 0, 255)));
         var final_color =  'rgb(' + '50' + ',' + '200' + ',' + r + ')';
         //console.log(final_color);
         return final_color;
      }
         
      //Calculate Thickness
      let ropeLength_forThickness = this.restLength*20 - p5.Vector.mag(p5.Vector.sub(this.a.pos, this.b.pos));
      //strokeWeight(ropeLength_forThickness*0.007);
      strokeWeight(2);
      
      //Calculate Spring Color
      let spr_color = MapStretchToColor(this.distance*5, this.restLength-15, this.restLength+30);
      stroke(spr_color);
      //stroke(0);
         
      //Draw Spring
      line(this.a.pos.x, this.a.pos.y, this.b.pos.x, this.b.pos.y);   
    }
  }