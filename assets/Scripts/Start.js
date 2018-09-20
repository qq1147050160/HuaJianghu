import ReWebSocket from './webSocket2';

cc.Class({
    extends: cc.Component,
    properties: {
        bodyadvice: cc.Animation
    },
    onLoad () {
        // cc.Class.ws = new ReWebSocket('ws://47.104.241.187:3000');
        cc.Class.ws = new ReWebSocket('ws://localhost:3000');
        cc.Class.ws.onopen = () => { cc.log('与服务器连接成功') }
    },
    start () {
        // 两秒后跳的登录页面
        setTimeout(() => {
            this.bodyadvice.play();
        }, 1000);
        setTimeout(() => {
            cc.director.loadScene('login');
        }, 3000);
    }
});