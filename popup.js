document.addEventListener('DOMContentLoaded', () => {
  const tabsContainer = document.getElementById('tabs-list');
  const collectionsContainer = document.getElementById('collections-list');
  const saveCollectionButton = document.getElementById('save-collection');
  const collectionNameInput = document.getElementById('collection-name');

  // Load open tabs
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      const tabElement = document.createElement('div');
      tabElement.innerHTML = `
        <input type="checkbox" class="tab-checkbox" data-url="${tab.url}" />
        ${tab.title}
      `;
      tabsContainer.appendChild(tabElement);
    });
  });

  // Load collections
  function loadCollections() {
    chrome.storage.local.get(['collections'], (result) => {
      collectionsContainer.innerHTML = '';
      const collections = result.collections || [];
      if (collections.length === 0) {
        collectionsContainer.innerHTML = 'No collections present';
      } else {
        collections.forEach((collection, index) => {
          const collectionElement = document.createElement('div');
          collectionElement.classList.add('collection-item');
          collectionElement.innerHTML = `
            <span>${collection.name}</span>
            <button class="open-collection" data-index="${index}">
              Open
            </button>
            <button class="delete-collection" data-index="${index}">
              Delete
            </button>
          `;
          collectionsContainer.appendChild(collectionElement);
        });
      }
    });
  }
  loadCollections();

  // Save selected tabs as a collection
  saveCollectionButton.addEventListener('click', () => {
    const selectedTabs = Array.from(document.querySelectorAll('.tab-checkbox:checked')).map((checkbox) => checkbox.getAttribute('data-url'));
    const collectionName = collectionNameInput.value.trim();

    if (selectedTabs.length > 0 && collectionName) {
      chrome.storage.local.get(['collections'], (result) => {
        const collections = result.collections || [];
        collections.push({ name: collectionName, urls: selectedTabs });
        chrome.storage.local.set({ collections }, () => {
          collectionNameInput.value = '';
          loadCollections();
        });
      });
    } else {
      alert('Please enter a collection name and select at least one tab.');
    }
  });

  // Open collection tabs
  collectionsContainer.addEventListener('click', (event) => {
    if (event.target.classList.contains('open-collection')) {
      const collectionIndex = event.target.getAttribute('data-index');
      chrome.storage.local.get(['collections'], (result) => {
        const collection = result.collections[collectionIndex];
        collection.urls.forEach((url) => {
          chrome.tabs.query({ url }, (tabs) => {
            if (tabs.length === 0) {
              chrome.tabs.create({ url });
            }
          });
        });
      });
    } else if (event.target.classList.contains('delete-collection')) {
      const collectionIndex = event.target.getAttribute('data-index');
      chrome.storage.local.get(['collections'], (result) => {
        let collections = result.collections || [];
        collections.splice(collectionIndex, 1);
        chrome.storage.local.set({ collections }, () => {
          loadCollections();
        });
      });
    }
  });
});
