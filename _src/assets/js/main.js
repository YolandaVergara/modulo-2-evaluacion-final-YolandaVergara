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

//guardamos las películas guardadas en el array de favoritos para que las cargue posteriormente, las pasamos a formato JSON
function setLocalStorage() {
  localStorage.setItem("favorite", JSON.stringify(favoriteFilms));
}
//definimos la función que nos recuperará el localstorage
function getLocalStorage() {
  const localStorageFavoriteFilms = JSON.parse(localStorage.getItem("favorite"));
 //en el caso de que al coger el json y parsearlo no esté vacío, lo volcamos en nuestro array de favoritos y lo pintamos en pantalla 
  if (localStorageFavoriteFilms !== null) {
    favoriteFilms = localStorageFavoriteFilms;
    paintFavorites();
    //en el caso de que esté vacío, ejecutamos la función que nos trae los datos de búsqueda del servidor
  } else {
    getServerData();
  }
}

//FETCH
function getServerData() {
//hacemos la búsqueda en la API, usando los criterios de búsqueda de la documentación de la misma
  fetch(
      `http://api.tvmaze.com/search/shows?q=${userSearchnp.value}`
    )//al traernos los datos del servidor, los guardamos en un array para poder usar los datos de forma cómoda, posteriormente ejecutamos la función de recuperar el localstorage, lo pintamos en pantalla y ejecutamos la función que escucha las series al clickarlas para posteriormente añadirlas a favoritos

    .then(response => response.json())
    .then(function (serverData) {
      films = serverData;
      getLocalStorage();
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
//creamos un método que recorre los resultados mostrados y almacena en favoritos cen función de si el id se encuentra en el array o no 
  for (let i = 0; i < films.length; i++) {
    const favoriteIndex = favoriteFilms.findIndex(function (show, favoriteIndex) {
      return show.id === films[i].show.id;
    })
//en el caso de que devuelva la posición del id y sea diferente a -1 lo marca como favodito
    const isFavorite = favoriteIndex !== -1;

    const defaultImage =
      'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
//en este condicional añadimos la clase que se le pone en el caso de estar en el array de favoritos
    if (isFavorite) {
      htmlCode += `<li class="js-films js-film-item favorite-film" id=${films[i].show.id} >`;
    } else {
      htmlCode += `<li class="js-films js-film-item" id=${films[i].show.id} >`;
    }
    htmlCode += `<h3 class="js-films-name">${films[i].show.name}</h3>`;
//en este condicional indicamos la imagen que muestra por defecto en caso de no existir
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
  //metemos en una constante el valor del id que tiene el elemento escuchado, si es igual al id que hemos almacenado en clickedItem añade o elimina en el caso de no serlo del array de favoritos
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
  //posteriormente repintamos los favoritos, preparamos para otra búsqueda, repintamos los nuevos resultados y los almacenamos en localStorage
  paintFilms();
  listenFilms();
  paintFavorites();
  setLocalStorage();
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

function handler(ev) {
  ev.preventDefault();
  getServerData();
}
//definimos la función que va a escuchar todos los resultados de ls búsquedas para añadir a favoritos
function listenFilms() {
  const filmItems = document.querySelectorAll('.js-film-item');

  for (const filmItem of filmItems) {
    filmItem.addEventListener('click', toogleFavorites);
  }
}

btn.addEventListener('click', handler);
getLocalStorage()
