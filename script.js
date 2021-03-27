'use strict';



const btn = document.querySelector('.btn-country');

const countriesContainer = document.querySelector('.countries');

const renderError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg)
        // countriesContainer.style.opacity = 1
}


///////////////////////////////////////
/*
///////////////////////////////////////
// Our First AJAX Call: XMLHttpRequest

const getCountryData = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [data] = JSON.parse(this.responseText);
    console.log(data);

    const html = `
  <article class="country">
    <img class="country__img" src="${data.flag}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>
  `;
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
  });
};

getCountryData('portugal');
getCountryData('usa');
getCountryData('germany');
*/

const renderCountry = function(data, className = '') {
        const html =
            `<article class="country ${className}">
            <img class="country__img" src="${data.flag}" />
            <div class="country__data">
                <h3 class="country__name">${data.name}</h3>
                <h4 class="country__region">${data.region}</h4>
                <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
                <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
                <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
            </div>
        </article> `
        countriesContainer.insertAdjacentHTML('beforeend', html);
        // countriesContainer.style.opacity = 1;
    }
    // const getCountryAndNeighbour = function(country) {

//     // AJAX call country 1
//     const request = new XMLHttpRequest();
//     request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
//     request.send();

//     request.addEventListener('load', function() {

//         const [data] = JSON.parse(this.responseText)
//             // console.log(data)

//         // Render country 1
//         renderCountry(data)

//         // Get the neighbour Country2
//         const [neihgbour] = data.borders;

//         if (!neihgbour) return
//             // AJAX call country 2
//         const request2 = new XMLHttpRequest();
//         request2.open('GET', `https://restcountries.eu/rest/v2/alpha/${neihgbour}`);
//         request2.send();

//         request2.addEventListener('load', function() {
//             const data2 = JSON.parse(this.responseText)
//                 // console.log(data2)
//             renderCountry(data2, 'neighbour')
//         })


//     });
// };

// // getCountryAndNeighbour('portugal');
// getCountryAndNeighbour('italy')

///////////////////////////////////////
// Welcome to Callback Hell

// setTimeout(() => {
//     console.log('1 second passed');
//     setTimeout(() => {
//       console.log('2 seconds passed');
//       setTimeout(() => {
//         console.log('3 second passed');
//         setTimeout(() => {
//           console.log('4 second passed');
//         }, 1000);
//       }, 1000);
//     }, 1000);
//   }, 1000);

///////////////////////////////////////
// Consuming Promises
// Chaining Promises
// Handling Rejected Promises
// Throwing Errors Manually

// const request = new XMLHttpRequest();
// request.open('GET', `https://restcountries.eu/rest/v2/name/${country}`);
// request.send();

const request = fetch('https://restcountries.eu/rest/v2/name/portugal');


// const getCountyData = function(country) {
//     fetch(`https://restcountries.eu/rest/v2/name/${country}`)
//         .then(function(response) {
//             console.log(response);
//             return response.json();
//         })
//         .then(function(data) {
//             console.log(data)
//             renderCountry(data[0])
//         })
// };

const getJson = function(url, errorMsg = 'Something went wrong') {
    return fetch(url).then((response) => {
        if (!response.ok) {
            throw new Error(`${errorMsg}(${response.status})`)
        }
        return response.json()
    })
}

// const getCountyData = function(country) {
//     /// Counrty 1
//     fetch(`https://restcountries.eu/rest/v2/name/${country}`)
//         .then((response) => {
//             if (!response.ok) {
//                 throw new Error(`Country not found (${response.status})`)
//             }
//             return response.json()
//         })
//         .then((data) => {
//             renderCountry(data[0])
//             const neighbour = data[0].borders[0]

//             if (!neighbour) return;

//             // Country 2
//             return fetch(`https://restcountries.eu/rest/v2/alpha/${neighbour}`);
//         }).then((response) => {
//             if (!response.ok) {
//                 throw new Error(`Country not found (${response.status})`)
//             }
//             return response.json()
//         })
//         .then(data => renderCountry(data, 'neighbour'))
//         .catch(err => {
//             console.log(`${err.message}`)
//             renderError(`Something went wrong 💥💥💥💥 ${err.message}, Try again!`)
//         })
//         .finally(() => {
//             countriesContainer.style.opacity = 1;

//             console.log("it is always invoked after the promise")
//         })

// };
const getCountyData = function(country) {
    /// Counrty 1
    getJson(`https://restcountries.eu/rest/v2/name/${country}`, 'Country not found')
        .then((data) => {
            renderCountry(data[0])
            const neighbour = data[0].borders[0]


            if (!neighbour) throw new Error("There is no neighbour ")

            // Country 2
            return getJson(`https://restcountries.eu/rest/v2/alpha/${neighbour}`, 'Country not found');
        })
        .then(data => renderCountry(data, 'neighbour'))
        .catch(err => {

            renderError(`Something went wrong 💥💥💥💥 ${err.message}, Try again!`)
        })
        .finally(() => {
            countriesContainer.style.opacity = 1;

            console.log("it is always invoked after the promise")
        })
};

// getCountyData('germany');
// getCountyData('ukraine');
// btn.addEventListener('click', function() {
//     getCountyData('india');
// })





// navigator.geolocation.getCurrentPosition(position => {
//     console.log(position),
//         err => console.error(err);
// });
// console.log('Position is getting received...')

const getPosition = function() {
    return new Promise(function(resolve, reject) {
        // navigator.geolocation.getCurrentPosition(
        //     position => resolve(position),
        //     err => reject(err)
        // );
        navigator.geolocation.getCurrentPosition(resolve, reject);
    });
};

// getPosition().then(pos => console.log(pos))

const whereIam = function() {


    getPosition().then(pos => {
            const { latitude: lat, longitude: lng } = pos.coords;
            return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        })
        .then((response) => {
            console.log(response)
            if (!response.ok) throw new Error("Max 3 request per second")
            return response.json()
        }).then(data => {
            console.log(data)
            const city = data.city
            console.log(`You are currently in ${city} in ${data.country} `)
            return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`)
        }).then(response => {
            if (!response.ok) throw new Error(`Country doesn't exists ${response.status}`);
            return response.json();
        }).then(data => {

            renderCountry(data[0])
            countriesContainer.style.opacity = 1;
        })
        .catch(err => {
            console.log(`${err.message}🍕 `)
        }).finally(() => {
            console.log("finally")
        })
}

btn.addEventListener('click', whereIam);
///////////////////////////////////////
// Coding Challenge #2

/*
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/
const wait = function(seconds) {
    return new Promise(function(resolve) {
        setTimeout(resolve, seconds * 1000)
    });
};
const div = document.querySelector('.images')

const createImage = function(imgPath) {
    return new Promise(function(resolve, reject) {
        const img = document.createElement('img')
        img.src = imgPath

        img.addEventListener('load', function() {
            div.append(img)
            resolve(img)
        })
        img.addEventListener('error', function() {
            reject(new Error('Something went wrong 💩'))
        })
    })
};
let currentImg
createImage('img/img-1.jpg')
    .then(img => {
        currentImg = img
        console.log('image 1 is loaded')
        return wait(2)
    })
    .then(() => {
        currentImg.style.display = 'none'
        console.log("2sec passed")
        return createImage('img/img-2.jpg')
    })
    .then(img => {
        currentImg = img
        console.log('image 2 is loaded')
        return wait(2)
    }).then(() => {
        currentImg.style.display = 'none'
        console.log("2picture is gone too")
    })
    .catch(err => console.error(err))