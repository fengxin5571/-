var path_yyt;
var y_path;//缩略图路径，原图路径
var count=1;//计数
/*
*发送图片事件
*/
function open_picture() {
    var upload_flag=true;
    var UIMediaScanner = api.require('UIMediaScanner');
    UIMediaScanner.open({
        type: 'picture',
        column: 4,
        classify: true,
        max: 1,
        sort: {key: 'time',order: 'desc'},
        texts: {stateText: '已选择*项',cancelText: '取消',finishText: '完成'},
        styles: {bg: '#fff',mark: {icon: '',position: 'bottom_left',size: 20},nav: {bg: '#eee',stateColor: '#000',stateSize: 18,cancelBg: 'rgba(0,0,0,0)',cancelColor: '#000',cancelSize: 18,finishBg: 'rgba(0,0,0,0)',finishColor: '#000',finishSize: 18}},
        exchange: true,
        rotation: true
    }, function(ret) {
        if (ret) {
             if(ret.eventType=="cancel"){
               return ;
             }
             UIMediaScanner.transPath({path:ret.list[0].path},function(ret,err){//ios图片路径转换
                 y_path=ret.path;//转换后的原图路径

             });
            path_yyt=ret.list[0].thumbPath;//转换后的缩略图路径
            var head_url;
            if(head_img==""||head_img==null){
                head_url='../../image/header_picture/tc_log.png';
            }else if (head_img.slice(0,4)=='http') {
                head_url=head_img;
            }else{
                head_url='../../image/header_picture/'+head_img;
            }
            var asd = "<div class='secret_chat_right_mc' xid="+ret.xid+"><div class='icon_img_right'><img src='"+head_url+"' alt=''><p>"+myName+"</p></div><div class='icon_chat_right_img'><div class='mask_sxy count_"+count+"' style='display:none'><img src='../../image/product_sxy/mask_.png' alt=''  ><p class='progress'>0%</p></div><img path="+ret.list[0].path+" src=" + path_yyt + " alt='' id='thumb_img' ></div></div>";
            $(".secret_chat_con_zn").append(asd);
            $('.secret_chat_con_zn').scrollTop($('.secret_chat_con_zn')[0].scrollHeight);
            $(".count_"+count).show();
            var trans = api.require('trans');
            trans.decodeImgToBase64({//将缩略图转换为base64
                imgPath: path_yyt
            }, function(ret, err) {
                if (ret.status) {//如果成功将原图转换为base64
                    trans.decodeImgToBase64({
                        imgPath: y_path
                    }, function(rat, err) {
                        if (rat.status) {
                            api.ajax({//上传缩略图
                                url: 'http://appapi.duyiwang.cn/index.php?action=upload&do=fasixin_img_ql',
                                method: 'post',
                                data: {values: {uid: uid, gid: gid, groups_room: "groups_" + gid,path_s:ret.base64Str}},
                                dataType: 'json',
                                report:true
                            }, function (ret, err) {
                                upload_flag=ret.status==2?false:true;
                                if (ret.body.code == 200) {
                                  api.ajax({//缩略图上传成功后上传原图
                                      url: 'http://appapi.duyiwang.cn/index.php?action=upload&do=fasixin_img_ql',
                                      method: 'post',
                                      data: {values: {uid: uid, gid: gid, groups_room: "groups_" + gid,path:rat.base64Str,pic_path:ret.body.url}},
                                      dataType: 'json',
                                      report:true
                                  }, function (ret, err) {
                                    upload_flag=ret.status==2?false:true;
                                    if(ret.progress<=100){
                                      $(".progress").html(ret.progress+"%");
                                    }
                                    if(upload_flag){
                                      $(".count_"+count).hide();
                                    }else{
                                      $(".progress").html("上传失败");
                                    }
                                  });
                                }
                            });
                        }
                    });
                }
            });
        }
    });
    count++;
}

/*
*点击图片查看事件
*/
$(document).on("click",".icon_chat_right_img img,.icon_chat_left_img img,#thumb_img",function (event) {
    photoBrowser_flag = true;
    path_yyt = $(this).attr("path");
    var photoBrowser = api.require('photoBrowser');
    photoBrowser.open({
        images: [
            path_yyt
        ],
        placeholderImg: 'widget://res/img/apicloud.png',
        bgColor: '#000'
    }, function(ret, err) {
        if (ret) {
            // 点击返回按钮关闭图片图片查看器
            api.addEventListener({
                name: 'keyback'
            }, function(ret, err){
                if( ret ){
                    api.closeFrame({
                        name: 'preview_image'
                    });
                    photoBrowser.close();
                }
            });
          
            // 打开frame显示下载按钮
            api.openFrame({
                name: 'preview_image',
                url: 'widget://html/message/preview_image.html',
                rect: {x: 0,y: api.winHeight/5*4,w: api.winWidth ,h: api.winHeight/5*1},
                pageParam:{
                    path_yyt:path_yyt
                },
                bounces: false,
                bgColor: '#000',
                vScrollBarEnabled: false,
                hScrollBarEnabled: false
            });
            if (ret.eventType == 'click') {//点击图片，关闭图片查看器以及下载按钮frame页面
                //点击图片的操作
                api.closeFrame({
                    name: 'preview_image'
                });
                photoBrowser.close();
                photoBrowser_flag = false;
            }else if(ret.eventType == 'longPress'){//长按保存图片到手机相册
                var name=path_yyt.split('/')[path_yyt.split('/').length-1];//图片后缀
                var myDate = new Date().getTime();//获取系统当前时间
                var new_path='fs://image/'+myDate+'.'+name;//图片存放路径
                api.download({
                    url: path_yyt,
                    savePath: new_path,
                    report: true,
                    cache: true,
                    allowResume: true
                }, function (ret, err) {
                    if (ret.state == 1) {
                        // 保存图片到系统相册
                        api.saveMediaToAlbum({
                            path: new_path
                        }, function(ret, err) {
                            if (ret && ret.status) {
                                api.closeFrame({
                                    name: 'preview_image'
                                });
                                api.toast({
                                    msg: '图片已保存至手机相册',
                                    duration: 4000,
                                    location: 'bottom'
                                });
                            } else {
                                api.toast({
                                    msg: '保存失败',
                                    duration: 3000,
                                    location: 'bottom'
                                });
                            }
                        });
                    } else {

                    }
                });
            }
        }
    });
})
//图片撤回
//    function recall_pic_zn(){
//        var xid;
//        var copy_word_time = 1;
//        var path;
//        var w_yyt = $(window).width();
//        var h_yyt = $(window).height();
//        $(document).on("touchstart", ".icon_chat_right_img", function (e) {
//            $(this).css('opacity','0.8');
//            var left_yyt = e.originalEvent.targetTouches[0].pageX;
//            var top_yyt = e.originalEvent.targetTouches[0].pageY;
//            var aa = setInterval(bb, 1000);
//            xid=$(this).parent().attr('xid');
//            that=$(this);
//            function bb() {
//                copy_word_time -= 1;
//                if (copy_word_time <= 0) {
//                    clearInterval(aa)
//                    copy_word_time = 1;
//                    $(".copy_word_yyt").css("background", "#fff");
//                    $(".copy_zhezhao_yyt").css({"display": "block", "width": w_yyt, "height": h_yyt, "zIndex": 99});
//                    $(".copy_word_yyt").css({"display": "none", "left": left_yyt, "top": top_yyt-70, "zIndex": 999});
//                    $(".delete_word_zn").css({"display": "block", "left": left_yyt-40, "top":top_yyt-100 , "zIndex": 999});
//                    $(this).off("touchmove")
//                }
//
//            }
//
//            $(this).on("touchend", function () {
//                if ($(".delete_word_zn").css("display") == "block") {
//                    $(this).css("opacity", "0.8")
//                } else {
//                    $(this).css("opacity", "1")
//                }
//
//                clearInterval(aa)
//                copy_word_time = 1;
//                $(this).off("touchend")
//            })
//
//        })


//        $(".copy_zhezhao_yyt").on("touchstart", function () {
//            $(this).css({"display": "none"})
//            $(".copy_word_yyt").css({"display": "none"})
//            $(".icon_chat").css("background", "#fff")
//            $(".icon_chat_right").css("background", "#0099FF")
//            $(this).on("touchend", function () {
//                $(this).off("touchend")
//                $('.icon_chat_right_img').css('opacity','1');
//            })
//        });
//
//        //撤回
//        $(".delete_word_zn").on("touchstart",function(event){
//            event.stopPropagation();
//            api.ajax({
//                url: 'http://192.168.1.138/dyz_manage/index.php?action=upload&dir=index&do=del_groups_img',
//                method: 'post',
//                data: {
//                    values: {xid: xid, uid: uid,gid:gid}
//                },
//                dataType: 'text'
//            }, function (ret, err) {
//                var response=JSON.parse(ret);
//                if(response.code==200){
//                    api.toast({
//                        msg: response.msg,
//                        duration: 2000,
//                        location: 'bottom'
//                    });
//                }
//                api.execScript({
//                    name: 'info_qty',
//                    script: 'reload_zn()'
//                });
//            });
//            that.parent().remove();
//            $(this).parent().css('display','none');
//            $(this).on("touchend", function () {
//                $(this).off("touchend");
//            })
//        })
//
//    }
//    recall_pic_zn();
