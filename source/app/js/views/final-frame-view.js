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
