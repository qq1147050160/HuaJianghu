cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        interval: 0
    },

    onLoad () {
        this.dotCount = 0;
        this.dotMaxCount = 3;
    },

    startLoading () {
        this.label.enabled = true;
        this.dotCount = 0;
        let size = cc.view.getVisibleSize();//返回视图窗口可见区域尺寸
        this.node.setPosition(cc.v2(size.width/2 - this.label.node.width/2, size.height/2));
        this.schedule(this.updateLabel, this.interval, this);//调用自定义函数
    },

    stopLoading () {
        this.label.enabled = false;
        this.unschedule(this.updateLabel);//取消自定义函数
        this.node.setPosition(cc.v2(2000, 2000));
    },

    updateLabel () {
        let dots = '.'.repeat(this.dotCount);
        this.label.string = 'Loading' + dots;
        this.dotCount += 1;
        if (this.dotCount > this.dotMaxCount) {
            this.dotCount = 0;
        }
    }
});