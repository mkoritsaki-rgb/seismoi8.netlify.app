const loadBtn = document.querySelector("#loadBtn");// Βρίσκει το κουμπί από το HTML με id loadBtn
const card = document.querySelector(".card");

const apiUrl =
"https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&minlatitude=34&maxlatitude=42&minlongitude=19&maxlongitude=29";//Αυτό είναι ένα link API από το USGS (σεισμοί)

loadBtn.addEventListener("click", async () => { //ταν γίνει click στο κουμπί: τρέχει μια async συνάρτηση (δηλαδή μπορεί να περιμένει δεδομένα)
    try { //Ξεκινά “ασφαλές μπλοκ” αν γίνει λάθος → πάει στο catch
        const data = await getEarthquakes(); // Περιμένει να πάρει δεδομένα από το API
        displayEarthquakes(data); //Στέλνει τα δεδομένα στη συνάρτηση που τα εμφανίζει
    } catch (error) {
        displayError(error.message);
    }
});

async function getEarthquakes() {
    const response = await fetch(apiUrl); // Κάνει αίτημα στο ΑΡΙ

    if (!response.ok) { //Αν το ΑΡΙ δεν απαντήσει σωστά
        throw new Error("Δεν ήταν δυνατή η λήψη δεδομένων σεισμών");
    }

    return await response.json();//Μετατρέπει τα δεδομένα σε JSON (JavaScript object)
}

function displayEarthquakes(data) {//Παίρνει τα δεδομένα και τα δείχνει στην οθόνη
    card.textContent = "";//Καθαρίζει την οθόνη από τα παλιά δεδομένα
    card.style.display = "flex";

    const quakes = data.features; // Παίρνει τη λίστα σεισμών από το API

    if (quakes.length === 0) {
        card.textContent = "Δεν βρέθηκαν σεισμοί στην Ελλάδα.";
        return;
    }

    quakes.forEach(quake => { //Για κάθε σεισμό κάνε τα παρακάτω:
        const props = quake.properties;//Πάρε τις πληροφορίες του σεισμού

        const mag = props.mag;//Το μέγεθος
        const place = props.place;//Την τοποθεσία
        const time = new Date(props.time).toLocaleString();//Μετατρέπει το timestamp σε ανθρώπινη ημερομηνία

        const item = document.createElement("p");//Φτιάχνει ένα νέο <p> στοιχείο

        item.textContent =
            `🇬🇷 M ${mag} - ${place} | ${time}`;//Βάζει μέσα το κείμενο του σεισμού

        card.appendChild(item);//Το προσθέτει στην κάρτα
    });
}

function displayError(message) {//Συνάρτηση για errors
    card.textContent = "";

    const error = document.createElement("p");
    error.textContent = message;
    error.classList.add("errorDisplay");//Προσθέτει CSS class για styling

    card.style.display = "flex";
    card.appendChild(error);
}