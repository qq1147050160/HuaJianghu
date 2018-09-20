cc.Class({
    extends: cc.Component,

    properties: {
        camera: cc.Node,
        map: cc.Node,
        rolePos: cc.Node
    },

    // onLoad () {},

    start () {
        this.initRoleMove()// 角色移动初始化
    },

    // 角色移动
    initRoleMove () {
        let canvas = this.node,     // 获取窗口
            camera = this.camera,   // 获取相机
            map = this.map,         // 获取地图
            role = this.rolePos,    // 获取角色
            moveSpeed = 1;          // 移动速度
        // 最大移动坐标
        let mapMax_x = map.width/2 + canvas.width/2 - canvas.width;
        let mapMax_y = map.height/2 + canvas.height/2 - canvas.height;
        // 点击地图移动
        map.on('touchstart', ({touch}) => {
            // 要移动距离
            let moveX = (touch._point.x - canvas.width/2 - (role.x - camera.x)),
                moveY = (touch._point.y - canvas.height/2 - (role.y - camera.y)),
                leng = Math.sqrt(moveX * moveX + moveY * moveY), //总距离
                moveTime = leng / (100 * moveSpeed),//平均时长
                roleMovePosX = role.x + moveX,//移动后的X
                roleMovePosY = role.y + moveY;//移动后的Y
                console.log('moveX'+moveX,'moveY'+moveY);
            // X方向
            if (Math.ceil(moveX) !== 0) {
                clearInterval(this.moveID_x);//停止上次移动
                this.moveID_x = setInterval(() => {
                    //先决定方向
                    if (moveX > 0) {
                        Math.ceil(role.x) >= Math.ceil(roleMovePosX) ? clearInterval(this.moveID_x) :null;
                        role.x+=2;
                    } else {
                        Math.ceil(role.x) <= Math.ceil(roleMovePosX) ? clearInterval(this.moveID_x) :null;
                        role.x-=2;
                    }
                    //没到边界跟踪
                    Math.abs(role.x) >= Math.ceil(mapMax_x) ? '' : camera.x = role.x;
                }, 1000/(Math.abs(moveX)/moveTime));
            }
            // Y方向
            if (Math.ceil(moveY) !== 0) {
                clearInterval(this.moveID_y);//停止上次移动
                this.moveID_y = setInterval(() => {
                    //先决定方向
                    if (moveY > 0) {
                        Math.ceil(role.y) >= Math.ceil(roleMovePosY) ? clearInterval(this.moveID_y) :null;
                        role.y+=2;
                    } else {
                        Math.ceil(role.y) <= Math.ceil(roleMovePosY) ? clearInterval(this.moveID_y) :null;
                        role.y-=2;
                    }
                    //没到边界跟踪
                    Math.abs(role.y) >= Math.ceil(mapMax_y) ? '' : camera.y = role.y;
                }, 1000/(Math.abs(moveY)/moveTime));
            }
        }, this);
    }
    // update (dt) {},
});
