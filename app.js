// tutorial: https://www.youtube.com/watch?v=gcx-3qi7t7c

const apiKey = '192fef3aacb54c6e92c3a8ee423c9420';
const main = document.querySelector('main');
const sourceSelector = document.querySelector('#sourceSelector');
const defaultSource = 'the-washington-post';

window.addEventListener('load', async e => {
    updateNews();
    await updateSources();
    sourceSelector.value = defaultSource;

    sourceSelector.addEventListener('change', (e) => {
        console.log('asdasda');
        updateNews(e.target.value);
    });

    if('serviceWorker' in navigator) {
        try {
            navigator.serviceWorker.register('sw.js');
            console.log('SW registered');
        } catch (e) {
            console.log('registeration failed');
        }
    }
});

async function updateSources() {
    const result = await fetch(`https://newsapi.org/v1/sources`);
    const json = await result.json();

    sourceSelector.innerHTML = json.sources.map(
        src => `<option value="${src.id}">${src.name}</option>`
    ).join('\n');
}

async function updateNews(source = defaultSource) {
    const result = await fetch(`https://newsapi.org/v1/articles?source=${source}&apiKey=${apiKey}`);
    const json = await result.json();

    main.innerHTML = json.articles.map(createArticle).join('\n');
}


function createArticle(article) {
    return `
        <div class="article">
            <a href="${article.href}">
                <h2>${article.title}</h2>
                <img src="${article.urlToImage}" />
                <p>${article.description}</p>
            </a>
        </div>
    `;
}
