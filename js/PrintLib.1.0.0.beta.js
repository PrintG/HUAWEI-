//
//  Author: Print
//  Version: 1.0.0beta
//  Warning:   如果想兼容IE7 以及以下的浏览器 请勿引入本插件
//
//
//

/*
*    select -> 选择器
*    parent -> 元素的父级,可有可无
*/
function $Print(select, parent){
    if(select !== document && select !== window){
        var $ = parent?parent.querySelectorAll(select):document.querySelectorAll(select);
        //如果填了没有获取到
        if(!$[0]&&select!==undefined) return $;
    }else{
        var $ = select;
    }

    //用于储存要添加的方法
    var $methods = {};

    //类名操作部分
    (function(){
        //为元素注册方法
        $methods.addClass = addClass;
        $methods.removeClass = removeClass;

        //添加类名
        function addClass(className){
            $find(this, function($){
                operationClass($, "add", className);
            });
            return this;
        };

        //删除类名
        function removeClass(className){
            //遍历对象
            $find(this, function($){
                operationClass($, "remove", className);
            });
            return this;
        }

        //操作类名
        /*
            obj ->  被操作的元素
            pattern ->  操作方式
                "add"      -> 增加类名
                "remove"   -> 移出类名
         */
        function operationClass(obj, pattern ,className){
            var str = obj.className.split(" "),
                $leng = str.length;
            if(!className) return;
            //遍历去除空串
            for(var i = 0; i < $leng; i++) if(str[i]==="")str.splice(i--, 1);

            var tmp = className.split(" "),
                tmpLeng = tmp.length;

            //增加类名
            pattern === "add" && (function(){
                //遍历整合
                for(var i = 0; i < tmpLeng; i++)str.push(tmp[i]);

                //检测是否有相同的类名
                var $leng;
                for(var i = 0; i < str.length; i++){
                    $leng = str.length;
                    for(var j = i+1; j < $leng; j++)
                        if(str[i]===str[j]) str.splice(j--, 1);
                }
            })();

            //删除类名
            pattern === "remove" && (function(){
                var strLength = str.length;
                if(!strLength) return;
                for(var i = 0; i < tmpLeng; i++) for(var j = 0; j < strLength; j++) if(tmp[i]===str[j]) str.splice(j--, 1);
            })();

            obj.className = str.join(" ").replace(/^\s*|\s*$/g, "");
        };
    })();

    //增加事件
    (function(){
        //为元素注册方法
        $methods.addEvent = addEvent;
        $methods.removeEvent = removeEvent;


        function addEvent(event, fn){
            var tmp = fn;
            fn = function(e){
                e = e || window.event;
                e.target = e.target || e.srcElement;
                var wheelDis = e.wheelDelta/120 || -e.detail/3;
                tmp(e, wheelDis);
            }

            $find($, function($){
                //滚轮事件的兼容
                if(event === "mousewheel"){
                    if($.addEventListener){
                        $.addEventListener("mousewheel", fn, false);
                        $.addEventListener("DOMMouseScroll", fn);
                    }else{
                        $.attachEvent("on"+event, fn);
                    }
                }else{
                    $.attachEvent?$.attachEvent("on"+event, fn):$.addEventListener(event, fn, false);
                }
            });
        }
        function removeEvent(event, fn){
            $find($, function($){
                $.detachEvent?$.detachEvent("on"+event, fn):$.removeEventListener(event, fn);
            });

        }
    })();

    //关于css
    (function(){
        //为元素注册方法
        $methods.css = css;


        function css(attr, setVal){
            var tmp = [];   //储存获取的样式 或者是 当前对象

            var tmpThis = this; //储存this,到时候返回出去

            $find(this, function($){
                if(typeof attr === "object"){
                    var tmpVal = "";
                    //遍历取出值
                    for(var key in attr){
                        tmpVal += key+":"+attr[key]+";";
                    }
                    setStyle($, "cssText" ,tmpVal);
                    tmp = tmpThis;
                }else if(setVal){
                    //设置单个样式
                    setStyle($, attr ,setVal);
                    tmp = tmpThis;
                }else if(!/:|;/.test(attr)){
                    //获取样式
                    tmp.push(getStyle($, attr));
                }else{
                    //以字符串的方式设置样式
                    setStyle($, "cssText" , attr);
                    tmp = tmpThis;
                }
            });

            function getStyle(obj, attr){
                return window.getComputedStyle?getComputedStyle(obj, null)[attr]:obj.currentStyle[attr];
            }

            function setStyle(obj, attr, setVal){
                obj.style[attr] = setVal;
            }


            //返回值出去
            return tmp;
        };

    })();

    //查找元素(需放最后)
    (function(){
        //把操作的所有方法在顶部加上
        $methods.find = find;

        function find(select){
            var $$ = [];
            $find(this, function($){
                $$length = $Print(select, $).length;
                for(var i = 0; i < $$length; i++){
                    $$.push($Print(select, $)[i]);
                }
            });
            $addFun($$);
            return $$;
        };
    })();

    ///////////////////////////////
    //                           //
    //     $Print 局部的方法     //
    //                           //
    //////////////////////////////
    /*
    *  - 用于遍历(内部方法)
    *      $ -> 要遍历的对象
    *      fn -> 回调函数,每遍历一次就会调用一次,把遍历到的对象通过实参传进去
    */
    function $find($, fn){
        //遍历对象
        var $leng = $.length;
        if($leng === undefined || $leng === 0){
            //只有一个元素
            fn($);
        }else{
            //有一组元素
            for(var i = 0; i < $leng; i++){
                fn($[i]);
            }
        }
    }

    //遍历给元素加上方法
    $addFun($);
    function $addFun(obj){
        var $objLeng = obj.length;
        for(var key in $methods){
            obj[key] = $methods[key];
            for(var i = 0; i < $objLeng; i ++){
                obj[i][key] = $methods[key];
            }
        }
    }

    //储存公开的方法库
    function PublicFn(){}
    //关于cookie的方法
    (function(){
        //获取cookie
        PublicFn.prototype.getCookie = function(){};
    })();

    //如果不填选择器
    if(select===undefined){
        return new PublicFn();
    }


    return $;
}