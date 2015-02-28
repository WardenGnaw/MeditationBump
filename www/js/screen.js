var desires = []; // List of desires on screen.


function stageSetup() {
    // get a reference to the canvas we'll be working with:
    canvas = document.getElementById("gameScreen");
    
    // set canvas width
    canvas.width = window.innerWidth;
    
    // set canvas height
    canvas.height = window.innerHeight;
    
    stage = new createjs.Stage(canvas);
    
    stage.canvas.width = window.innerWidth;
    stage.canvas.height = window.innerHeight;
    
    // Enable touchscreen
    createjs.Touch.enable(stage);
    
    background = new createjs.Container();
    stage.addChild(background);
    
    var img = new Image();
    img.onload = function(){
        // create a new bitmap object, and set image to bitmap
        var bitmap = new createjs.Bitmap(img);
        // set bitmap x location in canvas
        bitmap.x = 0;
        // set bitmap y location in canvas
        bitmap.y = 0;
        
        bitmap.scaleX = canvas.width / img.width;
        bitmap.scaleY = canvas.height / img.height;
        // add the bitmap as a child of the stage. This means it will be drawn any time the stage is updated
        // and that its transformations will be relative to the stage coordinates:
        background.addChild(bitmap);
        // call update on the stage to make it render the current display list to the canvas:
        stage.update();
    };
    // set image source
    img.src = "img/background/Background.png";
    
    game = new Game(stage);
	
	// pos, vel, mass, radius
    monk = new Monk(new Vector(stage.canvas.width/2, stage.canvas.height/2), new Vector(0, 0), 1, 10);
    
    projection = new Projection(new Vector(stage.canvas.width/2, stage.canvas.height/2), new Vector(0, 0), 10, 1);

    stage.update();

    createjs.Ticker.addEventListener("tick", tick);
    createjs.Ticker.setFPS(30);

    function tick(event) {
        // Randomly generate a desire.
        if (Math.random() < 0.05 && desires.length < 5) {
			// Random position
			var start = new Vector(Math.ceil(Math.random() * stage.canvas.width), 0);
			// pos, vel, mass, radius
            desires.push(new Desire(start, monk.position.sub(start).norm().scale(Math.ceil(Math.random() * 2)), 0.1, 0.01));
        }
        
        // this set makes it so the stage only re-renders when an event handler indicates a change has happened.
        if (update) {
            update = false; // only update once
            stage.update(event);
        }
        
                
        // Update projection
        projection.update(monk);
        
        // Update desires
        for (var i = 0; i < desires.length; i++) {
            
            // Remove desire if its off screen.
           if(false == desires[i].update(monk)) {
               desires.splice(i--, 1);
           }
		   
		   // Game over if collided with Monk.
		   else if( monk.position.distance(desires[i].position) <= (monk.radius + desires[i].radius) ) {
               stage.removeChild(desires[i].bitmap);
               desires.splice(i--, 1)
			   //GAME OVER
		   }		   
		   // Collide astral projection with desires
		   else if(desires[i].collision_check(projection)) {
			   desires[i].collide(projection);
               //console.log(i);
               //console.log(desires[i]);
               //desires[i].velocity = desires[i].velocity.scale(-1);
		   }
		   
        }
    }
}