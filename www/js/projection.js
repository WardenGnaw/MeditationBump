var flyingProjection = false;

function Projection(pos, vel, mass, radius) {
    var that = this;
	Actor.call(this, pos, vel, mass, radius);

    var localBitmap;
    this.bitmap = new createjs.Bitmap("img/protagonist/AstralProtagonist.png");
    localBitmap = this.bitmap;
    this.bitmap.x = stage.canvas.width/2 - (0.15) * 512/2;
    this.bitmap.y = stage.canvas.height/2 - (0.15) * 512/2;
    this.bitmap.scaleX = 0.15;
    this.bitmap.scaleY = 0.15;
    this.bitmap.image.onload = function() {
        stage.addChild(localBitmap);
        stage.update();
    };
    
    // the pressmove event is dispatched when the mouse moves after a mousedown on the target until the mouse is released.
    this.bitmap.on("mousedown", function (evt) {
    this.parent.addChild(this);
    this.offset = {x: this.x - evt.stageX, y: this.y - evt.stageY};
    flyingProjection = true;
});
    this.bitmap.on("pressup", function (evt) {
    that.position.x = evt.stageX;
    that.position.y = evt.stageY;
    flyingProjection = false;
});

    this.bitmap.on("pressmove", function (evt) {
       this.x = evt.stageX + this.offset.x;
       this.y = evt.stageY + this.offset.y;
       // indicate that the stage should be updated on the next tick:
       update = true;
    });
}

Projection.prototype = Object.create(Actor.prototype);

Projection.prototype.constructor = Actor

Projection.prototype.update = function(monk) {
	// Updating acceleration every tick based on spring & damper physics
	var positionFromCenter = this.position.nonImmuteSub(monk.position);
	var acceleration = positionFromCenter.scale(-MEDITATION_BUMP_CONSTANTS.SPRING_CONSTANT).nonImmuteSub(this.velocity.scale(MEDITATION_BUMP_CONSTANTS.DAMPING)).scale(1/this.mass);
    if (!flyingProjection) {
        //this.velocity = this.velocity.add(acceleration);
        this.position = this.position.add(this.velocity);
        
        this.bitmap.x = this.position.x - (0.15) * 512/2;
        this.bitmap.y = this.position.y - (0.15) * 512/2;
        
    }
	//super.update();
}