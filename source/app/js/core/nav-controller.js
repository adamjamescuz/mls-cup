
var NavigationController = function(pages)
{
	this.pages = pages;
	this.currentPage = {};
};

$.extend(NavigationController.prototype, {

    init: function()
    {
    	// var $navLinksContainer = $('#nav-links-container');
		//
		// _.forEach(this.pages, function(page)
		// {
        //     if (page.nav === true)
        //     {
        //         $navLinksContainer.append("<div class='nav-button' id=nav-" + page.name + "><a href='#" + page.name + "'><p>" + page.caption + "</p></a></div>");
        //     }
		// });
    },

    // set url
    navigateTo: function(name)
    {
    	var page = _.findWhere(this.pages, { name:name });
        this.currentPage = page;
    	$(location).attr('href', '#' + page.name);
    },

    // turn on nav item
    setActive: function(page)
    {
        console.log('NavigationController : setActive () ' + page);
    	var navItem = $('#nav-' + page);
    	navItem.addClass('active');
        //navItem.css('pointer-events','none');
    },

	setDeactive: function(page)
    {
        console.log('NavigationController : setDeactive () ' + page);
    	var navItem = $('#nav-' + page);
    	navItem.removeClass('active');
        //navItem.css('pointer-events','auto');
    },

    deactivateAll: function()
    {
        $('.nav-button').removeClass('active');
        $('.nav-button').css('pointer-events','auto');
    }
});
