var VideoController = function(elem, videoID)
{
    this.elem = $(elem);
    this.videoID = videoID
    this.video;
    this.playButton;
    this.pauseButton;
    this.close;
    this.playingState;
};

VideoController.States = {
    PAUSED: 0,
    PLAYING: 1
}

$.extend(VideoController.prototype, {

    init: function()
    {
        var scope = this;

        this.video = this.elem.find(this.videoID).get(0);
        this.video.onended = function() { scope.handleVideoEnd(); }

        this.playButton = this.elem.find("#play-btn");
        this.pauseButton = this.elem.find("#pause-btn");
        this.close = this.elem.find("#close-btn");

        this.playButton.bind("pointerdown", function() { scope.handlePlayPauseClicked(); } );
        this.pauseButton.bind("pointerdown", function() { scope.handlePlayPauseClicked(); } );
        this.close.bind("pointerdown", function() { scope.handleCloseClicked(); } );

        this.pause();
    },

    handleCloseClicked: function()
    {
        this.pause();
        this.hide();
        var event = new CustomEvent('Close', {'detail': {}});
        this.elem[0].dispatchEvent(event);
    },

    handleVideoEnd: function()
    {
        console.log("video ended");
        this.pause();
        this.video.currentTime = 0;
    },

    handlePlayPauseClicked:function(elem)
    {
        switch (this.state)
        {
        case VideoController.States.PAUSED:
            this.play();
            break;
        case VideoController.States.PLAYING:
            this.pause();
            break;
        }
    },

    play:function()
    {
        this.state = VideoController.States.PLAYING;
        this.video.play();
        this.playButton.css("display", "none");
        this.pauseButton.css("display", "block");
    },

    pause:function()
    {
        this.state = VideoController.States.PAUSED;
        this.video.pause();
        this.playButton.css("display", "block");
        this.pauseButton.css("display", "none");
    },

    show: function(d)
    {
        this.elem.css('display', 'block');
        TweenMax.to(this.elem[0], 0.4, { opacity:1, ease:Back.easeOut, onComplete:function() {} });
    },

    hide: function(d)
    {
        var scope = this;
        TweenMax.to(this.elem[0], 0.4, { opacity:0, ease:Power2.easeOut, onComplete:function() {
            scope.elem.css('display', 'none');
        }});
    },

    destroy: function()
    {
    }
});
