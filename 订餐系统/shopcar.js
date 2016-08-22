yc.addEvent('car','click',function(){
	if(yc.$("shopcar").getElementsByTagName("div").length>0){
		//if(yc.$('shopcar').style.right!="-180px"){
		if(yc.$('shopcar').style.display!="block"){
			//yc.$('shopcar').style.right=-180+"px";
			yc.$('shopcar').style.display="block";
		}else{
			yc.$('shopcar').style.display="none";
			
			//yc.$('shopcar').style.right=-460+"px";
		}			  
	}else{
		alert("请先添加菜品");
	}
	
});