function pageRefreshed() {
	function createButtons(someDiv) { 
		if($('.player-controls__right-control-group').length){ 
			if(!$('.clean').length){ 
				var div = document.createElement('div');
				div.classList.add("clean");
				div.addEventListener("click", clean);
				
				var cleanButton=document.createElement("button");
				cleanButton.classList.add("cleanButton");
				
				div.appendChild(cleanButton);
				$('.player-controls__right-control-group:last-child').prepend(div);


				$(".clean").css({"width": "30px","height": "30px","display": "flex", "justify-content": "center", "align-items": "center", "border-radius": "4px","cursor": "pointer"});
				$('.clean').hover(function(){
					$(this).css("background-color","var(--color-background-button-icon-overlay-hover)");
				},function(){
					$(this).css("background-color","transparent");
				});
				$(".cleanButton").css({"margin-left": "2%", "margin-right": "1%", "color":"white", "background-image": "url("+chrome.runtime.getURL("clean-icon.png")+")","background-repeat": "no-repeat", "background-position": "50% 50%", "height": "16px", "width": "16px", "border": "none"});
			}
			
			if(!$('.start').length){ 
				var div = document.createElement('div');
				div.classList.add("start");
				div.addEventListener("click", start);
				
				var startButton=document.createElement("button");
				startButton.classList.add("startButton");
				
				div.appendChild(startButton);
				$('.player-controls__right-control-group:last-child').prepend(div);


				$(".start").css({"width": "30px","height": "30px","display": "flex", "justify-content": "center", "align-items": "center", "border-radius": "4px","cursor": "pointer"});
				$('.start').hover(function(){
					$(this).css("background-color","var(--color-background-button-icon-overlay-hover)");
				},function(){
					$(this).css("background-color","transparent");
				});
				$(".startButton").css({"margin-left": "2%", "margin-right": "1%", "color":"white", "background-image": "url("+chrome.runtime.getURL("start-icon.png")+")","background-repeat": "no-repeat", "background-position": "50% 50%", "height": "16px", "width": "16px", "border": "none"});
				
				
			}
			//$('[data-toggle="popover"]').popover();
			
		}
	}

	const observer = new MutationObserver(function (mutations, mutationInstance) {
		const videoDiv = document.getElementsByClassName('player-controls__right-control-group')[0];
		if (videoDiv != null) {
			createButtons(videoDiv);
			mutationInstance.disconnect();
		}
	});

	observer.observe(document, {
		childList: true,
		subtree:   true
	});

}


function start() {
	
	let check="start";
	if($(".startButton").data('state')=="stopped"){
		check="stop";
		$(".startButton").css({"background-image": "url("+chrome.runtime.getURL("start-icon.png")+")"});
		$(".startButton").data('state',"started");
	}
	else{
		$(".startButton").css({"background-image": "url("+chrome.runtime.getURL("stop-icon.png")+")"});
		$(".startButton").data('state',"stopped");
	}
	chrome.runtime.sendMessage({method: check}, function(response) {
	});
};

function clean() {
	console.log("cleaning...");
	$(".size").text("0mo");
	chrome.runtime.sendMessage({method: 'clean'}, function(response) {
	});
};
			
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == 'blobs'){
	  var size=parseFloat(request.data.toFixed(1));
	  if(!$(".size").length){
		var div=document.createElement("div");
		div.classList.add("size");
		div.innerText="0mo";				

		$('.player-controls__right-control-group:last-child').prepend(div)
		$(".size").css({"margin-left": "1%","color":"white"});
	  }
	  $(".size").text(size+"mo");
	  
	  if(!$(".download").length){
		var div = document.createElement('div');
		div.classList.add("download");
		div.addEventListener("click", function() {
			console.log("downloading...");
			chrome.runtime.sendMessage({method: 'download',id:"video"+request.data2}, function(response) {
			});
		});
		
		
		var downloadButton=document.createElement("button");
		downloadButton.id="video"+request.data2;
		downloadButton.classList.add("downloadButton");
		
		
		div.appendChild(downloadButton);
		$('.player-controls__right-control-group:last-child').prepend(div);


		$(".download").css({"width": "30px","height": "30px","display": "flex", "justify-content": "center", "align-items": "center", "border-radius": "4px","cursor": "pointer"});
		$('.download').hover(function(){
			$(this).css("background-color","var(--color-background-button-icon-overlay-hover)");
		},function(){
			$(this).css("background-color","transparent");
		});
		$(".downloadButton").css({"margin-left": "2%", "margin-right": "1%", "color":"white", "background-image": "url("+chrome.runtime.getURL("download-icon.png")+")","background-repeat": "no-repeat", "background-position": "50% 50%", "height": "16px", "width": "16px", "border": "none"});
	  }
	sendResponse({ data: 'OK' });
  }
  else if (request.method == 'refresh') {
	pageRefreshed();
  }
  else 
	sendResponse({});
});	