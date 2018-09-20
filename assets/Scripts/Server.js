cc.Class({
    extends: cc.Component,

    properties: {
        serverList: {
            default: null,
            type: cc.Layout
        },
        currentServer: {
            default: null,
            type: cc.Label
        },
        hintBox: {//动画提示框
            default: null,
            type: cc.Animation
        }
    },

    // onLoad () {},

    start () {
        //加载预制资源(是从resources目录找起)
        let PrefabUrl = 'prefabs/server/ServerBtn';

        cc.loader.loadRes(PrefabUrl, (error, resource) => {
            //资源检查
            if( error ) { cc.log( '载入预制资源失败, 原因:' + error ); return; }
            if( !( resource instanceof cc.Prefab ) ) { cc.log( '你载入的不是预制资源!' ); return; } 

            let obj = {
                'type': 'getServerList',
                'data': {}
            }
            // 向服务器获取列表
            cc.Class.ws.send(JSON.stringify(obj));
            console.log("获取服务器列表中...");

            //接收数据
            cc.Class.ws.onmessage = (evt) => {
                // 忽略默认信息
                if (evt.data !== 'msg' && evt.data) {
                    console.log("服务器列表已获取...");
                    let info = JSON.parse(evt.data);
                    // 获取列表成功
                    if (info.result === 'serverList') {
                        for (let i = 0,leng = info.data.length; i < leng; i++) {
                            // 开始实例预制资源
                            let Prefab = cc.instantiate(resource);
                            
                            // 对数据进行处理
                            let label = Prefab.children[0].getComponent(cc.Label);
                            //把服务器名给label
                            label.string = info.data[i].servername;
                            
                            //将资源放到父节点中
                            this.serverList.node.addChild(Prefab);

                            //为加载的按钮注册点击事件
                            Prefab.on('click', () => {
                                //点击后显示点击的服务器
                                this.currentServer.string = label.string;
                                this.currentServer.id = info.data[i].serverid;
                            }, this);
                        }
                    }
                }
            };
        });
    },

    clickUp () {//点击上一步
        cc.director.loadScene('login');
    },
    clickDown () {//点击下一步
        // 提示内容
        let label = this.hintBox.node.children[0].getComponent(cc.Label);
        // 先判断是否选择
        if (this.currentServer.string === '请先选择') {
            label.string = '请先选择服务器!!';
            this.hintBox.play('hint');
            return;
        }
        // 初始信息
        let obj = {
            'type': 'getRoleList',
            'data': {
                'username': localStorage.getItem('user'),
                'serverid': this.currentServer.id
            }
        }
        // 上传获取角色列表
        cc.Class.ws.send(JSON.stringify(obj));
        cc.Class.ws.onmessage = (evt) => {
            if (evt.data !== 'msg') {
                let info = JSON.parse(evt.data);
                // 获取成功就跳转
                if (info.result === 'roleList') {
                    // 判断一下目前有角色没有
                    if (info.data[0]) {
                        info.data[0].servername = this.currentServer.string;
                        cc.Class.roleInfo = info.data
                    } else {
                        cc.Class.roleInfo = obj.data
                    }
                    cc.director.loadScene('roleList');
                }
            }
        }
    },
});
