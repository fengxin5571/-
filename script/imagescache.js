/*
*获取图片缓存
*/
function fnLoadImage(ele_) {
        var dataUrl = $api.attr(ele_, 'data-url');
//            alert(fnLoadImage)
        if (dataUrl) {
            api.imageCache({
                url : dataUrl,
                thumbnail:false
            }, function(ret, err) {
                if (ret) {
                    ele_.src = ret.url;
                    $api.attr(ele_, 'data-url', '');
                } else {
                }
            });
        }
    }
