'use strict';

const dataResults = document.querySelector('.js-container');
const userSearch = document.querySelector('.js-input');
const btn = document.querySelector('.js-btn');
let films = [];


//
function getServerData(ev) {
  ev.preventDefault()
  fetch(
      `http://api.tvmaze.com/search/shows?q=${userSearch.value}`
    )
    .then(response => response.json())
    .then(function (serverData) {
      films = serverData;
      paintFilms();
    })
    .catch(function (err) {
      console.log("Error al traer los datos del servidor", err);
    });
}


function paintFilms() {
  let htmlCode = "<ul>";
  for (const film of films) {

    const defaultImage = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

    htmlCode += `<li class="">`;
    htmlCode += `<h3 class="film__name">${film.show.name}</h3>`;

    if (film.show.image !== null) {
      let filmImage = film.show.image.medium;
      htmlCode += `<img src="${filmImage}">`;
    } else {
      htmlCode += `<img src="${defaultImage}"`;
    }
    htmlCode += `</li>`;
  }
  htmlCode += '</ul>';
  dataResults.innerHTML = htmlCode;
}

btn.addEventListener('click', getServerData);
