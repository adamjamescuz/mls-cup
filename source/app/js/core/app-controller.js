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
        if (this.previousViewController !== null)
        {
            this.previousViewController.destroy();
            this.previousViewController = null;
        }

        this.hideLoader();
    },

    handleTransitionOut: function()
    {
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
