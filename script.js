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
btn.addEventListener('click', function() {
    getCountyData('india');
})

///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/

const whereIam = function(lat, lng) {
        return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`).

        then((response) => {
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
    // whereIam(52.508, 13.381)
    // whereIam(19.037, 72.873)
whereIam(-33.933, 18.474)