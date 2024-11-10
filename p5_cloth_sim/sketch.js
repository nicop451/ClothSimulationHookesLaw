let ptc_array = [];
let spr_array = [];

let spacing = 16;
let rows = 25;
let cols = 30;

let t_x = -150;
let t_y = 0;

let xoff = 0;
let softBody = false;
let lockTopParticles = true;
let borderCollisions = false;
let showParticle = false;
let rowsToGrab = 1;

let def_k = 0.4;
let def_d = 0;
let baseSpringTearStrength = 11;
let RandomTearStrengthMultRange = 3;


//Adjust Variables switch between softBody and cloth
if (softBody == true) {def_k *= 0.4;}

//FUNCTIONS--------------------------------------------------------------------------------------------
function BreakSpringsAtMouse(spring, iteration, radius)
{
   let s = spring;
   let i = iteration;
   
   if (mouseIsPressed) 
   {
      //get locations of spring's particles
      let x1 = s.a.pos.x; let y1 = s.a.pos.y; let x2 = s.b.pos.x; let y2 = s.b.pos.y;
      //Use collide 2d to check if mouse is colliding with spring 
      if (collideLineCircle(x1, y1, x2, y2, mouseX, mouseY, radius)) 
      {
         spr_array.splice(i, 1);
      }
   }
}

function BreakSpringsWhenStretched(spring, iteration)
{
  let s = spring;
  let i = iteration;

  if(s.distance > s.tearLength)
  {
        spr_array.splice(i, 1);
  }
}


//SETUP--------------------------------------------------------------------------------------------
function setup()
{
   cnv = createCanvas(windowWidth, windowHeight);
   gravity = createVector(0, 0.1);

   function Initialize_Particles()
   {
      //Loops through rows and creates particles in row containers.
      for (let i = 0; i < rows; i++) 
      { 
         let row_array = []; //clears row array to be filled
         for (let j = 0; j < cols; j++) 
         {
            //Lock top particles
            let particleLock = false;
            if (lockTopParticles && i == 0)
            {
               particleLock = true;
            } 
            //Initialize particle & add to current row
            ptc_X_Init = windowWidth / 4 + j * spacing - t_x;
            ptc_Y_Init = windowHeight / 8 + i * spacing + t_y;
            //Create Particle and add to current row
            row_array.push(new particle(ptc_X_Init ,ptc_Y_Init, 0, 0, particleLock, 1));
         }
         ptc_array[i] = row_array;//Add row just filled with particles to particles array
      }
   }

   function Initialize_Springs()
   {
      for (let i = 0; i < rows; i++) 
      {
         for (let j = 0; j < cols; j++) 
         {
            let sprTearStrengthRandMult = random(1, RandomTearStrengthMultRange)
            let finalspringTearLength = baseSpringTearStrength * sprTearStrengthRandMult;

            //Connect majority of springs and diagonally down if softBody
            if (i < rows - 1 && j < cols - 1) 
            {
               a = ptc_array[i][j];
               b1 = ptc_array[i + 1][j];
               b2 = ptc_array[i][j + 1];

               spr_array.push(new Spring(def_k, def_d, spacing, a, b1,finalspringTearLength*2));
               spr_array.push(new Spring(def_k, def_d, spacing, a, b2,finalspringTearLength));

               if (softBody == true) 
               {
                  b3 = ptc_array[i + 1][j + 1];
                  spacing_diagonal = p5.Vector.dist(a.pos, b3.pos);
                  spr_array.push(new Spring(def_k, def_d, spacing_diagonal, a, b3,finalspringTearLength));
               }
            }

            //Make Cross Springs Up if softBody
            if (softBody == true)
            {
               if (i > 0 && j < cols - 1)
               {
                  a = ptc_array[i][j];
                  b1 = ptc_array[i - 1][j + 1];

                  spacing_diagonal = p5.Vector.dist(a.pos, b1.pos);

                  spr_array.push(new Spring(def_k, def_d, spacing_diagonal, a, b1,finalspringTearLength));
               }
            }

            //Connect bottom row missing links
            if (i == rows - 1 && j < cols - 1) 
            {
               a = ptc_array[i][j];
               b1 = ptc_array[i][j + 1];

               spr_array.push(new Spring(def_k, def_d, spacing, a, b1, finalspringTearLength));
            }

            //Connect Right Column Missing Links
            if (j == cols - 1 && i < rows - 1) 
            {
               a = ptc_array[i][j];
               b1 = ptc_array[i + 1][j];

               spr_array.push(new Spring(def_k, def_d, spacing, a, b1, finalspringTearLength));
            }
         }
      }
   }

   Initialize_Particles();
   Initialize_Springs();   
}


//DRAW--------------------------------------------------------------------------------------------
function draw() 
{
   //background(67,101,187);
   background(0,0,0);
   //Hande Particle Update, Wind and Drag
   let wind = createVector(0.2 * noise(xoff) - 0.1, 0);

   //Grab Particle
   if (keyIsPressed) 
   {
      for (let i = 0; i < cols; i++) 
      {
         for(let j = 1; j <= rowsToGrab; j++) 
         {
            let tail = ptc_array[rows-j][i];
            tail.pos = createVector(mouseX + spacing * i, mouseY- spacing * j);
            tail.vel = createVector(0, 0);
         
         }
      }
   }
   //Spring Update
   for (let i = spr_array.length - 1; i >= 0; i--) 
   {
      let s = spr_array[i];

      if (s.a.pos.y > height && s.b.pos.y > height)
      {
         spr_array.splice(i, 1);
      }

      BreakSpringsWhenStretched(s, i);
      BreakSpringsAtMouse(s, i, 7);

      s.show();
      s.update();
   }
   //Particle Update
   for (let row of ptc_array)
   {
      for (let ptc of row)
      {
         //Calculate Drag
         let drag = ptc.vel.copy();
         let speed = drag.mag();
         let dragMag = speed * speed * 0.03;
         drag.normalize().mult(-1).mult(dragMag);
         ptc.applyForce(drag);
         ptc.applyForce(wind);
         ptc.applyForce(gravity);
  
         if (borderCollisions) {ptc.edgeCollision(0.5);}
         if(showParticle) {ptc.show();}
         //Update this current iteration of particle
         ptc.update();
      }
   }
   //Scroll across perlin noise for wind
   xoff += 0.01;
}


