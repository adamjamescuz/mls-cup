// Simple particle system to simulate simple Confetti
// Author: Adam Cousins
var ConfettiController = function(loader, bitmapID, w, h, origin, maxParticles, alpha)
{
	this.loader = loader;
	this.bitmapID = bitmapID;
	this.screenWidth = w;
	this.screenHeight = h;
	this.container = new createjs.Container();

	if (origin)
	{
		this.container.x = origin.x;
		this.container.y = origin.y;
	}
	else
	{
		this.container.x = this.screenWidth * .5;
		this.container.y = this.screenHeight * .5;
	}

	// blend mode for the particles
	this.blendMode = "source-over";

	// alpha multiplier - 1 = max opacity, 0.42 = default
	this.alpha = alpha ? alpha : 0.42;

	// particles array
	this.particles = [];
	this.maxParticles = maxParticles;
};


$.extend(ConfettiController.prototype, {

    initParticles:function()
    {
    	var scope = this;

    	this.makeParticles(this.maxParticles);
    	createjs.Ticker.addEventListener("tick", function(){  scope.update(); });
    },

    makeParticles: function(particleCount)
    {
    	for (var i = 0; i < particleCount; i++)
    	{
    		var rand = Math.floor(this.randomRange(0,5));
    		var particle = new ImageParticle(this.loader, this.container, this.bitmapID + rand.toString(), this.blendMode);
    		this.particles.push(particle);
    		this.initParticle(particle, i, false);
    	}
    },

    initParticle: function(particle, i, offscreen)
    {
    	var depth = this.randomRange(0.1, 1);

    	if (offscreen === true)
    	{
    		//particle.posX =  -this.screenWidth * .5 - particle.img.image.width;
			particle.posY = - particle.img.image.width;
    	}
    	else
    	{
			particle.posY = this.randomRange(0, -this.screenHeight);
    	}

		particle.posX = this.randomRange(0, this.screenWidth);
    	particle.depth = depth;
    	particle.velX = depth * 0.4;
    	particle.velY = 0
		particle.lateralX = this.randomRange(depth * -10, depth * 10);
		particle.thetaDelta = this.randomRange(depth * -0.05, depth * 0.05);
    	particle.scaleX = depth;
    	particle.scaleY = depth;
    	particle.alpha = depth * this.alpha;
    	particle.gravity = depth * 0.1;
    	particle.drag = 0.98;
    	particle.fade = 0;
		particle.spin = this.randomRange(depth * -1, depth);
    	particle.shrinkX = this.randomRange(1, 1);
    	particle.shimmer = false;
    	particle.compositeOperation = this.blendMode;

    	if (i % 2 === 0)
    	{
    		particle.scaleX *= -1;
    	}
    },

	stop: function()
	{
		createjs.Ticker.reset();
	},

    update: function()
    {
    	for (var i = 0; i < this.particles.length; i++)
    	{
    		var particle = this.particles[i];
    		particle.update();
    		particle.render();

    		if (particle.posX > this.screenWidth + (particle.img.image.width*.5))
    		{
    			this.initParticle(particle, i, true);
    		}
			if (particle.posY > this.screenHeight + (particle.img.image.height*.5))
    		{
    			this.initParticle(particle, i, true);
    		}
    	}
    },

    randomRange: function(min, max) {
	    return ((Math.random()*(max-min)) + min);
    }
});
