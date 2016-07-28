// - Polyfills

// - IE 11 polyfill for custom event
(function () {
  function CustomEvent ( event, params ) {
    params = params || { bubbles: false, cancelable: false, detail: undefined };
    var evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
   }

  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();

// - Utilities


function hasWebGL()
{
    try {
       var canvas = document.createElement( 'canvas' );
       return !! window.WebGLRenderingContext && (canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl' ));
    } catch( e ) {
        return false;
    }
 };

function isIE () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
}

// - helper method for prototype inheritence
var inheritsFrom = function (child, parent) {
    child.prototype = Object.create(parent.prototype);
};

function getBrowserWidth()
{
    return window.top.innerWidth || window.top.document.documentElement.clientWidth;
};

function getBrowserHeight()
{
    return window.top.innerHeight || window.top.document.documentElement.clientHeight;
};

function getOrientation()
{
    var orientation = getBrowserWidth() > getBrowserHeight() ? "landscape" : "portrait";
    return orientation;
};

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
};

window.requestAnimFrame = (function() {
  return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame   ||
        window.mozRequestAnimationFrame      ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();
