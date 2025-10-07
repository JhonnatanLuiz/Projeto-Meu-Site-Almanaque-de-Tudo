// ===================================================
// ALMANAQUE DE TUDO - SISTEMA COMPLETO
// ===================================================

// ===== CARREGAMENTO DE DADOS =====
let siteData = {
    categories: [],
    articles: [],
    popularSearches: [],
    recentlyAdded: [],
    trending: []
};

let fuseInstance = null;

// Carregar dados do JSON
async function loadData() {
    try {
        const response = await fetch('data.json');
        siteData = await response.json();
        
        // Inicializar Fuse.js para busca fuzzy
        initializeSearch();
        
        // Popular interface
        populateCategories();
        populateSidebar();
        populatePopularSearches();
        loadArticles();
        
        console.log('✅ Dados carregados com sucesso');
    } catch (error) {
        console.error('❌ Erro ao carregar dados:', error);
        // Fallback: usar dados mock
        useMockData();
    }
}

// Inicializar busca com Fuse.js
function initializeSearch() {
    const options = {
        keys: [
            { name: 'title', weight: 0.5 },
            { name: 'summary', weight: 0.3 },
            { name: 'content', weight: 0.1 },
            { name: 'tags', weight: 0.1 }
        ],
        threshold: 0.3,
        includeScore: true,
        minMatchCharLength: 2
    };
    
    fuseInstance = new Fuse(siteData.articles, options);
}

// Usar dados mock se data.json falhar
function useMockData() {
    siteData = {
        categories: [
            { id: 'ciencia', name: 'Ciência', icon: 'fa-flask', color: '#3b82f6', subcategories: [] },
            { id: 'historia', name: 'História', icon: 'fa-landmark', color: '#8b5cf6', subcategories: [] },
            { id: 'tecnologia', name: 'Tecnologia', icon: 'fa-microchip', color: '#10b981', subcategories: [] }
        ],
        articles: [],
        popularSearches: ['física quântica', 'inteligência artificial', 'história do brasil'],
        recentlyAdded: [],
        trending: []
    };
    populateCategories();
    populateSidebar();
}

// ===== TOGGLE MODO DARK/LIGHT =====
const themeToggle = document.getElementById('theme-toggle');
const body = document.body;
const themeIcon = themeToggle.querySelector('i');

const currentTheme = localStorage.getItem('theme') || 'dark';
if (currentTheme === 'light') {
    body.classList.remove('dark-mode');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
} else {
    body.classList.add('dark-mode');
    themeIcon.classList.replace('fa-sun', 'fa-moon');
}

themeToggle.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeIcon.classList.replace('fa-sun', 'fa-moon');
        localStorage.setItem('theme', 'dark');
    } else {
        themeIcon.classList.replace('fa-moon', 'fa-sun');
        localStorage.setItem('theme', 'light');
    }
});

// ===== BUSCA WIKIPEDIA =====
const wikiSearchInput = document.getElementById('wiki-search');
const wikiSearchBtn = document.getElementById('wiki-search-btn');

function searchWikipedia() {
    const query = wikiSearchInput.value.trim();
    if (query) {
        const url = `https://pt.wikipedia.org/wiki/${encodeURIComponent(query.replace(/ /g, '_'))}`;
        window.open(url, '_blank', 'noopener,noreferrer');
        wikiSearchInput.value = '';
    }
}

wikiSearchBtn.addEventListener('click', searchWikipedia);

wikiSearchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWikipedia();
    }
});

// ===== NAVEGAÇÃO ATIVA =====
const navLinks = document.querySelectorAll('.nav-link');

navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
        // Se for link externo ou com href real, permitir navegação normal
        if (this.getAttribute('href').startsWith('http') || 
            this.getAttribute('href').endsWith('.html')) {
            return; // Deixa o navegador seguir o link
        }
        
        // Para links internos (#), prevenir comportamento padrão
        if (this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
        }
    });
});

// Marcar link ativo baseado na página atual
document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    navLinks.forEach(link => {
        const linkHref = link.getAttribute('href');
        if (linkHref === currentPage || 
            (currentPage === '' && linkHref === 'index.html')) {
            link.classList.add('active');
        }
    });
});

navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
            e.preventDefault();
        }
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
    });
});

// ===== FILTRO DE CATEGORIAS =====
const categoryLinks = document.querySelectorAll('[data-category]');
const posts = document.querySelectorAll('.post');

categoryLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.getAttribute('data-category');
        
        // Filtrar posts por categoria (exemplo simples)
        posts.forEach(post => {
            const postText = post.textContent.toLowerCase();
            const categoryMatch = postText.includes(category.toLowerCase());
            
            if (categoryMatch || category === 'todos') {
                post.style.display = 'block';
                // Animação de entrada
                setTimeout(() => {
                    post.classList.add('active');
                }, 50);
            } else {
                post.style.display = 'none';
            }
        });
        
        // Scroll suave para o topo do conteúdo
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
});

// ===== BOTÕES DE COMPARTILHAR E COPIAR LINK =====
const shareButtons = document.querySelectorAll('.share-btn');
const copyLinkButtons = document.querySelectorAll('.copy-link-btn');

shareButtons.forEach(btn => {
    btn.addEventListener('click', async function() {
        const post = this.closest('.post');
        const title = post.querySelector('h2').textContent;
        const url = window.location.href;
        
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: `Confira este artigo: ${title}`,
                    url: url
                });
            } catch (err) {
                console.log('Compartilhamento cancelado');
            }
        } else {
            alert('Seu navegador não suporta compartilhamento nativo.\nUse o botão "Copiar link" para compartilhar.');
        }
    });
});

copyLinkButtons.forEach(btn => {
    btn.addEventListener('click', async function() {
        const url = window.location.href;
        
        try {
            await navigator.clipboard.writeText(url);
            
            // Feedback visual
            const originalText = this.textContent;
            this.textContent = '✓ Link copiado!';
            this.style.backgroundColor = '#238636';
            
            setTimeout(() => {
                this.textContent = originalText;
                this.style.backgroundColor = '';
            }, 2000);
        } catch (err) {
            // Fallback para navegadores antigos
            const tempInput = document.createElement('input');
            tempInput.value = url;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            
            alert('Link copiado para a área de transferência!');
        }
    });
});

// ===== SCROLL REVEAL ANIMATION =====
const revealElements = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

revealElements.forEach(el => revealObserver.observe(el));

// ===================================================
// MODAL DE BUSCA AVANÇADA
// ===================================================

const searchToggle = document.getElementById('search-toggle');
const searchModal = document.getElementById('search-modal');
const searchClose = document.getElementById('search-close');
const searchInput = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
const filterCategory = document.getElementById('filter-category');
const filterSort = document.getElementById('filter-sort');

// Abrir modal de busca
searchToggle?.addEventListener('click', () => {
    searchModal.classList.add('active');
    searchModal.setAttribute('aria-hidden', 'false');
    searchInput.focus();
});

// Fechar modal
searchClose?.addEventListener('click', closeSearchModal);

searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) {
        closeSearchModal();
    }
});

function closeSearchModal() {
    searchModal.classList.remove('active');
    searchModal.setAttribute('aria-hidden', 'true');
    searchInput.value = '';
    searchResults.innerHTML = '<div class="search-suggestions"><h3>Buscas populares:</h3><div id="popular-searches" class="tag-list"></div></div>';
    populatePopularSearches();
}

// Busca em tempo real
let searchTimeout;
searchInput?.addEventListener('input', (e) => {
    clearTimeout(searchTimeout);
    const query = e.target.value.trim();
    
    if (query.length === 0) {
        searchResults.innerHTML = '<div class="search-suggestions"><h3>Buscas populares:</h3><div id="popular-searches" class="tag-list"></div></div>';
        populatePopularSearches();
        return;
    }
    
    if (query.length < 2) return;
    
    searchTimeout = setTimeout(() => {
        performSearch(query);
    }, 300);
});

// Executar busca
function performSearch(query) {
    if (!fuseInstance) {
        searchResults.innerHTML = '<div class="search-no-results"><i class="fas fa-exclamation-circle"></i><p>Sistema de busca não disponível</p></div>';
        return;
    }
    
    let results = fuseInstance.search(query);
    
    // Aplicar filtro de categoria
    const categoryFilter = filterCategory.value;
    if (categoryFilter) {
        results = results.filter(r => r.item.category === categoryFilter);
    }
    
    // Aplicar ordenação
    const sortBy = filterSort.value;
    results = sortSearchResults(results, sortBy);
    
    displaySearchResults(results, query);
}

// Ordenar resultados
function sortSearchResults(results, sortBy) {
    const sorted = [...results];
    
    switch (sortBy) {
        case 'date-desc':
            return sorted.sort((a, b) => new Date(b.item.date) - new Date(a.item.date));
        case 'date-asc':
            return sorted.sort((a, b) => new Date(a.item.date) - new Date(b.item.date));
        case 'title':
            return sorted.sort((a, b) => a.item.title.localeCompare(b.item.title));
        case 'relevance':
        default:
            return sorted;
    }
}

// Exibir resultados
function displaySearchResults(results, query) {
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-no-results">
                <i class="fas fa-search"></i>
                <p>Nenhum resultado encontrado para "${query}"</p>
                <p style="font-size: 0.9rem; margin-top: 0.5rem;">Tente usar palavras-chave diferentes</p>
            </div>
        `;
        return;
    }
    
    const html = results.map(result => {
        const article = result.item;
        const category = siteData.categories.find(c => c.id === article.category);
        
        return `
            <div class="search-result-item" data-article-id="${article.id}">
                <h4>${highlightText(article.title, query)}</h4>
                <p>${highlightText(article.summary, query)}</p>
                <div class="search-result-meta">
                    <span><i class="fas fa-folder"></i> ${category?.name || article.category}</span>
                    <span><i class="fas fa-clock"></i> ${article.readTime}</span>
                    <span><i class="fas fa-calendar"></i> ${formatDate(article.date)}</span>
                </div>
            </div>
        `;
    }).join('');
    
    searchResults.innerHTML = html;
    
    // Adicionar evento de clique nos resultados
    document.querySelectorAll('.search-result-item').forEach(item => {
        item.addEventListener('click', () => {
            const articleId = item.dataset.articleId;
            loadArticle(articleId);
            closeSearchModal();
        });
    });
}

// Destacar termos de busca
function highlightText(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
}

// Popular buscas populares
function populatePopularSearches() {
    const container = document.getElementById('popular-searches');
    if (!container || !siteData.popularSearches) return;
    
    container.innerHTML = siteData.popularSearches.map(term => 
        `<span class="tag">${term}</span>`
    ).join('');
    
    container.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            searchInput.value = tag.textContent;
            performSearch(tag.textContent);
        });
    });
}

// ===================================================
// MENU LATERAL (SIDEBAR MENU)
// ===================================================

const sidebarToggle = document.getElementById('sidebar-toggle');
const sidebarMenu = document.getElementById('sidebar-menu');
const sidebarClose = document.getElementById('sidebar-close');

sidebarToggle?.addEventListener('click', () => {
    sidebarMenu.classList.add('active');
    sidebarToggle.setAttribute('aria-expanded', 'true');
});

sidebarClose?.addEventListener('click', closeSidebar);

function closeSidebar() {
    sidebarMenu.classList.remove('active');
    sidebarToggle.setAttribute('aria-expanded', 'false');
}

// Fechar ao clicar fora (apenas em mobile)
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
        if (!sidebarMenu.contains(e.target) && !sidebarToggle.contains(e.target)) {
            closeSidebar();
        }
    }
});

// ===================================================
// POPULAR CATEGORIAS
// ===================================================

function populateCategories() {
    // Popular no filtro de busca
    if (filterCategory && siteData.categories) {
        filterCategory.innerHTML = '<option value="">Todas as categorias</option>' +
            siteData.categories.map(cat => 
                `<option value="${cat.id}">${cat.name}</option>`
            ).join('');
    }
    
    // Popular no menu lateral (hambúrguer)
    const categoryNav = document.getElementById('category-nav');
    if (categoryNav && siteData.categories) {
        categoryNav.innerHTML = siteData.categories.map(cat => `
            <li>
                <a href="${cat.id}.html" data-category="${cat.id}">
                    <i class="fas ${cat.icon} cat-icon-${cat.id}"></i>
                    ${cat.name}
                </a>
            </li>
        `).join('');
    }
}

// Popular sidebar
function populateSidebar() {
    const categoryListSidebar = document.getElementById('category-list-sidebar');
    if (categoryListSidebar && siteData.categories && categoryListSidebar.children.length === 0) {
        categoryListSidebar.innerHTML = siteData.categories.map(cat => `
            <li>
                <a href="${cat.id}.html" data-category="${cat.id}">
                    <i class="fas ${cat.icon} cat-icon-${cat.id}"></i> ${cat.name}
                </a>
            </li>
        `).join('');
    }
    
    // Popular tags populares
    populatePopularTags();
}


function populatePopularTags() {
    const container = document.getElementById('popular-tags');
    if (!container || !siteData.articles) return;
    
    // Extrair todas as tags
    const allTags = siteData.articles.flatMap(a => a.tags || []);
    const tagCount = allTags.reduce((acc, tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
        return acc;
    }, {});
    
    // Ordenar por frequência
    const topTags = Object.entries(tagCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10)
        .map(([tag]) => tag);
    
    container.innerHTML = topTags.map(tag => 
        `<span class="tag" data-tag="${tag}">${tag}</span>`
    ).join('');
    
    container.querySelectorAll('.tag').forEach(tag => {
        tag.addEventListener('click', () => {
            filterByTag(tag.dataset.tag);
        });
    });
}

// ===================================================
// BREADCRUMBS DINÂMICOS
// ===================================================

function updateBreadcrumbs(path) {
    const breadcrumbs = document.querySelector('.breadcrumbs ol');
    if (!breadcrumbs) return;
    
    breadcrumbs.innerHTML = path.map((item, index) => {
        const isLast = index === path.length - 1;
        return `
            <li itemprop="itemListElement" itemscope itemtype="https://schema.org/ListItem" ${isLast ? 'class="active"' : ''}>
                ${!isLast ? `<a itemprop="item" href="${item.url}">` : ''}
                <span itemprop="name">${item.name}</span>
                ${!isLast ? '</a>' : ''}
                <meta itemprop="position" content="${index + 1}" />
            </li>
        `;
    }).join('');
}

// ===================================================
// TABLE OF CONTENTS (TOC)
// ===================================================

function generateTOC(content) {
    const tocWidget = document.getElementById('toc-widget');
    const toc = document.getElementById('table-of-contents');
    
    if (!tocWidget || !toc || !content) return;
    
    // Extrair headings
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const headings = tempDiv.querySelectorAll('h2, h3, h4');
    
    if (headings.length === 0) {
        tocWidget.style.display = 'none';
        return;
    }
    
    tocWidget.classList.add('visible');
    tocWidget.style.display = 'block';
    
    const tocHTML = Array.from(headings).map((heading, index) => {
        const id = `heading-${index}`;
        heading.id = id;
        const level = heading.tagName.toLowerCase();
        
        return `
            <li class="toc-${level}">
                <a href="#${id}">${heading.textContent}</a>
            </li>
        `;
    }).join('');
    
    toc.innerHTML = tocHTML;
    
    // Adicionar smooth scroll
    toc.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.getElementById(link.getAttribute('href').slice(1));
            target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
    
    // Destacar seção ativa durante scroll
    observeHeadings(Array.from(headings));
}

function observeHeadings(headings) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const tocLink = document.querySelector(`#table-of-contents a[href="#${id}"]`);
            
            if (entry.isIntersecting) {
                document.querySelectorAll('#table-of-contents a').forEach(link => 
                    link.classList.remove('active')
                );
                tocLink?.classList.add('active');
            }
        });
    }, { rootMargin: '-100px 0px -66%' });
    
    headings.forEach(heading => observer.observe(heading));
}

// ===================================================
// CARREGAR E FILTRAR ARTIGOS
// ===================================================

function loadArticles(filter = null) {
    let articles = siteData.articles;
    
    if (filter) {
        if (filter.category) {
            articles = articles.filter(a => a.category === filter.category);
        }
        if (filter.tag) {
            articles = articles.filter(a => a.tags?.includes(filter.tag));
        }
        if (filter.type === 'featured') {
            articles = articles.filter(a => a.featured);
        }
        if (filter.type === 'recent') {
            articles = [...articles].sort((a, b) => 
                new Date(b.date) - new Date(a.date)
            ).slice(0, 10);
        }
        if (filter.type === 'trending') {
            articles = articles.filter(a => siteData.trending?.includes(a.id));
        }
    }
    
    // TODO: Renderizar artigos na página
    console.log('Artigos carregados:', articles.length);
}

function filterByCategory(categoryId) {
    const category = siteData.categories.find(c => c.id === categoryId);
    if (!category) return;
    
    updateBreadcrumbs([
        { name: 'Início', url: '#' },
        { name: category.name, url: `#category/${categoryId}` }
    ]);
    
    loadArticles({ category: categoryId });
}

function filterByTag(tag) {
    updateBreadcrumbs([
        { name: 'Início', url: '#' },
        { name: `Tag: ${tag}`, url: `#tag/${tag}` }
    ]);
    
    loadArticles({ tag });
}

function loadArticle(articleId) {
    const article = siteData.articles.find(a => a.id === articleId);
    if (!article) return;
    
    const category = siteData.categories.find(c => c.id === article.category);
    
    updateBreadcrumbs([
        { name: 'Início', url: '#' },
        { name: category?.name || article.category, url: `#category/${article.category}` },
        { name: article.title, url: `#article/${articleId}` }
    ]);
    
    // Gerar TOC
    generateTOC(article.content);
    
    // TODO: Renderizar artigo completo
    console.log('Artigo carregado:', article.title);
}

// ===================================================
// ATALHOS DE TECLADO
// ===================================================

document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + K: Abrir busca
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        searchToggle?.click();
    }
    
    // ESC: Fechar modals
    if (e.key === 'Escape') {
        if (searchModal?.classList.contains('active')) {
            closeSearchModal();
        }
        if (sidebarMenu?.classList.contains('active')) {
            closeSidebar();
        }
    }
    
    // Setas: Navegar entre artigos (futuro)
    // Home/End: Ir para topo/rodapé
});

// ===================================================
// BACK TO TOP BUTTON
// ===================================================

const backToTop = document.createElement('button');
backToTop.id = 'back-to-top';
backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
backToTop.setAttribute('aria-label', 'Voltar ao topo');
document.body.appendChild(backToTop);

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }
});

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===================================================
// UTILITÁRIOS
// ===================================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
    });
}

// ===================================================
// INICIALIZAÇÃO
// ===================================================

document.addEventListener('DOMContentLoaded', () => {
    loadData();
    
    // Botão de artigo aleatório
    const randomBtn = document.getElementById('random-article-btn');
    if (randomBtn) {
        randomBtn.addEventListener('click', goToRandomArticle);
    }
    
    // Curiosidade do dia
    displayDailyFact();
    
    // Configurar filtros rápidos
    document.querySelectorAll('.quick-filters a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const filter = e.currentTarget.dataset.filter;
            
            if (filter === 'all') {
                loadArticles();
                updateBreadcrumbs([{ name: 'Início', url: '#' }, { name: 'Todos os Artigos', url: '#' }]);
            } else {
                loadArticles({ type: filter });
                const filterNames = {
                    featured: 'Em Destaque',
                    recent: 'Artigos Recentes',
                    trending: 'Populares'
                };
                updateBreadcrumbs([
                    { name: 'Início', url: '#' },
                    { name: filterNames[filter], url: `#${filter}` }
                ]);
            }
            
            closeSidebar();
        });
    });
});

const revealOnScroll = () => {
    const windowHeight = window.innerHeight;
    const revealPoint = 150;
    
    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
};

// Revelar elementos ao carregar a página
window.addEventListener('load', () => {
    setTimeout(revealOnScroll, 100);
});

// Revelar elementos ao rolar
window.addEventListener('scroll', revealOnScroll);

// ===== SMOOTH SCROLL PARA LINKS INTERNOS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && href.length > 1) {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }
    });
});

// ===== MENU MOBILE (HAMBURGER) - OPCIONAL =====
// Se quiser adicionar um menu hambúrguer para mobile, descomente abaixo:
/*
const menuToggle = document.createElement('button');
menuToggle.className = 'menu-toggle';
menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
menuToggle.setAttribute('aria-label', 'Toggle menu');

const headerContainer = document.querySelector('.header-container');
headerContainer.insertBefore(menuToggle, headerContainer.firstChild);

const mainNav = document.querySelector('.main-nav');

menuToggle.addEventListener('click', () => {
    mainNav.classList.toggle('mobile-active');
    const icon = menuToggle.querySelector('i');
    icon.classList.toggle('fa-bars');
    icon.classList.toggle('fa-times');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
            mainNav.classList.remove('mobile-active');
            menuToggle.querySelector('i').classList.replace('fa-times', 'fa-bars');
        }
    });
});
*/

// ===== CARREGAR ARTIGOS DE UMA CATEGORIA =====
async function loadCategoryArticles(categoryId) {
    // Garantir que os dados foram carregados
    if (!siteData.articles || siteData.articles.length === 0) {
        await loadData();
    }
    
    const container = document.getElementById('articles-container');
    if (!container) return;
    
    // Filtrar artigos da categoria
    const categoryArticles = siteData.articles.filter(article => article.category === categoryId);
    
    if (categoryArticles.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-inbox"></i>
                <h3>Nenhum artigo encontrado</h3>
                <p>Esta categoria ainda não possui artigos publicados.</p>
                <p>Volte em breve para conferir novos conteúdos!</p>
            </div>
        `;
        return;
    }
    
    // Renderizar artigos
    container.innerHTML = categoryArticles.map(article => `
        <article class="article-card">
            ${article.image ? `<img src="${article.image}" alt="${article.title}">` : ''}
            <div class="article-card-content">
                <h3>${article.title}</h3>
                <p>${article.summary}</p>
                <div class="article-meta">
                    <span><i class="far fa-calendar"></i> ${formatDate(article.date)}</span>
                    <span><i class="far fa-clock"></i> ${article.readTime}</span>
                </div>
            </div>
        </article>
    `).join('');
}

// ===== ARTIGO ALEATÓRIO =====
function goToRandomArticle() {
    if (!siteData.articles || siteData.articles.length === 0) {
        showToast('Carregando artigos...');
        return;
    }
    
    const randomIndex = Math.floor(Math.random() * siteData.articles.length);
    const randomArticle = siteData.articles[randomIndex];
    
    // Salvar visualização
    trackArticleView(randomArticle.id);
    
    // Mostrar feedback visual
    showToast(`🎲 ${randomArticle.title}`, 2000);
    
    // Navegar para a categoria (já que não temos páginas individuais de artigos)
    setTimeout(() => {
        window.location.href = `${randomArticle.category}.html`;
    }, 500);
}

// ===== CONTADOR DE VISUALIZAÇÕES =====
function trackArticleView(articleId) {
    const views = JSON.parse(localStorage.getItem('articleViews') || '{}');
    views[articleId] = (views[articleId] || 0) + 1;
    localStorage.setItem('articleViews', JSON.stringify(views));
}

function getMostViewedArticles(limit = 5) {
    const views = JSON.parse(localStorage.getItem('articleViews') || '{}');
    return Object.entries(views)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit)
        .map(([id, count]) => ({
            id,
            views: count,
            article: siteData.articles.find(a => a.id === id)
        }))
        .filter(item => item.article);
}

// ===== CURIOSIDADE DO DIA =====
function getDailyFact() {
    if (!siteData.articles || siteData.articles.length === 0) return null;
    
    // Usar a data atual como seed para sempre mostrar a mesma curiosidade no mesmo dia
    const today = new Date().toDateString();
    const seed = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const index = seed % siteData.articles.length;
    
    return siteData.articles[index];
}

function displayDailyFact() {
    const container = document.getElementById('daily-fact');
    if (!container) return;
    
    const fact = getDailyFact();
    if (!fact) return;
    
    container.innerHTML = `
        <div class="daily-fact-content">
            <h4>💡 Curiosidade do Dia</h4>
            <h5>${fact.title}</h5>
            <p>${fact.summary}</p>
            <a href="${fact.category}.html" class="btn-link">
                Ler mais <i class="fas fa-arrow-right"></i>
            </a>
        </div>
    `;
}

// ===== TOAST/NOTIFICAÇÃO =====
function showToast(message, duration = 3000) {
    const toast = document.getElementById('toast');
    if (!toast) {
        const newToast = document.createElement('div');
        newToast.id = 'toast';
        newToast.setAttribute('role', 'status');
        newToast.setAttribute('aria-live', 'polite');
        newToast.setAttribute('aria-atomic', 'true');
        document.body.appendChild(newToast);
    }
    
    const toastEl = document.getElementById('toast');
    toastEl.textContent = message;
    toastEl.classList.add('show');
    
    setTimeout(() => {
        toastEl.classList.remove('show');
    }, duration);
}

// Função auxiliar para formatar data
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { 
        day: '2-digit', 
        month: 'long', 
        year: 'numeric' 
    });
}

console.log('✨ Almanaque de Tudo carregado com sucesso!');