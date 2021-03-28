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
        countriesContainer.style.opacity = 1;
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

// const whereIam = function() {


//     getPosition().then(pos => {
//             const { latitude: lat, longitude: lng } = pos.coords;
//             return fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
//         })
//         .then((response) => {
//             console.log(response)
//             if (!response.ok) throw new Error("Max 3 request per second")
//             return response.json()
//         }).then(data => {
//             console.log(data)
//             const city = data.city
//             console.log(`You are currently in ${city} in ${data.country} `)
//             return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`)
//         }).then(response => {
//             if (!response.ok) throw new Error(`Country doesn't exists ${response.status}`);
//             return response.json();
//         }).then(data => {

//             renderCountry(data[0])
//             countriesContainer.style.opacity = 1;
//         })
//         .catch(err => {
//             console.log(`${err.message}🍕 `)
//         }).finally(() => {
//             console.log("finally")
//         })
// }

// btn.addEventListener('click', whereIam);

const whereAmI = async function(country) {

    try { // Geolocation
        const pos = await getPosition();
        const { latitude: lat, longitude: lng } = pos.coords;
        // Reverse geocoding
        const resGeo = await fetch(`https://geocode.xyz/${lat},${lng}?geoit=json`)
        if (!resGeo.ok) throw new Error('Problem getting location date ')
        const dataGeo = await resGeo.json()
            // Country data
        const res = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.country}`)
        if (!res.ok) throw new Error('Problem getting country ')
        const data = await res.json();
        renderCountry(data[0])
        return `You are in ${dataGeo.city}, ${dataGeo.country}`
    } catch (err) {
        console.error(`${err}💩`);
        renderError(`💣 ${err.message}`)

        // Reject promise returned from async functions 
        throw err;
    }
};

console.log('1: will get location');
// const city = whereAmI();
// console.log(city)
// whereAmI()
//     .then(city => console.log(`2: ${city}😎`))
//     .catch(err => console.error(`2: ${err}💥`))
//     .finally(() => console.log('3: Finished getting location'))

(async function() {
    try {
        const city = await whereAmI()
        console.log(`2: ${city}😎`);
    } catch (err) {
        console.error(`2: ${err}💥`);
    }
    console.log('3: Finished getting location')
})();