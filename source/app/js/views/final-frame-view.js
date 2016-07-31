// Extends ViewControllerBase
var FinalFrameView = function(config)
{
    // call base class constructor
    ViewControllerBase.call(this, config);

    // class level members
    this.inTimeline = {};
    this.videoController = {};

    // DOM elements
    this.fader = this.elem.find(".fader");
    this.infoScaler = this.elem.find(".info-scaler");
    this.hotspotWrapper = this.elem.find(".hotspot-wrapper");
    this.mlsCup = this.elem.find("#mls-cup");
    this.hand = this.elem.find(".hand");
    this.videoContainer = this.elem.find(".video-container");
    this.hotspotButton = this.elem.find("#hotspot-button");
};
inheritsFrom(FinalFrameView, ViewControllerBase);

// Intro View Implementation
$.extend(FinalFrameView.prototype, {

	// ViewControllerBase overridden methods
    handleLoadComplete: function()
    {
        console.log('FinalFrameView handleLoadComplete');
        var scope = this;

        // timelines
        this.inTimeline = new TimelineMax({ delay:1 });
        this.videoController = new VideoController(this.videoContainer, "#tv-spot");
        this.videoController.elem[0].addEventListener('Close', function (e) { scope.handleVideoClosed(e.detail); }, false);
        this.videoController.init();

        // dom event handlers
        $(window).bind('resize', function (event) { scope.handleResize(event); });
        this.handleResize(null);

        this.hotspotButton.bind("pointerdown", function() { scope.handleVideoHotspotClicked(); } );

        // page is ready
        this.dispatchIsReady();
    },

    transitionIn: function()
    {
        console.log("FinalFrameView transition in");
        var scope = this;

        this.show();
        this.dispatchTransitionIn();

        this.inTimeline.from(this.hand, 0.6, { opacity:0, x:75, y:75, ease:Power2.easeOut });
        this.inTimeline.set(this.hand,  { opacity:0, x:75, y:75 }, "+=0.5");
        this.inTimeline.to(this.hand, 0.6, { opacity:1, x:0, y:0, ease:Power2.easeOut });
        this.inTimeline.set(this.hand,  { opacity:0, x:75, y:75 }, "+=0.5");
        this.inTimeline.to(this.hand, 0.6, { opacity:1, x:0, y:0, ease:Power2.easeOut });
        this.inTimeline.set(this.hand,  { opacity:0, x:75, y:75 }, "+=0.5");
        this.inTimeline.to(this.hand, 0.6, { opacity:1, x:0, y:0, ease:Power2.easeOut });
    },

    // Event handlers
    handleVideoHotspotClicked: function()
    {
        TweenMax.to(this.fader, 0.8, {opacity:0.8, ease:Quad.easeOut });
        this.videoController.show();
    },

    handleVideoClosed: function()
    {
        TweenMax.to(this.fader, 0.4, {opacity:0, ease:Quad.easeOut });
    },

    handleResize: function(event)
    {
        var newHeight = getBrowserHeight();
        var ratioH = newHeight / app.siteModel.properties.height;
        var newWidth = getBrowserWidth();
        var ratioW = newWidth / app.siteModel.properties.width;
        var ratio = Math.min(Math.min(ratioH, ratioW), 1);

        this.mlsCup.css("transform", "scale(" + ratio + ")");
        this.infoScaler.css("transform", "scale(" + ratio + ")");
        this.hotspotWrapper.css("transform", "scale(" + ratio + ")");
        this.videoContainer.css("transform", "scale(" + ratio + ")");
    }
});
