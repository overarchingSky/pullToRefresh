var data = {
	entity: [],
	total: 40
}
for(var i = 0; i < data.total; i++) {
	data.entity.push("第" + (i + 1) + "行")
}
var page = 1
var pageSize = 20
var scroller = new pullToRefresh('#scroller-outer', {
	triggerDist: 70, //出发距离，可选，默认50
	//pullDownText:"下拉刷新"，//可选，默认"下拉刷新"
	//pullUpText:"上拉加载更多",//可选，默认"上拉加载更多"
	//beforeRefreshText:"释放刷新",//可选，默认"释放刷新"
	//beforeLoadText:"释放加载",//可选,默认"释放加载"
	//refreshingText:"正在刷新...",//可选，默认"正在刷新"
	//loadingText:"加载中...",//可选，默认"正在加载"
	//noMoreText:"没有更多数据了",//可选，默认"没有更多数据了"
	refreshendTip: ".refreshend-tip", //可选，不配置则禁用此功能，自定义刷新结束后的提示，以.或#开头，自定义dom结构，内部会进行dom查询，并将结果结覆盖refreshendTip字段，否则，使用默认提示，提示内容为refreshendTip传入的值
	refreshSuccessTipDruation: "1000", //可选，默认"1000",刷新结束后提示持续时间
	deceleration: 0.001, //滑动减速系数
	/*onBeforeRefresh:function(){//可选
	            //箭头旋转
	            this.topSpring.style.background = 'url(images/shuijiao.jpg) no-repeat'
	            this.topSpring.style.backgroundSize = '100% 100%'
	            this.topSpring.style.height = '60px'
	            this.topSpring.style.width = '100px'
	            console.log("beforeRefresh...")
	        },*/
	/*onBeforeLoad:function(){//可选
	    //箭头旋转
	    this.bottomSpring.style.background = 'url(images/shuijiao.jpg) no-repeat'
	    this.bottomSpring.style.backgroundSize = '100% 100%'
	    this.bottomSpring.style.height = '60px'
	    this.bottomSpring.style.width = '100px'
	    console.log("beforeLoad")
	},*/
	onLoading: function() { //必选
		//loading
		setTimeout(function() {
			var res = data.entity.slice((page - 1) * pageSize, page * pageSize - 1)
			for(var i = 0; i < res.length; i++) {
				var item = document.createElement("div")
				item.className = "item"
				item.innerHTML = res[i]
				this.content.appendChild(item)
			}
			this.hasMore(page * pageSize >= data.total)
			page++
			this._execEvent("onLoadend")
		}.bind(this), 2000)
	},
	onRefreshing: function() { //必选        	
		//refresh
		setTimeout(function() {
			page = 1
			this.content.innerHTML = ""
			this.resetHeight()
			var res = data.entity.slice((page - 1) * pageSize, page * pageSize - 1)
			for(var i = 0; i < res.length; i++) {
				var item = document.createElement("div")
				item.className = "item"
				item.innerHTML = res[i]
				this.content.appendChild(item)
			}
			//this.refreshendTip.innerText = "更新数据15条"
			this.hasMore(page * pageSize >= data.total)
			this._execEvent("onRefreshend")
			page++

		}.bind(this), 2000)
	},
	onRefreshend: function() { //可选
		this.refreshendTip.innerText = "更新数据**条"
	},
	onLoadend: function() { //可选

	},
	onDrag: function() { //可选
		//拖拽
		console.log(this.y)
	},
})