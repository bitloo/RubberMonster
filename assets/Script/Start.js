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
        scaleFactor: 1.2,
        zoomInDuration: 0.8,
        zoomOutDuration: 1,
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        self.node.on('touchend', function() {
            cc.director.loadScene('GamePlay');
        });

        let startBtnScale = cc.sequence(
            cc.scaleBy(self.zoomInDuration, self.scaleFactor, self.scaleFactor), 
            cc.scaleBy(self.zoomOutDuration, 1 / self.scaleFactor, 1 / self.scaleFactor)
        )  
        self.node.runAction(cc.repeatForever(startBtnScale));
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
