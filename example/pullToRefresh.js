/**
 * Created by Administrator on 2017/5/3.
 */

(function(){
	var rAF = window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame	||
	window.mozRequestAnimationFrame		||
	window.oRequestAnimationFrame		||
	window.msRequestAnimationFrame		||
	function (callback) { window.setTimeout(callback, 1000 / 60); };
	
	/*var cancelRAF = window.cancelRequestAnimationFrame
		|| window.webkitCancelAnimationFrame
		|| window.webkitCancelRequestAnimationFrame
		|| window.mozCancelRequestAnimationFrame
		|| window.oCancelRequestAnimationFrame
		|| window.msCancelRequestAnimationFrame
		|| clearTimeout;*/
	
	
	function pullToRefresh(selector,options){
		
	    var defaultOption = {
	    	scrollX:false,
	    	scrollY:true,
	        triggerDist:50,
	        pullDownText:"下拉刷新",
	        pullUpText:"上拉加载更多",
	        beforeRefreshText:"释放刷新",
	        beforeLoadText:"释放加载",
	        refreshingText:"正在刷新",
	        loadingText:"正在加载",
	        noMoreText:"没有更多数据了",
	        pullupStatus:0,//下拉状态：0 初始状态，1 达到触发距离 2触发中
	        pulldownStatus:0,//上拉状态：0 初始状态，1 达到触发距离 2触发中
	        scrollbars: true,
			mouseWheel: true,
			//interactiveScrollbars: true,
			shrinkScrollbars: 'scale',//使滚动条具有弹性
			fadeScrollbars: true//自动显示与隐藏滚动条
			
	    }
		
	    
	    IScroll.utils.extend(defaultOption,options)
	    options = defaultOption
	    var scroller = new IScroll(selector, options)
	    IScroll.utils.extend(scroller,defaultOption)
	   
	   
	    
		scroller.refreshSpring = $(".refresh .spring")
		scroller.refreshLayer = $(".refresh")
		scroller.loaderSpring = $(".loader .spring")
		scroller.loaderLayer = $(".loader")
		scroller.refreshTip = $(".refresh-tip")
		scroller.refreshLayer.style = "width:100%;top:-"+scroller.refreshTip.offsetHeight + "px"
		scroller.content = $(".content")
		scroller.isMore = true
		
		IScroll.utils.Text(scroller.refreshTip,scroller.pullDownText)
		IScroll.utils.Text(scroller.loaderLayer,scroller.pullUpText)
		
		 if(scroller.refreshendTip){
			initRefreshSuccessTip()
		}
		
		
		//重载refresh()
		var refresh = scroller.refresh.bind(scroller)
		scroller.refresh = function(){
			refresh()
			if(this.maxScrollY == 0){
				this.loaderLayer.style.display = "none"
			}else{
				this.loaderLayer.style.display = "block"
			}
			
		}
		scroller.refresh()
	    /*绑定事件*/
	    var event = {
	    	onDrag:function(){
	        	//拖拽
	            options.onDrag && options.onDrag.call(this)
	        },
	        onBeforeRefresh: function(){
	            //箭头旋转
	            if(options.onBeforeRefresh){
	            	options.onBeforeRefresh.call(scroller)
	            	return
	            }
	            scroller.refreshSpring.classList.add("rotate")
	            IScroll.utils.Text(scroller.refreshTip,scroller.beforeRefreshText)
	            
	        },
	        onBeforeLoad: function(){
	            //箭头旋转
	            if(options.onBeforeLoad){
	            	options.onBeforeLoad.call(scroller)
	            	return
	            }
	            scroller.loaderSpring.classList.add("rotate")
	            IScroll.utils.Text(scroller.loaderLayer,scroller.beforeLoadText)
	        },
	        onLoading:function(){
	        	IScroll.utils.Text(scroller.loaderLayer,scroller.loadingText)
	        	if(options.onBeforeLoad){
	            	scroller.resetHeight()
	           	}else{
	           		//加载雪花
	            	scroller.loaderSpring.classList.add("icon-loading")
	            	scroller.loaderSpring.classList.add("rotateAnimate")
	           	}
	        	options.onLoading && options.onLoading.call(scroller)
	        },
	        onRefreshing: function(){
	        	//scroller.disable()
	            //scroller.refreshLayer.style[IScroll.utils.style.transitionDuration] = '0ms'
	            //scroller.refreshLayer.style.height = scroller.refreshTip.offsetHeight + "px"//如果存在refreshendTip，在松手的刹那，将scroller.refreshLayer高度设置为其内容高度
	            //如果存在refreshendTip，scroller.refreshLayer在被撑开时，会造成整个content区域乡下移动scroller.refreshLayer的高度，这时手动将内容区域滚动向上移动scroller.refreshLayer高度的距离，以此抵消突兀感

	            /*scroller._animate(0,scroller.refreshTip.offsetHeight,150,IScroll.utils.ease.circular.fn)
	            setTimeout(function(){
	            	scroller._animate(0,scroller.refreshTip.offsetHeight,100000,IScroll.utils.ease.circular.fn)
	            },150)*/
	            
	            IScroll.utils.Text(scroller.refreshTip,scroller.refreshingText)
	            if(!options.onBeforeRefresh){
	            	 //加载雪花
	            	scroller.refreshSpring.classList.add("icon-loading")
	           		scroller.refreshSpring.classList.add("rotateAnimate")
	            }
	            options.onRefreshing && options.onRefreshing.call(scroller)
	            
	        },
	        onRefreshend: function(){	        	
	        	scroller.refreshSpring.classList.remove("rotateAnimate")
	        	scroller.refreshSpring.classList.remove("rotate")
	        	if(scroller.refreshendTip){
	        		scroller.showRefreshSuccessTip(function(){
	        			scroller.pulldownStatus = 0
						scroller.refresh()//refresh内部调用了一次resetPosition方法，这里无需再次调用
	        					
	        			scroller.refreshSpring.classList.remove("icon-loading")
	        			scroller.enable()	
	        			scroller.hasMore(false)
	        			setTimeout(function(){
							scroller.refreshendTip.style.opacity = 0
							scroller.refreshendTip.style.display = "none"
							scroller.refreshTip.style.display = "block"
						},300)
	        		})
	        	}else{
	        		endRefresh(function(){
	        			
	        			scroller.refresh()
	        			scroller.pulldownStatus = 0
	        			scroller.refreshSpring.classList.remove("icon-loading")
	        			IScroll.utils.Text(scroller.refreshTip,scroller.pullDownText)
	        			scroller.enable()
	        			scroller.hasMore(false)
	        		})	
	        	}
	        	options.onRefreshend && options.onRefreshend.call(scroller)
	        	
	        	
	        },
	        onLoadend: function(){
	        	scroller.pullupStatus = 0
	        	if(scroller.isMore){
	        		IScroll.utils.Text(scroller.loaderLayer,scroller.pullUpText)
	        	}
	        	scroller.loaderSpring.classList.remove("icon-loading")
	        	scroller.loaderSpring.classList.remove("rotateAnimate")
	        	scroller.loaderSpring.classList.remove("rotate")
	        	
	        	options.onLoadend && options.onLoadend.call(scroller)
	        	scroller.refresh()
	        },
	    }
	
	    for(var i in event){
	        scroller.on(i,event[i])
	    }
	
	    IScroll.utils.extend(scroller,event)
	
	    /*绑定事件 end*/
	
	    //重载_move()
	    var  move = scroller._move
	    scroller._move = function(e){
	    	
	    	/*获取滑动方向*/
	    	var point = e.touches ? e.touches[0] : e;
	    	var deltaY = point.pageY - this.pointY;
	    	this.direction = deltaY > 0 ? "down" : "up";
			//this.pointY = point.pageY;//这句代码在_move方法中有执行，这里就不再重复
			/*获取滑动方向 end*/
			
	    	scroller._execEvent('onDrag')
	        move.call(this,e)
	            if(scroller.y > scroller.triggerDist){
	            	if(scroller.pulldownStatus ==0){
	            		scroller._execEvent('onBeforeRefresh')
	                	scroller.pulldownStatus = 1
	            	}
	            }else if(scroller.y < (-scroller.triggerDist+scroller.maxScrollY)){
	            	if(!this.isMore) return//没有更多数据时，禁止触发加载事件
	            	if(scroller.pullupStatus == 0){
	            		scroller._execEvent('onBeforeLoad')
	                	scroller.pullupStatus = 1
	            	}
	            }else{
	            	if(scroller.pullupStatus == 1){
	            		scroller.pullupStatus = 0
	            		IScroll.utils.Text(scroller.loaderLayer,scroller.pullUpText)
	            		scroller.loaderSpring.classList.remove("rotate")
	            	}
	            	if(scroller.pulldownStatus == 1){
	            		scroller.pulldownStatus = 0
	            		IScroll.utils.Text(scroller.refreshTip,scroller.pullDownText)
	            		scroller.refreshSpring.classList.remove("rotate")
	            	}
	            }
	        
	    }
	
	    //重载_end()
	    var end = scroller._end
	    scroller._end = function(e){
	    	if(scroller.y > scroller.triggerDist){
	            if(scroller.pulldownStatus ==1){
	            	scroller._execEvent('onRefreshing')
	                scroller.pulldownStatus = 2
	            }
	        }else if(scroller.y < (-scroller.triggerDist+scroller.maxScrollY)){
	            if(scroller.pullupStatus == 1){
	            	scroller._execEvent('onLoading')
	                scroller.pullupStatus = 2
	            }
	        }
	        if(scroller.pulldownStatus == 2){
	        	
	        }
	        end.call(this,e)
	        scroller.resetPosition()
	        
	    }
		
		//重载resetPosition
		var resetPosition = scroller.resetPosition.bind(scroller)
		scroller.resetPosition = function (time) {
			var time = 150
			if(scroller.pulldownStatus != 2){
				resetPosition(time)
				return
	    	}
			if((scroller.direction == "down" && scroller.y >= 0) || (scroller.direction == "up" && scroller.y > scroller.triggerDist)){
				var y = scroller.triggerDist
				scroller.scrollTo(0, y, 150, scroller.options.bounceEasing);	
			}else if(scroller.direction == "down" && scroller.y < 0){
				resetPosition.call(scroller,time)
			}else if(scroller.direction == "up" && scroller.y < scroller.triggerDist){
				resetPosition.call(scroller,time)
			}
		}
		
		//重载scrollTo方法
		var _animate = scroller._animate
		scroller._animate = function (destX, destY, duration, easingFn) {
			this.direction = destY < this.y ? "up" : "down"
			_animate.call(this, destX, destY, duration, easingFn)
		}
		
		//重载
		var i = 0
		scroller.rAFqueue = [true]
		scroller._animate = function(destX, destY, duration, easingFn){
			
			var s = ++i;
		
			var that = this,
			startX = this.x,
			startY = this.y,
			startTime = IScroll.utils.getTime(),
			destTime = startTime + duration;
			var g = 0
			function step () {
				var j = i - s
				var now = IScroll.utils.getTime(),
					newX, newY,
					easing;
	
				if ( now >= destTime ) {
					that.isAnimating = false;
					that._translate(destX, destY);
	
					if ( !that.resetPosition(that.options.bounceTime) ) {
						that._execEvent('scrollEnd');
					}
	
					return;
				}
	
				now = ( now - startTime ) / duration;
				easing = easingFn(now);
				newX = ( destX - startX ) * easing + startX;
				newY = ( destY - startY ) * easing + startY;
				that._translate(newX, newY);
	
				if ( that.isAnimating && scroller.rAFqueue[j]) {
					rAF(step);
				}
			}
	
			this.isAnimating = true;
			step();
		}
		
		scroller.hasMore = function(flag){
			if(flag){
				this.loaderSpring.style.display = "none"
				IScroll.utils.Text(this.loaderLayer,this.noMoreText)
				this.isMore = false
			}else{
				this.loaderSpring.style.display = "inline-block"
				IScroll.utils.Text(this.loaderLayer,this.pullUpText)
				this.isMore = true
			}
			
		}
		
		
		scroller.showRefreshSuccessTip = function(callback){
			scroller.refreshTip.style.display = "none"
			scroller.refreshendTip.style.display = "block"
			var refreshSuccessTipDruation = parseInt(scroller.refreshSuccessTipDruation || 1000)
			var delay = refreshSuccessTipDruation + 150
			setTimeout(function(){
				scroller.refreshendTip.style.opacity = 1
			})
			setTimeout(function(){
				callback && callback()
			},delay)
		}
		
		function endRefresh(callback){
			//scroller.refreshLayer.style[IScroll.utils.style.transitionDuration] = '200ms'
			//scroller.refreshLayer.style.height = 0
			setTimeout(function(){
				scroller.refreshTip.style.display = "block"
				callback && callback()
			},parseInt(scroller.refreshLayer.style[IScroll.utils.style.transitionDuration]))
		}
		
		//copy refresh方法，去掉了this.resetPosition()方法
		scroller.resetHeight = function(){
			var utils = IScroll.utils
			utils.getRect(this.wrapper);		// Force reflow
	
			this.wrapperWidth	= this.wrapper.clientWidth;
			this.wrapperHeight	= this.wrapper.clientHeight;
	
			var rect = utils.getRect(this.scroller);
	/* REPLACE START: refresh */
	
			this.scrollerWidth	= rect.width;
			this.scrollerHeight	= rect.height;
			
			this.maxScrollX		= this.wrapperWidth - this.scrollerWidth;
			this.maxScrollY		= this.wrapperHeight - this.scrollerHeight;
	
	/* REPLACE END: refresh */
	
			this.hasHorizontalScroll	= this.options.scrollX && this.maxScrollX < 0;
			this.hasVerticalScroll		= this.options.scrollY && this.maxScrollY < 0;
			
			if ( !this.hasHorizontalScroll ) {
				this.maxScrollX = 0;
				this.scrollerWidth = this.wrapperWidth;
			}
	
			if ( !this.hasVerticalScroll ) {
				this.maxScrollY = 0;
				this.scrollerHeight = this.wrapperHeight;
			}
	
			this.endTime = 0;
			this.directionX = 0;
			this.directionY = 0;
			
			if(utils.hasPointer && !this.options.disablePointer) {
				// The wrapper should have `touchAction` property for using pointerEvent.
				this.wrapper.style[utils.style.touchAction] = utils.getTouchAction(this.options.eventPassthrough, true);
	
				// case. not support 'pinch-zoom'
				// https://github.com/cubiq/iscroll/issues/1118#issuecomment-270057583
				if (!this.wrapper.style[utils.style.touchAction]) {
					this.wrapper.style[utils.style.touchAction] = utils.getTouchAction(this.options.eventPassthrough, false);
				}
			}
			this.wrapperOffset = utils.offset(this.wrapper);
	
			this._execEvent('refresh');
	
			//this.resetPosition();
		}
		
		//初始化下拉成功提示
		function initRefreshSuccessTip(){
			var text = scroller.refreshendTip
			scroller.refreshendTip =  $(options.refreshendTip)
			console.log(options.refreshendTip)
			if(!scroller.refreshendTip){
				if(/^(\.|#).+/.test(text)){
					console.warn("refreshendTip: "+ text + " not found")
				}
				scroller.refreshendTip = document.createElement("div")
				scroller.refreshendTip.classList.add("refreshend-tip")
				scroller.refreshendTip.innerHTML = text
				scroller.refreshLayer.appendChild(scroller.refreshendTip)
			}
			var height = scroller.refreshTip.offsetHeight
			scroller.refreshendTip.style.cssText = "width:100%;text-align: center;opacity:0;transition:all;display:none;min-height:" + height +"px;line-height:" + height +"px"
			scroller.refreshendTip.style[IScroll.utils.style.transitionDuration] = "500ms"
		}
		
		function $(s){
			return document.querySelector(selector + " " + s)
		}
		
	    return scroller
	}
	
	
	IScroll.utils.Text = function(dom,text){
		var nodes = dom.childNodes,
		    len = nodes.length
		for(; len-- && nodes[len].nodeType == 3 && !!nodes[len].nodeValue.trim(); ){
			return nodes[len].nodeValue = text
		}
		if(len>1){
			return nodes[2].nodeValue = text
		}
		return nodes[0].nodeValue = text
	}	
	
	
	if ( typeof module != 'undefined' && module.exports ) {
		module.exports = pullToRefresh;
	} else if ( typeof define == 'function' && define.amd ) {
	        define( function () { return pullToRefresh; } );
	} else if (typeof jQuery != 'undefined'){
		jQuery.fn.extend({
			pullToRefresh : function(){
				return pullToRefresh()
			}
		})
	}else {
		window.pullToRefresh = pullToRefresh;
	}
	
	
}())



