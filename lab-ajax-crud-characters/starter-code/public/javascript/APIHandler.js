class APIHandler {
  constructor (baseUrl) {
    this.BASE_URL = baseUrl;
  }

  getFullList () {
    return axios.get(this.BASE_URL)
    .then(response => {
        return response.data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  getOneRegister (id) {
    return axios.get(this.BASE_URL + id)
    .then(response => {
       return response.data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  createOneRegister (newCharacter) {
    return axios.post(this.BASE_URL, newCharacter)
    .then(response => {
      return response.data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  updateOneRegister (id, updatedCharacter) {
    return axios.put(this.BASE_URL + id, updatedCharacter)
    .then(response => {
        return response.data;
    })
    .catch(err => {
      console.log(err);
    });
  }

  deleteOneRegister (id) {
    axios.delete(this.BASE_URL + id)
    .then(response => {
        console.log(response.data);
    })
    .catch(err => {
      console.log(err);
    });
  }
}
