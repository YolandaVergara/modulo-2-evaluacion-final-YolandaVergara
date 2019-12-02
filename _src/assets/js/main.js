'use strict';

const dataResults = document.querySelector('.js-container');
const userSearch = document.querySelector('.js-input');
const btn = document.querySelector('.js-btn');
let films = [];

function getServerData() {
  fetch(
    `http://api.tvmaze.com/search/shows?q=${userSearch}`
  )
    .then(response => response.json())
    .then(function (serverData) {
      films = serverData.show;
    })
    .catch(function (err) {
      console.log("Error al traer los datos del servidor", err);
    });
}

function paintResults(){
    
}

btn.addEventListener('click', getServerData);
