// 角色信息数组
let roleItem = cc.Class({
    name: 'roleItem',
    properties: {
        itemName: '', //姓名
        rolesex: '', //性别
        iconWord: cc.SpriteFrame, //图片字
        iconBackGround: cc.SpriteFrame, //人物图
        raceIntroduce: cc.SpriteFrame //种族介绍
    }
});
let roleActive = {'ren': '易水寒','yao': '狐不归','xian': '武尊神','wu': '酒未央'}
cc.Class({
    extends: cc.Component,
    properties: {
        rolebg: { //创建显示
            default: null,
            type: cc.Node
        },
        intrbg: { //角色介绍
            default: null,
            type: cc.Node
        },
        raceToggle: { //种族切换卡
            default: null,
            type: cc.Node
        },
        renzuToggle: { //人族
            default: null,
            type: cc.ToggleContainer
        },
        yaozuToggle: { //妖族
            default: null,
            type: cc.ToggleContainer
        },
        xianzuToggle: { //仙族
            default: null,
            type: cc.ToggleContainer
        },
        wuzuToggle: { //巫族
            default: null,
            type: cc.ToggleContainer
        },
        roleBgName: { //角色名字img
            default: null,
            type: cc.Sprite
        },
        roleBgIcon: {//角色背景img
            default: null,
            type: cc.Sprite
        },
        roleItems: { //人物信息数组
            default: [],
            type: roleItem
        },
        hintBox: { //动画提示框
            default: null,
            type: cc.Animation
        },
        userRoleName: { //请输入角色名
            default: null,
            type: cc.Label
        },
        intrRole: { //角色介绍-角色
            default: null,
            type: cc.Sprite
        },
        intrRoleBg: { //角色介绍-种族
            default: null,
            type: cc.Sprite
        },
        defChoice: '人族', //记录种族
        defRole: '易水寒' // 记录角色
    },
    
    onLoad () {
        //加载时候需要隐藏的
        this.intrbg.active = false;//角色介绍
        this.yaozuToggle.node.active = false;//人物切换卡
        this.xianzuToggle.node.active = false;//人物切换卡
        this.wuzuToggle.node.active = false;//人物切换卡
    },

    start () {
        //循环列表绑定数据
        this.raceToggle.children.forEach(el => {
            el.on('click', () => {
                // 优化忽略当前选中
                if (el._name !== this.defChoice) {
                    //为种族切换卡注册
                    this.changeRaceList(el,'人族',this.renzuToggle)
                    this.changeRaceList(el,'妖族',this.yaozuToggle)
                    this.changeRaceList(el,'仙族',this.xianzuToggle)
                    this.changeRaceList(el,'巫族',this.wuzuToggle)
                }
            }, this)
        });
        //为角色切换卡注册
        this.changeRoleList(this.renzuToggle)
        this.changeRoleList(this.yaozuToggle)
        this.changeRoleList(this.xianzuToggle)
        this.changeRoleList(this.wuzuToggle)
    },
    
    //返回角色列表
    backRoleList () {cc.director.loadScene('roleList')},
    
    //切换种族
    changeRaceList (element, name, race) {
        if (element._name === name) {
            // 显示角色列表
            race.node.active = true;
            // 记录当前选择
            this.defChoice = name;
            //调用raceSwitch,切换角色
            this.raceSwitch(this.defChoice);
        } else {
            // 没选中隐藏
            race.node.active = false;
        }
    },

    //切换角色
    changeRoleList (roleList) {
        roleList.node.children.forEach(element => {
            //获取角色数组长度
            let leng = this.roleItems.length;
            // 为每个单选注册点击事件
            element.on('click', () => {
                // this.defChoice是种族名字
                // element._name是角色名字
                this.raceSwitch(this.defChoice, element._name);
            }, this)
        })
    },
    raceSwitch (race, rolename) {
        let tool = (active, e) => {
            // 记录角色
            active = rolename;
            this.defRole = e.itemName;
            // 切换角色
            this.roleBgName.spriteFrame = e.iconWord;
            this.roleBgIcon.spriteFrame = e.iconBackGround;
        }
        // 第一个参数:角色种族,可选第二个:角色名字
        //获取角色数组长度
        let leng = this.roleItems.length;
        for (let i = (leng -1); i >= 0; i--) {
            const elmt = this.roleItems[i];
            //切换种族,记录角色并显示
            if (race === '人族' && (rolename ? rolename : roleActive.ren) === elmt.itemName) {
                tool(roleActive.ren, elmt)
            }
            if (race === '妖族' && (rolename ? rolename : roleActive.yao) === elmt.itemName) {
                tool(roleActive.yao, elmt)
            }
            if (race === '仙族' && (rolename ? rolename : roleActive.xian) === elmt.itemName) {
                tool(roleActive.xian, elmt)
            }
            if (race === '巫族' && (rolename ? rolename : roleActive.wu) === elmt.itemName) {
                tool(roleActive.wu, elmt)
            }
        }
        
    },

    // 进入游戏
    enterGame () {
        // 提示内容
        let label = this.hintBox.node.children[0].getComponent(cc.Label);
        let sqlReg = /([*";><%\/}{\\])|(select|update|union|and|or|delete|insert|trancate|char|into|substr|ascii|declare|exec|count|master|into|drop|execute)/gi;
        // 过滤sql
        if (sqlReg.test(this.userRoleName.string)) {
            label.string = '名称中含有危险字符!!!';
            this.hintBox.play('hint');
            return;
        }
        // 排除空格
        if (this.userRoleName.string === '') {
            label.string = '您还没有输入角色名哦!!!';
            this.hintBox.play('hint');
            return;
        }
        // 排除空格
        if (/\s/g.test(this.userRoleName.string)) {
            label.string = '名称中不能有空白符!!!';
            this.hintBox.play('hint');
            return;
        }
        // 禁用敏感词
        if (/gm|官方|客服|策划|kfz|程序|渠道|傻逼|sb|艹|操|技术|穴|奸/i.test(this.userRoleName.string)) {
            label.string = '名称中包含敏感词汇!!!';
            this.hintBox.play('hint');
            return;
        }
        //生成数据
        let roleInfo = null;
        // 先判断服务有没有数据
        if (cc.Class.roleInfo[0]) {
            roleInfo = cc.Class.roleInfo[0];
        } else {
            roleInfo = cc.Class.roleInfo;
        }
        let obj = {
            'type': 'createRole',
            'data': {
                'username': roleInfo.username, //帐号
                'serverid': roleInfo.serverid, //服务器ID
                'rolename': this.userRoleName.string, //用户角色名
                'rolerace': this.defChoice, //角色种族
                'personname': this.defRole,  //角色名字
                'rolesex': getRoleSex(this.roleItems, this.defRole), //角色性别
                'roleindexs': roleInfo.roleindexs ? cc.Class.roleInfo.length + 1 : 0 //角色位置
            }
        };
        
        cc.Class.ws.send(JSON.stringify(obj));
        function getRoleSex(json, name) {
            for (let i = 0,leng = json.length; i < leng; i++) {
                if (json[i].itemName === name) { return json[i].rolesex }
            }
        }
    },

    // 角色介绍
    character () {
        this.rolebg.active = false;
        // 循环显示信息
        for (let i = (this.roleItems.length - 1); i >= 0; i--) {
            const element = this.roleItems[i];
            // 如果跟传递过来的名字一样
            // cc.Class.roleInfo由上个页面传递
            if (element.itemName === this.defRole) {
                // 显示到页面中
                this.intrRole._spriteFrame = element.iconBackGround
                this.intrRoleBg._spriteFrame = element.raceIntroduce
            }
        }
        this.intrbg.active = true;
    },

    //返回角色创建
    backCreate () {
        this.intrbg.active = false;
        this.rolebg.active = true;
    }
    // update (dt) {},
});