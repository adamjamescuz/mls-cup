// Extends PageViewController base
var IntroViewController = function(config)
{
    // class level members
    this.stage;
    this.confettiController = {};
    this.timeline = {};

    // cache DOM elements once
    this.scaler = $(".scaler");
    this.cup = $(".cup");

    // call base class constructor
    PageViewControllerBase.call(this, config);
};
inheritsFrom(IntroViewController, PageViewControllerBase);


$.extend(IntroViewController.prototype, {

	// overridden methods
    setup: function()
    {
        console.log("intro view setup")
    	var scope = this;

        // load the assets
        this.loader = new createjs.LoadQueue(true);
        this.listenerRefs["loader"] = this.loader.addEventListener("complete", function() { scope.handleLoadComplete(); });
        this.loader.loadManifest(this.config.assets);
    },

    handleLoadComplete: function()
    {
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
        var scope = this;

        PageViewControllerBase.prototype.transitionIn.call(this);

        this.timeline.to(this.cup, 1, { bottom:0, ease:Power2.easeOut });
        this.timeline.add(TweenMax.delayedCall(1, function() { scope.confettiController.initParticles(); } ));
    },

    transitionOut: function()
    {
        PageViewControllerBase.prototype.transitionOut.call(this);
    },

    show: function()
    {
        PageViewControllerBase.prototype.show.call(this);
    },

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
