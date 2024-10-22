const web_site = document.querySelector('.web_site');
const view_code = document.querySelector('.view_code'); 
const page_view = document.querySelector('.page_view');
const page_control = document.querySelector('.page_control');
const pin = document.querySelector('.pin'); 
const create_tag =  document.querySelector('.create_tag');
const change_tag =  document.querySelector('.change_tag');
const delete_tag =  document.querySelector('.delete_tag');
const btn_tags =  document.querySelector('.tags_switcher');
const copy_html = document.querySelector('.copy_html');
const active_parent = document.querySelector('.active_parent');
const full_screen = document.querySelector('.full_screen');
const group_s_input = document.querySelectorAll('.group_s *[type="text"]');
const group_s_select = document.querySelectorAll('.group_s select');
const select_all = document.querySelector('.select_all');
const select_child = document.querySelector('.select_child');
const switch_units = document.querySelectorAll('.units .switch-units');
const copy_css = document.querySelector('.copy_css');
const paste_css = document.querySelector('.paste_css');
const copy_block = document.querySelector('.copy_block');
const paste_block = document.querySelector('.paste_block');
const popup_save = document.querySelector('.popup-save');
const popup_import = document.querySelector('.popup-import');
const save_load = document.querySelector('.save_load');
const import_export = document.querySelector('.import_export');
const save_f5 = document.querySelector('.save_f5');
const tags_buttons = document.querySelector('.tags-buttons');


let current_active = web_site;
let copied_css = ''
let current_tagname = 'div';


let blocks_settings = [];
for (let i = 0; i < setting_divs.length; i++) {
    if (setting_divs[i].dataset.tagsSettings) blocks_settings.push(setting_divs[i].dataset.tagsSettings);
}
const text_blocks = document.querySelectorAll('.texts-btns button');
let text_blocks_settings = [];
for (let i = 0; i < text_blocks.length; i++) {
    text_blocks_settings[i] = text_blocks[i].dataset.block;
}
registerInputOnChange(group_s_input,'input');
registerInputOnChange(group_s_select,'change');
colorPicker();

let copied_block = '';

copy_block.addEventListener('click', function(event){
    copied_block = current_active.outerHTML;
});
paste_block.addEventListener('click', function(event){
    current_active.innerHTML += copied_block;
});
tags_buttons.addEventListener('click', function(event){
    let target = event.target.closest('span');    
    if (target) {
        this.querySelector('.active').classList.remove('active');
        target.classList.add('active');
        let active_tag = target.dataset.tags;
        let active = document.querySelector('div.tags.hide');
        let deleted =   document.querySelector('div.tags.active');

        if (active != target) {
            active.classList.remove('hide');
            active.classList.add('active');
            deleted.classList.add('hide');       
            deleted.classList.remove('active');   
        }            
    }
});

save_f5.addEventListener('click', function(){
    let tr = this.querySelector('tr.new-input');
    let currentdate = new Date();
    let date =  currentdate.getDate() + "."
            + (currentdate.getMonth()+1)  + "." 
            + currentdate.getFullYear() + " "  
            + currentdate.getHours() + ":"  
            + currentdate.getMinutes() + ":" 
            + currentdate.getSeconds();
    let data = {};
    data.name ='save';
    data.date = date;
    data.description = 'Быстрое сохранение';
    data.html = web_site.innerHTML || 'Пустой шаблон';
    setLocalStorage(data);
});

import_export.addEventListener('click', function(){
    popup_import.style.display = "flex";
   
});
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
popup_import.addEventListener('click', function(event){
    let close = event.target.closest('div.close-popup');
    let importSite = event.target.closest('button.data-import');    
    let exportSite = event.target.closest('button.data-export');
    let data_head = this.querySelector('.data-head .center');
    let import_html_css = event.target.closest('.import-html-css'); 
   
   
    if (importSite) {        
        importSite.setAttribute('disabled', 'disabled');
        this.querySelector('button.data-export').removeAttribute('disabled', 'disabled');
        this.querySelector('.import').classList.remove('hide');
        this.querySelector('.export').classList.add('hide');
        data_head.innerHTML = 'Import';

    }
    if (exportSite) {
        exportSite.setAttribute('disabled', 'disabled');
        this.querySelector('button.data-import').removeAttribute('disabled');
        this.querySelector('.import').classList.add('hide');
        this.querySelector('.export').classList.remove('hide');
        data_head.innerHTML = 'Export';
    }
    if (import_html_css) {
        let textarea_html = document.querySelector('.textarea-html');
        let textarea_css = document.querySelector('.textarea-css');
        web_site.innerHTML = textarea_html.value;

        //  https://regex101.com/r/44HC7D/3
        // \.((?!:).)*{[^}]*} на данный момент практически делает то что нужно
        let style = '<style type="text/css"></style>';
        css_list = textarea_css.value;
        css_list_clean = css_list.replace(/\/\*[\S\s]+?\*\//g, '');
        css_list_media  = css_list_clean.match(/@media[\S\s]+?}([\s]|)+?}/g, ''); // получаем все что в медии 
        css_list = css_list_clean.replace(/@media[\S\s]+?}([\s]|)+?}/g, ''); // заменяем 
        css_set = css_list.split('}');
        web_site.innerHTML = style + web_site.innerHTML;
        for (let i = 0; i < css_set.length - 1; i++) {
            let block = css_set[i].split('{');
            let name = block[0].trim();
            let css = block[1].trim();
            if (name.search(':') > -1 ){ // :nth-child по хорошему такие варианты тоже надо учитывать(отдельно)
                web_site.querySelector('style').innerHTML += css_set[i].trim() + "\n}\n" 
            } else if(name.search('@') > -1) {
                web_site.querySelector('style').innerHTML += css_set[i].trim() + "\n}\n" 
            }
            else if(name.search(/\*/) > -1) {
                web_site.querySelector('style').innerHTML += '.web-site ' + css_set[i].trim() + "\n}" 
            } else {
               let styles =  web_site.querySelectorAll(name);      
               for (let j = 0; j < styles.length; j++) {
                styles[j].style.cssText =  css;                   
               }  
            }
        }
        // вставка медиа не работает корректно, то что сейчас вставляем в стили в сами тэги перебивает то что кладется в style, нужно лучше обрабатывать css сайтик ломается)
        for (let i = 0; i < css_list_media.length; i++) {
            web_site.querySelector('style').innerHTML += css_list_media[i].trim() + "\n"
        }
        
        if (view_code.classList.contains('active')) structureContainerUpdate();
        close = true;
    }
    if ((close) || (event.target == this)) {
        this.style.display = 'none';
        this.querySelector('textarea').innerHTML = '';
    } 
});
popup_save.addEventListener('click', function(event){
    let close = event.target.closest('div.close-popup');
    let save = event.target.closest('button.data-save');    
    let clear = event.target.closest('button.data-clear');

    let load = event.target.closest('button.data-load');
    let tr_click = event.target.closest('tbody tr');


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
        let template = getLocalStorage();
        let tr_clicked = this.querySelector('tr.active');
        if (tr_clicked) {
            let save = tr_clicked.nextElementSibling.value;
            web_site.innerHTML = template[save]['html'];
            close = true;
        }
        
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
    
    if ((close) || (event.target == this)) {
        this.style.display = 'none';
        this.querySelector('tbody').innerHTML = '';
        this.querySelector('.data-save').classList.remove('active');

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
    current_active.classList.remove('active_tag');
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
        this.checked = false;        
    } 
    if (!this.checked) change_tag.disabled = false;
});



web_site.addEventListener('dblclick', function (event) {
    let target =  event.target;
    editCurrentActive(target);

  });
web_site.addEventListener('click', function(event) {  
    let target =  event.target;
    let active_tag = document.querySelector('.active_tag');
    let active_tag_edit = document.querySelector('.active_tag');

   
    
    if (target != active_tag) {        
        if (active_tag_edit) active_tag_edit.classList.remove('active_tag_edit');
        current_active_edit.checked = false;
        if (event.ctrlKey) {
            event.preventDefault();
            current_active_edit.checked = true;             
        } else {
            let active_tags = document.querySelectorAll('.active_tag');
            if (active_tags) {
                for (let i = 0; i < active_tags.length; i++) {
                    active_tags[i].classList.remove('active_tag');                    
                }                
            }
        }    
        document.querySelector('.tag_name').innerHTML = target.tagName;   
    } 
    target.classList.add('active_tag');
    current_active = target;
    current_tagname = target.tagName.toLowerCase();
    if (target.textContent && target.textContent == target.innerHTML) document.querySelector('.group_s textarea').value = target.textContent;
    if (target.getAttribute('style')) {
        let split_css = target.getAttribute('style').split(';'); 
        let temp_settings = []
        for (let i = 0; i < split_css.length - 1; i++) {
            let temp_css = split_css[i].split(':');
            temp_settings.push(temp_css[0].trim());
           let tags_settings =  document.querySelector('.tags_settings [data-tags-settings="' + temp_css[0].trim() + '"]');
           if (tags_settings) tags_settings.value = temp_css[1].trim();
        } 
        for (let i = 0; i < blocks_settings.length; i++) {
            if (temp_settings.indexOf(blocks_settings[i]) == -1) {
                document.querySelector('.tags_settings [data-tags-settings="' + blocks_settings[i] + '"]').value = '';
            }
            
        }
    }    
});

//  отобразить теги
view_code.addEventListener('click', function(event) {  
    let structure_container = document.querySelector('.structure_container');
    if (!this.classList.contains('active')) {
        this.classList.add('active');
        structureContainerUpdate();
    } else {
        this.classList.remove('active');
        document.querySelector('.div-settings').style.height = 'auto';
        structure_container.classList.add('hide');
        structure_container.innerHTML = '';
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

        let active = document.querySelector('.btn_tags.active');
        active.classList.remove('active');
        button.classList.add('active');       
        current_tagname = tag_name;
    }    
});


create_tag.addEventListener('click', function(event) {       
    let tag_name = current_tagname;
    let css = "";
    let settings =  document.querySelectorAll('.setting_div');
    for (let i = 0; i < settings.length; i++) {
        if (settings[i].value) {
            if (settings[i].tagName != 'TEXTAREA') {
                css += settings[i].getAttribute('data-tags-settings') + ": " + settings[i].value + ";\n";
            }
        }
    }
    
    

    let tag = document.createElement(tag_name);
    tag.className = tag_name + "_block"; 
    tag.style.cssText = css;
    tag.textContent = document.querySelector('.group_s textarea').value;
    let structure_container = document.querySelector('.structure_container');
    if (structure_container.innerHTML != '') setTimeout(structureContainerUpdate, 0 );
    
    current_active.append(tag);        
});

change_tag.addEventListener('click', function(event) {       
    let tag_name = current_tagname;
    let css = "";
    let settings = document.querySelectorAll('.setting_div');;
    for (let i = 0; i < settings.length; i++) { // меняется css текущего и единственного текущего
        if (settings[i].value) {
            current_active.style[settings[i].getAttribute('data-tags-settings')] = settings[i].value;
        }        
    }
    if (text_blocks_settings.indexOf(tag_name) > -1){
        let current_actives = document.querySelectorAll('.active_tag');
        for (var i=0, max=current_actives.length; i < max; i++) {
            current_actives[i].innerHTML = document.querySelector('.group_s textarea').value;
        }
    }
});

delete_tag.addEventListener('click', function(event) {       
    
    let active_tags = document.querySelectorAll('.active_tag');
    if (active_tags) {
        for (let i = 0; i < active_tags.length; i++) {
            if (active_tags[i] != web_site) active_tags[i].remove('active_tag');                    
        }                
    }   
});


active_parent.addEventListener('click', function() {
    if ((current_active != web_site)/* && (!current_active.parentElement.classList.contains('web_site'))*/) {
        current_active = current_active.parentElement;
        let active_tag = document.querySelector('.active_tag');
        if (active_tag) active_tag.classList.remove('active_tag');
        current_active.classList.add('active_tag');
    }
});

const resize_page_control = document.querySelector('.resize_page_control');
resize_page_control.onmousedown = function(event) {
    event.preventDefault();
    let resizer = this;
    let shiftX = event.clientX - resizer.getBoundingClientRect().left;
  console.log(shiftX, event.clientX, resizer.getBoundingClientRect().left)
  
    moveAt(event.pageX);
  
    function moveAt(pageX) {
        page_view.style.width = (pageX - shiftX)/window.innerWidth*100 + '%';
        page_control.style.width = (window.innerWidth - pageX + shiftX)/window.innerWidth*100 + '%';
    }
  
    function onMouseMove(event) {
      moveAt(event.pageX, event.pageY);
    }
  
    // передвигаем мяч при событии mousemove
    document.addEventListener('mousemove', onMouseMove);
  
    // отпустить мяч, удалить ненужные обработчики
    document.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      resizer.onmouseup = null;
    };
    resizer.ondragstart = function() {
        return false;
    };
  };
  
 