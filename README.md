# MLS Cup Assignment - Adam Cousins
Email: cousins.aj@gmail.com

### NOTES:
Best viewed in Chrome or Safari. Desktop format version has resizing / anchoring of elements to scale to different screen sizes.
I have implemented the main close button - if you click this it will completely destroy the view, so you will need to refresh to view the ad again. All DIN based text is HTML text rather than PNG or SVG graphics. Lastly, the supplied video does not seem to be related to the MLS Cup creative, but have used it anyway. It was a very large video, so have compressed it to .H264 MP4 format.

### TO VIEW PRE-BUILT DISTRIBUTION VERSION ON THE WEB:
1. Navigate your browser to: http://adamcousins.com/demos/undertone/mls-cup/


### TO BUILD DEVELOPMENT VERSION:
1. Ensure Grunt is installed
2. Open terminal, and then:

```sh
cd {project folder}
npm install
bower install
grunt dev
```
BrowserSync is used, so a new browser window should open automatically. If not, direct your browser to http://localhost:3000/

### TO BUILD DISTRIBUTION VERSION
1. Lines 1 - 3 as above, and then:

```sh
grunt deploy
```

### CODEBASE NOTES
All the source code contains lots of comments - so here is just a brief overview:

Although I see the benefit of front end frameworks e.g. Backbone, Angular etc, for this I have used my own bespoke lightweight single page
app framework as it contains just three views and I can achieve everything I need to whilst still having enough scalability should I extend the banner later. It uses SCSS for the CSS and has a Grunt build process (described above) for buiding the develop and distribution versions. Lastly, I have only included the OTF formats for the DIN fonts which are used in the design.

#### source/app/js/__main.js:

__main.js is the entry point JS, defines a simple single page app structure JSON and initilises
a new single application, passing in the site model JSON.


#### source/app/js/core
The code for the single page application framework is in source/app/js/core - basically consists of just two classes:

1. app-controller.js - manages listening for navigate to events and triggering the transitioning in and out and setup of various views.
2. _view-controller-base.js - base class containing view controller functionality. Individual view controllers are in source/app/js/views
and extend this class and override certain functions (see 3). Each View is responsible for it's own loading strategy, using LoaderJS to preload any assets defined in the site JSON.


#### source/app/js/views
Just three views:
1. intro-view.js: manages intro related functionality - cup and confetti,
2. team-vs-team-view.js: manages the sliced team vs team animations, and
3. final-frame-view.js: which manages the last frame and video pop up.


#### source/app/js/components/
Contains various re-usable components such as a simple createJS based confetti particle system and a simple video controller

#### THANK YOU
