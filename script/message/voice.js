//语音撤回功能
function recall_voice_zn(){
    var xid;
    var copy_word_time = 1;
    var path;
    var w_yyt = $(window).width();
    var h_yyt = $(window).height();
    $(document).on("touchstart", ".self_left", function (e) {
        $(this).find('.voice_player').css("background", "#0066CC");
        var left_yyt = e.originalEvent.targetTouches[0].pageX;
        var top_yyt = e.originalEvent.targetTouches[0].pageY;
        var aa = setInterval(bb, 1000);
        path=$(this).find('.voice_player').attr('record_url');
        xid=$(this).parent().attr('xid');
        that=$(this);
        function bb() {
            copy_word_time -= 1;
            if (copy_word_time <= 0) {
                clearInterval(aa);
                copy_word_time = 1;
                $(".copy_word_yyt").css("background", "#fff");
                $(".copy_zhezhao_yyt").css({"display": "block", "width": w_yyt, "height": h_yyt, "zIndex": 99});
                $(".copy_word_yyt").css({"display": "none", "left": left_yyt, "top": top_yyt-70, "zIndex": 999});
                $(".delete_word_zn").css({"display": "block", "left": left_yyt-40, "top":top_yyt-70 , "zIndex": 999});
                $(this).off("touchmove")
            }

        }
        $(this).on("touchend", function () {
            $('.self_left').find('.voice_player').css("background", "#0099FF");
            if ($(".delete_word_zn").css("display") == "block") {
                $(this).find('.voice_player').css("background", "#0066CC");
            } else {
                $(this).find('.voice_player').css("background", "#0099FF");
            }
            clearInterval(aa);
            copy_word_time = 1;
            $(this).off("touchend")
        })
    })
    $(".copy_zhezhao_yyt").on("touchstart", function () {
        $(this).css({"display": "none"});
        $(this).find('.delete_word_zn').css('display','none');
        $(".copy_word_yyt").css({"display": "none"})
        $('.self_left').find('.voice_player').css("background", "#0099FF");
        $(this).on("touchend", function () {
            $(this).off("touchend");
            $('.self_left').find('.voice_player').css("background", "#0099FF");
        })
    });

    //撤回
    $(".delete_word_zn").on("touchstart",function(event){
        event.stopPropagation();
        api.ajax({
            url: 'http://appapi.duyiwang.cn/index.php?action=upload_amr&dir=index&do=del_groups_amr',
            method: 'post',
            data: {
                values: {xid: xid, uid: uid,gid:gid,groups_room:"groups_"+gid}
            },
            dataType: 'json'
        }, function (ret, err) {
            if(ret.code==200){
                api.toast({
                    msg: ret.msg,
                    duration: 2000,
                    location: 'bottom'
                });
            }
            api.execScript({
                name: 'info_qty',
                script: 'reload_zn()'
            });
        });
        $(".delete_word_zn").css('display','none');
        that.parent().remove();
        $(this).parent().css('display','none');
        $(this).on("touchend", function () {
            $(this).off("touchend");
        })
    })
}
recall_voice_zn();//语音撤回事件
//发送语音
$(".yuyin_icon").on("touchstart",function (event) {
    var fs = api.require('fs');//引入文件管理
    var ret = fs.rmdirSync({ path: 'fs://tc_manager' });//清空录音文件目录
    $(this).css('background','#e2e2e2');
    $('.voice_jumpgif').css('display','block');
    num_voice++;
    record_num++;
    record_path='fs://tc_manager/tc_a_'+num_voice+'.pcm'
    audioRecorder = api.require('audioRecorder');//引入录音模块
    audioRecorder.startRecord({//开始录音
        savePath:record_path,
        format:'pcm'
    }, function(ret, err){
    });
    $(this).on("touchend",function (event) {
        $(this).css('background','#fff');
        $('.voice_jumpgif').css('display','none');
        audioRecorder.stopRecord(function(ret){//停止录音
            if(ret.status){//停止录音成功
              covert_path='fs://tc_manager/tc_a_'+num_voice+'.mp3';
              audioRecorder.covertToMp3({//转换为mp3
                        originalFilePath: record_path,//要转换的文件
                        mp3FilePath:covert_path,//转换后的路径
                        quality:9//音频质量
              }, function(ret) {
                    audioRecorder.getAttr({//获取录音时长
                            path: covert_path
                    }, function(ret) {
                         var duration = ret.duration/1000;
                         var width_voice = formatSeconds(duration);
                         var img_path=head_img.slice(0,4)=='http'?head_img:'../../image/header_picture/tc_log.png';
                         var voice_ = "<div class='secret_chat_right_mc' xid="+record_num+"><div class='icon_img_right'><img src="+img_path+"><p>"+myName+"</p> </div>"+
                         "<div class='voice_box self_left' id='voice_box_"+record_num+"'>"+
                         "<div class='upload_process' id='upload_process_"+record_num+"'>语音上传中...</div>"
                         "</div>";
                         $(".secret_chat_con_zn").append(voice_);
                         $('.secret_chat_con_zn').scrollTop($('.secret_chat_con_zn')[0].scrollHeight);
                         api.ajax({//上传语音文件
                             url: 'http://appapi.duyiwang.cn/index.php?action=upload_amr&do=send_voice_groups',
                             method: 'post',
                             data: {
                                 values: {
                                     uid: uid,
                                     gid: gid,
                                     groups_room: "groups_" + gid,
                                     local_url: covert_path,
                                     time_length:duration,
                                     send_length:width_voice
                                 },
                                 files: {file: covert_path}
                             },
                             dataType:"json",
                             report:true
                         }, function(ret, err) {
                           var palay_html="";
                           if(ret.status==1){//上传完成
                               palay_html+="<div class='voice_gif'><img src='../../image/voice_play.gif' alt=''></div>"+
                                "<div class='voice_player' record_url='"+ret.body.url+"' id='voice_player_"+ret.body.xid+"'>"+
                                "<div class='play_button' onclick='palay_record("+ret.body.xid+","+duration+")' id='play_key_"+ret.body.xid+"'><div class='voice_but play_voice'></div></div>"+
                                "<div class='voice_time'><div class='total_tiao'></div><div class='played' id="+ret.body.xid+"></div></div>"+
                                "<div class='show_time'>"+width_voice+"</div>"
                                "</div>";
                               $("#voice_box_"+record_num).html(palay_html);
                           }else if(ret.status==2||ret.body.code==500){//上传失败
                               $("#upload_process_"+record_num).html("语音上传失败...")
                           }

                         })

                    });
              });
            }
        });
        $(this).off("touchend")
    })
})
/*
*播放语音事件
*param #xid消息id；
*/
function palay_record(xid,duration){
    $('.self_left').unbind('touchstart','touchmove');
    $('.self_left').find('.voice_player').css("background", "#0099FF");
    var duration;
    var current;//播放位置
    var record_url=$("#voice_player_"+xid).attr("record_url")//获取音频地址
    var audio = api.require('audio');
    if(record_url){
        if($("#play_key_"+xid).find('.voice_but').hasClass('play_voice')){
            $(".play_button").find('.voice_but').removeClass('paused_voice');
            $(".play_button").find('.voice_but').addClass('play_voice');
            $(".play_button").parent().parent().find('.voice_gif').css("display","none");
            audio.play({//播放事件
                path: record_url
            }, function(ret, err) {
            if (ret) {
                duration=ret.duration;
                current=ret.current;
                var progress=(current/duration)*100;//获取到进度
                $(".played[id='"+xid+"']").width(progress+"%");
                if(ret.complete){
                    $("#play_key_"+xid).find('.voice_but').removeClass('paused_voice');
                    $("#play_key_"+xid).find('.voice_but').addClass('play_voice');
                    $("#play_key_"+xid).parent().parent().find('.voice_gif').css("display","none");
                    $("#play_key_"+xid).parent().find('.played').css('width','0%');
                }
            }
           });
            $("#play_key_"+xid).find('.voice_but').removeClass('play_voice');
            $("#play_key_"+xid).find('.voice_but').addClass('paused_voice');
            $("#play_key_"+xid).parent().parent().find('.voice_gif').css("display","flex");
        }else{
            audio.pause();
            $("#play_key_"+xid).find('.voice_but').removeClass('paused_voice');
            $("#play_key_"+xid).find('.voice_but').addClass('play_voice');
            $("#play_key_"+xid).parent().parent().find('.voice_gif').css("display","none");
        }
    }

}
//    语音反馈
$(document).on("touchstart", ".icon_chat_left_yuyin", function (e) {
    $(this).css("background", "#ccc");
    $(this).on("touchend", function () {
        $(this).css("background", "#fff");
        $(this).off("touchend")
    })
})
