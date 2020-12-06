

const web_site = document.querySelector('.web_site');
const view_code = document.querySelector('.view_code'); 
const page_view = document.querySelector('.page_view');
const page_control = document.querySelector('.page_control');
const pin = document.querySelector('.pin'); 
const create_tag =  document.querySelector('.create_tag');
const change_tag =  document.querySelector('.change_tag');
const delete_tag =  document.querySelector('.delete_tag');
const btn_tags =  document.querySelector('.tags');
const current_active_checkbox = document.querySelector('#current_active');
const copyHTML = document.querySelector('.copy_html');
const full_screen = document.querySelector('.full_screen');

let current_active = web_site;
let current_tagname = 'div';


current_active_checkbox.addEventListener('click', function(){
    all_active_tag = document.querySelectorAll('.active_tag');
    for (let i = 0; i < all_active_tag.length; i++) {
        all_active_tag[i].classList.remove('active_tag') ;            
    }
    web_site.classList.add('active_tag');        
    current_active = web_site;
    
});

web_site.addEventListener('click', function(event) {  
    target =  event.target.closest('div');
    all_active_tag = document.querySelectorAll('.active_tag');
    for (let i = 0; i < all_active_tag.length; i++) {
        all_active_tag[i].classList.remove('active_tag') ;            
    }
    target.classList.add('active_tag');    
    if (target.getAttribute('style')) {
        let split_css = target.getAttribute('style').split('; ');   
        let css_arr = [];
        for (let i = 0; i < split_css.length; i++) {
            let temp_css = split_css[i].split(': ');
            // css_arr[temp_css[0]] = temp_css[1];
            document.querySelector('input[data-tags-settings="' + temp_css[0] + '"]').value = temp_css[1];
        } 
    }
  
    current_active = target;
    current_active_checkbox.checked = false;
    
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
        web_site.style.width = "100%";
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

        let btn_tag_edit = document.querySelectorAll('.btn_tag_edit')
        for (let i = 0; i < btn_tag_edit.length; i++) {
           btn_tag_edit[i].classList.remove('hide');            
        }
        current_tagname = tag_name;
    }    
});


create_tag.addEventListener('click', function(event) {       
    let tag_name = current_tagname;
    let css = "";
    let settings =  document.querySelectorAll('.setting_' + tag_name);
    for (let i = 0; i < settings.length; i++) {
        if (settings[i].value) {
            css += settings[i].getAttribute('data-tags-settings') + ": " + settings[i].value + ";\n";
        }        
    }
   
    let tag = document.createElement(tag_name);
    tag.className = tag_name + "_block"; 
    tag.style.cssText = css;
    current_active.append(tag);        
});

change_tag.addEventListener('click', function(event) {       
    let tag_name = current_tagname;
    let css = "";
    let settings =  document.querySelectorAll('.setting_' + tag_name);
    for (let i = 0; i < settings.length; i++) {
        if (settings[i].value) {
            css += settings[i].getAttribute('data-tags-settings') + ":" + settings[i].value + ";\n";
        }        
    }
    if (current_active != web_site) current_active.style.cssText = css;     
});

delete_tag.addEventListener('click', function(event) {       
    if (current_active != web_site) current_active.remove();     
});

