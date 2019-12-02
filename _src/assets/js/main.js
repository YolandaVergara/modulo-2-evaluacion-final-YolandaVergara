'use strict';
//variable donde voy a mostrar el contenido buscado
const dataResults = document.querySelector('.js-container');
//variable donde guardamos la búsqueda del usuario
const userSearch = document.querySelector('.js-input');
//variable que ejecuta la busqueda
const btn = document.querySelector('.js-btn');
//variable predefinida como array en la que almacenaremos los datos para después mostrarlos
let films = [];
//variable predefinida como array en la que guardamos los favoritos
let favoriteFilms = [];

// function setLocalStorage() {
//   localStorage.setItem("films", JSON.stringify(films));
// }

// function getLocalStorage() {
//   const localStorageFilmsJSON = localStorage.getItem("films");
//   const localStorageFilms = JSON.parse(localStorageFilmsJSON);

//   if (localStorageFilms !== null) {
//     favoriteFilms = localStorageFilms;
//     paintFilms();
//     listenFilms();
//   } else {
//     getServerData();
//   }
// }

//FETCH
function getServerData(ev) {
  ev.preventDefault();
  fetch(
      `http://api.tvmaze.com/search/shows?q=${userSearch.value}`
    )
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

//FUNCION PINTAR RESULTADOS
function paintFilms() {
  let htmlCode = '';

  for (let i = 0; i < films.length; i++) {
    const favoriteFilm = favoriteFilms.indexOf(i);
    const isFavorite = favoriteFilm !== -1;

    const defaultImage =
      'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

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
      htmlCode += `<img src="${defaultImage}"`;
    }
    htmlCode += `</li>`;
  }
  dataResults.innerHTML = htmlCode;
}


function toogleFavorites(ev) {
  //metemos en una constante el id de los elementos seleccionados
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
}

function paintFavorites() {
  const containerFav = document.querySelector('.js-paint-favorites');
  let htmlCode = "";
  for (let i = 0; i < favoriteFilms.length; i++) {
    htmlCode += `<li class=js-favorites id='${favoriteFilms[i].id}'>`;
    htmlCode += `<h3 class="favTitle">${favoriteFilms[i].name}</h3>`;
    if (favoriteFilms[i].image === null) {
      htmlCode +=
        '<img class="item__img"src="./assets/images/tvPlaceholder.png"/>';
    } else {
      htmlCode += `<img class='item__img'src='${favoriteFilms[i].image.medium}'/>`;
    }

    htmlCode += "</li>";
  }

  containerFav.innerHTML = htmlCode;
}

function listenFilms() {
  const filmItems = document.querySelectorAll('.js-film-item');

  for (const filmItem of filmItems) {
    filmItem.addEventListener('click', toogleFavorites);
  }
}

btn.addEventListener('click', getServerData);
// getLocalStorage()
