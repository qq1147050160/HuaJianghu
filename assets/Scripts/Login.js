cc.Class({
    extends: cc.Component,
    properties: { 
        username: cc.EditBox,
        password: cc.EditBox,
        hintBox: cc.Animation,//动画提示框
        passwordText: '',//用来存储密码
        recordname: cc.Toggle //记住帐号
    },
    start () {
        if (this.recordname) {
            // 检查记住帐号
            if (localStorage.getItem('recordname') === 'false') {
                this.recordname.isChecked = false;
            }
            //加载时候判断一下有Storage没
            if (localStorage.getItem('user') && this.recordname.isChecked) {
                // 替换到输入框中
                this.username.string = localStorage.getItem('user');
                this.passwordText = localStorage.getItem('pass');
                this.password.string = '*';
            } else {
                localStorage.removeItem('user')
                localStorage.removeItem('pass')
            }
        }
    },
    // 点击登录
    clickLogin () {
        let passStr = this.passwordText,
            userStr = this.username.string,
            label = this.hintBox.node.children[0].getComponent(cc.Label),// 提示内容
            userReg = /^[1-9a-zA-Z][0-9a-zA-Z.@]+$/;// 验证正则

        if (!userReg.test(userStr) || !userReg.test(passStr)) {
            label.string = '帐号或密码格式错误!!';
            this.hintBox.play('hint');
            return;//结束执行
        }

        // 先判断本地是否有存储
        if (localStorage.getItem('user') === userStr && localStorage.getItem('pass') === passStr) {
            let obj = {//生成数据
                'type': 'localLogin',
                'data': {
                    'username': userStr,
                    'password': passStr
                }
            };
            cc.Class.ws.send(JSON.stringify(obj));
        } else {
            let obj = {//生成数据
                'type': 'close',
                'data': {
                    'username': userStr,
                    'password': passStr
                }
            };
            cc.Class.ws.send(JSON.stringify(obj));
        }
        cc.log("登录中...");
        
        // 接收服务端数据时
        cc.Class.ws.onmessage = (evt) => {
            cc.log("数据已接收...");
            if (evt.data !== 'msg') {//忽略默认返回信息

                let info = JSON.parse(evt.data);
                // 登录成功记录
                if (info.result === 'loginOk') {
                    localStorage.setItem(`user`, info.data.username);
                    localStorage.setItem(`pass`, info.data.password);
                    cc.director.loadScene('server');
                }
                if (info.result === 'localLoginOk') {
                    cc.director.loadScene('server');
                }
                //密码错误
                if (info.result === 'loginErr') {
                    label.string = info.data;
                    this.hintBox.play('hint');
                }
            }
        };
    },

    //输入密码执行
    passTextChange () {
        // 用户输入记录到passwordText中
        this.passwordText = this.password.string;
    },

    //记住帐号状态
    remember () {
        localStorage.setItem('recordname', String(this.recordname.isChecked));
    },

    register () {
        cc.sys.openURL('http://47.104.241.187/register');
    }
});