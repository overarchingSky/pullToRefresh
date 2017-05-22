window.addEventListener("load",function(){
	var js = ['./iscroll.js','./pullToRefresh.js','./init.js'];
	setTimeout(function(){
		loadJs(js)
	},1000)
	
})
function loadJs(arr){
	var len = arr.length;
	var i = 0
	deep(arr,i,len)
}
function deep(arr,i,len){
	var script = document.createElement("script");
	script.src = arr[i];
	script.type = "text/javascript";
	document.head.appendChild(script)
	script.onload = function(arr,i,len){
		if(i < len - 1){
			i++
			deep(arr,i,len)
		}
	}.bind(null,arr,i,len)
}
