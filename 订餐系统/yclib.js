(function(){
	if(!window.yc){
		//window.yc={};
		window['yc']={};
	}

	//判断当前浏览器是否兼容这个库： 浏览器能力检测
	function isCompatible(other){
		if(other===false || !Array.prototype.push || !Object.hasOwnProperty || !document.createElement || !document.getElementsByTagName){
			return false;
		}
		return true;
	};
	window['yc']['isCompatible']=isCompatible;

	//////////获取页面元素////////
	//window['yc']['$']=$;
	//<div id="a"> <div id="b">
	//$("a"); var array=$("a","b") ==> array=>1 array=>2 array=>0
	function $(){
		var elements=new Array();
		for(var i=0;i<arguments.length;i++){
			var element=arguments[i];
			if(typeof element=='string'){
				element=document.getElementById(element);
			}
			if(arguments.length==1){
				return element;
			}
			elements.push(element);
		}
		return elements;
	}
	//window.yc.$=$;
	window['yc']['$']=$;

	function getElementsByClassName( className, tag, parent){
		parent=parent||document;
		if( !(parent=$(parent)) ){
			return false;
		}
		//查看所有匹配的标签
		var allTags=(tag=="*" &&parent.all)?parent.all:parent.getElementsByTagName(tag);
		var matchingElements=new Array();
		//创建一个正则表达式，来判断className是否正确  ^a || a
		var regex=new RegExp("(^|\\s)"+className+"(\\s|$)");
		var element;
		//检查每个元素
		for(var i=0;i<allTags.length;i++){
			element=allTags[i];
			if(regex.test(element.className) ){
				matchingElements.push(element);
			}
		}
		return matchingElements;
	};
	window['yc']['getElementsByClassName']=getElementsByClassName;
	

	////////////////////事件操作//////////////////// 
	//添加事件： node：节点  type：事件类型('click' listener:监听器函数)
	function addEvent(node,type,listener){
		if( !isCompatible() ){ return false; };
		if( !(node=$(node)) ){ return false; };
		//w3c加事件的方法
		if( node.addEventListener ){  //firefox
			node.addEventListener(type,listener,false);
			return true;
		}else if( node.attachEvent ){  //IE
			//MSIE的事件
			node['e'+type+listener]=listener;
			node[type+listener]=function(){
				node['e'+type+listener]( window.event );  //listener(window.event)
			}
			node.attachEvent('on'+type,node[type+listener]);
			return true;
		}
	};
	window['yc']['addEvent']=addEvent;

	//移除事件
	function removeEvent(node,type,listener){
		if( !(node=$(node)) ){ return false; };
		if(node.removeEventListener){  //fireFox
			node.removeEventListener(type,listener,false);
			return true;
		}else if(node.detachEvent){     //IE
			node.detachEvent('on'+type,node[type+listener]);
			node[type+listener]=null;
			return true;
		}
		return false;
	};
	window['yc']['removeEvent']=removeEvent;

	//页面加载事件
	function addLoadEvent(func){
		var oldonLoad=window.onload;
		if(typeof window.onload!='function'){
			window.onload=func;
		}else{
			window.onload=function(){
				oldonLoad();
				func();
			}
		}
	}
	window['yc']['addLoadEvent']=addLoadEvent;

	////////////////界面操作//////////////////
	//开关操作
	function toggleDisplay(node,value){
		if(!(node=$(node)) ){ return false;}
		if( node.style.display!='none'){
			node.style.display='none';
		}else{
			node.style.display=value||' ';
		}
		return true;
	}
	window['yc']['toggleDisplay']=toggleDisplay;

	//动画：定时移动元素
	function moveElement(elementId,final_x,final_y,interval){
		if(!isCompatible()){ return false; }
		if(!$(elementId)){return false;}
		var ele=$(elementId);
		if(ele.movement){
			clearTimeout(ele.movement);
		}
		var xpos=parseInt(ele.style.left);
		var ypos=parseInt(ele.style.top);
		if(xpos==final_x && ypos==final_y){
			return true; 
		}
		var dist=0;
		if(xpos<final_x){ dist=(final_x-xpos)/10; xpos=xpos+dist; }
		if(xpos>final_x){ dist=(xpos-final_x)/10; xpos=xpos-dist; }
		if(ypos<final_y){ dist=(final_y-ypos)/10; ypos=ypos+dist; }
		if(ypos>final_y){ dist=(ypos-final_y)/10; ypos=ypos-dist; }
		ele.style.left=xpos+"px";
		ele.style.top=ypos+"px";
		var repeat="yc.moveElement('"+elementId+"',"+final_x+","+final_y+","+interval+")";
		ele.movement=setTimeout(repeat,interval);
	}
	window['yc']['moveElement']=moveElement;
	//模板替换
	/*
	//方法一
	function supplant(template,date){
		template=template.replace("{last}",date.last);
		template=template.replace("{first}",date.first);
		template.replace("{border}",date.border);
		return template;
	}
	window.yc.supplant=supplant;
	*/
	function supplant(str,o){
		return str.replace(/{([a-z]*)}/g,
			function(a,b){
				var r=o[b];
				return r;
			}
		);
	}
	window.yc.supplant=supplant;

	function parseJson(str,filter){
		var result=eval("("+str+")");
		if(filter!=null && typeof(filter)=='function'){
			for(var i in result){
				result[i]=filter(i,result[i]);
			}
		}
		return result;
	}
	window['yc']['parseJson']=parseJson;

	///////////DOM中的节点的操作补充////////////////
	//新增的第一个函数：给 referenceNode的后面加入一个node
	function insertAfter(node,referenceNode){
		if(!(node=$(node))){ return false; }
		if(!(referenceNode=$(referenceNode))){ return false;}
		var parent=referenceNode.parentNode;
		if(parent.lastChild==referenceNode){
			parent.appendChild(node);
		}else{
			parent.insertBefore(node,referenceNode.nextSibling);
		}
	};
	window['yc']['insertAfter']=insertAfter;

	//新增的第二个函数：一次删除所有的子节点
	function removeChildren(parent){
		if(!(parent=$(parent))){ return false;}
		while(parent.firstChild){
			//parent.firstChild.parentNode.removeChild(parent.firstChild);
			parent.removeChild(parent,firstChild);
		}
		//返回父节点，以实现方法连缀
		return parent;
	};
	window['yc']['removeChildren']=removeChildren;

	//在一个父节点的第一个子节点前面添加一个新节点
	function prependChild(parent,newChild){
		if(!(parent=$(parent))){ return false;}
		if(!(newChild=$(newChild))){return false;}
		if(parent.firstChild){  //查看parent节点下是否有子节点
			//如果有一个子节点，就在这个子节点前添加
			parent.insertBefore(newChild,parent.firstChild);
		}else{
			//如果没有子节点则直接添加
			parent.appendChild(newChild);
		}
		return parent;
	};
	window['yc']['prependChild']=prependChild;


	////////////////////////样式表操作：设置样式规则///////////////////
	function camelize(s){
		return s.replace(/-(\w)/g,function(strMatch,p1){
			return p1.toUpperCase();
		});
	}
	window['yc']['camelize']=camelize;

	function uncamelize(s,sep){
		sep=sep||'-';
		return s.replace(/([a-z])([A-Z])/g,function(match,p1,p2){
			return p1+sep+p2.toLowerCase();
		});
	}
	window['yc']['uncamelize']=uncamelize;

	//通过id修改单个元素的样式
	function setStyleById(element,styles){
		//取得对象的引用
		if(!(element=$(element))){
			return false;
		}
		//遍历styles对象的属性，并应用每个属性
		for(property in styles){
			if(!styles.hasOwnProperty(property)){
				continue;
			}
			if(element.style.setProperty){
				//setProperty("background-color")
				//DOM2样式规范 setproperty(propertyName,value,priority);
				element.style.setProperty(uncamelize(property,'-'),styles[property],null);
			}else{
				//备用方法 element.style["backgroundColor"]="red";
				element.style[camelize(property)]=styles[property];
			}
		}
		return true;
	}
	window['yc']['setStyle']=setStyleById;
	window['yc']['setStyleById']=setStyleById;

	/*通过标签名修改多个样式：调用举例：yc.setStylesByTagName('a',{'color':'red'}) tagName:标签名 
	styles:样式对象 parent:父标签的id号*/
	function setStylesByTagName(tagname,styles,parent){
		parent=$(parent)||document;
		var elements=parent.getElementsByTagName(tagname);
		for(var e=0;e<elements.length;e++){
			setStyleById(elements[e],styles);
		}
	}
	window['yc']['setStylesByTagName']=setStylesByTagName;

	/*通过类名修改多个元素的样式 parent:父元素的id tag:标签名 className:标签上的类名 styles:样式对象*/
	function setStylesByClassName(parent,tag,className,styles){
		if(!(parent=$(parent))){return false;}
		var elements=getElementsByClassName(className,tag,parent);
		for(var e=0;e<elements.length;e++){
			setStyleById(elements[e],styles);
		}
		return true;
	}
	window['yc']['setStylesByClassName']=setStylesByClassName;

	//////////////////样式表操作：基于css切换样式////////////////
	/*取得元素中类名的数组 element:要查找类名的元素*/
	function getclassNames(element){
		if(!(element=$(element))){return false;}
		return element.className.replace(/\s+/,' ').split(' ');
	}
	window['yc']['getclassNames']=getclassNames;

	/*检查元素中是否存在某个类 element:要查找类名的元素 className:要查找的类名*/
	function hasClassName(element,className){
		if(!(element=$(element))){
			return false;
		}
		var classes=getclassNames(element);
		for(var i=0;i<classes.length;i++){
			if(classes[i]===className){
				return true;
			}
		}
		return false;
	}
	window['yc']['hasClassName']=hasClassName;

	/*为元素添加类 element：要添加类名的元素 className：要添加的类名*/
	function addClassName(element,className){
		if(!(element=$(element))){
			return false;
		}
		var space=element.className?' ':'';
		element.className+=space+className;
		return true;
	}
	window['yc']['addClassName']=addClassName;

	/*从元素中删除类*/
	function removeClassName(element,className){
		if(!(element=$(element))){
			return false;
		}
		var classes=getclassNames(element);
		var length=classes.length;
		var a=0;
		for(var i=length-1;i>=0;i--){
			if(classes[i]===className){
				delete(classes[i]);
				a++;
			}
		}
		element.className=classes.join(' ');
		return (a>0?true:false);
	}
	window['yc']['removeClassName']=removeClassName;

	////////////////样式表操作：更大范围的改变，切换样式表//////////////////////
	/*通过url取得包含所有样式表的数组*/
	function getStyleSheets(url,media){
		var sheets=[];
		for(var i=0;i<document.getStyleSheets.length;i++){
			if(!document.styleSheets[i].href){
				continue;
			}
			if(url&&document.styleSheets[i].href.indexOf(url)==-1){
				continue;
			}
			if(media){
				media=media.replace(/,\s*/,',');
				var sheetMedia;
				if(document.getStyleSheets[i].media.mediaText){
					sheetMedia=document.getStyleSheets[i].media.mediaText.replace(/,\s*/,',');
					sheetMedia=sheetMedia.replace(/,\s*$/,'');
				}else{
					sheetMedia=document.styleSheets[i].media.replace(/,\s*/,',');
				}
				if(media!=sheetMedia){
					continue;
				}
			}
			sheets.push(document.styleSheets[i]);
		}
		return sheets;
	}
	window['yc']['getStyleSheets']=getStyleSheets;

	//添加新的样式表
	function addStyleSheet(url,media){
		media=media||'screen';
		var link=document.createElement('link');
		link.setAttribute('rel','stylesheet');
		link.setAttribute('type','text/css');
		link.setAttribute('href',url);
		link.setAttribute('media',media);
		document.getElementsByTagName('head')[0].appendChild(link);
	}
	window['yc']['addStyleSheet']=addStyleSheet;

	//移除样式表
	function removeStyleSheet(url,media){
		var styles=getStyleSheets(url,media);
		for(var i=0;i<styles.length;i++){
			var node=styles[i].ownerNode||styles[i].owningElement;
			//禁用样式表
			styles[i].diabled=true;
			//移除节点
			node.parentNode.removeChild(node);
		}
	}
	window['yc']['removeStyleSheet']=removeStyleSheet;

	///////////////////////
	function addCSSRule(selector,styles,index,url,media){
		var declaration='';
		//根据styles参数(样式对象)构建声明字符串
		for(prototype in styles){
			if(!styles.hasOwnProperty(property)){
				continue;
			}
		}
		//根据url和media获取样式表
		declaration+=property+":"+styles[property]+";";
		var newIndex;
		//循环所有满足条件的样式表，添加样式规则
		for(var i=0;i<styleSheets.length;i++){
			//添加规则
			if(styleSheets[i].insertRule){
				//计算规则添加的索引位置
				newIndex=(index>=0?index:styleSheets[i].cssRules.length);
				styleSheets[i].insertRule(selector+'('+declaration+')',newIndex);
			}else if(styleSheets[i].addRule){
				newIndex=(index>=0?index:-1);
				styleSheets[i].addRule(selector,declaration,newIndex);
			}
		}
	}
	window['yc']['addCSSRule']=addCSSRule;

	/*编辑样式规则:yc.editCSSRule('.test',{'font-size':'red'})*/
	function editCSSRule(selector,styles,url,media){
		//取出所有样式表
		var styleSheets=getStyleSheets(url,media);
		//循环每个样式表中的每一条规则
		for(var i=0;i<styleSheets.length;i++){
			//取出规则列表 DOM2样式规范方法是styleSheets[i].cssRules IE方法是styleSheets[i].rules
			var rules=styleSheets[i].cssRules||styleSheets[i].rules;
			if(!rules){
				continue;
			}
			//IE默认选择器名使用大写，故转换为大写形式，如果使用的是区分大小写的id，则可能会导致冲突
			selector=selector.toUpperCase();
			for(var j=0;j<rules.length;j++){
				//检查
				if(rules[j].selectorText.toUpperCase()==selector){
					for(property in styles){
						if(!styles.hasOwnProperty(property)){
							continue;
						}
						rules[j].style[camelize(property)]=styles[property];
					}
				}
			}
		}
	}
	window['yc']['editCSSRule']=editCSSRule;

	/*取得一个元素的计算样式*/
	function getStyle(element,property){
		if(!(element=$(element))||!property){
			return false;
		}
		//检测元素style属性中的值
		var value=element.style[camelize(property)];
		if(!value){
			//取得计算值
			if(document.defaultView&&document.defaultView.getComputedStyle){
				//DOM方法
				var css=document.defaultView.getComputedStyle(element,null);//取出了element这个元素所有的计算样式
				value=css?css.getPropertyValue(property):null;
			}else if(element.currentStyle){
				//IE方法
				value=element.currentStyle[ camelize(prototype) ];
			}
		}
		//返回空字符串而不是auto，这样就不必检查auto值了
		return value=='auto'?'':value;
	}
	window['yc']['getStyle']=getStyle;
	window['yc']['getStyleById']=getStyle;

	/////////////////////////////Ajax封装//////////////////////////////////////////
	//对参数字符串编码 针对get请求
	function addUrlParam( url,name,value){
		url+=(url.indexOf("?")==-1?"?":"&");
		url+=encodeURIComponent(name)+"="+encodeURIComponent(value);
		return url;
	}
	//序列化表单
	function serialize(form){
		var parts=new Array();
		var field=null;
		for(var i=0,len=form.elements.length;i<len;i++){
			field=form.elements[i];
			switch(field.type){
				case "select-one":
				case "select-multiple":
				for(var j=0,optLen=field.options.length;j<optLen;j++){
					var option=field.options[j];
					if(option.selected){
						var optValue="";
						if(option.hasAttribute){
							optValue=(option.hasAttribute("value")?option.value:option.text);
						}else{
							optValue=(option.attributes["value"].specified?option.value:option.text);
						}
						parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(optValue));
					}
				}
				break;
				case undefined:
				case "file":
				case "submit":
				case "reset":
				case "button":
					break;
				case "radio":
				case "checkbox":
					if(!field.checked){
						break;
					}
					default:
						parts.push(encodeURIComponent(field.name)+"="+encodeURIComponent(field.value));
			}
		}
		return parts.join("&");
	}
	window['yc']['serialize']=serialize;

	//////////////////////////////xml操作/////////////////////////////////
	//从xml文档对象中按 xpath规则提取出要求的节点
	function selectXMLNodes(xmlDoc,xpath){
			if('\v'=='v'){
				xmlDoc.setProperty("SelectionLanguage","XPath");
				return xmlDoc.documentElement.selectNodes(xpath);
			}else{
				var evaluctor=new XPathEvaluator();
				var resultSet=evaluctor.evaluate(xpath,xmlDoc,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);
				var finalArray=[];
				if(resultSet){
					var el=resultSet.iterateNext();
					while(el){
						finalArray.push(el);
						el=resultSet.iterateNext();
					}
					return finalArray;
				}
			}
		}
		window['yc']['selectXMLNodes']=selectXMLNodes;

		//在xml dom中不能使用getElementById方法，所以这里自己实现一个相似功能的函数
		function getElementByIdXML(rootnode,id){
			nodeTags=rootnode.getElementsByTagName('*');
			for(i=0;i<nodeTags.length;i++){
				if(nodeTags[i].hasAttribute('id')){
					if(nodeTags[i].getAttribute('id')==id){
						return nodeTags[i];
					}
				}
			}
		}
		window['yc']['getElementByIdXML']=getElementByIdXML;

		//将xml的字符串 反序列化转为xml Dom节点对象，以便于使用 getElementsByTagName()等函数来操作
		function parseTextToXmlDomObject(str){
			if('\v'=='v'){
				var xmlNames=["Msxml2.DOMDocument.6.0","Msxml2.DOMDocument.4.0","Msxml2.DOMDocument.3.0","Msxml2.DOMDocument","Microsoft.XMLDOM","Microsoft.XMLDom"];
				for(var i=0;i<xmlNames.length;i++){
					try{
						var xmlDoc=new ActiveXObject(xmlNames[i]);
						break;
					}catch(e){

					}
				}
				xmlDoc.async=false;
				xmlDoc.loadXML(str);
			}else{
				try{
					var parser=new DOMParser();
					var xmlDoc=parser.parseFromString(str,"text/xml");
				}catch(x){
					alert(x.message);
					return;
				}
			}
			return xmlDoc;
		}
		window['yc']['parseTextToXmlDomObject']=parseTextToXmlDomObject;

		//将 xml Dom对象序列化转成 xml字符串
		function parseXmlDomObjectTOText(xmlDom){
			if(xmlDOM.xml){
				return xmlDOM.xml;
			}else{
				var serializer=new XMLSerializer();
				return serializer.serializeToString(xmlDOM,"text/xml");
			}
		}
		window['yc']['parseXmlDomObjectTOText']=parseXmlDomObjectTOText;


		function parseJSON(s,filter){
			var j;
			function walk(k,v){
				var i;
				if(v && typeof v==='object'){
					for(i in v){
						if(v.hasOwnProperty(i)){
							v[i]=walk(i,v[i]);
						}
					}
				}
				return filter(k,v);
			}
			if(/^("(\\.|[^"\\\n\r])*?"|[,:{}\[\]0-9.\-+Eaeflnr-u \n\r\t])+?$/.test(s)){
				try{
					j=eval('('+s+')');
				}catch(e){
					throw new SyntaxError("eval parseJSON");
				}
			}else{
				throw new SyntaxError("parseJSON");
			}
			if(typeof filter==='function'){
				j=walk(' ',j);
			}
			return j;
		}
		window['yc']['parseJSON']=parseJSON;

		function getRequestObject(url,options){
			var req=false;
			if(window.XMLHttpRequest){
				var req=new window.XMLHttpRequest();
			}else if(window.ActiveXObject){
				var req=new window.ActiveXObject('Microsoft.XMLHTTP');
			}
			if(!req){ return false; }
			options=options || {};
			options.method=options.method || 'POST';
			options.send=options.send || null;

			req.onreadystatechange=function(){
				switch(req.readyState){
					case 1:
						if(options.loadListener){
							options.loadListener.apply(req,arguments);
						}
						break;
					case 2:
						if(options.loadedListener){
							options.loadedListener.apply(req,arguments);
						}
						break;
					case 3:
						if(options.ineractiveListener){
							options.ineractiveListener.apply(req,arguments);
						}
						break;
					case 4:
						try{
							if(req.status && req.status==200){
								var contentType=req.getResponseHeader('content-Type');
								var mimeType=contentType.match(/\s*([^;]+)\s*(;|$)/i)[1];
								switch(mimeType){
									case 'text/javascript':
									case 'application/javascript':
										if(options.jsResponseListener){
											options.jsResponseListener.call(req,req.responseText);
										}
										break;
									case 'text/plain':
									case 'application/json':
										if(options.jsonResponseListener){
											try{
												var json=parseJSON(req.responseText);
											}catch(e){
												var json=false;
											}
											options.jsonResponseListener.call(req,json);
										}
										break;
									case "text/xml":
									case "application/xml":
									case "application/xhtml+xml":
										if(options.xmlResponseListener){
											options.xmlResponseListener.call(req,req.responseText);
										}
										break;
									case "text/html":
										if(options.htmlResponseListener){
											options.htmlResponseListener.call(req,req.responseText);
										}
										break;
								}
								if(options.completeListener){
									options.completeListener.call(req,req.responseText);
								}
							}else{
								if(options.errorListener){
									options.errorListener.apply(req,arguments);
								}
							}
						}catch(e){
							alert(e);
						}
						break;
				}
			};
			req.open(options.method,url,true);
			return req;
		}
		window['yc']['getRequestObject']=getRequestObject;

		function ajaxRequest(url,options){
			var req=getRequestObject(url,options);
			req.setRequestHeader("content-Type","application/x-www-form-urlencoded");
			return req.send(options.send);
		}
		window['yc']['ajaxRequest']=ajaxRequest;
		
		
		/**
 * 跨站对象计数器
 */
var XssHttpRequestCount=0;

/**
 *request对象的一个跨站点<script>标签生成器
 */
var XssHttpRequest = function(){
    this.requestID = 'XSS_HTTP_REQUEST_' + (++XssHttpRequestCount);   //请求的编号，保证唯一. 
}
//扩展   httpRequest对象。添加了一些属性
XssHttpRequest.prototype = {
    url:null,
    scriptObject:null,
    responseJSON:null,    //  包含响应的结果，这个结果已经是json对象，所以不要 eval了. 
    status:0,        //1表示成功，   2表示错误
    readyState:0,      
    timeout:30000,
    onreadystatechange:function() { },
    
    setReadyState: function(newReadyState) {
        // 如果比当前状态更新，，则更新就绪状态
        if(this.readyState < newReadyState || newReadyState==0) {
            this.readyState = newReadyState;
            this.onreadystatechange();
        }
    },
    
    open: function(url,timeout){
        this.timeout = timeout || 30000;
        // 将一个名字为  XSS_HTTP_REQUEST_CALLBACK的键加到   请求的url地址后面， 值为要回调的函数的名字.这个函数名叫   XSS_HTTP_REQUEST_数字_CALLBACK
        this.url = url + ((url.indexOf('?')!=-1) ? '&' : '?' ) + 'XSS_HTTP_REQUEST_CALLBACK=' + this.requestID + '_CALLBACK';    
        this.setReadyState(0);        
    },
    
    send: function(){
        var requestObject = this;
        //创建一个用于载入外部数据的  script 标签对象
        this.scriptObject = document.createElement('script');
        this.scriptObject.setAttribute('id',this.requestID);
        this.scriptObject.setAttribute('type','text/javascript');
        // 先不设置src属性，也先不将其添加到文档.

        // 异常情况： 创建一个在给定的时间 timeout 毫秒后触发的  setTimeout(), 如果在给定的时间内脚本没有载入完成，则取消载入.
        var timeoutWatcher = setTimeout(function() {
            // 如果脚本晚于我们指定的时间载入， 则将window中的rquestObject对象中的方法设置为空方法
            window[requestObject.requestID + '_CALLBACK'] = function() { };
            // 移除脚本以防止这个脚本的进一步载入。 
            requestObject.scriptObject.parentNode.removeChild(requestObject.scriptObject);
            // 因为以上加载的脚本的操作已经超时，并且 脚本标签已经移除，所以将当前  request对象的状态设置为  2,表示错误, 并设置错误文本 
            requestObject.status = 2;
            requestObject.statusText = 'Timeout after ' + requestObject.timeout + ' milliseconds.'            
            
            // 重新更新  request请求的就绪状态，但请注意，这时，  status 是2 ,而不是200,表示失败了.
            requestObject.setReadyState(2);
            requestObject.setReadyState(3);
            requestObject.setReadyState(4);
                    
        },this.timeout);
        
        
        // 在window对象中创建一个与请求中的回调方法名相同的方法，在回调时负责处理请求的其它部分. 
        window[this.requestID + '_CALLBACK'] = function(JSON) {
            // 当脚本载入时将执行这个方法同时传入预期的JSON对象. 
        
            // 当请求载入成功后，清除timeoutWatcher定时器. 
            clearTimeout(timeoutWatcher);

            //更新状态
            requestObject.setReadyState(2);
            requestObject.setReadyState(3);
            
            // 将状态设置为成功. 
            requestObject.responseJSON = JSON; 
            requestObject.status=1;
            requestObject.statusText = 'Loaded.' 
        
            // 最后更新状态为  4. 
            requestObject.setReadyState(4);
        }

        // 设置初始就绪状态
        this.setReadyState(1);
        
        // 现在再设置src属性并将其添加到文档头部，这样就会访问服务器下载脚本. 
        this.scriptObject.setAttribute('src',this.url);                    
        var head = document.getElementsByTagName('head')[0];
        head.appendChild(this.scriptObject);
        
    }
}
window['yc']['XssHttpRequest'] = XssHttpRequest;

/**
 * 设置Xssrequest对象的各个参数.
 */
function getXssRequestObject(url,options) {
    var req = new  XssHttpRequest();
    options = options || {};
    //默认超时时间
    options.timeout = options.timeout || 30000;
    req.onreadystatechange = function() {
        switch (req.readyState) {
            case 1:
                if(options.loadListener) {
                    options.loadListener.apply(req,arguments);
                }
                break;
            case 2:
                if(options.loadedListener) {
                    options.loadedListener.apply(req,arguments);
                }
                break;
            case 3:
                if(options.ineractiveListener) {
                    options.ineractiveListener.apply(req,arguments);
                }
                break;
            case 4:
                if (req.status == 1) {
                    // The request was successful
                    if(options.completeListener) {
                        options.completeListener.apply(req,arguments);
                    }
                } else {
                    if(options.errorListener) {
                        options.errorListener.apply(req,arguments);
                    }
                }
                break;
        }
    };
    req.open(url,options.timeout);
    return req;
}
window['yc']['getXssRequestObject'] = getXssRequestObject;

/**
 * 发送跨站请求:   JSONP的跨站请求只支持  get方式.
 */
 /*
	options对象结构：{
		timeout: 超时时间
		'loadListener':readyState=1时的回调函数
		'loadedLIstener':readyState=2时的回调函数
		'ineractiveListener':readyState=3时的回调函数

		以下是readyState=4 时的处理回调函数
		'completeListener':处理完成后的回调
		'errorListener':响应码不为200时的回调函数
	}
	*/
function xssRequest(url,options) {
    var req = getXssRequestObject(url,options);
    return req.send(null);
}
window['yc']['xssRequest'] = xssRequest;





})();

//扩展全局的window.Object.prototype=xxx
Object.prototype.toJSONString=function(){
	//需求：给Object 类的prototype添加一个功能 toJSONString(), 将属性的值以json格式输出
	//{"name":"smith","age":30,"sex":"男"}
	//for(var i in person)  person[i]取出值
	/*var str="";
	str+="{"
	for(var i in this){
		if( (typeof this[i])==="object" ){
			str+="\""+i+"\":"+this[i].toJSONString()+",";
		}else if( (typeof this[i])==="string" ){
			str+="\""+i+"\":\""+this[i]+"\",";
		}else if( (typeof this[i])!=="function"){
			str+="\""+i+"\":"+this[i]+",";
		}
	}
	str=str.slice(0,str.length-1);
	str+="}";
	return str;   //返回json字符串
	*/
	var jsonarr=[];
	for(var i in this){
		if(this.hasOwnProperty(i)){
			jsonarr.push( "\""+i+"\""+":\""+this[i]+"\"");
		}
	}
	var r=jsonarr.join(",");
	r="{"+r+"}";
	return r;
}
//[{"name":"smith","age":30,"sex":"男"},{"name":"ls","age":30,"sex":"男"}]
Array.prototype.toJSONString=function(){
	/*var str="";
	str+="[";
	for(var i=0;i<this.length;i++){
		if( (typeof this[i])==="object" ){
			str+=this[i].toJSONString()+",";
		}else if( (typeof this[i])==="string" ){
			str+="\""+this[i]+"\",";
		}else if( (typeof this[i])!=="function"){
			str+=this[i]+",";
		}}
	str=str.slice(0,str.length-1);
	str+="]";
	return str;
	*/
	var json=[];
	for(var i=0;i<this.length;i++){
		json[i]=(this[i]!=null)?this[i].toJSONString():"null";
	}
	return "["+json.join(",")+"]";
}

String.prototype.toJSONString=function(){
	return '"'+this.replace(/(\\|\")/g,"\\$1").replace(/\n|\r|\t/g,function(){   })
}

Boolean.prototype.toJSONString=function(){return this}
Function.prototype.toJSONString=function(){return this}
Number.prototype.toJSONString=function(){return this}
RegExp.prototype.toJSONString=function(){return this}