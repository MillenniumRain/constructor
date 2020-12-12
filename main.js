const web_site = document.querySelector('.web_site');
const view_code = document.querySelector('.view_code'); 
const page_view = document.querySelector('.page_view');
const page_control = document.querySelector('.page_control');
const pin = document.querySelector('.pin'); 
const create_tag =  document.querySelector('.create_tag');
const change_tag =  document.querySelector('.change_tag');
const delete_tag =  document.querySelector('.delete_tag');
const btn_tags =  document.querySelector('.tags');
const copy_html = document.querySelector('.copy_html');
const active_parent = document.querySelector('.active_parent');
const full_screen = document.querySelector('.full_screen');
const group_s_input = document.querySelectorAll('.group_s input[type="text"]');
const group_s_select = document.querySelectorAll('.group_s select');
const select_all = document.querySelector('.select_all');
const select_child = document.querySelector('.select_child');
const switch_units = document.querySelectorAll('.units .switch-units');
const copy_css = document.querySelector('.copy_css');
const paste_css = document.querySelector('.paste_css');
const popup_save = document.querySelector('.popup-save');
const save_load = document.querySelector('.save_load');



let current_active = web_site;
let copied_css = ''

registerInputOnChange(group_s_input,'input');
registerInputOnChange(group_s_select,'change');
colorPicker();


save_load.addEventListener('click', function(){
    popup_save.style.display = "flex";
    let table = popup_save.querySelector('.data-body>.saves tbody');
    data = getLocalStorage();
    for (var saves in data) {
        let tr = `<tr>
        <td>${data[saves]['name']}  
        </td>
        <td class="date">${data[saves]['date']}</td>   
        <td>${data[saves]['description']}
        </tr><input name="saveId" type=""hidden value="${saves}">`;
        table.innerHTML = tr + table.innerHTML;
    }    
});

popup_save.addEventListener('click', function(event){
    let close = event.target.closest('div.close-save-popup');
    let save = event.target.closest('button.data-save');    
    let clear = event.target.closest('button.data-clear');

    let load = event.target.closest('button.data-save');
    let tr_click = event.target.closest('tr');


    if ((close) || (event.target == this)) {
        this.style.display = 'none';
        popup_save.querySelector('tbody').innerHTML = '<tr><td colspan="3" style="white-space: break-spaces;font-size: 10px;font-style: italic;color: #888888;">Ограничение хранения 5 мб(когда-нибудь будет это серверная часть)</td></tr>';
    } 
    if (save) {
        let currentdate = new Date();
        let date =  currentdate.getDate() + "."
                        + (currentdate.getMonth()+1)  + "." 
                        + currentdate.getFullYear() + " "  
                        + currentdate.getHours() + ":"  
                        + currentdate.getMinutes() + ":" 
                        + currentdate.getSeconds();
        let table = this.querySelector('.data-body>.saves tbody');

        if (save.classList.contains('active')) save.classList.remove('active');
        else save.classList.add('active');


        if (save.classList.contains('active')) {                      
            save.innerText = 'Save';           
            let tr = `<tr class="new-input"><td><input class="clear" name="name" autocomplete="off"></td>   <td class="date">${date}</td>   <td><input class="clear" name="description" autocomplete="off"></tr>`;
            table.innerHTML = tr + table.innerHTML;
            let input = this.querySelector('input.clear[name="name"]');
            input.focus();
        } else  {     
            let tr = this.querySelector('tr.new-input');
            let input_name = tr.querySelector('input.clear[name="name"]');
            let input_description = tr.querySelector('input.clear[name="description"]');
            let data = {};
            data.name = input_name.value || 'save';
            data.date = date;
            data.description = input_description.value;
            data.html = web_site.innerHTML || 'Пустой шаблон';

            input_name.parentElement.innerHTML = input_name.value || 'save';
            input_description.parentElement.innerHTML = input_description.value;
            let id = setLocalStorage(data);
            tr.outerHTML += `<input name="saveId" type="" hidden="" value="${id}">`
            save.innerText = '+';
        }          
    }
    if (load){
        
    }
    if (tr_click){
        if (tr_click.classList.contains('active')) tr_click.classList.remove('active');
        else tr_click.classList.add('active');
    }
    if (clear) { 
        let tr_clicked = this.querySelectorAll('tr.active');
        for (let i = 0; i < tr_clicked.length; i++) {     
            let input = tr_clicked[i].nextElementSibling;        
            deleteSaveLocalStorage(input.value);
            input.outerHTML = '';
            tr_clicked[i].outerHTML = '';
            
            // localStorage.removeItem('constructorSite');
        }
        
    }
});
copy_css.addEventListener('click', function(){
    copied_css = current_active.getAttribute('style');
});
paste_css.addEventListener('click', function(){
    let current_actives = document.querySelectorAll('.active_tag');
    for (var i=0, max=current_actives.length; i < max; i++) {
        current_actives[i].setAttribute('style', copied_css);
    }
});
select_child.addEventListener('click', function(){
    let all = current_active.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        all[i].classList.add('active_tag');
        current_active_edit.checked = true;
    }
});

select_all.addEventListener('click', function(){
    let all = web_site.getElementsByTagName("*");
    for (var i=0, max=all.length; i < max; i++) {
        all[i].classList.add('active_tag');
        current_active_edit.checked = true;
    }
});

for (let i = 0; i < switch_units.length; i++) {
    switch_units[i].addEventListener('change', function(){
        let input = this.parentElement.querySelector('input[type="text"]');
        let num  = input.value.match(/\d+/);
        if (num) input.value = num + this.nextSibling.innerText;
        fourSidesTogetherUpdate(this);
        if (edit_checkbox.checked) {
            let current_actives = document.querySelectorAll('.active_tag');
            for (let i = 0; i < current_actives.length; i++) {
                current_actives[i].style[input.getAttribute('data-tags-settings')] = input.value;                
            }
        }
    });    
}
edit_checkbox.addEventListener('click', function(){
    if (current_active != web_site) {
        change_tag.disabled = true;
    } else {
        edit_checkbox.checked = false;        
    } 
    if (!edit_checkbox.checked) change_tag.disabled = false;
});

web_site.addEventListener('dblclick', function (event) {
    let target =  event.target.closest('div');
    let active_tag_edit = document.querySelector('.active_tag');
    if (active_tag_edit) active_tag_edit.classList.remove('active_tag_edit');
        // target.classList.add('active_tag_edit');
    if (target.classList.contains('active_tag_edit')) {
        target.classList.remove('active_tag_edit');
        current_active_edit.checked = false;
    } else {
        target.classList.add('active_tag_edit');     
        current_active_edit.checked = true; 
       
    } 
    current_active = target;

  });
web_site.addEventListener('click', function(event) {  
    let target =  event.target.closest('div');
    let active_tag = document.querySelector('.active_tag');
    let active_tag_edit = document.querySelector('.active_tag');

   
    
    if (target != active_tag) {        
        if (active_tag_edit) active_tag_edit.classList.remove('active_tag_edit');
        current_active_edit.checked = false;
        if (event.ctrlKey) {
            current_active_edit.checked = true;             
        } else {
            let active_tags = document.querySelectorAll('.active_tag');
            if (active_tags) {
                for (let i = 0; i < active_tags.length; i++) {
                    active_tags[i].classList.remove('active_tag');                    
                }                
            }
        }          
    } 
    target.classList.add('active_tag');
    current_active = target;

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


copy_html.addEventListener('click', function() {
    if (document.querySelector('div.hide_3') == null){
        let copyText = web_site.innerHTML.replace('<plaintext>', '').replace(/            /gm, '').trim();
        copyHtml(copyText);
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