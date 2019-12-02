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
//   localStorage.setItem('favoriteFilms', JSON.stringify(films));
// }

// function getLocalStorage() {


// }


//FETCH
function getServerData(ev) {
  ev.preventDefault()
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

//FUNCIÓN PINTAR RESULTADOS
function paintFilms() {
  let htmlCode = '<ul>';
  for (let i = 0; i < films.length; i++) {
    const favoriteItem = favoriteFilms.indexOf(i);
    const isFavorite = favoriteItem !== -1
    const defaultImage = 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';

    if (isFavorite) {
      htmlCode += `<li class="js-film-item favorite-film" id=${films[i].show.id}>`;
    } else {
      htmlCode += `<li class="js-film-item" id=${films[i].show.id}>`;
    }

    htmlCode += `<h3 class="js-film-name">${films[i].show.name}</h3>`;
    if (films[i].show.image !== null) {
      let filmImage = films[i].show.image.medium;
      htmlCode += `<img src="${filmImage}">`;
    } else {
      htmlCode += `<img src="${defaultImage}"`;
    }
    htmlCode += `</li>`;
  }
  htmlCode += '</ul>';
  dataResults.innerHTML = htmlCode;
}

function toggleFavorites(ev) {
  //metemos en una constante el id de los elementos seleccionados
  const clickedItem = parseInt(ev.currentTarget.id);
  //guardamos en otra constante la posición de los elementos clickados
  const favoriteFilm = favoriteFilms.indexOf(clickedItem);
  //en el caso de no encontrarla, le asigna un -1, por lo que sólo guardamos los que son diferentes a -1
  const isFavorite = favoriteFilm !== -1;
  if (isFavorite === true) {
    favoriteFilms.splice(favoriteFilm, 1);
  } else {
    favoriteFilms.push(parseInt(ev.currentTarget.id));
  }
  paintFilms();
  listenFilms();
}



function listenFilms() {
  const filmsItems = document.querySelectorAll('.js-film-item');
  for (const filmsItem of filmsItems) {
    filmsItem.addEventListener('click', toggleFavorites);
  }
}

btn.addEventListener('click', getServerData);
