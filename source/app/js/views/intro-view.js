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
    this.scaler = this.elem.find(".scale-container");
    this.cup = this.elem.find(".cup");

    // properties
    this.confettiParticles = 600;
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
        this.timeline = new TimelineMax({ delay:1 });

        // create the confetti
        this.confettiController = new ConfettiController(this.loader, "confetti-", app.siteModel.properties.width, app.siteModel.properties.height, {x:0, y:0}, this.confettiParticles, 1);
        this.stage.addChild(this.confettiController.container);

        // set DOM preloaded images
        var cupSrc = _.findWhere(this.config.assets, {id: "cup"}).src;
        this.cup.css("background-image", "url(" + cupSrc + ")");

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
        this.timeline.add(function() {
            scope.confettiController.stop();
            scope.navigateTo("team-vs-team");
        }, "+=5");
    },

    // clean up - remove the confetti
    destroy: function()
    {
        console.log("destroy intro view");
        this.timeline.stop();
        this.timeline = null;
        this.stage.removeChild(this.confettiController.container);
        this.confettiController = null;
        this.elem.remove();
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
