let rolePhoto = cc.Class({
    name: 'rolePhoto',
    properties: {
        itemName: '', //姓名
        photo: cc.SpriteFrame //图片
    }
});
cc.Class({
    extends: cc.Component,

    properties: {
        serverName: { //服务器名
            default: null,
            type: cc.Label
        },
        roleInfoFrame: { //角色信息框
            default: null,
            type: cc.Sprite
        },
        createRoleBtn: { //创建按钮
            default: null,
            type: cc.Button
        },
        rolePortrait: { //角色头像
            default: null,
            type: cc.Sprite
        },
        roleNickName: { //角色昵称
            default: null,
            type: cc.Label
        },
        roleLevel: { //角色等级
            default: null,
            type: cc.Label
        },
        roleId: { //角色ID
            default: null,
            type: cc.Label
        },
        roleListNode: { //角色列表
            default: null,
            type: cc.Node
        },
        rolePhotos: { //人物头像数组
            default: [],
            type: rolePhoto
        },
        roleIndex: 0
    },

    // onLoad () {},

    start () {
        //获取角色数据
        let roleInfo = null;
        
        // 先判断服务有没有数据
        if (cc.Class.roleInfo[0]) {
            roleInfo = cc.Class.roleInfo[0];
        } else {
            roleInfo = cc.Class.roleInfo;
        }
        //显示当前服务器
        this.serverName.string = roleInfo.servername;

        //显示角色信息框
        if (roleInfo.rolename) {
            // 默认展示
            this.roleNickName.string = roleInfo.rolename;
            this.roleLevel.string = roleInfo.rolelevel + '级';
            this.roleId.string = roleInfo.roleid;
            this.showRole(roleInfo.personname);//角色头像
            
            // 展示角色(为了解决排序问题,使用倒序)
            for (let i = (cc.Class.roleInfo.length - 1); i >= 0; i--) {
                //加载预制资源(是从resources目录找起)
                let PrefabUrl = 'prefabs/选择角色-密罗';
                console.log(i);
                cc.loader.loadRes(PrefabUrl, (error, resource) => {
                    //资源检查
                    if( error ) { cc.log( '载入预制资源失败, 原因:' + error ); return; }
                    if( !( resource instanceof cc.Prefab ) ) { cc.log( '你载入的不是预制资源!' ); return; } 

                    // 开始实例预制资源
                    let Prefab = cc.instantiate(resource);
                    //将资源放到父节点中
                    this.roleListNode.addChild(Prefab);
                    
                    
                    //获取动画
                    let anim = Prefab.children[0].getComponent(cc.Animation);
                    anim.play();//执行动画
                    
                    // 注册点击事件
                    Prefab.children[0].on('touchstart', () => {
                        //选择角色
                        this.clickRole(Prefab.children[0], cc.Class.roleInfo[i]);
                    }, this);
                });
            }
        } else {
            // 没角色不显示信息框
            this.roleInfoFrame.node.active = false;
        }
        //没角色位置,隐藏创建按钮
        if (roleInfo[5]) {
            this.createRoleBtn.node.active = false;
        }
    },
    //点击重选服务器
    reelectServer () {
        cc.director.loadScene('server')
    },

    // 点击创建角色
    createRole () {
        cc.director.loadScene('createRole')
    },

    //选择角色
    clickRole (elemt, roleInfo) {
        elemt.scaleX = 1.2
        elemt.scaleY = 1.2
        setTimeout(() => {
            elemt.scaleX = 1
            elemt.scaleY = 1
        }, 200);
        // 记录下标
        this.roleIndex = roleInfo.roleindexs

        // 角色信息展示
        this.roleNickName.string = roleInfo.rolename;
        this.roleLevel.string = roleInfo.rolelevel + '级';
        this.roleId.string = roleInfo.roleid;
        this.showRole(roleInfo.personname);//角色头像
    },

    //角色头像展示
    showRole (rlname) {
        // 判断传入角色名进行展示
        for (let i = (this.rolePhotos.length - 1); i >= 0; i--) {
            //展示头像
            if (rlname === this.rolePhotos[i].itemName) {
                this.rolePortrait.spriteFrame = this.rolePhotos[i].photo;
            }
        }
    },
    // update (dt) {},

    // 进入游戏
    play () {
        //记录登录角色信息
        localStorage.setItem('roleInfo', cc.Class.roleInfo[this.roleIndex]);
        cc.director.loadScene('傲来国-map')
    }
});
