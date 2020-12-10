const web_site = document.querySelector('.web_site');
const view_code = document.querySelector('.view_code'); 
const page_view = document.querySelector('.page_view');
const page_control = document.querySelector('.page_control');
const pin = document.querySelector('.pin'); 
const create_tag =  document.querySelector('.create_tag');
const change_tag =  document.querySelector('.change_tag');
const delete_tag =  document.querySelector('.delete_tag');
const btn_tags =  document.querySelector('.tags');
const edit_checkbox = document.querySelector('#current_active_edit');
const copyHTML = document.querySelector('.copy_html');
const active_parent = document.querySelector('.active_parent');
const full_screen = document.querySelector('.full_screen');
const group_s_input = document.querySelectorAll('.group_s input[type="text"]');
const group_s_select = document.querySelectorAll('.group_s select');


let current_active = web_site;

registerInputOnChange(group_s_input,'input');
registerInputOnChange(group_s_select,'change');



edit_checkbox.addEventListener('click', function(){
    if (current_active != web_site) {
        console.log('edit');
        change_tag.disabled = true;
    } else {
        edit_checkbox.checked = false;        
    } 
    if (!edit_checkbox.checked) change_tag.disabled = false;
});

web_site.addEventListener('click', function(event) {  
    let target =  event.target.closest('div');
    let active_tag = document.querySelector('.active_tag');

    target.classList.add('active_tag');
    if (active_tag) active_tag.classList.remove('active_tag');
    if (target == active_tag) {
        target.classList.remove('active_tag');
        current_active = web_site;
        web_site.classList.add('active_tag');
    } else {
        current_active = target;        
    }    

    if (target.getAttribute('style')) {
        let split_css = target.getAttribute('style').split(';'); 
        for (let i = 0; i < split_css.length - 1; i++) {
            let temp_css = split_css[i].split(':');
            document.querySelector('.tags_settings [data-tags-settings="' + temp_css[0].trim() + '"]').value = temp_css[1].trim();
        } 
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

active_parent.addEventListener('click', function() {
    if ((current_active != web_site)/* && (!current_active.parentElement.classList.contains('web_site'))*/) {
        current_active = current_active.parentElement;
        let active_tag = document.querySelector('.active_tag');
        if (active_tag) active_tag.classList.remove('active_tag');
        current_active.classList.add('active_tag');
    }
});