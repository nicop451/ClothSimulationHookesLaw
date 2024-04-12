class particle 
{
  
   constructor(x,y, x_vel, y_vel,locked, mass) 
   {
      this.pos = createVector(x,y);
      this.vel = createVector(x_vel, y_vel);
      this.acc = createVector(0,0);
      this.isLocked = locked;
      this.radius = 4;
      this.mass = mass;
   }

   applyForce(force)
   {
      this.acc.add(force);
   }

   edgeCollision(damp)
   {
      if(this.pos.y >= height - this.radius)
      {
         this.pos.y = height - this.radius;
         this.vel.y *= -1*damp;
      }
      else if(this.pos.x >= width - this.radius) 
      { 
         this.pos.x = width - this.radius;
         this.vel.x *= -1*damp; 
      } 
      else if (this.pos.x <= this.radius) 
      {
         this.pos.x = this.radius;
         this.vel.x *= -1*damp;
      }
   }

   update()
   {
      if(this.isLocked !== true)
      {
         //this.acc.mult(1.2);
         this.vel.add(this.acc);
         //this.vel.mult(0.96);
         //this.vel.mult(deltaTime*0.1);
         this.pos.add(this.vel);//p5.Vector.div(this.vel, deltaTime*0.1)
         this.acc.set(0,0);
      }
   }

   show()
   {
      fill(255)
      strokeWeight(0);
      stroke(255);
      ellipse(this.pos.x, this.pos.y, this.radius);
   }
}







