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
        //move
        playerJumpTime: 0.5,
        playerLeft: -230,
        playerRight: 230,
        playerHeight: 260,
        touchSide: 0,
        bFlip: false,
        bMoving: false,
        moveAction: null,
        //score
        score: 0,
    },

    // use this for initialization
    onLoad: function () {
        console.log("load*****************************");
        let self = this;
        self.playerJumpTime = 0.5;
        self.playerLeft = -230;
        self.playerRight = 230;
        self.playerHeight = 260;
        self.bFlip = false;
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

        self.bFlip = (self.touchSide > 0);
        console.log("flip:", self.bFlip);
        self.moveAction = self.playerMove(self.controlPlayer, self.touchSide);
        console.log("moveAction", self.moveAction);
        self.bMoving = true;
    },

    playerMove: function(player, touchSide) {
        let self = this;
        let move;
        let moveDirection = touchSide > 0 ? 1 : -1;
        console.log("realflip",self.bFlip);
        move = cc.sequence( cc.moveTo(self.playerJumpTime, cc.p(self.playerRight * moveDirection, self.playerHeight)).easing(cc.easeInOut(3.0)), cc.flipX(self.bFlip));

        return player.node.runAction(move);
    },

});
