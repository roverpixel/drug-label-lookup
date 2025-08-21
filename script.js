const searchBtn = document.getElementById('search-btn');
const drugNameInput = document.getElementById('drug-name');
const resultsDiv = document.getElementById('results');
const formatToggle = document.getElementById('format-toggle');

let lastSearchData = null;

searchBtn.addEventListener('click', () => {
    const drugName = drugNameInput.value.trim();
    if (drugName) {
        searchDrugs(drugName);
    }
});

function handleFormatToggle() {
    if (lastSearchData) {
        displayResults(lastSearchData);
    }
}

async function searchDrugs(drugName) {
    resultsDiv.innerHTML = 'Searching...';

    const url = `https://rxnav.nlm.nih.gov/REST/drugs.json?name=${drugName}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        lastSearchData = data;
        displayResults(data);
    } catch (error) {
        lastSearchData = null;
        resultsDiv.innerHTML = 'An error occurred while fetching data.';
        console.error(error);
    }
}

function displayResults(data) {
    if (formatToggle.checked) {
        displayResultsAsTable(data);
    } else {
        displayResultsAsCards(data);
    }
}

function displayResultsAsCards(data) {
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

function displayResultsAsTable(data) {
    resultsDiv.innerHTML = '';

    if (data.drugGroup.conceptGroup) {
        const table = document.createElement('table');
        const thead = document.createElement('thead');
        const tbody = document.createElement('tbody');

        // Create table header
        const headerRow = document.createElement('tr');
        ['Name', 'Synonym', 'RxCUI'].forEach(headerText => {
            const th = document.createElement('th');
            th.textContent = headerText;
            headerRow.appendChild(th);
        });
        thead.appendChild(headerRow);
        table.appendChild(thead);

        // Create table body
        data.drugGroup.conceptGroup.forEach(group => {
            if (group.conceptProperties) {
                group.conceptProperties.forEach(drug => {
                    const row = document.createElement('tr');

                    const nameCell = document.createElement('td');
                    nameCell.textContent = drug.name;
                    row.appendChild(nameCell);

                    const synonymCell = document.createElement('td');
                    synonymCell.textContent = drug.synonym;
                    row.appendChild(synonymCell);

                    const rxcuiCell = document.createElement('td');
                    rxcuiCell.textContent = drug.rxcui;
                    row.appendChild(rxcuiCell);

                    tbody.appendChild(row);
                });
            }
        });
        table.appendChild(tbody);
        resultsDiv.appendChild(table);
    } else {
        resultsDiv.innerHTML = 'No results found.';
    }
}
