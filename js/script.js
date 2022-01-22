"use strict";

let date = new Date();

function render(){
    /* MODAL TABLE */
    let table = document.querySelector('#table');
    let textMonth = document.querySelector('#month');
    let textYear = document.querySelector('#year');
    let currentDay = date.getDate();
    let currentMonth = date.getMonth();
    let currentYear = date.getFullYear();
    let lastDay = new Date(currentYear, currentMonth + 1, 0).getDate();
    let prevDays = new Date(currentYear, currentMonth, 0).getDate();
    let firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

    let months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
    let nums = ['one', 'two', 'three', 'four', 'five'];
    /* MODAL WINDOW */
    let modal = document.querySelector('#modal');
    let modalClose = modal.querySelector('#modal__btn-close');
    let modalHeaderTitle = modal.querySelector('#modal-header__date');
            //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    let dayChecked;
    let monthChecked = currentMonth;
    let yearChecked = currentYear;

        //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
    /* MODAL-NOTES */
    let modalNotes = modal.querySelector('#modal-notes');
    let modalNotesList = modal.querySelector('.modal-notes__list');
    let modalNotesItems;

    /* MODAL-CREATE MODAL-EDIT */
    let changeNote = modal.querySelector('.new-note');
    let btnSave = modal.querySelector('.new-note__add');
    let titleEditNote = modal.querySelector('.new-note__header');
    let inputTimeFrom = modal.querySelector('.time-from');
    let inputTimeTo = modal.querySelector('.time-to');
    let inputText = modal.querySelector('.new-note-text');
    let form = modal.querySelector('#form');

    /* MODAL-DAYS */
    let modalDays = document.querySelector('#modal-days');
    let modalDaysItems; 

    /* MODAL-BTNS */
    let modalBtns = modal.querySelector('.modal-btns'); 
    let modalBtnItems = modal.querySelectorAll('.modal-btns__item');
    let addNewNote = modalBtns.querySelector('.modal-btns__add');
    
    table.innerHTML = '';
    textMonth.innerHTML = months[currentMonth];
    textYear.innerHTML = currentYear;

    /* SIDEBAR-NOTES*/
    let sidebarNotes = document.querySelector('#sidebar-notes'); 
    let notes = sidebarNotes.querySelectorAll('.note');
    let pinnedElems;
    getAmountPinnedElems();
    let numMark = {};

    /* ARRAY WITH DATA */
    let obj;
    if(localStorage.getItem('data-obj')){
        let json = JSON.parse(localStorage.getItem('data-obj'));
        obj = json;
        setSidebarNotes();
    }else{
        obj = {};
    }
    
    /*=======================SET TABLE=============================*/
    setTable(getArrayOfWeeks(firstDayIndex, prevDays, getNumsOfDays(lastDay)));
    function getAmountPinnedElems(){
        notes = sidebarNotes.querySelectorAll('.note');
        let amount = notes.length;
        let i;
        amount ? i = amount : i = 0;
        pinnedElems = i;
    }
    function setMarkOnCells(){ 
        if(obj){
            if(obj[yearChecked]){ 
                if(obj[yearChecked][monthChecked]){
                    let subObj = obj[yearChecked][monthChecked];
                    for(let day in subObj){
                        if(Object.keys(subObj[day]).length !== 0 && subObj[day].constructor === Object){
                            isFilledCell(day, 'true');
                        }
                        for(let note in subObj[day]){
                            if(subObj[day][note]['isPinned']){
                                setMarkOnCell();
                            }
                        }
                    }
                }
            }
        }
        setMarkOnCell();
    }
    function isFilledCell(day, act){
        let trs = table.querySelectorAll('tr');
        for(let i = 0; i< trs.length; i++){
            let tds  = trs[i].querySelectorAll('.cell');
            
            for(let j = 0; j< tds.length; j++){
                if(tds[j].innerHTML == day){
                    tds[j].dataset.filled = act;
                }
            }
        }
    }
    function setMarkOnCell(){
        let trs = table.querySelectorAll('tr');
        for(let i = 0; i< trs.length; i++){
            let tds  = trs[i].querySelectorAll('.cell');
            
            for(let j = 0; j< tds.length; j++){
                switch(tds[j].innerHTML) {
                    case numMark['one']:
                        tds[j].classList.add('one');
                    break
                    case numMark['two']:  
                        tds[j].classList.add('two');
                    break
                    case numMark['three']:
                        tds[j].classList.add('three');
                    break
                
                    case numMark['four']:
                        tds[j].classList.add('four');
                    break
                
                    case numMark['five']:
                        tds[j].classList.add('five');
                    break
                    default:
                        tds[j].className = 'cell';
                    break
                  }
            }
        }
    }
    function getNumsOfDays(days){
        let cells = [];
        for(let i = 1; i<=days; i++){
            cells.push(i);
        }
        return cells;
    }
    function getArrayOfWeeks(firstDay, lastDay, arr){
        let rows = [];
        let subArr = [];
        let indexFirstDay = firstDay;
        if(indexFirstDay == 0){
            indexFirstDay = 7;
        }
        let prevDays = 7 - (7 - indexFirstDay + 1); 
        let prevDay = prevDays - 1;
        

        for(let i = 0; i<prevDays; i++, prevDay--){
            subArr.push(lastDay - prevDay);
        }

        for(let i = 0; i<arr.length; i++){
            if(subArr.length == 7){
                rows.push(subArr);
                subArr= [];
                subArr.push(arr[i]);
            }else{
                subArr.push(arr[i]);
            }
        }
        for(let i = 1; rows.length<6; i++){
            if(subArr.length == 7){
                rows.push(subArr);
                subArr = [];
            }
            subArr.push(i);
        }
        return rows;
    }
    function setTable(arr){
        let tr = document.createElement('tr');
        table.append(tr);
        
        for(let i = 0; i<days.length; i++){
            let td = document.createElement('td');
            td.innerHTML = days[i];
            td.classList.add('thead');
            tr.append(td);
        }
        for(let i = 0; i< arr.length; i++){
            let tr = document.createElement('tr');
            table.append(tr);
            for(let j = 0; j< arr[i].length; j++){
                let td = document.createElement('td');
                if(i == 0 && arr[i][j] > 7){
                    td.classList.add('prev');
                }
                if(i >= 3 && arr[i][j] < 15){
                    td.classList.add('next');
                }
                if(arr[i][j] === currentDay && currentMonth == new Date().getMonth() && currentYear == new Date().getFullYear()){
                    td.classList.add('current');
                }
                td.innerHTML = arr[i][j];
                if(!(td.classList.contains('next') ||td.classList.contains('prev'))){
                    td.addEventListener('click', createNote);
                    td.classList.add('cell');
                }
                tr.append(td);
            }
        }
        setMarkOnCells();
    }
    /*=======================SET TABLE=============================*/

    /*====================== SIDEBAR-NOTES ========================*/
    function setSidebarNotes(){
        sidebarNotes.innerHTML = '';
        numMark = {}; 
        if(obj){
            let objMonth = obj[yearChecked || currentYear][monthChecked || currentMonth];
            for(let day in objMonth){
                for(let note in objMonth[day]){
                    if(objMonth[day][note]['isPinned']){
                        createSidebarNote(day, note, objMonth[day][note]['text']);
                        setMarkOnCells();
                    }
                }
            }
        }
    }
    function createSidebarNote(dayValue, timeValue, textValue){
        notes = sidebarNotes.querySelectorAll('.note');
        let amount = notes.length;
        let i;
        amount ? i = amount : i = 0;
        getAmountPinnedElems();
        if(i < 5){
            let nameOfDay = new Date(yearChecked || currentYear, monthChecked || currentMonth, dayValue).getDay();
            let note = document.createElement('div');
            let row1 = document.createElement('div');
            let row2 = document.createElement('div');
            let row3 = document.createElement('div');
            let day = document.createElement('div');
            let name = document.createElement('div');
            let date = document.createElement('div');
            let time = document.createElement('div');
            let descrip = document.createElement('div');

            note.classList.add('note', nums[i]);
            row1.classList.add('row');
            row2.classList.add('row');
            row3.classList.add('row', 'row-descrip');
            day.classList.add('note__day');
            name.classList.add('note__name');
            date.classList.add('note__date');
            time.classList.add('note__time');
            descrip.classList.add('note__descip');
            
            note.addEventListener('click', showSidebarNote);

            day.innerHTML = dayValue;
            name.innerHTML = 'Event ' + nums[i];
            date.innerHTML = ucFirst(days[nameOfDay]) + ', ' + dayValue + ' ' + months[monthChecked || currentMonth];
            time.innerHTML = timeValue;
            descrip.innerHTML = cutStr(textValue);

            sidebarNotes.append(note);
            note.append(row1, row2, row3);
            row1.append(day, name);
            row2.append(date);
            row3.append(time, descrip);

            numMark[nums[i]] = dayValue;
            setMarkOnCells();
        }
    }
    function ucFirst(str) {
        if (!str) return str;
      
        return str[0].toUpperCase() + str.slice(1);
    }
    function cutStr(text) {
        if(text.length > 13){
            return text.slice(0, 13) + ' . . .';
        }else{
            return text;
        } 
    } 
    /*====================== SIDEBAR-NOTES ========================*/
    function showSidebarNote(){
        let day = this.querySelector('.note__day').innerHTML;
        dayChecked = day;
        setModal(day);
    }
    function createNote(){
        modalNotesItems = modalNotesList.querySelectorAll('.modal-notes__item');
        let day = this.innerHTML;

        monthChecked = currentMonth;
        yearChecked = currentYear;
        dayChecked = day;

        setModal(dayChecked);
        for(let modalNotesItem of modalNotesItems){
            modalNotesItem.addEventListener('click', setChecked);
        }
    }
    function setChecked(){
        modalNotesItems = modalNotesList.querySelectorAll('.modal-notes__item');
        for(let modalNotesItem of modalNotesItems){
            modalNotesItem.classList.remove('checked');
        }
        this.classList.add('checked');
        for(let modalBtnItem of modalBtnItems){
            modalBtnItem.addEventListener('click', clickBtns);
        }
    }
    function clickBtns(){
        let elemChecked = isCheckedNote();
        if(elemChecked){
            let key = elemChecked.querySelector('.modal-notes__time-from').innerHTML;
            if(this.classList.contains('modal-btns__done')){
                elemChecked.classList.toggle('done');
                obj[yearChecked][monthChecked][dayChecked][key]['isDone'] = !obj[yearChecked][monthChecked][dayChecked][key]['isDone'];
                setJson();
                elemChecked.classList.remove('checked');
            }else if(this.classList.contains('modal-btns__edit')){
                editNote();
            }else if(this.classList.contains('modal-btns__remove')){
                elemChecked.remove();
                delete obj[yearChecked][monthChecked][dayChecked][key];
                setJson();
                setSidebarNotes();
                setMarkOnCells();
                if(Object.keys(obj[yearChecked][monthChecked][dayChecked]).length === 0 && obj[yearChecked][monthChecked][dayChecked].constructor === Object){
                    isFilledCell(dayChecked, 'false');
                }
            }else if(this.classList.contains('modal-btns__pinned')){
                if(pinnedElems < 4){
                    elemChecked.classList.toggle('pinned');
                    obj[yearChecked][monthChecked][dayChecked][key]['isPinned'] = !obj[yearChecked][monthChecked][dayChecked][key]['isPinned'];
                }else{
                    elemChecked.classList.remove('pinned');
                    obj[yearChecked][monthChecked][dayChecked][key]['isPinned'] = false;
                }
                setJson();
                setSidebarNotes();
                setMarkOnCells();
                elemChecked.classList.remove('checked');
            }
        }
    }
    

   function setModal(day){
        openModal();
        if(obj){
            if(obj[yearChecked]){
                if(obj[yearChecked][monthChecked]){
                    if(obj[yearChecked][monthChecked][dayChecked]){
                        setNotes(obj, day);
                    }else{
                        modalNotesList.innerHTML = '';
                    }
                }else{
                    modalNotesList.innerHTML = '';
                }
            }else{
                modalNotesList.innerHTML = '';
            }
        }else{
            modalNotesList.innerHTML = '';
        }
        
        let numMonth = date.getMonth();
        dayChecked = day;
        monthChecked = currentMonth;
        yearChecked = currentYear;
    
        addNewNote.addEventListener('click', addNote);
        modalDays.innerHTML = '';
        for(let i = 0, j = day; i < 5; i++, j++){
            createModalDays(i, j);
        }
        
        modalHeaderTitle.innerHTML = months[numMonth] +', ' + dayChecked;
        inputTimeFrom.addEventListener('input', e => {maskForInput(e);});
        inputTimeTo.addEventListener('input', e => {maskForInput(e);});
        modalClose.addEventListener('click', ()=>{ modal.classList.remove('open');});
        form.addEventListener('submit', e=>{e.preventDefault();})
        modal.addEventListener('mousedown', event =>{event.target.classList.contains('modal')  && modal.classList.remove('open');});
    }
    function createModalDays(index, numDay){
        let numMonth = date.getMonth();
        let item = document.createElement('div');
        let spanDay = document.createElement('span');
        let spanMonth = document.createElement('span');
        if(index == 0){
            item.classList.add('active');
        }
        item.classList.add('modal-days__item');
        spanDay.classList.add('modal-days__num');
        spanMonth.classList.add('modal-days__month');

        item.addEventListener('click', clickDaysItem);

        if(numMonth == 11 && numDay > 31){
            yearChecked = +currentYear + 1;
        }
        if(numDay > lastDay){
            numDay = 1;
            numMonth = +numMonth + 1;
            spanDay.innerHTML = numDay;

            spanDay.dataset.day = numDay; 
        }else{
            spanDay.innerHTML = numDay;
            spanDay.dataset.day = numDay;
        }
        if(numMonth === 12){
            numMonth = 0;
        }
        spanMonth.dataset.month = numMonth;

        if(months[numMonth].length > 4){
            spanMonth.innerHTML = months[numMonth].slice(0, 3);
        }else{
            spanMonth.innerHTML = months[numMonth];
        } 
        modalDays.appendChild(item);
        item.append(spanDay, spanMonth);
    }

    function clickDaysItem(){
        modalDaysItems = document.querySelectorAll('.modal-days__item');
        for(let modalDaysItem of modalDaysItems){
            modalDaysItem.classList.remove('active');
        }
        this.classList.add('active');
        
        let month = this.querySelector('.modal-days__month').dataset.month;
        let day = this.querySelector('.modal-days__num').dataset.day;

        dayChecked = day;
        monthChecked = month;

        modalHeaderTitle.innerHTML = months[month] +', ' + day;
        setNotes(obj, day);
    }

    function setNotes(obj, day){
        let subObj;
        if(obj){
            if(obj[yearChecked]){
                if(obj[yearChecked][monthChecked]){
                    if(obj[yearChecked][monthChecked][day]){
                        modalNotesList.innerHTML = '';
                        subObj = obj[yearChecked][monthChecked][day];

                    }else{
                        modalNotesList.innerHTML = '';
                    }
                }else{
                    modalNotesList.innerHTML = '';
                }
            }else{
                modalNotesList.innerHTML = '';
            }
        }else{
            modalNotesList.innerHTML = '';
        }
        if(subObj){
           for(let key in subObj){
                let item = document.createElement('div');
                let time = document.createElement('div');
                let text = document.createElement('span');
                let timeTo = document.createElement('span');
                let timeFrom = document.createElement('span');
                if(subObj[key]['isDone']){
                    item.classList.add('done');
                }
                if(subObj[key]['isPinned']){
                    item.classList.add('pinned');
                }
                item.classList.add('modal-notes__item');
                time.classList.add('modal-notes__time');
                text.classList.add('modal-notes__text');
                timeTo.classList.add('modal-notes__time-to');
                timeFrom.classList.add('modal-notes__time-from');
                item.addEventListener('click', setChecked);
                
                text.innerHTML = subObj[key]['text'];
                timeTo.innerHTML = subObj[key]['timeTo'];
                timeFrom.innerHTML = subObj[key]['timeFrom'];

                modalNotesList.append(item);
                item.append(time, text);
                time.append(timeFrom, timeTo);
            }  
        }
    }
    
    
    function addNote(){
        closeModal();
        btnSave.removeEventListener('click', saveEditNote);
        
        titleEditNote.innerHTML = 'Add new';
        inputTimeFrom.value = '';
        inputTimeTo.value = '';
        inputText.value = '';
        btnSave.addEventListener('click', saveAddNote);
    }
    
    
    function saveAddNote(){
        if(inputText.value !== '' && inputTimeFrom.value !== '' && !inputTimeFrom.classList.contains('errorValue') && !inputTimeTo.classList.contains('errorValue')){
            openModal();
            let item = document.createElement('div');
            let time = document.createElement('div');
            let text = document.createElement('span');
            let timeTo = document.createElement('span');
            let timeFrom = document.createElement('span');

            item.classList.add('modal-notes__item');
            time.classList.add('modal-notes__time');
            text.classList.add('modal-notes__text');
            timeTo.classList.add('modal-notes__time-to');
            timeFrom.classList.add('modal-notes__time-from');
            item.addEventListener('click', setChecked);

            text.innerHTML = inputText.value;
            timeTo.innerHTML = inputTimeTo.value;
            timeFrom.innerHTML = inputTimeFrom.value;

            pushInObj('timeFrom', inputTimeFrom.value, inputTimeFrom.value);
            pushInObj('timeTo', inputTimeTo.value, inputTimeFrom.value);
            pushInObj('text', inputText.value, inputTimeFrom.value);
            pushInObj('isDone', false, inputTimeFrom.value);
            pushInObj('isPinned', false, inputTimeFrom.value);

            modalNotesList.append(item);
            item.append(time, text);
            time.append(timeFrom, timeTo);
            inputTimeFrom.classList.remove('error');
            inputText.classList.remove('error');
            setSidebarNotes();
            if(Object.keys(obj[yearChecked][monthChecked][dayChecked]).length !== 0 && obj[yearChecked][monthChecked][dayChecked].constructor === Object){
                isFilledCell(dayChecked, 'true');
            }
        }
        if(inputText.value == ''){
            inputText.classList.add('error');
        }else{
            inputText.classList.remove('error');
        }
        if(inputTimeFrom.value == ''){
            inputTimeFrom.classList.add('error');
        }else{
            inputTimeFrom.classList.remove('error');
        }
    }

    function editNote(){
        closeModal();
        btnSave.removeEventListener('click', saveAddNote);
        let elemChecked = isCheckedNote();
        let noteTimeFrom = elemChecked.querySelector('.modal-notes__time-from');
        let noteTimeTo = elemChecked.querySelector('.modal-notes__time-to');
        let noteText = elemChecked.querySelector('.modal-notes__text');

        titleEditNote.innerHTML = 'Edit note';

        inputTimeFrom.value = noteTimeFrom.innerHTML;
        inputTimeTo.value = noteTimeTo.innerHTML;
        inputText.value = noteText.innerHTML;
        let isDone = obj[yearChecked][monthChecked][dayChecked][noteTimeFrom.innerHTML]['isDone'];
        let isPinned = obj[yearChecked][monthChecked][dayChecked][noteTimeFrom.innerHTML]['isPinned'];
        btnSave.addEventListener('click', () =>{saveEditNote(noteTimeFrom.innerHTML, isDone, isPinned);});
        
    }
    
    function saveEditNote(prevNote, isDone, isPinned){
        let elemChecked = isCheckedNote();
        if(elemChecked){
            if(inputTimeFrom.value == '' && inputTimeTo.value == '' && inputText.value == ''){
                elemChecked.remove();
                delete obj[yearChecked][monthChecked][dayChecked][prevNote];
                setJson();
                openModal();
                setSidebarNotes();
                if(Object.keys(obj[yearChecked][monthChecked][dayChecked]).length === 0 && obj[yearChecked][monthChecked][dayChecked].constructor === Object){
                    isFilledCell(dayChecked, 'false');
                }
            }else{
                elemChecked.querySelector('.modal-notes__time-from').innerHTML =  inputTimeFrom.value;
                elemChecked.querySelector('.modal-notes__time-to').innerHTML =  inputTimeTo.value;
                elemChecked.querySelector('.modal-notes__text').innerHTML =  inputText.value;

                pushInObj('timeFrom', inputTimeFrom.value, inputTimeFrom.value, prevNote);
                pushInObj('timeTo', inputTimeTo.value, inputTimeFrom.value);
                pushInObj('text', inputText.value, inputTimeFrom.value);
                pushInObj('isDone', isDone, inputTimeFrom.value);
                pushInObj('isPinned', isPinned, inputTimeFrom.value);

                elemChecked.classList.remove('checked');
                openModal();
                setSidebarNotes();
            }
        }
    }









    function pushInObj(key, value, hour, prevNote){
        if(prevNote){
            delete obj[yearChecked][monthChecked][dayChecked][prevNote];
        }
        if(obj[yearChecked] === undefined){
            obj[yearChecked] = {};
        }
        if(obj[yearChecked][monthChecked] === undefined){
            obj[yearChecked][monthChecked] = {};
        }
        if(obj[yearChecked][monthChecked][dayChecked] === undefined){
            obj[yearChecked][monthChecked][dayChecked] = {};
        }
        if(obj[yearChecked][monthChecked][dayChecked][hour] === undefined){
            obj[yearChecked][monthChecked][dayChecked][hour] = {};
        }
        if(obj[yearChecked][monthChecked][dayChecked][hour]){
            obj[yearChecked][monthChecked][dayChecked][hour][key] = value; 
        }
        
        
        if(obj){
            setJson();
        } 
    }

    function setJson(){
        let json = JSON.stringify(obj);
        localStorage['data-obj'] = json;
        let result = JSON.parse(localStorage.getItem('data-obj'));
        obj = result; 
    }
    function isCheckedNote(){
        let modalNotesItems = modalNotesList.querySelectorAll('.modal-notes__item');
        let elemChecked;
        for(let modalNotesItem of modalNotesItems){
            if(modalNotesItem.classList.contains('checked')){
                elemChecked = modalNotesItem;
            }
        }
        return elemChecked;
    }
    function maskForInput(e){
        let value = e.target.value;
        
        let replaceNotNum = value.replace(/\D/g, '');
        let result = replaceNotNum.replace(/(\d{2})(\d{2})/g, '$1:$2');
        let test = /([0-1][0-9]{1}|[2][0-3]{1}):([0-5]{1}[0-9]{1})/.test(result);
        e.target.value = result;
        if(e.target.value.length == 5){
            if(test){
                e.target.classList.remove('errorValue');
            }else{
                e.target.classList.add('errorValue');
            }
        }
    }
    function openModal(){
        modal.classList.add('open');
        modalNotes.classList.add('open');
        modalBtns.classList.add('open');
        changeNote.classList.remove('open');
    }

    function closeModal(){
        modalNotes.classList.remove('open');
        changeNote.classList.add('open');
        modalBtns.classList.remove('open');
    }
}
document.querySelector('#arrowPrev').addEventListener('click', () =>{
    date.setMonth(date.getMonth() - 1);
    render();
});
document.querySelector('#arrowNext').addEventListener('click', () =>{
    date.setMonth(date.getMonth() + 1);
    render();
});
render();