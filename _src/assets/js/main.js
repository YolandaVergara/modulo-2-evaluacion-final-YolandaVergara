'use strict';
const dataResults = document.querySelector('.js-container');
const userSearch = document.querySelector('.js-input');
const btn = document.querySelector('.js-btn');
let films = [];
let favoriteFilms = [];

//Local Storage
function setLocalStorage() {
  localStorage.setItem("favorite", JSON.stringify(favoriteFilms));
}

function getLocalStorage() {
  const localStorageFavoriteFilms = JSON.parse(localStorage.getItem("films"));
  if (localStorageFavoriteFilms !== null) {
    favoriteFilms = localStorageFavoriteFilms;
    paintFilms();
    listenFilms();
  } else {
    getServerData();
  }
}

//FETCH
function getServerData() {
  fetch(`http://api.tvmaze.com/search/shows?q=${userSearch.value}`)
    .then(response => response.json())
    .then(function (serverData) {
      films = serverData;
      paintFilms();
      listenFilms();
    })
    .catch(function (err) {
      console.log('Error al traer los datos del servidor', err);
    });
}

//Mostrar resultados en pantalla
function paintFilms() {
  let htmlCode = '';
  for (let i = 0; i < films.length; i++) {
    const favoriteIndex = favoriteFilms.findIndex(function (show, favoriteIndex) {
      return show.id === films[i].show.id;
    })
    const isFavorite = favoriteIndex !== -1;
    const defaultImage = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
    if (isFavorite) {
      htmlCode += `<li class="js-films js-film-item favorite-film" id=${films[i].show.id} >`;
    } else {
      htmlCode += `<li class="js-films js-film-item" id=${films[i].show.id} >`;
    }
    htmlCode += `<h3 class="js-films-name">${films[i].show.name}</h3>`;
    if (films[i].show.image !== null) {
      let filmImage = films[i].show.image.medium;
      htmlCode += `<img src="${filmImage}">`;
    } else {
      htmlCode += `<img src="${defaultImage}">`;
    }
    htmlCode += `</li>`;
  }
  dataResults.innerHTML = htmlCode;
}

//Marcar favoritos
function toogleFavorites(ev) {
  const clickedItem = parseInt(ev.currentTarget.id);
  const favoriteIndex = favoriteFilms.findIndex(function (show, favoriteIndex) {
    return show.id === clickedItem
  })

  const isFavorite = favoriteIndex !== -1;
  if (isFavorite === true) {
    favoriteFilms.splice(favoriteIndex, 1);
  } else {
    for (let i = 0; i < films.length; i++) {
      if (clickedItem === films[i].show.id) {
        favoriteFilms.push(films[i].show);
      }
    }
  }
  paintFilms();
  listenFilms();
  paintFavorites();
  setLocalStorage();
}
//Pintar favoritos
function paintFavorites() {
  const defaultImage = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  const containerFav = document.querySelector('.js-paint-favorites');
  let htmlCode = "";
  for (let i = 0; i < favoriteFilms.length; i++) {
    htmlCode += `<li class=js-favorites id='${favoriteFilms[i].id}'>`;
    htmlCode += `<h3 class="favTitle">${favoriteFilms[i].name}</h3>`;
    if (favoriteFilms[i].image === null) {
      htmlCode += `<img src="${defaultImage}">`;
    } else {
      htmlCode += `<img class='item__img'src='${favoriteFilms[i].image.medium}'/>`;
    }
    htmlCode += "</li>";
  }
  containerFav.innerHTML = htmlCode;
}

function handler(ev) {
  ev.preventDefault();
  getServerData();
}
//Función listener
function listenFilms() {
  const filmItems = document.querySelectorAll('.js-film-item');
  for (const filmItem of filmItems) {
    filmItem.addEventListener('click', toogleFavorites);
  }
}

btn.addEventListener('click', handler);
getLocalStorage()
