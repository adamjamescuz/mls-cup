// global app controller reference
var app;

$(document).ready(function () {

  // defines the site propeties and views
  var siteModel = {
    properties: {
        width: 2000,
		height: 1050,
		fps: 60
    },
    views: [
        {
            id:0,
            name:"intro",
            elem:"#intro-view",
            layerOrder:1,
            assets:[
                {src:"assets/images/confetti/confetti-particle-0.png", id:"confetti-0"},
            	{src:"assets/images/confetti/confetti-particle-1.png", id:"confetti-1"},
            	{src:"assets/images/confetti/confetti-particle-2.png", id:"confetti-2"},
            	{src:"assets/images/confetti/confetti-particle-3.png", id:"confetti-3"},
    			{src:"assets/images/confetti/confetti-particle-4.png", id:"confetti-4"},
            	{src:"assets/images/confetti/confetti-particle-5.png", id:"confetti-5"},
                {src:"assets/images/intro/cup.png", id:"cup"}
            ]
        },
        {
            id:1,
            name:"team-vs-team",
            elem:"#team-vs-team-view",
            layerOrder:2,
            nav:false,
            assets:[
                {src:"assets/images/team-vs-team/dallas-wedge.png", id:"dallas-wedge"},
                {src:"assets/images/team-vs-team/portland-wedge.png", id:"portland-wedge"},
            ]
        },
        {
            id:2,
            name:"final-frame",
            elem:"#final-frame-view",
            layerOrder:0,
            nav:false,
            assets:[
            ]
        }
    ],
    viewsRequiredToRun:[
        "intro","team-vs-team"
    ],
    startPage: "intro",
    loader:"#loader"
  };

  // create a new ApplicationController from the site model
  app = new ApplicationController(siteModel);
  app.init();
});

// - Polyfills

// - IE 11 polyfill for custom event
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

// - Utilities


function hasWebGL()
{
    try {
       var canvas = document.createElement( 'canvas' );
       return !! window.WebGLRenderingContext && (canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ));
    } catch( e ) {
        return false;
    }
 };

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
}

// - helper method for prototype inheritence
var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

function getBrowserWidth()
{
    return window.top.innerWidth || window.top.document.documentElement.clientWidth;
};

function getBrowserHeight()
{
    return window.top.innerHeight || window.top.document.documentElement.clientHeight;
};

function getOrientation()
{
    var orientation = getBrowserWidth() > getBrowserHeight() ? "landscape" : "portrait";
    return orientation;
};

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame   ||
        window.mozRequestAnimationFrame      ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

// Simple particle system to simulate Confetti

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

	// blend mode for the particles (lighter = add)
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

var Loader = function(elem)
{
    this.elem = $(elem);
};

$.extend(Loader.prototype, {

    init: function()
    {
        var scope = this;

        // register DOM elements

        this.hide();
    },

    show: function()
    {
        this.elem.css('display', 'block');
        TweenMax.to(this.elem[0], 0.1, {opacity:1, ease:Power2.easeOut, onComplete:function() {} });
    },

    hide: function()
    {
        var scope = this;
        TweenMax.to(this.elem[0], 0.4, {opacity:0, ease:Power2.easeOut, onComplete:function() { scope.elem.css('display', 'none'); } });
    }
});

// Base class for the view controllers
// Individual view controllers extend this and override
// certain methods for their own functionality
var ViewControllerBase = function(config)
{
    this.config = config;
    this.elem = $(config.elem);
    this.elem.css('z-index', this.config.layerOrder);
    this.loader = {};
    this.callbacks = [];
    this.transitionOutCallbacks = [];

    // listener refs dict for removing event listener functions - (key: string describing the listener, value: handler function signiture)
    this.listenerRefs = {};

    // note: leave this set to false to setup the view as fresh every time
    this.isReady = false;
};

// Implementation of base funtionality
$.extend(ViewControllerBase.prototype, {

    init: function()
    {
        if (this.isReady)
        {
            this.transitionIn();
        }
        else
        {
            this.setup();
        }
    },

    setup: function()
    {
        // override this in individual page controllers for any besoke setup e.g. loading in manifest etc
        console.log(this.config.name + ' : setup');
        var scope = this;

        // if we have to pre-load, load them, otherwise dispatch is ready
        if (this.config.assets.length > 0)
        {
            this.loader = new createjs.LoadQueue(true);
            this.listenerRefs["loader"] = this.loader.addEventListener("complete", function() { scope.handleLoadComplete(); });
            this.loader.loadManifest(this.config.assets);
        }
        else {
            this.handleLoadComplete();
        }
    },

    // override this in individual views
    handleLoadComplete: function()
    {
        this.dispatchIsReady();
    },

    show: function()
    {
        this.elem.css('display', 'block');
        this.elem.css('pointer-events', 'auto');
    },

    hide: function()
    {
        this.elem.css('display', 'none');
        this.elem.css('pointer-events', 'none');
    },

    // navigate away from view to a new view
    navigateTo: function(page, args)
    {
        var event = new CustomEvent('NavigateTo', {'detail': {page:page}});
        this.elem[0].dispatchEvent(event);
    },

    // override for more snazzy transitions
    transitionOut: function()
    {
        console.log(this.config.name + ' : transition out');
        this.dispatchTransitionOutComplete();
    },

    // for any post - transition clean up
    destroy: function()
    {
        console.log(this.config.name + ' : destroy');
        this.hide();
    },

    dispatchTransitionOutComplete: function()
    {
        var event = new CustomEvent('TransitionOutComplete', {'detail': {config:this.config}});
        this.elem[0].dispatchEvent(event);
    },

    // override for more snazzy transitions
    transitionIn: function()
    {
        console.log(this.config.name + ' : transition in');
        this.show();
        this.dispatchTransitionIn();
    },

    dispatchTransitionIn: function()
    {
        var event = new CustomEvent('TransitionIn', {'detail': {config:this.config}});
        this.elem[0].dispatchEvent(event);
    },

    dispatchIsReady: function()
    {
        console.log('dispatch is ready');
        this.isReady = true;

        var event = new CustomEvent('Ready', {'detail': {config:this.config}});
        this.elem[0].dispatchEvent(event);
    }
});

// Author: Adam James Cousins
// lightweight single page application controller
// site structure is defined in the site model JSON that is passed in
// PageViewController base class defined common page functinality
// individual view controllers override PageViewControler base class with bespoke functionality

var ApplicationController = function(siteModel)
{
    this.siteModel = siteModel;
    this.activeViewController = null;
    this.previousViewController = null;
    this.controllers = {};
    this.viewsReadyToRun = [];
    this.loader = {};
    this.nextViewAfterTranstion;
};

// $.extend() allows us to use jquery inside our class and registers view event handlers
$.extend(ApplicationController.prototype, {

    // creates view controllers based on site model
    init: function()
    {
        this.loader = new Loader("#loader-container");
        this.loader.init();

        // show the loader as we are initialising the app
        this.showLoader();

        var scope = this;

        _.forEach(this.siteModel.views, function(pageConfig) {

            var viewController = {};

            // TODO: ApplicationController should now know about other view controllers
            // need to replace this with 'window[classname]' to instantiate
            switch (pageConfig.name)
            {
            case "intro":
                viewController = new IntroViewController(pageConfig);
                break;
            case "team-vs-team":
                viewController = new TeamVsTeamView(pageConfig);
                break;
            case "final-frame":
                viewController = new FinalFrameView(pageConfig);
                break;
            default:
                console.error('unknown view in config');
            }

            scope.controllers[pageConfig.name] = viewController;
            viewController.elem[0].addEventListener('TransitionOutComplete', function (e) { scope.handleTransitionOut(e.detail.config); }, false);
            viewController.elem[0].addEventListener('TransitionIn', function (e) { scope.handleTransitionIn(); }, false);
            viewController.elem[0].addEventListener('NavigateTo', function (e) { scope.handleNavigateTo(e.detail.page); }, false);
            viewController.elem[0].addEventListener('Ready', function (e) { scope.handlePageIsReady(e.detail.config); }, false);
        }, this);

        // if we require certain views to be setup, set them up otherwise start the app
        if (this.siteModel.viewsRequiredToRun.length > 0)
        {
            _.forEach(this.siteModel.viewsRequiredToRun, function(view)
            {
                this.controllers[view].setup();
            }, this);
        }
        else
        {
            this.start();
        }
    },

    // page event handlers
    showLoader: function()
    {
        this.loader.show();
    },

    hideLoader: function()
    {
        this.loader.hide();
    },

    handlePageIsReady: function(config)
    {
        console.log('ApplicationController: pageReady');

        if (_.contains(this.siteModel.viewsRequiredToRun, config.name))
        {
            this.viewsReadyToRun.push(config.name);

            var diff = _(this.siteModel.viewsRequiredToRun).difference(this.viewsReadyToRun);

            // once all the required ready views are ready we can run the app
            if (diff.length === 0)
            {
                this.hideLoader();
                this.start();
            }
        }
        else {
            this.hideLoader();
            this.activeViewController.transitionIn();
        }
    },

    handleNavigateTo: function(page)
    {
        this.navigateTo(page);
    },

    handleTransitionIn: function()
    {
        console.log("ApplicationController: handle transition in");

        // clean up previous view, if any
        if (this.previousViewController !== null)
        {
            this.previousViewController.destroy();
            this.previousViewController = null;
        }

        this.hideLoader();
    },

    handleTransitionOut: function()
    {
        console.log('ApplicationController: handle transition out');
        this.previousViewController = this.activeViewController;
        this.activeViewController = null;
        this.initView(this.nextViewAfterTranstion);
    },

    // application controller implementation
    start: function()
    {
        console.log("ApplicationController: start");
        var scope = this;
        this.navigateTo(this.siteModel.startPage);
    },

    navigateTo: function(name)
    {
        console.log("ApplicationController: navigate to: " + name);
        if (this.activeViewController === null)
        {
            this.initView(name);
        }
        else
        {
            this.nextViewAfterTranstion = name;
            this.activeViewController.transitionOut();
        }
    },

    initView: function(view)
    {
        console.log('ApplicationController: init view with name: ' + view);
        //this.hideAllViews();
        //this.showLoader();

        this.activeViewController = this.controllers[view];
        this.activeViewController.init();
    },

    hideAllViews: function()
    {
        $('.view').css('display', 'none');
        $('.view').css('pointer-events', 'none');
    }
});

// Extends ViewControllerBase
var FinalFrameView = function(config)
{
    // call base class constructor
    ViewControllerBase.call(this, config);

    // class level members
    this.timeline = {};

    // DOM elements
    this.scaler = this.elem.find(".scaler");
};
inheritsFrom(FinalFrameView, ViewControllerBase);

// Intro View Implementation
$.extend(FinalFrameView.prototype, {

	// ViewControllerBase overridden methods

    transitionIn: function()
    {
        var scope = this;

        ViewControllerBase.prototype.transitionIn.call(this);
    },

    handleLoadComplete: function()
    {
        var scope = this;

        // dom event handlers
        $(window).bind('resize', function (event) { scope.handleResize(event); });
        this.handleResize(null);

        // page is ready
        this.dispatchIsReady();
    },

    // Event handlers
    handleResize: function(event)
    {
        var newHeight = getBrowserHeight();
        var ratioH = newHeight / app.siteModel.properties.height;

        var newWidth = getBrowserWidth();
        var ratioW = newWidth / app.siteModel.properties.width;

        var ratio = Math.min(Math.min(ratioH, ratioW), 1);
        this.scaler.css("transform", "scale(" + ratio + ")");
    }
});

// Extends ViewControllerBase
var IntroViewController = function(config)
{
    // call base class constructor
    ViewControllerBase.call(this, config);

    // class level members
    this.stage;
    this.confettiController = {};
    this.timeline = {};

    // DOM elements
    this.scaler = this.elem.find(".scaler");
    this.cup = this.elem.find(".cup");
};
inheritsFrom(IntroViewController, ViewControllerBase);

// Intro View Implementation
$.extend(IntroViewController.prototype, {

	// ViewControllerBase overridden methods
    handleLoadComplete: function()
    {
        console.log('intro view: load complete');
        var scope = this;

        // make a createJS stage for the confetti
        this.stage = new createjs.Stage($("#canvas")[0]);
		this.stage.update();
		this.stage.enableMouseOver();
		createjs.Ticker.setFPS(app.siteModel.properties.fps);
		createjs.Ticker.addEventListener("tick", this.stage);
		createjs.Touch.enable(this.stage);

        // main timeline
        this.timeline = new TimelineMax({ onComplete:function() { } });

        // create the confetti
        this.confettiController = new ConfettiController(this.loader, "confetti-", app.siteModel.properties.width, app.siteModel.properties.height, {x:0, y:0}, 600, 1);
        this.stage.addChild(this.confettiController.container);

        // dom event handlers
        $(window).bind('resize', function (event) { scope.handleResize(event); });
        this.handleResize(null);

        // page is ready
        this.dispatchIsReady();
    },

    transitionIn: function()
    {
        console.log("Intro view: transitionIn");
        var scope = this;

        ViewControllerBase.prototype.transitionIn.call(this);

        this.timeline.to(this.cup, 1, { bottom:0, ease:Power2.easeOut });
        this.timeline.add(function() { scope.confettiController.initParticles(); }, "-=1");
        this.timeline.add(function() { scope.navigateTo("team-vs-team") }, "+=3");
    },

    // clean up - remove the confetti
    destroy: function()
    {
        console.log("destroy intro view");
        this.stage.removeChild(this.confettiController.container);
        this.confettiController = null;
        this.hide();
    },

    // Event Handlers
    handleResize: function(event)
    {
        var newHeight = getBrowserHeight();
        var ratioH = newHeight / app.siteModel.properties.height;

        var newWidth = getBrowserWidth();
        var ratioW = newWidth / app.siteModel.properties.width;

        var ratio = Math.min(Math.min(ratioH, ratioW), 1);
        this.scaler.css("transform", "scale(" + ratio + ")");
    }
});

// Extends ViewControllerBase
var TeamVsTeamView = function(config)
{
    // call base class constructor
    ViewControllerBase.call(this, config);

    // class level members
    this.inTimeline = {};
    this.outTimeline = {};

    // DOM elements
    this.fader = this.elem.find(".fader");
    this.scaler = this.elem.find(".scaler");
    this.portlandWedge = this.elem.find("#portland-wedge");
    this.dallasWedge = this.elem.find("#dallas-wedge");

    // DOM 'ONE GAME' copy
    this.one = this.elem.find("#one-game-copy h1");
    this.game = this.elem.find("#one-game-copy h2");
    this.toGlory = this.elem.find("#one-game-copy h3");

    // team logo SVGs
    this.portlandLogo = this.elem.find("#portland-logo");
    this.dallasLogo = this.elem.find("#dallas-logo");
};
inheritsFrom(TeamVsTeamView, ViewControllerBase);


$.extend(TeamVsTeamView.prototype, {

	// Overridden methods

    handleLoadComplete: function()
    {
        console.log('team vs team: load complete');
        var scope = this;

        // timelines
        this.inTimeline = new TimelineMax({delay:1, onComplete:function() { }});
        this.outTimeline = new TimelineMax({delay:1, onComplete:function() { }});

        // DOM event handlers
        $(window).bind('resize', function (event) { scope.handleResize(event); });
        this.handleResize(null);

        // page is ready
        this.dispatchIsReady();
    },

    transitionIn: function()
    {
        console.log("TeamVsTeam view: transitionIn");
        var scope = this;
        this.show();

        // wedges
        this.inTimeline.to(this.portlandWedge, 1, { left:0, ease:Quad.easeIn });
        this.inTimeline.to(this.dallasWedge, 1, { right:0, ease:Quad.easeIn }, "-=1");
        this.inTimeline.to(this.fader, 1, { opacity:1, ease:Quad.easeIn }, "-=1");
        this.inTimeline.add(function() { scope.dispatchTransitionIn(); });

        // center copy
        this.inTimeline.set(this.one, { scaleX:4, scaleY:4, opacity:0 }, "+=0.4");
        this.inTimeline.set(this.game, { scaleX:4, scaleY:4, opacity:0 });
        this.inTimeline.to(this.one, 0.4, { scaleX:1, scaleY:1, opacity:1, ease:Power2.easeIn });
        this.inTimeline.to(this.game, 0.4, { scaleX:1, scaleY:1, opacity:1, ease:Power2.easeIn });

        // split text 'to glory'
        var toGlorySplitText = new SplitText(this.toGlory, {type:"words"});
        this.inTimeline.add(function(){ scope.toGlory.removeClass("fade-off") }, "+=0.2");
        this.inTimeline.set($(toGlorySplitText.words[0]), { x:-400, opacity:0 });
        this.inTimeline.set($(toGlorySplitText.words[1]), { x:400, opacity:0 });
        this.inTimeline.staggerTo($(toGlorySplitText.words), 0.4, { opacity:1, x:0, ease:Power2.easeIn }, 0);

        // team logos
        this.inTimeline.set(this.dallasLogo, { scaleX:5, scaleY:5, opacity:0 }, "+=0.4");
        this.inTimeline.set(this.portlandLogo, { scaleX:5, scaleY:5, opacity:0 });
        this.inTimeline.to(this.dallasLogo, 0.4, { scaleX:1, scaleY:1, opacity:1, ease:Power2.easeIn });
        this.inTimeline.to(this.portlandLogo, 0.4, { scaleX:1, scaleY:1, opacity:1, ease:Power2.easeIn }, "-=0.4");
    },

    transitionOut: function()
    {
        this.inTimeline.to(this.one, 0.4, { opacity:0, ease:Power2.easeOut });
        this.inTimeline.to(this.game, 0.4, { opacity:0, ease:Power2.easeOut }, "-=0.4");
        this.inTimeline.to(this.toGlory, 0.4, { opacity:0, ease:Power2.easeOut }, "-=0.4");
        this.outTimeline.to(this.portlandWedge, 1, { left:-1498, ease:Quad.easeOut });
        this.outTimeline.to(this.dallasWedge, 1, { right:-1557, ease:Quad.easeOut }, "-=1");
        this.outTimeline.to(this.fader, 1, { opacity:0, ease:Quad.easeOut }, "-=1");
    },

    show: function()
    {
        ViewControllerBase.prototype.show.call(this);
    },

    handleResize: function(event)
    {
        var newHeight = getBrowserHeight();
        var ratioH = newHeight / app.siteModel.properties.height;

        var newWidth = getBrowserWidth();
        var ratioW = newWidth / app.siteModel.properties.width;

        var ratio = Math.max(ratioH, ratioW);
        this.scaler.css("transform", "scale(" + ratio + ")");
    }
});
