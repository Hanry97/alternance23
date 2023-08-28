async function readdata() {
    const response = await fetch("./../data/data.json")
    if (response.ok) {
        data = await response.json()
       return data;
    }
    return null
}


