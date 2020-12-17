let input_units = document.querySelectorAll('[data-units="1"]');
let input_counter = 0;
for (let i = 0; i < input_units.length; i++) {
    let new_block = document.createElement('div');
    if(input_units[i].classList.length) new_block.classList.add(input_units[i].classList);
    new_block.classList.add('units');
    let input = input_units[i].outerHTML;
    let symbol  = input_units[i].value.match(/\D+/) || "px";
    new_block.innerHTML = `
    <input class="switch-units" id="switch-units${++input_counter}" name="switch-units${i}" type="radio" ${symbol == "px"?'checked="checked"':''}><label class="switch-left" for="switch-units${input_counter}">px</label>
    ${input}
    <input class="switch-units" id="switch-units${++input_counter}" name="switch-units${i}" type="radio" ${symbol == "%"?'checked="checked"':''}><label class="switch-right" for="switch-units${input_counter}">%</label>
    `;
    input_units[i].replaceWith(new_block);
}
const setting_divs = document.querySelectorAll('.setting_div');
for (let i = 0; i < setting_divs.length; i++) {
    setting_divs[i].outerHTML = '<div class="icon trash">'+ bucket + '</div>' + setting_divs[i].outerHTML 
}
const clear_input = document.querySelectorAll('.icon.trash');
for (let i = 0; i < clear_input.length; i++) {
    clear_input[i].addEventListener('click', function(){
        let next = this.nextSibling;
        if (next.tagName == "DIV") {
            next.querySelector('input[type="text"]').value = '';
        } else if (next.tagName == "SELECT") {
            next.selectedIndex = 0;
        } else if (next.classList.contains('center')) {
            let four_sides = next.parentElement.querySelectorAll('input[type="text"]');
            for (let j = 0; j < four_sides.length; j++) {
                four_sides[j].value = '';
            }
        } else {
            next.value = '';
        }
        console.log();
    });
}


const edit_checkbox = document.querySelector('#current_active_edit');
// functions
function registerInputOnChange(object, event_on){
    for (let i = 0; i < object.length; i++) {   
        object[i].addEventListener(event_on, function(event){            
            if ((this.tagName == 'INPUT') && (this.parentElement.classList.contains('units'))){
                let checked_unit = this.parentElement.querySelector('input:checked').nextSibling.innerText;
                let unit_reg = this.value.match(/\D+/);
                let unit = unit_reg ? unit_reg[0] : '' || checked_unit;
                let number = this.value.replace(/\D+/g, '');
                if ((unit != '%') && (unit != 'px')) {
                    unit = unit.replace('%','');
                    this.value = number ? number + unit : '';
                } else {
                    str = this.value.replace(unit, '');
                    if (number){
                        this.value = number + unit;
                        this.setSelectionRange(number.length, number.length);
                    }                    
                }
            }    
            fourSidesTogetherUpdate(this);
            if (edit_checkbox.checked) {
                let current_actives = document.querySelectorAll('.active_tag');
                let css_text = this.value;
                let css = this.getAttribute('data-tags-settings');
                for (let i = 0; i < current_actives.length; i++) {
                    current_actives[i].style[css] = css_text;                   
                }
                
            }        
        });
    }
}
function deleteSaveLocalStorage(save, key='constructorSite'){
    let local_data = getLocalStorage(); 
    delete local_data[save];
    forJson = local_data || {};
    localStorage.setItem(key, JSON.stringify(forJson));
}
function setLocalStorage(data, key='constructorSite'){
    
    let local_data = getLocalStorage(); 
    let arr = local_data ? Object.keys(local_data) : [];   
    forJson = local_data|| {};
    let counter = parseInt(localStorage.getItem('constructorSiteCounter')) + 1; // localStorage.setItem('constructorSiteCounter', 0);
    localStorage.setItem('constructorSiteCounter', counter)
    let name = 's' + counter;
    forJson[name] = data;
    localStorage.setItem(key, JSON.stringify(forJson));
    return name;
}
function getLocalStorage(key='constructorSite'){
   let json_data = localStorage.getItem(key);
   data = JSON.parse(json_data);  
   return data;  
}

function triggerInput(element) {
    var event = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    element.dispatchEvent(event);
}

function fourSidesTogetherUpdate(object) {
    let setting_mp = object.parentElement.parentElement;
    if (setting_mp.classList.contains('settings-mp') ) {
        let center = setting_mp.querySelector('input.center');
        let settings = setting_mp.querySelectorAll('.units input[type="text"]');
        center.value = (settings[1].value || '0px') + " " + (settings[2].value || '0px') + " " + (settings[3].value || '0px') + " " + (settings[0].value || '0px');       
        triggerInput(center);
    }
}

function copyHtml(copyText){    
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

function colorPicker(){
    
    let context, gradient, hue;
    let canvas = document.querySelector('canvas.color-line');
    let w = canvas.width;
    let h = canvas.height;
    context = canvas.getContext("2d");
    gradient = context.createLinearGradient(w / 2, h, w / 2, 0);

    hue = [[255, 0, 0], [255, 255, 0], [0, 255, 0], [0, 255, 255], [0, 0, 255], [255, 0, 255], [255, 0, 0]];
    for (var i = 0; i <= 6; i++) {
        color = 'rgb(' + hue[i][0] + ',' + hue[i][1] + ',' + hue[i][2] + ')';
        gradient.addColorStop(i * 1 / 6, color);
    };
    context.fillStyle = gradient;
    context.fillRect(0, 0, w, h);

    const colorPickerSquare = document.querySelector('.picker .square');
    const blockPicker = document.querySelector('.block_picker');
    const colorText = document.querySelector('.color-text');
    const colorView = document.querySelector('.color-view');
    blockPicker.querySelector('.bk_img').draggable = false;
    let V = 100;
    let S = 0;
    let H = 0
    colorPickerSquare.onmousedown = function(e){
        let square = this;  
        let square_xy = square.getBoundingClientRect(); 
        
        boundX = square_xy.x - square.offsetLeft; 
        boundY = square_xy.y - square.offsetTop;  
        document.onmousemove = function(e) {     
            e.preventDefault();        
            let x = Math.round(e.pageX - boundX) - square.clientWidth/2;
            if (x < 0 ) x = 0;
            if (x + square.clientWidth > blockPicker.clientWidth  ) x = blockPicker.clientWidth  - square.clientWidth ;
    
            let y = Math.round(e.pageY - boundY) - square.clientHeight/2;
            if (y < 0 ) y = 0;
            if (y + square.clientHeight > blockPicker.clientHeight ) y = blockPicker.clientHeight - square.clientHeight ;
    
            square.style.position = 'absolute';
            square.style.left = x + 'px';
            square.style.top = y + 'px';

            S = square.offsetLeft * 100 / (blockPicker.clientWidth - square.clientWidth);
            V = 100 - square.offsetTop * 100 / (blockPicker.clientHeight - square.clientHeight);
            S = Math.round(S);
            V = Math.round(V);
            
            let rgb = 'rgb(' + hsvToRgb(H, S, V).join() + ')'; 
            colorText.value =  rgb;
            colorView.style.background =  rgb;        
            changeColor(rgb);    
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            this.onmouseup = null;
        };

       
    };   
        
    const arrows= document.querySelector('.picker .arrows');
    arrows.onmousedown = function(e){
        let arrows = this;  
        let arrows_xy = arrows.getBoundingClientRect(); 
        
        boundX = arrows_xy.x - arrows.offsetLeft; 
        boundY = arrows_xy.y - arrows.offsetTop;  
        document.onmousemove = function(e) {             
            e.preventDefault();
            let y = Math.round(e.pageY - boundY) - arrows.clientHeight/2;
            if (y < 0 ) y = 0;
            if (y + arrows.clientHeight > blockPicker.clientHeight ) y = blockPicker.clientHeight - arrows.clientHeight ;
    
            arrows.style.position = 'absolute';
            arrows.style.top = y + 'px';
            let maxH = canvas.clientHeight - arrows.clientHeight;
            H = 360 - arrows.offsetTop  / (canvas.clientHeight - arrows.clientHeight) * 360
            H = Math.round(H);
            if (H == 360) H = 0
            let rgb = 'rgb(' + hsvToRgb(H, S, V).join() + ')'; 
            colorText.value =  rgb;
            blockPicker.style.background = 'rgb(' + hsvToRgb(H, 100, 100).join() + ')';
            colorView.style.background =  rgb;
            changeColor(rgb);
        };
        document.onmouseup = function() {
            document.onmousemove = null;
            this.onmouseup = null;
        };
    };
    function changeColor(rgb) {
        let input_color = document.querySelectorAll('input.color');
        for (let i = 0; i < input_color.length; i++) {
            let check = input_color[i].checked;
            if (check) input_color[i].previousElementSibling.value = rgb;
            if (edit_checkbox.checked) triggerInput(input_color[i].previousElementSibling);
        }
    }
    function hsvToRgb (H,S,V){
        var f , p, q , t, lH;
    
        S /=100;
        V /=100;
        
        lH = Math.floor(H / 60);
        
        f = H/60 - lH;
                    
        p = V * (1 - S); 
                        
        q = V *(1 - S*f);
            
        t = V* (1 - (1-f)* S);
        
        switch (lH){            
            case 0: R = V; G = t; B = p; break;
            case 1: R = q; G = V; B = p; break;
            case 2: R = p; G = V; B = t; break;
            case 3: R = p; G = q; B = V; break;
            case 4: R = t; G = p; B = V; break;
            case 5: R = V; G = p; B = q; break;
        }
        return [parseInt(R*255), parseInt(G*255), parseInt(B*255)];
    }
}