document.addEventListener('DOMContentLoaded', () => {
    const navigationMenu = document.getElementById('navigation-menu');
    const articleContent = document.getElementById('article-content');
    const searchInput = document.getElementById('search-input');

    // --- 1. Data Initialization ---
    // Populate the full list of articles from the database source. This happens only once.
    const allArticles = [];
    database.categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
            subcategory.articles.forEach(article => {
                allArticles.push({ ...article, category: category.name, subcategory: subcategory.name });
            });
        });
    });

    // Initialize Fuse.js with the complete list of articles.
    const fuse = new Fuse(allArticles, {
        keys: ['title'],
        includeScore: true,
        threshold: 0.2, // Stricter search
    });

    // --- 2. UI Rendering Functions ---

    /**
     * Renders the full, nested navigation menu from the original database.
     */
    function generateMenu() {
        navigationMenu.innerHTML = ''; // Clear the menu
        database.categories.forEach(category => {
            const categoryDiv = document.createElement('div');
            categoryDiv.className = 'category';
            const categoryName = document.createElement('span');
            categoryName.textContent = category.name;
            categoryName.setAttribute('role', 'button');
            categoryName.setAttribute('tabindex', '0');
            categoryDiv.appendChild(categoryName);

            category.subcategories.forEach(subcategory => {
                const subcategoryDiv = document.createElement('div');
                subcategoryDiv.className = 'subcategory';
                const subcategoryName = document.createElement('span');
                subcategoryName.textContent = subcategory.name;
                subcategoryName.setAttribute('role', 'button');
                subcategoryName.setAttribute('tabindex', '0');
                subcategoryDiv.appendChild(subcategoryName);

                const articleList = document.createElement('ul');
                subcategory.articles.forEach(article => {
                    const articleItem = document.createElement('li');
                    const articleLink = document.createElement('a');
                    articleLink.href = `#${article.file}`;
                    articleLink.textContent = article.title;
                    articleLink.dataset.file = article.file;
                    articleItem.appendChild(articleLink);
                    articleList.appendChild(articleItem);
                });
                subcategoryDiv.appendChild(articleList);
                categoryDiv.appendChild(subcategoryDiv);
            });
            navigationMenu.appendChild(categoryDiv);
        });
    }

    /**
     * Renders a flat list of articles based on search results.
     * @param {Array} articles - The articles to display.
     */
    function displaySearchResults(articles) {
        navigationMenu.innerHTML = ''; // Clear the menu
        const searchResultList = document.createElement('ul');
        if (articles.length === 0) {
            const noResultsItem = document.createElement('li');
            noResultsItem.textContent = 'Nenhum resultado encontrado.';
            searchResultList.appendChild(noResultsItem);
        } else {
            articles.forEach(article => {
                const articleItem = document.createElement('li');
                const articleLink = document.createElement('a');
                articleLink.href = `#${article.file}`;
                articleLink.textContent = article.title;
                articleLink.dataset.file = article.file;
                articleItem.appendChild(articleLink);
                searchResultList.appendChild(articleItem);
            });
        }
        navigationMenu.appendChild(searchResultList);
    }

    // --- 3. Article Loading & Routing ---

    async function loadArticle(fileName) {
        try {
            const response = await fetch(`content/${fileName}`);
            if (!response.ok) throw new Error('Artigo não encontrado.');
            const markdown = await response.text();
            articleContent.innerHTML = marked.parse(markdown);
            updateActiveLink(fileName);
        } catch (error) {
            articleContent.innerHTML = `<p>Erro ao carregar o artigo: ${error.message}</p>`;
        }
    }

    function updateActiveLink(fileName) {
        document.querySelectorAll('#navigation-menu a').forEach(link => {
            link.classList.remove('active');
            if (link.dataset.file === fileName) {
                link.classList.add('active');
            }
        });
    }

    function handleRouting() {
        const fileName = window.location.hash.substring(1);
        if (fileName) {
            loadArticle(fileName);
        } else {
            articleContent.innerHTML = '<h2>Bem-vindo ao Almanaque Digital!</h2><p>Selecione um artigo no menu ao lado para começar a ler.</p>';
        }
    }

    // --- 4. Event Listeners (using event delegation) ---

    navigationMenu.addEventListener('click', (event) => {
        const target = event.target;
        if (target.tagName === 'SPAN' && target.getAttribute('role') === 'button') {
            target.parentElement.classList.toggle('open');
        }
        if (target.tagName === 'A') {
            event.preventDefault();
            window.location.hash = target.dataset.file;
        }
    });

    navigationMenu.addEventListener('keydown', (event) => {
        const target = event.target;
        if (target.tagName === 'SPAN' && target.getAttribute('role') === 'button') {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                target.parentElement.classList.toggle('open');
            }
        }
    });

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim();
        if (query === '') {
            generateMenu();
        } else {
            const results = fuse.search(query);
            const resultArticles = results.map(result => result.item);
            displaySearchResults(resultArticles);
        }
    });

    // --- 5. Initial Setup ---
    generateMenu();
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
});