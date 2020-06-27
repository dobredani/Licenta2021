document.addEventListener('DOMContentLoaded', function(){

    var input = document.getElementById('toggle-scraper');

    // set the initial state of the checkbox
    chrome.storage.sync.get("scrape_olx", function(data){
        if (data["scrape_olx"]){
            input.checked = true;
        } else {
            input.checked = false;
        }
      });


    input.addEventListener("change", function(){
        chrome.storage.sync.set({scrape_olx: input.checked});
    });


});