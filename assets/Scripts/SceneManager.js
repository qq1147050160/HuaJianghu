const Loading = require('Loading');

cc.Class({
    extends: cc.Component,

    properties: {
        loading: Loading
    },

    onLoad: function () {
        cc.game.addPersistRootNode(this.node);
        this.loading.startLoading();
    },

    loadScene (sceneName) {
        this.loading.startLoading();
        this.curLoadingScene = sceneName;
        cc.director.preloadScene(sceneName, this.onSceneLoaded);
    },

    onSceneLoaded () {
        this.loading.stopLoading();
        cc.director.loadScene(this.curLoadingScene);

    }
});