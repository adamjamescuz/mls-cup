// Author: Adam James Cousins
// lightweight single page application controller
// site structure is defined in the site model JSON that is passed in
// PageViewController base class defined common page functinality
// individual view controllers override PageViewControler base class with bespoke functionality

var ApplicationController = function(siteModel)
{
    this.siteModel = siteModel;
    this.currentController = null;
    this.controllers = {};
    //this.navigationController = {};
    this.viewsReadyToRun = [];
    this.loader = {};
};

// $.extend() allows us to use jquery inside our class and registers view event handlers
$.extend(ApplicationController.prototype, {

    // creates view controllers based on site model
    init: function()
    {
        this.loader = new Loader("#loader-container");
        this.loader.init();
        // this.navigationController = new NavigationController(this.siteModel.views);
        // this.navigationController.init();

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
            default:
                console.error('unknown view in config');
            }

            scope.controllers[pageConfig.name] = viewController;
            viewController.elem[0].addEventListener('TransitionOutComplete', function (e) { scope.handleTransitionOut(e.detail.config); }, false);
            viewController.elem[0].addEventListener('NavigateTo', function (e) { scope.handleNavigateTo(e.detail.page); }, false);
            viewController.elem[0].addEventListener('TransitionIn', function (e) { scope.handleTransitionIn(); }, false);
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
            this.currentController.transitionIn();
        }
    },

    handleNavigateTo: function(page)
    {
        this.navigateTo(page);
    },

    // handleHashHasChanged: function()
    // {
    //     console.log('ApplicationController: hash change handler');
    //
    //     var hash = decodeURI(window.location.hash);
    //
    //     // transition out of current view
    //     if (this.currentController === null)
    //     {
    //         this.initView(hash);
    //     }
    //     else
    //     {
    //         this.currentController.transitionOut();
    //     }
    // },

    handleTransitionIn: function()
    {
        this.hideLoader();
    },

    handleTransitionOut: function()
    {
        this.currentController = null;
        this.initView(decodeURI(window.location.hash));
    },

    // application controller implementation
    start: function()
    {
        console.log("ApplicationController: start");
        var scope = this;
        this.navigateTo(this.siteModel.startPage);
        // listen for url changes in the #
        // $(window).on('hashchange', function()
        // {
        //     scope.handleHashHasChanged();
        // });

        // if we have url in the hash refresh or default to start page if /
        // var url = decodeURI(window.location);
        // console.log(url);
        // if (window.location.hash === "")
        // {
        //     this.navigateTo(this.siteModel.startPage);
        // }
        // else
        // {
        //     this.initView(decodeURI(window.location.hash));
        // }
    },

    navigateTo: function(name)
    {
        console.log("ApplicationController: navigate to: " + name);
        //var page = _.findWhere(this.siteModel.views, { name:name });
        if (this.currentController === null)
        {
            this.initView(name);
        }
        else
        {
            this.currentController.transitionOut();
        }
        //$(location).attr('href', '#' + page.name);
    },

    initView: function(view)
    {
        console.log('ApplicationController: init view with name: ' + view);
        this.hideAllViews();
        this.showLoader();

        //var page = url.replace("#","");

        // update the nav
        //this.navigationController.deactivateAll();
        //this.navigationController.setActive(page);

        this.currentController = this.controllers[view];
        this.currentController.init();
    },

    hideAllViews: function()
    {
        $('.page').css('display', 'none');
        $('.page').css('pointer-events', 'none');
    }
});
