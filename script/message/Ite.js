//@功能
var a ="";
//    手动输入@可以跳转页面@人
$('.click_import_zn').bind('input propertychange', function() {
var b = $('.click_import_zn').val();
var aa=a.split("");
var bb=b.split("");
if (b.length>=a.length) {
var value_zn=bb[bb.length-1];
if (value_zn == "@") {
    api.openWin({
        name: 'remind_zn',
        url: 'widget://html/message/remind_zn.html',
        pageParam: {
            gid: gid
        },
        rect: {x: 0, y: 0, w: 'auto', h: 'auto'}
    });
}
a = $(this).val();
}else {
if($(this).getCursorPosition()==bb.length){
    if (a.split(/^.*\s$/)){
        var blank_ago=a.lastIndexOf(' ');
        var index=$(this).val().lastIndexOf('@');
        if(blank_ago==bb.length){
            var now_val=$(this).val().slice(0,index);
            $(this).val(now_val);
            user_list.length--;
        }else{
            return
        }
    }
}else{
    var blank_prev=parseInt($(this).getCursorPosition());
    //得到前后输入两次不一样的地方
    function getUniqueSet( setA, setB ){
        var temp = {};
        for( var i = 0, len = setA.length; i < len ; i++ ){
            temp[ setA[i] ] = 0;
        }
        for( var j = 0, len = setB.length; j < len ; j++ ){
            if( typeof temp[ setB[j] ] === 'undefined' ){
                temp[ setB[j] ] = 0;
            }else{
                temp[ setB[j] ]++;
            }
        }
        var ret = [];
        for( var item in temp ){
            !temp[item] && ret.push( item );
        }
        return ret;
    }
    var value_yyt = getUniqueSet(aa,bb);
    if (value_yyt == ""){
        var num_a = $(this).val().split("");
        var arr_i = [];
        for (var i=0;i<num_a.length;i++){
            if (num_a[i]=="@"){
               arr_i.push(i)
            }
        }
        for (var i=0;i<arr_i.length;i++){
            if (arr_i[i]>=blank_prev){
                arr_i.splice(i,1)
            }
        }
        var max = arr_i[0];
        for (var i=0;i<arr_i.length;i++){
            if (arr_i[i]>max){
                max=arr_i[i]
            }
        }
        var value_a_zn = $(this).val().slice(max,blank_prev);
        var last_arr = value_a_zn.split("");
        if (last_arr) {
            for (var i = 0; i < last_arr.length; i++) {
                if (last_arr[i] == "") {

                } else {
                    user_list = [];
                }
            }
        }
    }
}
a = $(this).val();
}
});
//    长按头像@人
$(document).on('touchstart','.press_on_zn',function(){
var ago_val=$('.click_import_zn').val();
var user_id=parseInt($(this).attr('uid'));
var user_name=$(this).next().html();
var aa = setInterval(bb, 1000);
var copy_word_time = 1;
function bb() {
copy_word_time -= 1;
if (copy_word_time <= 0) {
    clearInterval(aa)
    copy_word_time = 1;
    $('.click_import_zn').val(ago_val+'@'+user_name+"  ");
}
}
$(this).on("touchend", function () {
clearInterval(aa);
copy_word_time = 1;
user_list.push(user_id);
$('.click_import_zn').focus();
$(this).off("touchend")
})
})
//    添加@的人
function updata_val(){
var html_zn=$(".click_import_zn").val();
var userName = api.getPrefs({
sync: true,
key: 'name'
});
$(".click_import_zn").val('').focus().val(html_zn+userName+" ").blur();
$(".click_import_zn").focus();
a = $(".click_import_zn").val();
}
var user_list=[];
function updata_id(){
var at_user_ids = api.getPrefs({
sync: true,
key: 'at_user_ids'
});
user_list.push(parseInt(at_user_ids));
}
