//复制文字
function copy_word_yyt() {
var copy_word_time = 1;
var w_yyt = $(window).width();
var h_yyt = $(window).height();
var word_con;
var startx,starty;
$(document).on("touchstart", ".icon_chat", function (e) {
word_con = $(this).html().replace(/(^\s*)|(\s*$)/g, "");
$(this).css("background", "#ccc");
var left_yyt = e.originalEvent.targetTouches[0].pageX;
var top_yyt = e.originalEvent.targetTouches[0].pageY;
var aa = setInterval(bb, 1000);
function bb() {
    copy_word_time -= 1;
    if (copy_word_time <= 0) {
        clearInterval(aa)
        copy_word_time = 1;
        $(".copy_word_yyt").css("background", "#fff")
        $(".copy_zhezhao_yyt").css({"display": "block", "width": w_yyt, "height": h_yyt, "zIndex": 99});
        $(".copy_word_yyt").css({"display": "block", "left": left_yyt-40, "top": top_yyt-70, "zIndex": 999});
        $(".delete_word_zn").css('display','none');
        $(this).off("touchmove");
    }
}

$(this).on("touchend", function () {
    if ($(".copy_word_yyt").css("display") == "block") {
        $(this).css("background", "#ccc");
    } else {
        $(this).css("background", "#fff");
    }
    clearInterval(aa)
    copy_word_time = 1;
    $(this).off("touchend")
})
})
//复制
$(document).on("touchstart", ".icon_chat_right", function (e) {
word_con = $(this).html().replace(/(^\s*)|(\s*$)/g, "");
$(this).css("background", "#0066CC")
var left_yyt = e.originalEvent.targetTouches[0].pageX;
var top_yyt = e.originalEvent.targetTouches[0].pageY;
var aa = setInterval(bb, 1000);

xid=$(this).parent().attr('xid');
that=$(this);
function bb() {
    copy_word_time -= 1;
    if (copy_word_time <= 0) {
        clearInterval(aa)
        copy_word_time = 1;
        $(".copy_word_yyt").css("background", "#fff");
        $(".copy_zhezhao_yyt").css({"display": "block", "width": w_yyt, "height": h_yyt, "zIndex": 99});
        $(".copy_word_yyt").css({"display": "block", "left": left_yyt, "top": top_yyt-70, "zIndex": 999});
        $(".delete_word_zn").css({"display": "block", "left": left_yyt-50, "top":top_yyt-70 , "zIndex": 999});
        $(this).off("touchmove")
    }

}

$(this).on("touchend", function () {
    if ($(".copy_word_yyt").css("display") == "block") {
        $(this).css("background", "#0066CC")
    } else {
        $(this).css("background", "#0099FF")
    }
    clearInterval(aa)
    copy_word_time = 1;
    $(this).off("touchend");
})

})



$(".copy_zhezhao_yyt").on("touchstart", function () {
$(this).css({"display": "none"})
$(".copy_word_yyt").css({"display": "none"})
$(".icon_chat").css("background", "#fff")
$(".icon_chat_right").css("background", "#0099FF")
$(this).on("touchend", function () {
    $(this).off("touchend")
})
});
//复制功能
$(".copy_word_yyt").on("touchstart", function (event) {
event.stopPropagation();
$(this).css({"display": "none"})
$(".copy_word_yyt").css({"display": "none"})
var clipBoard = api.require('clipBoard');
clipBoard.set({
    value: word_con
}, function(ret, err) {

});
$(this).on("touchend", function () {
    $(this).off("touchend");
    $(this).parent().css('display','none');
    $(".icon_chat_right").css("background", "#0099FF");
    $(".icon_chat").css("background", "#fff");
})
})
$(".delete_word_zn").on("touchstart",function(event){
$(".icon_chat_right_img img").css("pointer-events","none");
$(".icon_chat_right_img").prop("disabled",true);
event.stopPropagation();
api.ajax({
    url: 'http://appapi.duyiwang.cn/index.php?action=user_groups&dir=groups&do=del_groups_xiaoxi',
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
that.parent().remove();
$(this).parent().css('display','none');
$(this).on("touchend", function () {
    $(this).off("touchend");
})
})

}
copy_word_yyt();
