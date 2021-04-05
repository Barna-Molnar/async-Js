'use strict';



const btn = document.querySelector('.btn-country');

const countriesContainer = document.querySelector('.countries');

const renderError = function(msg) {
    countriesContainer.insertAdjacentText('beforeend', msg)
    countriesContainer.style.opacity = 1
}
const renderCountry = function(data, className = '') {
    const html =
        `<article class="country ${className}">
        <img class="country__img" src="${data.flag}" />
        <div class="country__data">
            <h3 class="country__name">${data.name}</h3>
            <h4 class="country__region">${data.region}</h4>
            <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)}M people</p>
            <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
            <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
        </div>
    </article> `
    countriesContainer.insertAdjacentHTML('beforeend', html);
    countriesContainer.style.opacity = 1;
};

const request = fetch('https://restcountries.eu/rest/v2/name/portugal');


const getJson = function(url, errorMsg) {
    return fetch(url).then((response) => {
        if (!response.ok) throw new Error(`${errorMsg} 👎 (${response.status})`)

        return response.json()
    })
}


const getCountryData = function(country) {

    getJson(`https://restcountries.eu/rest/v2/name/${country}`, 'Country is not found.')
        .then((data) => {
            renderCountry(data[0])
            const neighbour = data[0].borders[0]

            if (!neighbour) throw new Error(`No neighbour found`)
                // Country 2
            return getJson(`https://restcountries.eu/rest/v2/alpha/${neighbour},Country is not found. `);
        })
        .then(data => renderCountry(data, "neighbour"))
        .catch(err => {
            renderError(`Somethig went wrong💥 ${err.message}. Try it again!`)
            console.error(`${err} 💩💥💣`)
        }).finally(() => console.log('It will always be invoked '))
};
// getCountryData("portugal")
// btn.addEventListener('click', function() {
//     getCountryData('canada');
// })

// getCountryData('australia');
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


// wherAmI(-33.933, 18.474)
// wherAmI(19.037, 72.873)
// wherAmI(52.508, 13.381)


// const lotteryPromise = new Promise(function(resolve, reject) {
//     console.log('Drawing is happaning')
//     setTimeout(function() {
//         if (Math.random() >= .5) {
//             resolve('You won 🎉')
//         } else {
//             reject(new Error('You lost your money 💩'))
//         }
//     }, 2000)

// })

// lotteryPromise.then(res => console.log(res)).catch(err => console.error(err))




// wait(1)
//     .then(() => {
//         console.log('I waited for 1 second')
//         return wait(1)
//     })
//     .then(() => {
//         console.log('I waited for 2 seconds')
//         return wait(1)
//     }).then(() => {
//         console.log('I waited for 3 seconds')
//         return wait(1)
//     }).then(() => {
//         console.log('I waited for 4 seconds')
//         return wait(1)
//     })
//     .then(() => console.log('I waited for 5 seconds'));

// Promise.resolve('Promise is resolved').then((response) => console.log(response));
// Promise.reject(new Error('Promise is rejected')).catch((err) => console.error(err));



const getPosition = function() {
    return new Promise(function(resolve, reject) {
        // navigator.geolocation.getCurrentPosition(
        //     position => resolve(position),
        //     err => reject(err)
        // );
        navigator.geolocation.getCurrentPosition(resolve, reject)

    })
};

// getPosition().then(pos => console.log(pos));

const wherAmI = function() {

    getPosition().then(pos => {
            const { latitude: lat, longitude: lng } = pos.coords


            return fetch(` https://geocode.xyz/${lat},${lng}?geoit=json`)

        })
        .then(response => {
            if (!response.ok) throw new Error(`Beszoptad 👻(${response.status})`)
            return response.json()
        })
        .then(data => {
            console.log(`You are in ${data.city}, ${data.country}`)
            return fetch(`https://restcountries.eu/rest/v2/name/${data.country}`)
        })
        .then(response => {
            if (!response.ok) throw new Error(`there is any city 💥`)
            return response.json()
        })
        .then(data => {
            console.log('Itt vagyunk')
            renderCountry(data[0])
        })
        .catch(err => console.error(err.message))
};

btn.addEventListener('click', wherAmI)

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

// Prmosifying setTimeout 
const wait = function(seconds) {
    return new Promise(function(resolve) {
        setTimeout(resolve, seconds * 1000)
    })
}
const imgContainer = document.querySelector('.images');


const createImage = function(imgPath) {
    return new Promise(function(resolve, reject) {
        const img = document.createElement('img');
        img.src = imgPath

        img.addEventListener('load', function() {
            imgContainer.append(img)
            resolve(img)
        })
        img.addEventListener('error', function() {
            reject(new Error("Img is not loaded"))
        })

    })
};
let currentImg
createImage('img/img-1.jpg')
    .then(response => {

        currentImg = response
        return wait(2)

    }).then(() => {
        console.log('here')
        currentImg.style.display = "none"
        return createImage('img/img-2.jpg')

    }).then(response => {
        currentImg = response
        console.log()
        return wait(2)
    }).then(() => {
        currentImg.style.display = "none"
    }).catch(err => console.error(err));

const whereAmI = async function() {

    try {
        const pos = await getPosition();

        const { latitude: lat, longitude: lng } = pos.coords
            // let lat = 52.520008,
            //     lng = 13.404954
        const resGeo = await fetch(` https://geocode.xyz/${lat},${lng}?geoit=json`);

        if (!resGeo.ok) throw new Error('Problem getting location data')
        const dataGeo = await resGeo.json()


        const res = await fetch(`https://restcountries.eu/rest/v2/name/${dataGeo.country}`);

        if (!res.ok) throw new Error('Problem getting Country data')
        const data = await res.json()
        renderCountry(data[0])
        return `You are in ${dataGeo.city}, ${dataGeo.country}`

    } catch (err) {
        console.error(err)
        renderError(`Something went wrong 💩 ${err.message}`)
        throw err;
    }
}



console.log('1: Will get location');
// whereAmI()
//     .then(city => console.log(`2: ${city}`))
//     .catch(err => console.error(`2: ${err.message}💩`))
//     .finally(() => console.log("3: Finshed getting location"));

!async function() {
    try {

        const city = await whereAmI()
        console.log(`2: ${city}`)
    } catch (err) {
        console.error(err)
    }
    console.log('3: Finshed getting location')

}()


/////////////////// YDKJSY PRACTICING //////////////////////////
const dayStart = "07:30";
const dayEnd = "17:45";
let startDayMin = (dayStart.split(':')[0] * 60) + (+dayStart.split(':')[1])
let endDayMin = (dayEnd.split(':')[0] * 60) + (+dayEnd.split(':')[1])

function scheduleMeeting(startTime, durationMinutes) {
    let meetingStart = (startTime.split(':')[0] * 60) + (+startTime.split(':')[1])
    return (meetingStart >= startDayMin) && (endDayMin >= (meetingStart + durationMinutes))
}
// console.log(scheduleMeeting("7:00", 15)); // false
// console.log(scheduleMeeting("07:15", 30)); // false
// console.log(scheduleMeeting("7:30", 30)); // true
// console.log(scheduleMeeting("11:30", 60)); // true
// console.log(scheduleMeeting("17:00", 45)); // true
// console.log(scheduleMeeting("17:30", 30)); // false
// console.log(scheduleMeeting("18:00", 15)); // false

function range(start, end) {
    if (end == 0) return []
    if (start && end) {
        if (start == end) return [end]
        return Array.from({ length: end - start + 1 }, (_, i) => i + start)
    } else {
        return function createRangeOfNumber(end) {
            return Array.from({ length: end - start + 1 }, (_, i) => i + start)
        }
    }
}

// console.log(range(3, 3)) // [3]
// console.log(range(3, 8)); // [3,4,5,6,7,8]
// console.log(range(3, 0)); // []

// var start3 = range(3);
// var start4 = range(4);

// console.log(start3(3)); // [3]
// console.log(start3(8)); // [3,4,5,6,7,8]
// console.log(start3(0)); // []

// console.log(start4(6)); // [4,5,6]

function randMax(max) {
    return Math.trunc(1E9 * Math.random()) % max;
}

var reel = {
    symbols: [
        "♠", "♥", "♦", "♣", "☺", "★", "☾", "☀"
    ],
    spin() {
        if (this.position == null) {
            this.position = randMax(
                this.symbols.length - 1
            );
        }
        this.position = (
            this.position + 100 + randMax(100)
        ) % this.symbols.length;
    },
    display() {
        if (this.position == null) {
            this.position = randMax(
                this.symbols.length - 1
            );
        }
        return this.symbols[this.position];
    }
};


var slotMachine = {
    reels: [
        Object.create(reel),
        Object.create(reel),
        Object.create(reel)

        // this slot machine needs 3 separate reels
        // hint: Object.create(..)
    ],
    spin() {
        this.reels.forEach(function spinReel(reel) {
            reel.spin();
        });
    },
    display() {
        var lines = [];

        // display all 3 lines on the slot machine
        for (let linePos = -1; linePos <= 1; linePos++) {

            let line = this.reels.map(function getSlot(reel) {
                var slot = Object.create(reel);
                console.log(slot)
                slot.position = (
                    reel.symbols.length +
                    reel.position +
                    linePos
                ) % reel.symbols.length;



                console.log(
                    reel.symbols.length, '+', reel.position, '+', linePos,
                    '|', (reel.symbols.length + reel.position + linePos), '|',
                    '%', reel.symbols.length,
                    "result: ", slot.position % reel.symbols.length)

                return slot.display();
            });

            console.log(line)
            lines.push(line.join(" | "));
            console.log(lines)
        }

        return lines.join("\n");
    }
};


slotMachine.spin();
console.log(slotMachine.display());
// ☾ | ☀ | ★
// ☀ | ♠ | ☾
// ♠ | ♥ | ☀

slotMachine.spin();
console.log(slotMachine.display());
// ♦ | ♠ | ♣
// ♣ | ♥ | ☺
// ☺ | ♦ | ★