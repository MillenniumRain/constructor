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

let switch_units = document.querySelectorAll('.units .switch-units');
for (let i = 0; i < switch_units.length; i++) {
    switch_units[i].addEventListener('change', function(){
        let input = this.parentElement.querySelector('input[type="text"]');
        let num  = input.value.match(/\d+/);
        if (num) input.value = num + this.nextSibling.innerText;
    });    
}






// functions
function registerInputOnChange(object, event_on){
    for (let i = 0; i < object.length; i++) {   
        object[i].addEventListener(event_on, function(event){            
            if (this.tagName == 'INPUT'){
                let checked_unit = this.parentElement.querySelector('input:checked').nextSibling.innerText;
                let unit_reg = this.value.match(/\D+/);
                let unit = unit_reg ? unit_reg[0] : '' || checked_unit;
                let number = this.value.match(/\d+/)[0];
                if ((unit != '%') && (unit != 'px')) {
                    unit = unit.replace('%','');
                    this.value = number + unit;
                } else {
                    str = this.value.replace(unit, '');
                    this.value = number + unit;
                    this.setSelectionRange(number.length, number.length);
                }
            }
            if (edit_checkbox.checked) {
                let css_text = this.value;
                let css = this.getAttribute('data-tags-settings');
                current_active.style[css] = css_text;
            }        
        });
    }
}

function triggerInput(element) {
    var event = new Event('input', {
        'bubbles': true,
        'cancelable': true
    });
    element.dispatchEvent(event);
}
