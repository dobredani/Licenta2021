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
 */
function crawl_forward() {
    let offers_container = document.getElementById("offers_table");

    let offers = offers_container.querySelectorAll("tr.wrap");

    offers.forEach(ad => {
        let title = ad.querySelector("td.title-cell .linkWithHash");
        let price = ad.querySelector("p.price");
        let location = ad.querySelector('.bottom-cell small:first-child');
        let timestamp = ad.querySelector('.bottom-cell small:last-child');
        let id = ad.querySelector("table").getAttribute("data-id");

        console.log(title.textContent + ' ' + title.href);
        console.log(price.textContent + ' ' + location.textContent + ' ' + timestamp.textContent + ' ' + id  );
    })
}