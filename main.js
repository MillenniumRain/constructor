
let fullscreen = document.querySelector('.view_code'); //  отобразить теги
fullscreen.addEventListener('click', function(event) {  
    let web_site = document.querySelector('.web_site');  
    if(this.classList.contains('active')) {
        this.classList.remove('active');
        web_site.innerHTML = web_site.innerHTML.replace('<plaintext>', '');
    } else {
        this.classList.add('active');        
        web_site.innerHTML = web_site.innerHTML.replace(/            /gm, '').trim();
        web_site.innerHTML = `<plaintext>` + web_site.innerHTML;
    }
});

let pin = document.querySelector('.pin'); //  закрепить
pin.addEventListener('click', function(event) {    
    let page_view = document.querySelector('.page_view');
    let page_control = document.querySelector('.page_control');

    if(this.classList.contains('active')) {
        this.classList.remove('active');
        page_view.style.width = "65%";
        page_control.style.position = 'unset';
    } else {
        this.classList.add('active'); 
        page_view.style.width = "100%";
        page_control.style.position = 'fixed';
        page_control.style.right = '0';

    }
});

let full_screen = document.querySelector('.full_screen'); //  фулскрин
full_screen.addEventListener('click', function(event) {    
    let page_view = document.querySelector('.page_view');
    let web_site = document.querySelector('.web_site');
    let page_control = document.querySelector('.page_control');
    let right = page_control.querySelector('.attach .full_screen');

    if(this.classList.contains('active')) {
        this.classList.remove('active');
        page_view.style.width = "65%";
        web_site.style.width = "90%";
        page_control.style.display = 'block';
        page_control.style.visibility = 'visible';
        page_control.style.position = 'unset';     
        right.style.position = 'unset';   
    } else {
        this.classList.add('active'); 
        page_view.style.width = "100%";
        web_site.style.width = "100%";
        page_control.style.visibility = 'hidden';
        page_control.style.position = 'absolute';
        page_control.style.right = '100%';
        right.style.visibility = 'visible';       
        right.style.position = 'fixed'; 
        right.style.right = '0';      

    }
});

let copyHTML = document.querySelector('.copy_html'); // копирование  html
copyHTML.addEventListener('click', function() {
    if (document.querySelector('div.hide_3') == null){
        let web_site = document.querySelector('.web_site');
        copyText = web_site.innerHTML.replace('<plaintext>', '').replace(/            /gm, '').trim();
        let textBuffer = document.getElementById("buffer"); 
        // пока оставлю так потом найду метод получше с копированием в буфер (textarea скрыто за экраном (absolute))
        textBuffer.innerHTML= copyText;

        textBuffer.select();
        document.execCommand("copy"); 
        let page_control = document.querySelector('.attach .left');
        let copied = document.createElement('div');
        copied.className = "hide_3";
        copied.innerHTML = "Скопировано!";
        page_control.append(copied);
        textBuffer.innerHTML= '';
        setTimeout(function() {
            copied.remove();
        }, 1000, copied);
    }
});

let btn_tags =  document.querySelector('.tags');
btn_tags.addEventListener('click', function(event) {
    if (event.target.closest('button')) {        
        button = event.target.closest('button');
        let  tag_name = button.dataset.block;

        let tags_settings_all =  document.querySelectorAll('.tags_settings');
        for (let i = 0; i < tags_settings_all.length; i++) {
            tags_settings_all[i].classList.add('hide');            
        }
        let tags_settings =  document.querySelector('.tags_settings.' + tag_name);
        tags_settings.classList.remove('hide');
        
        window.current_tagname = tag_name;
    }    
});

let create_tag =  document.querySelector('.create_tag');
create_tag.addEventListener('click', function(event) {
        let web_site = document.querySelector('.web_site');
        let tag_name = window.current_tagname
        if (tag_name != 'h') {
            let tag = document.createElement(tag_name);
            tag.className = tag_name + "_block"; // вставить имя тэка
            tag.style.height = '300px';

            web_site.append(tag);
        }    
      
});

