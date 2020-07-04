let stopCrawler  = false;

window.onload = function() {
    if(window.location.href.includes("https://www.olx.ro/hobby-sport-turism/biciclete-fitness/biciclete/")) {
        if (!window.location.href.includes("https://www.olx.ro/hobby-sport-turism/biciclete-fitness/biciclete/?search%5Bfilter_float_price%3Afrom%5D=300&search%5Bphotos%5D=1")) {
            // apply filters    
            window.location.href = "https://www.olx.ro/hobby-sport-turism/biciclete-fitness/biciclete/?search%5Bfilter_float_price%3Afrom%5D=300&search%5Bphotos%5D=1";
            return;
        }
        /**
         * at this point, the page is listing bikes (page number is ignored). 
         * 
         * crawl_forward opens every ad and collects the data. At the end of the list, it will navigate
         * to the next page. If the current page contains ads that have been scraped, the function will 
         * return false
         */
        if (!crawl_forward()) return;
    }
};

/**
 * crawl all ads on this page and navigate forward to next page
 * (the crawler will not continue if an ad is already in the database)
 */
function crawl_forward() {
    let offers_container = document.getElementById("offers_table");

    let offers = offers_container.querySelectorAll("tr.wrap");

    offers.forEach(ad => {
        if (!ajaxStoreAd(ad)) return false;
    })

    if (stopCrawler) return false;

    // simulate user interaction with random delay
    setTimeout(() => {
        if (stopCrawler) return false;
        
        window.location.href = document.querySelector('a[data-cy="page-link-next"]').href;
        
    }, 3000 + Math.random() * 5000);

    return true;
}

/**
 * send a POST to db API with the details of an ad
 * @param {HTML object} ad one listing in olx.ro
 */
function ajaxStoreAd(ad) {
    let title = ad.querySelector("td.title-cell .linkWithHash");
    let price = ad.querySelector("p.price");
    let location = ad.querySelector('.bottom-cell small:first-child');
    let timestamp = ad.querySelector('.bottom-cell small:last-child');
    let id = ad.querySelector("table").getAttribute("data-id");

    console.log(title.textContent + ' ' + title.href);
    console.log(price.textContent + ' ' + location.textContent + ' ' + timestamp.textContent + ' ' + id  );

    payload = {
        "adId": 'olx' + id,
        "title": title.textContent,
        "url": title.href,
        "location": location.textContent,
        "price": price.textContent,
        "postedTimestamp": "2020-06-29 00:00:01",
        "active": true
            };


    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState == XMLHttpRequest.DONE) {
            console.log(xhr.response);

            if (xhr.status = 409 && JSON.parse(xhr.response).code == "ER_DUP_ENTRY") {
                // the server has signaled a duplicated ad, meaning that the crawler should stop !?
                // TODO verify above logic when ads start to be reposted

                stopCrawler = true;
            }
        }
    };
    xhr.onerror = function() {
        console.log(xhr.response);
    };
    xhr.open('POST','http://localhost:3000/ads',true);
    xhr.setRequestHeader('Content-Type', 'application/json');

    try {
    xhr.send(JSON.stringify(payload));
    }
    catch(err) {
        console.log(err);
    }

    return true;
}