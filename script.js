const searchBtn = document.getElementById('search-btn');
const drugNameInput = document.getElementById('drug-name');
const resultsDiv = document.getElementById('results');

searchBtn.addEventListener('click', () => {
    const drugName = drugNameInput.value.trim();
    if (drugName) {
        searchDrugs(drugName);
    }
});

async function searchDrugs(drugName) {
    resultsDiv.innerHTML = 'Searching...';

    const url = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drugName}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        displayResults(data);
    } catch (error) {
        resultsDiv.innerHTML = 'An error occurred while fetching data.';
        console.error(error);
    }
}

function displayResults(data) {
    resultsDiv.innerHTML = '';

    if (data.drugGroup.conceptGroup) {
        data.drugGroup.conceptGroup.forEach(group => {
            if (group.conceptProperties) {
                group.conceptProperties.forEach(drug => {
                    const drugCard = document.createElement('div');
                    drugCard.className = 'drug-card';

                    const drugName = document.createElement('h3');
                    drugName.textContent = drug.name;
                    drugCard.appendChild(drugName);

                    const synonym = document.createElement('p');
                    synonym.textContent = `Synonym: ${drug.synonym}`;
                    drugCard.appendChild(synonym);

                    const rxcui = document.createElement('p');
                    rxcui.textContent = `RxCUI: ${drug.rxcui}`;
                    drugCard.appendChild(rxcui);

                    resultsDiv.appendChild(drugCard);
                });
            }
        });
    } else {
        resultsDiv.innerHTML = 'No results found.';
    }
}
