document.addEventListener('DOMContentLoaded', () => {
    const themeToggleButton = document.getElementById('theme-toggle');
    const navigationMenu = document.getElementById('navigation-menu');
    const articleContent = document.getElementById('article-content');
    const searchInput = document.getElementById('search-input');
    const randomArticleButton = document.getElementById('random-article-button');

    // --- Theme Toggling ---
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    themeToggleButton.textContent = currentTheme === 'dark' ? '☀️' : '🌙';

    themeToggleButton.addEventListener('click', () => {
        let theme = document.documentElement.getAttribute('data-theme');
        theme = theme === 'light' ? 'dark' : 'light';
        themeToggleButton.textContent = theme === 'dark' ? '☀️' : '🌙';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    });

    // --- 1. Data Initialization ---
    const allArticles = [];
    database.categories.forEach(category => {
        category.subcategories.forEach(subcategory => {
            subcategory.articles.forEach(article => {
                allArticles.push({ ...article, category: category.name, subcategory: subcategory.name });
            });
        });
    });

    const fuse = new Fuse(allArticles, { keys: ['title'], includeScore: true, threshold: 0.2 });

    // --- 2. UI Rendering Functions ---

    /**
     * Renders a grid of article cards in the main content area.
     * @param {Array} articles - The articles to display as cards.
     */
    function displayArticleCards(articles) {
        articleContent.innerHTML = ''; // Clear the area
        const cardGrid = document.createElement('div');
        cardGrid.className = 'card-grid';

        if (articles.length === 0) {
            cardGrid.innerHTML = '<p>Nenhum artigo encontrado.</p>';
        } else {
            articles.forEach(article => {
                const card = document.createElement('div');
                card.className = 'article-card';
                card.dataset.file = article.file;
                card.innerHTML = `
                    <img src="${article.image}" alt="Imagem ilustrativa para ${article.title}">
                    <div class="card-content">
                        <h3>${article.title}</h3>
                        <p>${article.summary}</p>
                    </div>
                `;
                cardGrid.appendChild(card);
            });
        }
        articleContent.appendChild(cardGrid);
    }

    /**
     * Renders the nested navigation menu in the sidebar.
     */
    function generateNavMenu() {
        navigationMenu.innerHTML = '';
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

    // --- 3. Article Loading & Routing ---

    async function loadArticle(fileName) {
        try {
            const response = await fetch(`content/${fileName}`);
            if (!response.ok) throw new Error('Artigo não encontrado.');
            const markdown = await response.text();

            const articleContainer = document.createElement('div');
            articleContainer.className = 'article-view';
            articleContainer.innerHTML = marked.parse(markdown);

            articleContent.innerHTML = ''; // Clear previous content (cards or article)
            articleContent.appendChild(articleContainer);

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
            displayArticleCards(allArticles); // Show all cards by default
        }
    }

    // --- 4. Event Listeners ---

    // Listener for the main content area (for card clicks)
    articleContent.addEventListener('click', (event) => {
        const card = event.target.closest('.article-card');
        if (card) {
            window.location.hash = card.dataset.file;
        }
    });

    // Listener for the random article button
    randomArticleButton.addEventListener('click', () => {
        const randomIndex = Math.floor(Math.random() * allArticles.length);
        const randomArticle = allArticles[randomIndex];
        if (randomArticle) {
            window.location.hash = randomArticle.file;
        }
    });

    // Listeners for the sidebar navigation
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
            displayArticleCards(allArticles); // Show all cards if search is cleared
        } else {
            const results = fuse.search(query);
            const resultArticles = results.map(result => result.item);
            displayArticleCards(resultArticles);
        }
    });

    // --- 5. Initial Setup ---
    generateNavMenu();
    handleRouting();
    window.addEventListener('hashchange', handleRouting);
});