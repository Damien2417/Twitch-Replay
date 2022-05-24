function pageRefreshed() {
	function createButtons(someDiv) { 
		if($('.player-controls__right-control-group').length){ 
			if(!$('.clean').length){ 
				var cleanButton=document.createElement("button");
				cleanButton.classList.add("clean");
				cleanButton.innerText="Clean"; 
				cleanButton.addEventListener("click", clean);
				$('.player-controls__right-control-group:last-child').prepend(cleanButton);
				$(".clean").css({"margin-left": "2%","margin-right": "1%","color":"white"});
			}
			
			if(!$('.start').length){ 
				var buttonStart=document.createElement("button");
				buttonStart.classList.add("start");
				buttonStart.innerText="Start"; 
				buttonStart.addEventListener("click", start);
				$('.player-controls__right-control-group:last-child').prepend(buttonStart);
				$(".start").css({"margin-left": "3%","color":"white"});
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
	console.log("start");
	let check="start";
	if($(this).text()=="Stop"){
		check="stop";
		$(this).text("Start");
	}
	else
		$(this).text("Stop");
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
		var button=document.createElement("button");
		button.id="video"+request.data2;

		button.innerText="Download ";
						
		button.classList.add("download");
		button.addEventListener("click", function() {
			console.log("downloading...");
			chrome.runtime.sendMessage({method: 'download',id:button.id}, function(response) {
			});
		});
		$('.player-controls__right-control-group:last-child').prepend(button)
		$("#video"+request.data2).css({"color":"white"});
	  }
	sendResponse({ data: 'OK' });
  }
  else if (request.method == 'refresh') {
	pageRefreshed();
  }
  else 
	sendResponse({});
});	