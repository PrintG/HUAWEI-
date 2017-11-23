# 华为移动商城页面
## 首页面
# 在线演示
[在线演示](ht "在线演示")
# BUG修复
##    布局问题
###        line169   line287
####           描述: 在移动设备下浏览外边距合并的问题
解决方案:
```CSS
  line 169: border-top:0.01rem solid transparent;
  line 287: border-top:0.01rem solid transparent;
```
