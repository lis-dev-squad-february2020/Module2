const charactersAPI = new APIHandler('http://localhost:8000/characters/');

window.addEventListener('load', () => {
  document.getElementById('fetch-all').addEventListener('click', (event) => {
    
    charactersAPI.getFullList().then((result) => {
      let charactersContainer = document.getElementsByClassName("characters-container")[0];
      charactersContainer.innerHTML = "";
      result.forEach((character) => {
        charactersContainer.innerHTML += `
        <div class="character-info">
          <div class="name">Name: ${character.name}</div>
          <div class="occupation">Occupation ${character.occupation}</div>
          <div class="cartoon">Cartoon: ${character.cartoon}</div>
          <div class="weapon">Weapon: ${character.weapon}</div>
        </div>
        `;
      });
    });
  });

  document.getElementById('fetch-one').addEventListener('click', (event) => {
    let id = document.getElementsByName("character-id")[0].value;

    charactersAPI.getOneRegister(id).then((character) => {
      let charactersContainer = document.getElementsByClassName("characters-container")[0];

      charactersContainer.innerHTML=`
      <div class="character-info">
        <div class="name">Name: ${character.name}</div>
        <div class="occupation">Occupation ${character.occupation}</div>
        <div class="cartoon">Cartoon: ${character.cartoon}</div>
        <div class="weapon">Weapon: ${character.weapon}</div>
      </div>
      `;    
    });
  });

  document.getElementById('delete-one').addEventListener('click', (event) => {
    let id = document.getElementsByName("character-id-delete")[0].value;

    charactersAPI.deleteOneRegister(id);
  });

  document.getElementById('edit-character-form').addEventListener('submit', (event) => {
    event.preventDefault();
    let id = document.getElementsByName("chr-id")[0].value;
    let newCharacter = {
      "name": document.getElementsByName("name")[1].value,
      "occupation": document.getElementsByName("occupation")[1].value,
      "weapon": document.getElementsByName("weapon")[1].value,
      "cartoon": document.getElementsByName("cartoon")[1].checked
    };

    charactersAPI.updateOneRegister(id, newCharacter).then((result) => {
    });
  });

  document.getElementById('new-character-form').addEventListener('submit', (event) => {
    event.preventDefault();
    let newCharacter = {
      "name": document.getElementsByName("name")[0].value,
      "occupation": document.getElementsByName("occupation")[0].value,
      "weapon": document.getElementsByName("weapon")[0].value,
      "cartoon": document.getElementsByName("cartoon")[0].checked
    };

    charactersAPI.createOneRegister(newCharacter).then((result) => {
    });
  });
});
