document.addEventListener("DOMContentLoaded", () => {
  const toyCollection = document.getElementById('toy-collection');
  const addToyForm = document.querySelector('.add-toy-form');
  const newToyBtn = document.getElementById('new-toy-btn');
  const container = document.querySelector('.container');

  // Fetch and render toys from the API
  fetch('http://localhost:3000/toys')
    .then(response => response.json())
    .then(toys => {
      toys.forEach(toy => addToyToDOM(toy));
    })
    .catch(error => console.error('Error:', error));

  // Toggle form visibility
  newToyBtn.addEventListener('click', () => {
    container.style.display = container.style.display === 'none' ? 'block' : 'none';
  });

  // Add event listener to the form to add a new toy
  addToyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const toyName = e.target.name.value;
    const toyImage = e.target.image.value;

    // Create a new toy object
    const newToy = {
      name: toyName,
      image: toyImage,
      likes: 0 // Initial likes set to 0
    };

    // Send a POST request to the server to add the new toy
    fetch('http://localhost:3000/toys', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newToy)
    })
    .then(response => response.json())
    .then(toy => {
      addToyToDOM(toy);
      // Clear the form
      e.target.name.value = '';
      e.target.image.value = '';
    })
    .catch(error => console.error('Error:', error));
  });

  // Function to add a toy to the DOM
  function addToyToDOM(toy) {
    const toyCard = document.createElement('div');
    toyCard.className = 'card';

    const h2 = document.createElement('h2');
    h2.textContent = toy.name;
    toyCard.appendChild(h2);

    const img = document.createElement('img');
    img.src = toy.image;
    img.className = 'toy-avatar';
    toyCard.appendChild(img);

    const p = document.createElement('p');
    p.textContent = `${toy.likes} Likes`;
    toyCard.appendChild(p);

    const button = document.createElement('button');
    button.className = 'like-btn';
    button.id = toy.id; // Use the toy's ID from the server
    button.textContent = 'Like <3';
    toyCard.appendChild(button);

    // Add event listener to the like button
    button.addEventListener('click', () => {
      updateLikes(toy, p);
    });

    toyCollection.appendChild(toyCard);
  }

  // Function to update likes
  function updateLikes(toy, likeElement) {
    const newLikes = toy.likes + 1;

    fetch(`http://localhost:3000/toys/${toy.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ likes: newLikes })
    })
    .then(response => response.json())
    .then(updatedToy => {
      toy.likes = updatedToy.likes; // Update the local toy object
      likeElement.textContent = `${updatedToy.likes} Likes`; // Update the DOM
    })
    .catch(error => console.error('Error:', error));
  }
});
