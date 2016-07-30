// Extends ViewControllerBase
var TeamVsTeamView = function(config)
{
    // call base class constructor
    ViewControllerBase.call(this, config);

    // class level members
    this.timeline = {};

    // DOM elements
    this.scaler = this.elem.find(".scaler");
    this.portlandWedge = this.elem.find("#portland-wedge");
    this.dallasWedge = this.elem.find("#dallas-wedge");
};
inheritsFrom(TeamVsTeamView, ViewControllerBase);


$.extend(TeamVsTeamView.prototype, {

	// overridden methods
    setup: function()
    {
        ViewControllerBase.prototype.setup.call(this);

        // team-vs-team specific setup functionality
    	var scope = this;

        // load the assets
        this.loader = new createjs.LoadQueue(true);
        this.listenerRefs["loader"] = this.loader.addEventListener("complete", function() { scope.handleLoadComplete(); });
        this.loader.loadManifest(this.config.assets);
    },

    handleLoadComplete: function()
    {
        console.log('team vs team: load complete');
        var scope = this;

        // main timeline
        this.timeline = new TimelineMax({delay:1, onComplete:function() { scope.dispatchTransitionIn(); } });

        // dom event handlers
        $(window).bind('resize', function (event) { scope.handleResize(event); });
        this.handleResize(null);

        // page is ready
        this.dispatchIsReady();
    },

    transitionIn: function()
    {
        var scope = this;
        this.show();

        this.timeline.to(this.portlandWedge, 1, { left:0, ease:Quad.easeIn });
        this.timeline.to(this.dallasWedge, 1, { right:0, ease:Quad.easeIn }, "-=1");
        // this.timeline.add(TweenMax.delayedCall(1, function() { scope.confettiController.initParticles(); } ));
        // this.timeline.add(TweenMax.delayedCall(3, function() { scope.navigateTo("")} ));

    },

    transitionOut: function()
    {
        ViewControllerBase.prototype.transitionOut.call(this);
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
