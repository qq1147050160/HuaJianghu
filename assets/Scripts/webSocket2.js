export default function WebSocket2 (url, maxTime=30) {
    let ws = new WebSocket(url);
    let renumb = 1;
    ws.onclose = (event) => { 
        console.log("连接结束!!");
        console.log('开始重连!!');
        reconnect()
    };
    function reconnect() {
        console.log('开始第' + renumb + '重连..');
        let ws2 = new WebSocket(url),
            pro = new Promise(prose);
            pro.then((e) => {
                console.log('pro成功' + e);
                // ws2.close();//关闭上一个调试连接
                cc.Class.ws = new WebSocket2(url);
            }, (e) => {
                console.log('pro失败' + e);
                setTimeout(() => {
                    if (++renumb < maxTime) {
                        reconnect()
                    } else {
                        console.log('连接超时,请重新登录!');
                    }
                }, 2000); 
            });
        function prose(resolve, reject) {
            ws2.onopen = (event) => resolve('success');
            ws2.onclose = (event) => reject('failed');
        }
    }
    return ws;
}