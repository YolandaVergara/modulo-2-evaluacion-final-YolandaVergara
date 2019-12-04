'use strict';
const dataResults = document.querySelector('.js-container');
const userSearch = document.querySelector('.js-input');
const btn = document.querySelector('.js-btn');
let films = [];
let favoriteFilms = [];
const languajes = ['English', 'Spanish', 'Portuguese'];

//Local Storage
function setLocalStorage() {
  localStorage.setItem('favorite', JSON.stringify(favoriteFilms));
}

function getLocalStorage() {
  const localStorageFavoriteFilms = JSON.parse(localStorage.getItem('films'));
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
      htmlCode += `<li class="js-film-item favorite-film film__item" id=${films[i].show.id} >`;
    } else {
      htmlCode += `<li class="js-film-item film__item" id=${films[i].show.id} >`;
    }
    htmlCode += `<h3 class="js-films-name film__title">${films[i].show.name}</h3>`;
    htmlCode += `<p class="js-films-languaje">${films[i].show.language}</p>`;
    for (let j = 0; j < languajes.length; j++) {
      if (films[i].show.language === languajes[j])
        htmlCode += `<p class="js-films-recomended">Recomendada</p>`;
    }

    if (films[i].show.image !== null) {
      let filmImage = films[i].show.image.medium;
      htmlCode += `<img src="${filmImage}" class="film__image" alt="Imagen de la película">`;
    } else {
      htmlCode += `<img src="${defaultImage}" class="film__image" alt="Imagen de la película">`;
    }
    htmlCode += `</li>`;
  }
  dataResults.innerHTML = htmlCode;
}

//Marcar favoritos
function toogleFavorites(ev) {
  const clickedItem = parseInt(ev.currentTarget.id);
  const favoriteIndex = favoriteFilms.findIndex(function (show, favoriteIndex) {
    return show.id === clickedItem;
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

  const eraseAll = document.querySelector('.js-eraseall');

  function resetFavs() {
    favoriteFilms.splice(0, favoriteFilms.length);
    setLocalStorage();
    paintFilms();
    paintFavorites();
    listenFilms();
  }
  eraseAll.addEventListener('click', resetFavs);

}
//Pintar favoritos
function paintFavorites() {
  const defaultImage = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  const containerFav = document.querySelector('.js-paint-favorites');
  let htmlCode = '';
  for (let i = 0; i < favoriteFilms.length; i++) {
    htmlCode += `<li class="film-item film__item" id='${favoriteFilms[i].id}'>`;
    htmlCode += `<h3 class="favTitle film__title">${favoriteFilms[i].name}</h3>`;
    if (favoriteFilms[i].image === null) {
      htmlCode += `<img src="${defaultImage}" class="film__image" alt="Imagen de la película">`;
    } else {
      htmlCode += `<img class='item__img film__image' src='${favoriteFilms[i].image.medium}' alt="Imagen de la película"/>`;
    }
    htmlCode += `<i class="fas fa-trash-alt js-delete film__delete" id='${favoriteFilms[i].id}'></i>`;
    htmlCode += '</li>';
  }
  htmlCode += '<button class="js-eraseall film__delete__all">Borrar todo</button>';
  containerFav.innerHTML = htmlCode;
  listenDelete();
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

function listenDelete() {
  const deleteItems = document.querySelectorAll('.js-delete');
  for (const deleteItem of deleteItems) {
    deleteItem.addEventListener('click', toogleFavorites);
  }
}

const log = document.querySelector('.js-log');

function numFilms() {
  console.log(`Tienes ${favoriteFilms.length} series favoritas`);
}

log.addEventListener('click',numFilms);

btn.addEventListener('click', handler);
getLocalStorage()
