// Extends ViewControllerBase
var FinalFrameView = function(config)
{
    // call base class constructor
    ViewControllerBase.call(this, config);

    // class level members
    this.timeline = {};

    // DOM elements
    this.infoScaler = this.elem.find(".info-scaler");
    this.mlsCup = this.elem.find("#mls-cup");
};
inheritsFrom(FinalFrameView, ViewControllerBase);

// Intro View Implementation
$.extend(FinalFrameView.prototype, {

	// ViewControllerBase overridden methods
    handleLoadComplete: function()
    {
        console.log('FinalFrameView handleLoadComplete');
        var scope = this;

        // dom event handlers
        $(window).bind('resize', function (event) { scope.handleResize(event); });
        this.handleResize(null);

        // page is ready
        this.dispatchIsReady();
    },

    transitionIn: function()
    {
        console.log("FinalFrameView transition in");
        var scope = this;

        ViewControllerBase.prototype.transitionIn.call(this);
    },

    // Event handlers
    handleResize: function(event)
    {
        var newHeight = getBrowserHeight();
        var ratioH = newHeight / app.siteModel.properties.height;

        var newWidth = getBrowserWidth();
        var ratioW = newWidth / app.siteModel.properties.width;

        var ratio = Math.min(Math.min(ratioH, ratioW), 1);
        this.mlsCup.css("transform", "scale(" + ratio + ")");
        this.infoScaler.css("transform", "scale(" + ratio + ")");
    }
});
