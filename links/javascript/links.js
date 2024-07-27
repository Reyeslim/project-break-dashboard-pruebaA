document.addEventListener("DOMContentLoaded", () => {
  const nameInput = document.getElementById('name');
  const urlInput = document.getElementById('url');
  const addLinkButton = document.getElementById('add-link-btn');
  const linksContainer = document.getElementById('listaEnlacesContainer').querySelector('ul');
  const modal = document.getElementById('enlacesContainer');
  const closeModalButton = document.getElementById('close-modal');

  // obtener enlaces del localStorage
  const getSavedLinks = () => {
      return JSON.parse(localStorage.getItem('links')) || [];
  };

  // renderizar y añadir enlaces al DOM
  const renderLinks = () => {
      linksContainer.innerHTML = ""; 
      const savedLinks = getSavedLinks(); 

      savedLinks.forEach(link => {
          const linkItem = createLinkItem(link.name, link.url);
          if (linkItem) {
              linksContainer.appendChild(linkItem);
          }
      });
  };

  // validar URL
  const isValidUrl = (urlString) => {
      try {
          new URL(urlString); 
// constructor URL para construir objeto con propiedades href (todo), protocol (https:), hostname (www.ejemplo.com), port, pathname (//)...
          return true;
      } catch (e) {
          return false;
      }
  };

  // elemento de enlace con botón de eliminar
  const createLinkItem = (name, url) => {
      if (!isValidUrl(url)) {
          console.error(`Invalid URL: ${url}`);
          return null; 
      }

      const linkItem = document.createElement('li');
      linkItem.classList.add("enlace");
      
      // favicon
      const faviconLink = document.createElement('a');
      faviconLink.href = url;
      faviconLink.target = "_blank";
      faviconLink.className = "favicon-link";

      const icon = document.createElement('img');
      const deleteButton = document.createElement('button');
      deleteButton.classList.add("deletebtn");

      const domain = new URL(url).hostname; // Obtener el dominio del URL para el favicon

      // Establecer el src del favicon usando el servicio de Google
      icon.src = `https://www.google.com/s2/favicons?domain=${domain}`;
      icon.alt = "Favicon";
      icon.className = "icon";

      deleteButton.textContent = 'X';
      deleteButton.addEventListener('click', (event) => {
          event.stopPropagation(); // Evitar que el clic en el botón propague el evento al favicon
          // Eliminar el enlace del localStorage
          const savedLinks = getSavedLinks();
          const updatedLinks = savedLinks.filter(link => link.name !== name || link.url !== url);
          localStorage.setItem('links', JSON.stringify(updatedLinks));

          // Eliminar el elemento del DOM
          linksContainer.removeChild(linkItem);
      });

      faviconLink.appendChild(icon);
      linkItem.appendChild(faviconLink); 

      // Añadir el nombre del enlace
      const linkElement = document.createElement('a');
      linkElement.href = url;
      linkElement.textContent = name;
      linkElement.target = "_blank"; 
      linkItem.appendChild(linkElement);

      // Añadir el botón de eliminar
      linkItem.appendChild(deleteButton);

      return linkItem;
  }

  //habilitar o deshabilitar el botón "Añadir enlace"
  const toggleAddLinkButton = () => {
      const name = nameInput.value.trim(); // por si el usuario mete espacios en blanco, trim los elimina
      const url = urlInput.value.trim();
      addLinkButton.disabled = !(name && url); 
  };

  nameInput.addEventListener('input', toggleAddLinkButton);
  urlInput.addEventListener('input', toggleAddLinkButton);

  // Evento para añadir un nuevo enlace
  addLinkButton.addEventListener('click', function() {
      const name = nameInput.value.trim();
      const url = urlInput.value.trim();

      // Validar que ambos campos no estén vacíos antes de añadir el enlace
      if (name && url && isValidUrl(url)) {
          const savedLinks = getSavedLinks();
          savedLinks.push({ name, url });
          localStorage.setItem('links', JSON.stringify(savedLinks));
          renderLinks(); 

          nameInput.value = '';
          urlInput.value = '';

          toggleAddLinkButton(); // para deshabilitar de nuevo el botón

          // Cerrar el modal después de añadir el enlace
          modal.classList.add('hidden');
      } else {
          alert("Por favor, introduce una URL válida.");
      }
  });

  // Mostrar el modal
  document.getElementById('añadir-acceso-directo').addEventListener('click', () => {
      modal.classList.remove('hidden');
      nameInput.value = '';
      urlInput.value = '';
      toggleAddLinkButton(); 
  });

  // Cerrar el modal al hacer clic en el botón de cerrar
  closeModalButton.addEventListener('click', () => {
      modal.classList.add('hidden');
      nameInput.value = '';
      urlInput.value = '';
      toggleAddLinkButton(); 
  });

  renderLinks();
});
