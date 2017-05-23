# pullToRefresh
a plugin of pullupToLoading and pulldownToRefresh
#### demo：
http://htmlpreview.github.io/?https://github.com/overarchingSky/pullToRefresh/blob/master/example/pullToRefresh.html
### 特性：
1.支持drag事件捕获<br>
2.下拉刷新成功后，可进行友好的提示<br>
3.可监听各个阶段的事件<br>
4.兼容pc端
###页面结构
```
<div id="scroller-outer">
        <div class="scroll-inner">
            <div class="refresh">
            	<div class="refresh-tip">
            		<span class="spring icon iconfont icon-pulldown"></span>
            	</div>
            	<div class="refreshend-tip">
            		更新成功！
            	</div>
            </div>
            <div class="content">
                //内容区域
            </div>
            <div class="loader">
                <span class="spring icon iconfont icon-pullup"></span>
            </div>
        </div>

    </div>
```
