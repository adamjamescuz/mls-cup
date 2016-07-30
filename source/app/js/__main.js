// global app controller reference
var app;

$(document).ready(function () {

  // defines the site views
  var siteModel = {
    properties: {
        width: 2000,
		height: 1050,
		fps: 60
    },
    views: [
        {
            id:0,
            name:"intro",
            elem:"#intro-view",
            layerOrder:0,
            assets:[
                {src:"assets/images/confetti/confetti-particle-0.png", id:"confetti-0"},
            	{src:"assets/images/confetti/confetti-particle-1.png", id:"confetti-1"},
            	{src:"assets/images/confetti/confetti-particle-2.png", id:"confetti-2"},
            	{src:"assets/images/confetti/confetti-particle-3.png", id:"confetti-3"},
    			{src:"assets/images/confetti/confetti-particle-4.png", id:"confetti-4"},
            	{src:"assets/images/confetti/confetti-particle-5.png", id:"confetti-5"},
                {src:"assets/images/intro/cup.png", id:"cup"}
            ]
        },
        {
            id:1,
            name:"team-vs-team",
            elem:"#team-vs-team-view",
            layerOrder:1,
            nav:false,
            assets:[
                {src:"assets/images/team-vs-team/dallas-wedge.png", id:"dallas-wedge"},
                {src:"assets/images/team-vs-team/portland-wedge.png", id:"portland-wedge"},
            ]
        }
    ],
    viewsRequiredToRun:[
        "intro","team-vs-team"
    ],
    startPage: "intro",
    loader:"#loader"
  };

  // site model is passed into lightweight single page app controller
  app = new ApplicationController(siteModel);
  app.init();
});
