# pullToRefresh
a plugin of pullupToLoading and pulldownToRefresh
### demo：
http://htmlpreview.github.io/?https://github.com/overarchingSky/pullToRefresh/blob/master/example/pullToRefresh.html
### 特性：
1.支持drag事件捕获<br>
2.下拉刷新成功后，可进行友好的提示<br>
3.可监听各个阶段的事件<br>
4.兼容pc端
### 页面结构：

```
<div id="scroller-outer">
        <div class="scroll-inner">
            <div class="refresh">
            	<div class="refresh-tip">
            		<span class="spring icon iconfont icon-pulldown"></span>
            	</div>
            	<!--<div class="refreshend-tip">
            		//刷新成功后，提示区域
            	</div>-->
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
### 配置项：
triggerDist，//触发距离，可选，默认50<br>
pullDownText:"下拉刷新"，//可选，默认"下拉刷新"<br>
pullUpText:"上拉加载更多",//可选，默认"上拉加载更多"<br>
beforeRefreshText:"释放刷新",//可选，默认"释放刷新"<br>
beforeLoadText:"释放加载",//可选,默认"释放加载"<br>
refreshingText:"正在刷新...",//可选，默认"正在刷新"<br>
loadingText:"加载中...",//可选，默认"正在加载"<br>
noMoreText:"没有更多数据了",//可选，默认"没有更多数据了"<br>
refreshendTip:".refreshend-tip",//可选，不配置则禁用此功能，自定义刷新结束后的提示，以.或#开头，自定义dom结构，内部会进行dom查询，并将结果结覆盖refreshendTip字段，否则，使用默认提示，提示内容为refreshendTip传入的值<br>
refreshSuccessTipDruation:"1000",//可选，默认"1000",刷新结束后提示持续时间<br>
deceleration:0.001//滑动减速系数

#### 事件：
##### onBeforeRefresh
```
onBeforeRefresh:function(){}//可选
```
##### onBeforeLoad
```
onBeforeLoad:function(){},//可选<br>
```
##### onLoading
```
onLoading:function(){//必选<br>
//加载数据 <br>
var scroller = this<br>
$.ajax({<br>
...<br>
...<br>
success:function(){<br>
...<br>
...<br>
//是否还有更多数据<br>
scroller.hasMore(true/false)<br>
//结束加载状态<br>
scroller._execEvent("onLoadend") <br>
}<br>
})<br>
},<br>
```
##### onRefreshing
```
onRefreshing:function(){//必选<br>        	
//刷新<br>
var scroller = this<br>
$.ajax({<br>
...<br>
...<br>
success:function(){<br>
...<br>
...<br>
//是否还有更多数据<br>
this.resetHeight()<br>
scroller.hasMore(true/false)<br>
//结束加载状态<br>
scroller._execEvent("onRefreshend") <br>
}<br>
})<br>
},<br>
```
##### onRefreshend
```
onRefreshend:function(){//可选，刷新结束<br>
this.refreshendTip.innerText = "更新数据**条"<br>
},<br>
```
##### onLoadend
```
 onLoadend:function(){//可选，加载结束<br>
<br>
},<br>
```
##### onDrag
```
 onDrag:function(){//可选，拖拽<br>
var scroller = this<br>
console.log(scroller.y)<br>
}<br>
```
