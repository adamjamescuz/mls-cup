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
