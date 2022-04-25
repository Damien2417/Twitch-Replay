  //the event occurred
$(window).on('load', function() {
	if($('.player-controls__right-control-group').length){ 
		if(!$('#clean').length){ 
			var button2=document.createElement("button");
			button2.id="clean"
			button2.innerText="Clean"; 
			$('.player-controls__right-control-group:last-child').prepend(button2);
			$("#clean").css({"margin-left": "2%","margin-right": "1%","color":"white"});
		}
		
		if(!$('#start').length){ 
			var button2=document.createElement("button");
			button2.id="start"
			button2.innerText="Start"; 
			$('.player-controls__right-control-group:last-child').prepend(button2);
			$("#start").css({"margin-left": "3%","color":"white"});
		}
		//$('[data-toggle="popover"]').popover();
		document.getElementById("start").addEventListener('click', start);
		document.getElementById("clean").addEventListener('click', clean);	

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		  if (request.method == 'blobs'){
			  var size=parseFloat(request.data.toFixed(1));
			  if(!$("#size").length){
				var div=document.createElement("div");
				div.id="size";
				div.innerText="0mo";				

				$('.player-controls__right-control-group:last-child').prepend(div)
				$("#size").css({"margin-left": "1%","color":"white"});
			  }
			  $("#size").text(size+"mo");
			  
			  if(!$(".download").length){
				var button=document.createElement("button");
				button.id="video"+request.data2;

				button.innerText="Download ";
								
				button.classList.add("download");
				button.addEventListener("click", function() {
					downloadManager(button.id);
				});
				$('.player-controls__right-control-group:last-child').prepend(button)
				$("#video"+request.data2).css({"color":"white"});
			  }
			sendResponse({ data: 'OK' });
		  }
		  else 
			sendResponse({});
		});	
	}
});


	
		
function start(){
	let check="start";
	if($("#start").text()=="Stop"){
		check="stop";
		$("#start").text("Start");
	}
	else
		$("#start").text("Stop");
	chrome.runtime.sendMessage({method: check}, function(response) {
    });
}

function clean(){
	console.log("cleaning...");
	$("#size").text("0mo");
	chrome.runtime.sendMessage({method: 'clean'}, function(response) {
    });
	//document.getElementById("urls").innerHTML="";
}
function downloadManager(idToDownload){
	console.log("downloading...");
	chrome.runtime.sendMessage({method: 'download',id:idToDownload}, function(response) {
    });
}