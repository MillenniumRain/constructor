

let web_site = document.querySelector('.web_site');
let view_code = document.querySelector('.view_code'); 
let page_view = document.querySelector('.page_view');
let page_control = document.querySelector('.page_control');
let pin = document.querySelector('.pin'); 
let create_tag =  document.querySelector('.create_tag');
let btn_tags =  document.querySelector('.tags');
let current_active_checkbox = document.querySelector('#current_active');
let copyHTML = document.querySelector('.copy_html');
let full_screen = document.querySelector('.full_screen');

let current_active = web_site;
let current_tagname = 'div';


current_active_checkbox.addEventListener('click', function(){
    all_active_tag = document.querySelectorAll('.active_tag');
    for (let index = 0; index < all_active_tag.length; index++) {
        all_active_tag[index].classList.remove('active_tag') ;            
    }
    web_site.classList.add('active_tag');        
    current_active = web_site;
});

web_site.addEventListener('click', function(event) {  
    target =  event.target.closest('div');
    if(target.classList.contains('active_tag')) {
        target.classList.remove('active_tag');        
    } else {
        all_active_tag = document.querySelectorAll('.active_tag');
        for (let index = 0; index < all_active_tag.length; index++) {
            all_active_tag[index].classList.remove('active_tag') ;            
        }
        target.classList.add('active_tag');        
        current_active = target;
        current_active_checkbox.checked = false;
    }
});

//  отобразить теги
view_code.addEventListener('click', function(event) {  
    if(this.classList.contains('active')) {
        this.classList.remove('active');
        web_site.innerHTML = web_site.innerHTML.replace('<plaintext>', '');
    } else {
        this.classList.add('active');        
        web_site.innerHTML = web_site.innerHTML.replace(/            /gm, '').trim();
        web_site.innerHTML = `<plaintext>` + web_site.innerHTML;
    }
});


pin.addEventListener('click', function(event) {    
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


full_screen.addEventListener('click', function(event) {    
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


copyHTML.addEventListener('click', function() {
    if (document.querySelector('div.hide_3') == null){
        copyText = web_site.innerHTML.replace('<plaintext>', '').replace(/            /gm, '').trim();
        let textBuffer = document.getElementById("buffer"); 
        // пока оставлю так потом найду метод получше с копированием в буфер (textarea скрыто за экраном (absolute))
        textBuffer.innerHTML= copyText;

        textBuffer.select();
        document.execCommand("copy"); 
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
        
        current_tagname = tag_name;
    }    
});


create_tag.addEventListener('click', function(event) {       
        let tag_name = current_tagname;
        if (tag_name != 'h') {
            let tag = document.createElement(tag_name);
            tag.className = tag_name + "_block"; 
            tag.style.height = '300px';
            current_active.append(tag);
        }          
});

