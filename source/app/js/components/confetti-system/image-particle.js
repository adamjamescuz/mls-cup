// Class representing a createJS particle, to be used with the Confetti Controller
function ImageParticle(loader, container, imgId, blendmode)
{
	// the position of the particle
	this.loader = loader;
	this.container = container;
	this.posX = 0;
	this.posY = 0;

	// the velocity
	this.velX = 0;
	this.velY = 0;

	// fake 3D effects
	this.depth = 1;

	// multiply the particle size by this every frame
	this.shrink = 1;
	this.shrinkX = 1;
	this.shrinkY = 1;
	this.size = 1;
	this.scaleX = 1;
	this.scaleY = 1;
	this.maxSize = -1;

	// if true then make the particle flicker
	this.shimmer = true;
	this.drag = 1;

	// add this to the yVel every frame to simulate gravity
	this.gravity = 0;

	// current transparency of the image
	this.alpha = 0;

	// subtracted from the alpha every frame to make it fade out
	this.fade = 0;
	this.spin = 0;
	this.rotation = 0;

	// lateral movement;
	this.theta = 0;
	this.thetaDelta = 0.1;
	this.lateralX = 5;

	// the blendmode of the image render. 'source-over' is the default
	// 'lighter' is for additive blending.
	this.blendMode = blendmode;

	// the image to use for the particle.
	this.img = new createjs.Bitmap(this.loader.getResult(imgId));
	this.img.regX = this.img.image.width * .5;
    this.img.regY = this.img.image.height * .5;
	this.container.addChild(this.img);
	this.img.alpha = this.alpha;
	this.img.compositeOperation = this.blendMode;
	this.img.cache(0, 0, this.img.image.width, this.img.image.height);

	this.update = function()
	{
		// simulate drag
		this.velX *= this.drag;
		this.velY *= this.drag;

		// add gravity force to the y velocity
		this.velY += this.gravity;

		// and the velocity to the position
		this.posX += this.velX;
		this.posY += this.velY;

		// shrink the particle
		this.size *= this.shrink;
		this.scaleX *= this.shrinkX;
		this.scaleY *= this.shrinkY;

		// if maxSize is set and we're bigger, resize!
		if((this.maxSize>0) && (this.size>this.maxSize))
			this.size = this.maxSize;

		// and fade it out
		this.alpha -= this.fade;
		if(this.alpha<0) this.alpha = 0;
		if(this.alpha > 1) this.alpha = 1;

		// lateral movement
		this.posX += Math.sin(this.theta) * this.lateralX;
		this.theta += this.thetaDelta;
		if (this.theta > 359)
		{
			this.theta = 0;
		}

		// rotate the particle by the spin amount.
		this.rotation += this.spin;
	};

	this.render = function()
	{
		// if we're fully transparent, no need to render!
		if(this.alpha == 0) return;

		this.img.x = this.posX;
		this.img.y = this.posY;

		// scale it dependent on the size of the particle
		var s = this.shimmer ? this.size * Math.random() : this.size; //this.shimmer ? this.size * 0 : this.size;
		this.img.scaleX = s * this.scaleX;
		this.img.scaleY = s * this.scaleY;
		this.img.rotation = this.rotation;

		// set the alpha to the particle's alpha
		this.img.alpha = this.alpha;
	};
}
