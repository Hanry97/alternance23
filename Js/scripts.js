async function readdata() {
    const response = await fetch("./../data/data.json")
    if (response.ok) {
        data = await response.json()
        console.log(data)
    }
}


const data = readdata().then(r => {})
const candidat = data.candidats;
const votes = data.votes