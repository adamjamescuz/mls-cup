var Loader = function(elem)
{
    this.elem = $(elem);
};

$.extend(Loader.prototype, {

    init: function()
    {
        var scope = this;

        // register DOM elements

        this.hide();
    },

    show: function()
    {
        this.elem.css('display', 'block');
        TweenMax.to(this.elem[0], 0.1, {opacity:1, ease:Power2.easeOut, onComplete:function() {} });
    },

    hide: function()
    {
        var scope = this;
        TweenMax.to(this.elem[0], 0.4, {opacity:0, ease:Power2.easeOut, onComplete:function() { scope.elem.css('display', 'none'); } });
    }
});
