/*
    移动端初始化
        基于修改HTML的rem
        兼容支持 IE9+
 */
(function(w, d){

    var doc = d.documentElement || d.body,  //获取HTML标签
        oWrap = d.getElementById("wrap"); //获取网页容器

    rem();

    //判断是移动端还是PC端
    var resize = "orientationchange" in w?"orientationchange":"resize";
    function rem(){
        doc.style.fontSize = 100*(oWrap.clientWidth/720)+"px";
    }
    $Print(d).addEvent("DOMContentLoaded", rem);
    $Print(w).addEvent(resize, rem);

})(window, document);