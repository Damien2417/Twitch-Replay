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
				
				var tooltip=document.createElement("div");
				tooltip.classList.add("tooltipClean");
				div.appendChild(tooltip);
				
				$('.player-controls__right-control-group:last-child').prepend(div);


				$('.clean').hover(function(){
					$(".tooltipClean").css({"display": "block"});					
				},function(){
					$(".tooltipClean").css({"display": "none"});	
				});
				
				$(".cleanButton").css({"background-image": "url("+chrome.runtime.getURL("resources/clean-icon.png")+")"});
				$('.tooltipClean').attr('role', 'tooltip');
				$(".tooltipClean").text("Clean");
			}
			
			if(!$('.start').length){ 
				var div = document.createElement('div');
				div.classList.add("start");
				div.addEventListener("click", start);
				
				var startButton=document.createElement("button");
				startButton.classList.add("startButton");
				
				div.appendChild(startButton);
				
				var tooltip=document.createElement("div");
				tooltip.classList.add("tooltipStart");
				div.appendChild(tooltip);
				
				$('.player-controls__right-control-group:last-child').prepend(div);

				$('.start').hover(function(){
					$(".tooltipStart").css({"display": "block"});					
				},function(){
					$(".tooltipStart").css({"display": "none"});	
				});
				
				$(".startButton").css({"background-image": "url("+chrome.runtime.getURL("resources/start-icon.png")+")"});
				$('.tooltipStart').attr('role', 'tooltip');
				$(".tooltipStart").text("Start record");
				
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
		$(".startButton").css({"background-image": "url("+chrome.runtime.getURL("resources/start-icon.png")+")"});
		$(".startButton").data('state',"started");
		$(".tooltipStart").text("Start record");
	}
	else{
		$(".startButton").css({"background-image": "url("+chrome.runtime.getURL("resources/stop-icon.png")+")"});
		$(".startButton").data('state',"stopped");
		$(".tooltipStart").text("Stop record");
	}
	chrome.runtime.sendMessage({method: check}, function(response) {
	});
};

function startCounter(start, aim){
	$('.size').each(function (index) {
	    $(this).prop('Counter',start).animate({
	        Counter: aim
	    }, {
	        duration: 500,
	        easing: 'swing',
	        step: function (now) {
	            $(this).text(parseFloat(now).toFixed(1)+"mo");
	        }
	    });
	});
}	

function clean() {
	console.log("cleaning...");
	$(".size").addClass('notransition');
	$(".size").text("0mo");
	$(".size").removeClass('notransition');
	chrome.runtime.sendMessage({method: 'clean'}, function(response) {
	});
};


			
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.method == 'blobs'){
	  var size=parseFloat(request.data.toFixed(1));
	  if(!$(".size").length){
		var div=document.createElement("div");
		div.classList.add("size");

		$('.player-controls__right-control-group:last-child').prepend(div)
	  }

	$(".size").addClass('notransition');
	$(".size").removeClass('notransition');
	  startCounter(parseFloat($(".size").text()), size);
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
		
		var tooltip=document.createElement("div");
		tooltip.classList.add("tooltipDownload");
		div.appendChild(tooltip);
				
		$('.player-controls__right-control-group:last-child').prepend(div);
		
		$('.download').hover(function(){
			$(".tooltipDownload").css({"display": "block"});					
		},function(){
			$(".tooltipDownload").css({"display": "none"});	
		});
	
		$(".downloadButton").css({"background-image": "url("+chrome.runtime.getURL("resources/download-icon.png")+")"});
		$('.tooltipDownload').attr('role', 'tooltip');
		$(".tooltipDownload").text("Download record");

	  }
	sendResponse({ data: 'OK' });
  }
  else if (request.method == 'refresh') {
	pageRefreshed();
  }
  else 
	sendResponse({});
});	