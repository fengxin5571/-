//打通服务端与客户端双向通讯
socket = io('http://60.205.153.37:4003');
socket.on('connect', function () {
    socket.emit('login', uid);
});
//socke服务端定时更新是否有新的群组
socket.on("update_msg", function () {
    api.ajax({
        url: 'http://appapi.duyiwang.cn/index.php?action=user_groups&dir=groups&do=check_user_groups',
        method: 'post',
        data: {
            values: {uid: uid}
        },
        dataType: 'json'
    }, function (ret, err) {
        if (ret.code == 200) {
            if (ret.groups_gids) {
                socket.emit('join', uid, ret.groups_gids);
            }
        }
    });
});
//群聊socke实时回调函数
socket.on('sixin_to_groups', function (msg) {
    var obj = eval('(' + msg + ')');
    console.log(JSON.stringify(obj));
    if(api.getPrefs({sync:true,key:'is_database'})&&obj.sj==0){//如果数据库初始化成功则写入本地数据库
      insert_data(obj);//插入本地数据库信息
    }else if(api.getPrefs({sync:true,key:'is_database'})&&obj.sj==1){//如果是删除回调
      delete_data(obj,'rv_groups_xiaoxi');
    }
    api.ajax({//判断对话框是否打开，未打开则通知栏提示消息
        url: ' http://appapi.duyiwang.cn/index.php?action=user_groups&dir=groups&do=get_user_openwin',
        method: 'post',
        data: {
            values: {uid: uid}
        },
        dataType: 'json'
    }, function (ret, err) {
        if (ret.is_openwin == 0) {
            var notify_msg = "【群聊】";
            var notice_zn;
            if(obj.lx==0){
                notice_zn=obj.nr;
            }else if(obj.lx==1){
                notice_zn="发送了一张图片";
            }else{
                notice_zn="发送了一条语音";
            }
            api.notification({//手机通知栏通知消息
                notify: {
                    content: notify_msg + obj.send_name + " : " + notice_zn,
                    updateCurrent: true,
                    extra: {key: 'ql', gid: obj.gid}
                }

            }, function (ret, err) {

            });
        }
    });
    if(obj.sj==0) {
        var jieshou = 'jieshou(\'' + msg + '\');';
        api.execScript({//群聊对话框跨页面执行消息接收事件
            name: 'groupChartNumber_qty',
            script: jieshou
        });
    }else {
        var delete_zn = 'delete_zn(\'' + msg + '\')';
        api.execScript({
            name: 'groupChartNumber_qty',
            script: delete_zn
        });
    }
    if (select_idx == 1) {
        api.execScript({
            name: 'main',
            frameName: 'info_qty',
            script: 'chat_list_yyt()'
        });
    }
    set_badge(1);
});
/*
*问答问题回答实时回调通知
*/
socket.on('reply_to_msg',function(obj){
    var obj=eval('('+obj+')');
    var msg=obj.msg;
    api.notification({//手机通知栏通知消息
        vibrate: 100,
        notify: {
            content: msg,
            updateCurrent: true,
//                    extra: {key: 'dl', toid: obj.toid}
        }
    }, function (ret, err) {

    });
})
//同意审核实时通讯事件
socket.on('verify_to_user', function (obj) {
    var obj = eval('(' + obj + ')');
    if (obj.store_id) {
        api.execScript({//我的个人信息中获取用户信息
            name: 'main',
            frameName: 'me_',
            script: 'updata()'
        })
        api.execScript({//在个人信息页面获取用户资料
            name: 'man_information_zn',
            script: 'updata()'
        })
        api.execScript({//在个人信息编辑页面，获取页面数据
            name: 'personInfo_qty',
            script: 'updata_zn()'
        })
        api.removePrefs({key: 'store_id'});
        api.removePrefs({key: 'user_role'});
        api.setPrefs({key: 'roleid',value: obj.roleid});
        api.setPrefs({key: 'store_id',value: obj.store_id});
    }
    api.setPrefs({key: 'objMeg',value: obj.msg});
    var jsfun = 'chongzai()';
    api.execScript({
        name: 'myaudita',
        script: jsfun
    });
    api.execScript({
        frameName: 'work_in',
        script: 'store_id_cz()'
    });
    //    通知栏
    api.notification({//手机通知栏通知消息
//                vibrate: 100,
        notify: {
            content: obj.msg,
            updateCurrent: true,
            extra:{key:'sh'}
        }

    }, function (ret, err) {
//                var id = ret.id;
    });
    api.execScript({
        name: 'auditEnter',
        script: 'biaoji()'
    });
    api.execScript({//重载工作区域页面并重新获得门店id
        frameName: 'work_in',
        script: 'biaoji()'
    });
});
//单聊socket实时回调函数
socket.on('sixin_to', function (msg) {
    var obj = eval('(' + msg + ')');
    if(api.getPrefs({sync:true,key:'is_database'})){//如果数据库初始化化成功，则写入本地数据库数据
      insert_data(obj);
    }
    api.ajax({
        url: ' http://appapi.duyiwang.cn/index.php?action=user_groups&dir=groups&do=get_user_openwin',
        method: 'post',
        data: {
            values: {uid: uid}
        },
        dataType: 'json'
    }, function (ret, err) {
        if (ret.is_openwin == 0) {
            if (obj.lx = 0) {
                api.notification({//手机通知栏通知消息
                    vibrate: 100,
                    notify: {
                        content: "您有一条新消息：" + obj.nr,
                        updateCurrent: true,
                        extra: {key: 'dl', toid: obj.toid}
                    }
                }, function (ret, err) {
                    var id = ret.id;
                });
            }
            if (obj.lx = 1) {
                api.notification({//手机通知栏通知消息
                    vibrate: 100,
                    notify: {
                        content: "您有一条新消息:发了一张图片",
                        updateCurrent: true,
                        extra: {key: 'dl', toid: obj.toid}
                    }

                }, function (ret, err) {
                    var id = ret.id;
                });
            }
        }
    });
    var jieshou = 'jieshou(\'' + msg + '\');';
    api.execScript({
        name: 'talk_about',
        script: jieshou
    });
    if (select_idx == 1) {
        api.execScript({
            name: 'main',
            frameName: 'info_qty',
            script: 'chat_list_yyt()'
        });
    }
    set_badge(1);

});
