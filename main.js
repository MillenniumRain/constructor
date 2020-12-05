
let fullscreen = document.querySelector('.view_code');
fullscreen.addEventListener('click', function(event) {  
    let web_site = document.querySelector('.web_site');  
    if(this.classList.contains('active')) {
        this.classList.remove('active');
        web_site.innerHTML = web_site.innerHTML.replace('<plaintext>', '');
    } else {
        this.classList.add('active');        
        web_site.innerHTML = web_site.innerHTML.replace(/            /gm, '');
        web_site.innerHTML = `<plaintext>` + web_site.innerHTML;
    }

});

let pin = document.querySelector('.pin');
pin.addEventListener('click', function(event) {    
    let web_site = document.querySelector('.web_site');
    let page_control = document.querySelector('.page_control');

    if(this.classList.contains('active')) {
        this.classList.remove('active');

    } else {
        this.classList.add('active');        

    }

});