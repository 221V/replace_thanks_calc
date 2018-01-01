// ==UserScript==
// @name replace_Thanks_Calc
// @description replace_Thanks_Calc by 221V
// @author 221V
// @license MIT
// @version 1.0
// @include http://replace.org.ua/thanks/view/*
// ==/UserScript==

function qi(a){ return document.getElementById(a); }
function qc(a){ return document.getElementsByClassName(a); }
function save_to_local(a,v){ localStorage.setItem(a, JSON.stringify(v)); }
function restore_from_local(a){ return JSON.parse(localStorage.getItem(a)); }
function detect_pages(){ return [0, parseInt(qc('paging')[0].lastChild.previousElementSibling.innerHTML)]; }
function insert_or_update(data,nickname,post){
  var nick_id = data[0].indexOf(nickname);
  if(nick_id == -1){
    //insert
    data[0].push(nickname);
    data[1].push(1);
    data[2].push(data[0].indexOf(nickname) + '===' + post);
  }else{
    //update if non-repeat
    var found_post = data[2].indexOf(nick_id + '===' + post);
    if(found_post == -1){
      data[1][nick_id]++;
      data[2].push(nick_id + '===' + post);
    }
  }
}

function we_calc(){
  var data = restore_from_local('our_data') || [[],[],[]],// data[0] - nickname arr, data[1] - nickname count, data[2] - user_id + '===' + post url arr
      pages = restore_from_local('pages') || detect_pages(),// pages[0] = active, pages[1] = total count
      table_with_t = qc('ct-group')[0], table_rows_data = table_with_t.querySelectorAll('td');
  
  if(pages[0] == pages[1]){
    save_to_local('pages',false);
    save_to_local('our_data',false);
    console.log(data[0]); console.log(data[1]); console.log(data[2]); alert('it\'s all!');
    
    return true;
  }
  pages[0]++;
  
  var counter3 = 1, nickname = '', post = '';
  table_rows_data.forEach(function(el){
    if(counter3 == 1){ nickname = el.innerText; }else if(counter3 == 2){
      if(el.innerHTML.indexOf('<a') == -1){ post = el.innerHTML; }else{ post = el.innerHTML.match(/(\/post\/[\d]+\/\#p[\d]+)/)[0]; }
    }else{ insert_or_update(data,nickname,post); counter3 = 0; }
    counter3++;
  });
  
  
  if(pages[0] < pages[1]){
    //save and go
    save_to_local('pages',pages);
    save_to_local('our_data',data);
    window.location.href = qc('paging')[0].lastChild.href;
  }else{ console.log(data[0]); console.log(data[1]); console.log(data[2]); alert('it\'s all!'); }
};

we_calc();

