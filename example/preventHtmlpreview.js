window.addEventListener("load",function(){
	var js = ['./iscroll.js','./pullToRefresh.js','./init.js'];
	loadJs(js)
})
function loadJs(arr){
	var len = arr.length;
	var i = 0
	deep(arr,i,len)
}
function deep(arr,i,len){
	var script = document.createElement("script");
	script.src = arr[i];
	document.head.appendChild(script)
	script.onload = function(arr,i,len){
		if(i < len - 1){
			i++
			deep(arr,i,len)
		}
	}.bind(null,arr,i,len)
}
