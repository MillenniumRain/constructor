let input_units = document.querySelectorAll('[data-units="1"]');
let input_counter = 0;
for (let i = 0; i < input_units.length; i++) {
    let new_block = document.createElement('div');
    if(input_units[i].classList.length) new_block.classList.add(input_units[i].classList);
    new_block.classList.add('units');
    let input = input_units[i].outerHTML;

    new_block.innerHTML = `
    <input class="switch-units" id="switch-units${++input_counter}" name="switch-units${i}" type="radio" checked="checked"><label class="switch-left" for="switch-units${input_counter}">px</label>
    ${input}
    <input class="switch-units" id="switch-units${++input_counter}" name="switch-units${i}" type="radio"><label class="switch-right" for="switch-units${input_counter}">&nbsp;%</label>
    `;
    input_units[i].replaceWith(new_block);
}
