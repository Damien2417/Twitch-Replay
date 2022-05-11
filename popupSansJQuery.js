  //the event occurred
window.addEventListener("load", function() {
	if(document.getElementsByClassName('player-controls__right-control-group').length){
		var buttonStart;
		var buttonClean;
		var buttonDownload;
		var divSize;
		if(!document.getElementsByClassName('clean')){ 
			buttonClean=document.createElement("button");
			buttonClean.classList.add("clean");
			buttonClean.innerText="Clean"; 
			document.querySelector('.player-controls__right-control-group').insertBefore(button2,document.getElementsByClassName('player-controls__right-control-group').lastChild);
			buttonClean.setAttribute("style", "margin-left:2%;");
			buttonClean.setAttribute("style", "margin-right:1%;");
			buttonClean.setAttribute("style", "color:white;");
		}
		
		if(!document.getElementsByClassName('start').length){ 
			buttonStart=document.createElement("button");
			buttonStart.classList.add("start");
			buttonStart.innerText="Start"; 
			document.querySelector('.player-controls__right-control-group').insertBefore(buttonStart,document.getElementsByClassName('player-controls__right-control-group').lastChild);
			buttonStart.setAttribute("style", "margin-left:3%;");
			buttonStart.setAttribute("style", "color:white;");
		}
		//$('[data-toggle="popover"]').popover();
		buttonStart.addEventListener("click", function() {
			console.log("start");
			let check="start";
			if(this.text()=="Stop"){
				check="stop";
				this.text("Start");
			}
			else
				this.text("Stop");
			chrome.runtime.sendMessage({method: check}, function(response) {
			});
		});

		document.querySelectorAll('.clean').forEach(item => {
		  item.addEventListener('click', event => {
			console.log("cleaning...");
			this.text("0mo");
			chrome.runtime.sendMessage({method: 'clean'}, function(response) {
			});
		  })
		})

		chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
		  if (request.method == 'blobs'){
			  var size=parseFloat(request.data.toFixed(1));
			  if(!document.getElementsByClassName("size").length){
				divSize=document.createElement("div");
				divSize.classList.add("size");
				divSize.innerText="0mo";				

				document.querySelector('.player-controls__right-control-group').insertBefore(divSize,document.getElementsByClassName('player-controls__right-control-group').lastChild);
				document.getElementsByClassName("size")[0].setAttribute("style", "margin-left:1%;");
				document.getElementsByClassName("size")[0].setAttribute("style", "color:white;");
			  }
			  document.getElementsByClassName("size").text(size+"mo");
			  
			  if(!document.getElementsByClassName("download").length){
				buttonDownload=document.createElement("button");
				buttonDownload.id="video"+request.data2;

				buttonDownload.innerText="Download ";
								
				buttonDownload.classList.add("download");
				buttonDownload.addEventListener("click", function() {
					console.log("downloading...");
					chrome.runtime.sendMessage({method: 'download',id:buttonDownload.id}, function(response) {
					});
				});
				document.querySelector('.player-controls__right-control-group').insertBefore(buttonDownload,document.getElementsByClassName('player-controls__right-control-group').lastChild);
				document.getElementById("video"+request.data2).setAttribute("style", "color:white;");
			  }
			sendResponse({ data: 'OK' });
		  }
		  else 
			sendResponse({});
		});	
	}
});

