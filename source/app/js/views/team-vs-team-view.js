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
    this.scaler = this.elem.find(".scale-container");
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
        this.inTimeline = new TimelineMax({ delay:1 });
        this.outTimeline = new TimelineMax({ delay:1 });

        // set DOM preloaded images
        var dallasWedgeSrc = _.findWhere(this.config.assets, {id: "dallas-wedge"}).src;
        var portlandWedgeSrc = _.findWhere(this.config.assets, {id: "portland-wedge"}).src;
        this.dallasWedge.css("background-image", "url(" + dallasWedgeSrc + ")");
        this.portlandWedge.css("background-image", "url(" + portlandWedgeSrc + ")");

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

        // navigate out
        this.inTimeline.add(function(){ scope.navigateTo("final-frame")}, "+=2");
    },

    transitionOut: function()
    {
        var scope = this;

        this.outTimeline.add(function(){ scope.showOtherView("final-frame"); });
        this.outTimeline.to(this.toGlory, 0.3, { opacity:0, ease:Power2.easeOut });
        this.outTimeline.to(this.game, 0.3, { opacity:0, ease:Power2.easeOut }, "-=0.24");
        this.outTimeline.to(this.one, 0.3, { opacity:0, ease:Power2.easeOut }, "-=0.24");
        this.outTimeline.to(this.portlandWedge, 1.5, { left:-1498, ease:Quad.easeOut });
        this.outTimeline.to(this.dallasWedge, 1.5, { right:-1557, ease:Quad.easeOut }, "-=1.5");
        this.outTimeline.to(this.fader, 1.5, { opacity:0, ease:Quad.easeOut }, "-=1.5");
        this.outTimeline.add(function(){ scope.dispatchTransitionOutComplete(); });
    },

    show: function()
    {
        ViewControllerBase.prototype.show.call(this);
    },

    destroy: function()
    {
        console.log("destroy team vs team view");
        this.inTimeline.stop();
        this.inTimeline = null;
        this.outTimeline.stop();
        this.outTimeline = null;
        this.elem.remove();
    },

    // Event Handlers
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
