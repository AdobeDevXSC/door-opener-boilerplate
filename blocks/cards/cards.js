import { createOptimizedPicture } from '../../scripts/aem.js';

export default async function decorate(block) {
  const isJSON = block.classList.contains('is-json');
  const link = block.querySelector('a'); 

  async function fetchJson(link) {
    const response = await fetch(link?.href);

    if (response.ok) {
      const jsonData = await response.json();
      const data = jsonData?.data;
      return data;
    }
    return 'an error occurred';
  }

  const ul = document.createElement('ul');

	[...block.children].forEach((row) => {
		const anchor = document.createElement('a');
		anchor.href = '';
		const li = document.createElement('li');
		while (row.firstElementChild) li.append(row.firstElementChild);
		[...li.children].forEach((div) => {

		if (div.children.length === 1 && div.querySelector('picture')) {
			div.className = 'cards-card-image';
		} else if (div.children.length === 1 && div.querySelector('span')) {
			div.className = 'cards-card-icon';
		} else {
			div.className = 'cards-card-body';
		}
		});
		anchor.append(li);
		ul.append(anchor);
	});
  
  if (isJSON) {
    const cardData = await fetchJson(link);
    cardData.forEach((item) => {
      const picture = createOptimizedPicture(item.image, item.title, false, [{ width: 320 }]);
      picture.lastElementChild.width = '320';
      picture.lastElementChild.height = '180';

      const createdCard = document.createElement('li');

      createdCard.innerHTML = `
        <div class="cards-card-body">
			// place inner HTML structure based on JSON response as needed
        </div>
      `;
      ul.append(createdCard);
    });
  }

  block.textContent = '';
  block.append(ul);
}