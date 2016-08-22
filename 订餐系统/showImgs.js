var time=window.setInterval('show()',4000);
var index=1;
function show(id){
	if(id){
		index=id;
		clearInterval(time);
	}else{
		index=index%3+1;
	}
	yc.$('pic').setAttribute('src',"images/"+index+".jpg");
}

function start(){
	time=window.setInterval("show()",4000);
}