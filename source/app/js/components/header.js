var Header = function(elem)
{
    this.elem = $(elem);
    this.closeButton = this.elem.find("#main-close-btn");
};

$.extend(Header.prototype, {

    init: function()
    {
        var scope = this;

        // register DOM elements
        this.closeButton.bind("pointerdown", function() { scope.handleVideoHotspotClicked(); } );

        $(window).bind('resize', function (event) { scope.handleResize(event); });
        this.handleResize(null);
    },

    handleVideoHotspotClicked:function()
    {
        console.log("main close button!");
        var event = new CustomEvent('Close', {'detail': {}});
        this.elem[0].dispatchEvent(event);
    },

    handleResize: function(event)
    {
        var newHeight = getBrowserHeight();
        var ratioH = newHeight / app.siteModel.properties.height;

        var newWidth = getBrowserWidth();
        var ratioW = newWidth / app.siteModel.properties.width;

        var ratio = Math.max(ratioH, ratioW);
        this.elem.css("transform", "scale(" + ratio + ")");
    }

});
