/*
*时分秒转换
*/
function formatSeconds(value) {
    var theTime = parseInt(value);// 秒
    var theTime1 = 0;// 分
    var theTime2 = 0;// 小时
    if(theTime > 60) {
        theTime1 = parseInt(theTime/60);
        theTime = parseInt(theTime%60);
            if(theTime1 > 60) {
            theTime2 = parseInt(theTime1/60);
            theTime1 = parseInt(theTime1%60);
            }
    }

        var result = parseInt(theTime2)+":"+format_num(parseInt(theTime1))+":"+format_num(parseInt(theTime));

    return result;
}
/*
*格式化数字
*/
function format_num(num){
    var result=num<10?"0"+num:num;
    return result;
}
/*
*打开群聊设置页面
*/
function open_personList() {
    api.openWin({
        name:'groupChartPer_qty',
        url:'widget://html/message/groupChartPer_qty.html',
        bounces: false,
        pageParam: {gid: gid},
        rect: {x: 0,y: 0,w: 'auto',h: 'auto'}
    })
}

//点击群公告显示模态框
$('.gg_qty').click(function(){
    $('.notice_zn').show();
})
//点击我知道了隐藏模态框
$('.i_got_it').click(function(){
    $('.notice_zn').hide();
})
//获取光标位置
$.fn.getCursorPosition = function () {
    var el = $(this).get(0);
    var pos = 0;
    if ('selectionStart' in el) {
        pos = el.selectionStart;
    } else if ('selection' in document) {
        el.focus();
        var Sel = document.selection.createRange();
        var SelLength = document.selection.createRange().text.length;
        Sel.moveStart('character', -el.value.length);
        pos = Sel.text.length - SelLength;
    }
    return pos;
}
/*
*点击话筒出现语音录入区域
*/
$('.yuyin_con_zn').click(function(){
    if($(this).attr('src')=='../../image/image_zn/make_zn.png'){
        $(this).attr('src','../../image/image_zn/click_input_zn.png');
        $('.click_import_zn').hide();
        $('.click_send_zn').hide();
        $('.yuyin_icon').show();
    }else{
        $(this).attr('src','../../image/image_zn/make_zn.png');
        $('.click_import_zn').show();
        $('.click_send_zn').show();
        $('.yuyin_icon').hide();
    }
})
