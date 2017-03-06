let Player = require("Player");
let Score = require("Score");
cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        controlPlayer: {
            default: null,
            type: cc.Node
        },

        scoreCount: {
            default: null,
            type: cc.Node
        },

        jumpMusicSource: {
            default: null,
            type: cc.AudioSource    
        },
        //move
        playerJumpTime: 0.02,
        jumpSameSideHeight: 100,
        playerLeft: -230,
        playerRight: 230,
        playerHeight: 260,
        touchSide: 0,
        bMoveToOtherSide: false,
        bMoving: false,
        moveAction: null,
        //score
        score: 0,
    },

    // use this for initialization
    onLoad: function () {
        console.log("load*****************************");
        let self = this;
        self.playerJumpTime = 0.02;
        self.playerLeft = -230;
        self.playerRight = 230;
        self.playerHeight = 260;
        self.bMoveToOtherSide = false;
        self.bMoving = false;
        self.node.once('touchstart', self.onTouch, self);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        let self = this;
        if (self.bMoving) {       
            if (self.moveAction.isDone())
            {
                let scoreLabel = self.scoreCount.getComponent(cc.Label);
                scoreLabel.string = ++self.score;
                self.bMoving = false;
                self.node.once('touchstart', self.onTouch, self);
            }
        }
    },
    onTouch: function(event) {
        let self = this;

        self.controlPlayer = self.controlPlayer.getComponent(Player);
        console.log("controlPlayer:", self.controlPlayer);
        self.scoreCount = self.scoreCount.getComponent(Score);
        console.log("socreCount:", self.scoreCount);
        self.touchSide = event.getLocationX() - self.node.width / 2;
        let playerSide = self.controlPlayer.node.x;
        console.log("playerSide:", playerSide);
        console.log("touchSide:", self.touchSide);

        self.bMoveToOtherSide = (playerSide <= 0 && self.touchSide > 0) || (playerSide > 0 && self.touchSide <= 0);
        console.log("bMoveToOtherSide:", self.bMoveToOtherSide);
        self.moveAction = self.playerMove(self.controlPlayer, self.touchSide);
        console.log("moveAction", self.moveAction);
        self.bMoving = true;
    },

    playerMove: function(player, touchSide) {
        let self = this;
        let move;
        let moveDirection = touchSide > 0 ? 1 : -1;
        let bFlip = touchSide > 0 ? true : false;
        console.log("realbMoveToOtherSide",self.bMoveToOtherSide);
        if (self.bMoveToOtherSide)
            move = cc.moveTo(self.playerJumpTime, cc.p(self.playerRight * moveDirection, self.playerHeight)).easing(cc.easeInOut(3.0));
        else
            move = cc.sequence(cc.moveTo(self.playerJumpTime, cc.p((self.playerRight - self.jumpSameSideHeight) * moveDirection, self.playerHeight)).easing(cc.easeOut(3.0)), 
                    cc.moveTo(self.playerJumpTime, cc.p(self.playerRight * moveDirection, self.playerHeight)).easing(cc.easeIn(3.0)));
        let jumpMscCallBack = cc.callFunc(self.playJumpAudio, self);
        let finalMove = cc.sequence(cc.flipX(bFlip), move, jumpMscCallBack);

        return player.node.runAction(finalMove);
    },

    playJumpAudio: function() {
        let self = this;
        self.jumpMusicSource.play();
    }

});
