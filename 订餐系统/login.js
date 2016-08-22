yc.addEvent('login','click',function(){
	yc.$('hidebg').style.display="block";
	yc.$('Login').style.display="block";
});
yc.addEvent('close','click',function(){
	yc.$('hidebg').style.display="none";
	yc.$('Login').style.display="none";
	yc.$('bgleft').style.display="none";
});
yc.addEvent('close_x','click',function(){
	yc.$('hidebg').style.display="none";
	yc.$('Login_1').style.display="none";
	yc.$('bgleft').style.display="none";
});
/*yc.addEvent('','click',function(){
	yc.$('bgleft').style.display="block";
	yc.$('content').style.display="block";
});
*/
yc.addEvent('codeimg','click',function(){
	yc.$('codeimg').src="http://218.196.14.220:8080/res/verifyCodeServlet?valcode="+Math.random();
});
yc.addEvent('x','click',function(){
	yc.$('bgleft').style.display="none";
	yc.$('content').style.display="none";
});
yc.addEvent('word','click',function(){

	url="op=login&"+yc.serialize(myform);
	
	var options={
		
		"completeListener":function(){
			var json=this.responseJSON;
			if(json.code==0){
				alert("用户名或密码错误");
				
			}
			if(json.code==1){
				yc.$('hidebg').style.display="none";
				yc.$('Login').style.display="none";
				yc.$('showuser').style.display="block";
				yc.$('login').style.display="none";
				yc.$('showuser').innerHTML="欢迎,"+yc.$('username').value+",<a id='exit'>退出</a>";	
				
				
				yc.addEvent('exit','click',function(){
					yc.$('showuser').style.display="none";
					yc.$('showuser').innerHTML=null;
					yc.$('login').style.display="block";
					var options={
						"completeListener":function(){
							var json=this.responseJSON;
							if(json.code==1){
								alert("退出成功！");
							}else{
								alert("退出失败！");
							}
						}
					}
					
					yc.xssRequest("http://218.196.14.220:8080/res/resuser.action?op=logout",options);   
				});
				
			}
		}
	}
	yc.xssRequest("http://218.196.14.220:8080/res/resuser.action?"+url,options);
});

window.onload=function(){
	var options={
		"completeListener":function(){
			var json=this.responseJSON;
			if(json.code==1){
				yc.$('showuser').style.display="block";
				yc.$('login').style.display="none";
				yc.$('showuser').innerHTML="欢迎,"+json.obj.username+",<a id='ex' onclick='ex()'>退出</a>";	
				
			}else{
				yc.$('showuser').style.display="none";
				yc.$('login').style.display="block";
			}
			
			
		}
	}
	yc.xssRequest("http://218.196.14.220:8080/res/resuser.action?op=checkLogin",options);
}

function ex(){    
	yc.$('showuser').style.display="none";
	yc.$('showuser').innerHTML=null;
	yc.$('login').style.display="block";
	var options={
		"completeListener":function(){
			
		}
	}
	
	yc.xssRequest("http://218.196.14.220:8080/res/resuser.action?op=logout",options);   
}
yc.addEvent("word_1","click",function(){
	var url="op=confirmOrder&"+yc.serialize(myform1);
	yc.$("Login_1").style.display="none";
	yc.$('hidebg').style.display="none";
	var options={
		"completeListener":function(){
			var json=this.responseJSON;
			if(json.code==1){
				alert("购买成功");
				yc.$("shopcar").innerHTML=null;
				yc.$("shopcar").style.display="none";
				yc.$("foodnum").innerHTML=0;
			}
		}
	}
	
	yc.xssRequest("http://218.196.14.220:8080/res/cust/custOp.action?"+url,options);  
});