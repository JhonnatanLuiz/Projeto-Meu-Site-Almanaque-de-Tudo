// Aplica lazy-loading e decoding assíncrono a todas as imagens presentes
document.addEventListener('DOMContentLoaded', function () {
    const imgs = document.querySelectorAll('img');
    imgs.forEach(img => {
        if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy');
        if (!img.hasAttribute('decoding')) img.setAttribute('decoding', 'async');
        // Se for marcado como herói (LCP), dê prioridade de download
        if (img.hasAttribute('data-hero')) {
            img.setAttribute('fetchpriority', 'high');
            img.setAttribute('loading', 'eager');
        }
    });
});

// Reveal on scroll (IntersectionObserver)
document.addEventListener('DOMContentLoaded', function () {
    const els = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window) || els.length === 0) {
        els.forEach(el => el.classList.add('revealed'));
        return;
    }
    const io = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                obs.unobserve(entry.target);
            }
        });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });
    els.forEach(el => io.observe(el));
});

// Barra de progresso de leitura
document.addEventListener('DOMContentLoaded', function () {
    const bar = document.getElementById('progressBar');
    if (!bar) return;
    function update() {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = Math.max(
            document.body.scrollHeight,
            document.documentElement.scrollHeight,
            document.body.offsetHeight,
            document.documentElement.offsetHeight,
            document.body.clientHeight,
            document.documentElement.clientHeight
        );
        const win = window.innerHeight;
        const total = docHeight - win;
        const pct = total > 0 ? Math.min(100, Math.max(0, (scrollTop / total) * 100)) : 0;
        bar.style.width = pct + '%';
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
});

// Toast utilitário
function showToast(message) {
    let toast = document.getElementById('toast');
    if (!toast) return alert(message);
    toast.textContent = message;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2200);
}

// Ações: compartilhar e copiar link
document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.post').forEach(post => {
        const shareBtn = post.querySelector('.share-btn');
        const copyBtn = post.querySelector('.copy-link-btn');
        const title = post.querySelector('h2, h3')?.textContent?.trim() || document.title;
        const url = window.location.href.split('#')[0];

        if (shareBtn && navigator.share) {
            shareBtn.addEventListener('click', async () => {
                try {
                    await navigator.share({ title, url });
                    showToast('Compartilhado!');
                } catch (e) { /* cancelado */ }
            });
        } else if (shareBtn) {
            shareBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(url);
                    showToast('Link copiado!');
                } catch (e) {
                    showToast('Não foi possível copiar.');
                }
            });
        }

        if (copyBtn) {
            copyBtn.addEventListener('click', async () => {
                try {
                    await navigator.clipboard.writeText(url);
                    showToast('Link copiado!');
                } catch (e) {
                    showToast('Não foi possível copiar.');
                }
            });
        }
    });
});

// Atalhos de teclado: '/' foca busca, 't' alterna tema
document.addEventListener('keydown', function (e) {
    const tag = (document.activeElement && document.activeElement.tagName) || '';
    const isTyping = /INPUT|TEXTAREA|SELECT/.test(tag);
    if (!isTyping && e.key === '/') {
        const q = document.getElementById('wiki-q');
        if (q) { e.preventDefault(); q.focus(); }
    }
    if (!isTyping && (e.key === 't' || e.key === 'T')) {
        const btn = document.querySelector('.theme-toggle');
        if (btn) { e.preventDefault(); btn.click(); }
    }
});

// Intercepta o envio do formulário de contato e exibe feedback amigável
document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.contact-form');
    if (form) {
        const feedback = form.querySelector('.form-feedback');
        form.addEventListener('submit', function (e) {
            e.preventDefault();
            const name = form.querySelector('#name');
            const email = form.querySelector('#email');
            const message = form.querySelector('#message');

            // Validação simples
            if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
                if (feedback) {
                    feedback.textContent = 'Por favor, preencha todos os campos.';
                    feedback.style.color = '#b00020';
                }
                return;
            }

            // Simulação de envio; aqui você pode integrar com um backend ou serviço de e-mail
            if (feedback) {
                feedback.textContent = 'Mensagem enviada! Obrigado pelo contato — responderemos em breve.';
                feedback.style.color = '#0a7a20';
            }
            form.reset();
        });
    }
});

// Define o ano atual no rodapé
document.addEventListener('DOMContentLoaded', function () {
    const footerText = document.querySelector('footer p');
    if (footerText) {
        const year = new Date().getFullYear();
        footerText.textContent = `© ${year} Almanaque de Tudo. Todos os direitos reservados.`;
    }
});

// Alternância de tema (light/dark) com persistência
document.addEventListener('DOMContentLoaded', function () {
    const btn = document.querySelector('.theme-toggle');
    const root = document.documentElement; // <html>
    const STORAGE_KEY = 'almanaque-theme';

    // Preferência salva ou do sistema
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || (saved === null && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
        root.setAttribute('data-theme', 'dark');
        if (btn) btn.setAttribute('aria-pressed', 'true');
    }

    if (btn) {
        btn.addEventListener('click', () => {
            const isDark = root.getAttribute('data-theme') === 'dark';
            if (isDark) {
                root.removeAttribute('data-theme');
                localStorage.setItem(STORAGE_KEY, 'light');
                btn.setAttribute('aria-pressed', 'false');
            } else {
                root.setAttribute('data-theme', 'dark');
                localStorage.setItem(STORAGE_KEY, 'dark');
                btn.setAttribute('aria-pressed', 'true');
            }
        });
    }
});

// Sombra do header quando rolar e botão Voltar ao Topo
document.addEventListener('DOMContentLoaded', function () {
    const header = document.querySelector('header');
    const backToTop = document.getElementById('backToTop');

    function onScroll() {
        const y = window.scrollY || document.documentElement.scrollTop;
        if (header) header.classList.toggle('is-sticky', y > 8);
        if (backToTop) backToTop.classList.toggle('show', y > 400);
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// Busca na Wikipedia (pt) usando API de pesquisa
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('wiki-search');
    if (!form) return;

    const input = document.getElementById('wiki-q');
    const header = document.querySelector('header');
    const listbox = document.getElementById('search-suggestions');
    let panel = document.getElementById('wiki-results');
    if (!panel) {
        panel = document.createElement('section');
        panel.id = 'wiki-results';
        panel.setAttribute('aria-live', 'polite');
        panel.style.maxWidth = '900px';
        panel.style.margin = '0.75rem auto 0';
        panel.style.padding = '0 1rem';
        if (header) header.insertAdjacentElement('afterend', panel);
    }

    async function searchWikipedia(q) {
        const params = new URLSearchParams({
            action: 'query',
            list: 'search',
            srsearch: q,
            srlimit: '5',
            format: 'json',
            origin: '*'
        });
        const url = `https://pt.wikipedia.org/w/api.php?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Falha ao buscar na Wikipedia');
        return res.json();
    }

    function renderResults(items, q) {
        if (!items || items.length === 0) {
            panel.innerHTML = `<div class="post"><p>Nenhum resultado para "${q}".</p></div>`;
            return;
        }
        const list = items.map(it => {
            const url = `https://pt.wikipedia.org/wiki/${encodeURIComponent(it.title.replace(/ /g, '_'))}`;
            return `<article class="post"><h3><a class="external" href="${url}" target="_blank" rel="noopener noreferrer">${it.title}</a></h3><p>${it.snippet}...</p></article>`;
        }).join('');
        panel.innerHTML = `<div class="post"><h2>Resultados na Wikipedia</h2></div>${list}`;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const q = (input.value || '').trim();
        if (!q) return;
        if (listbox) listbox.hidden = true;
        panel.innerHTML = `<div class="post"><p>Buscando "${q}"...</p></div>`;
        try {
            const data = await searchWikipedia(q);
            renderResults(data?.query?.search || [], q);
        } catch (err) {
            panel.innerHTML = `<div class="post"><p>Erro ao buscar: ${(err && err.message) || err}</p></div>`;
        }
    });

    // Autocomplete - prefixsearch
    async function fetchSuggestions(term) {
        // Usamos generator para trazer título + extract curto numa única chamada
        const params = new URLSearchParams({
            action: 'query',
            format: 'json',
            origin: '*',
            generator: 'prefixsearch',
            gpssearch: term,
            gpslimit: '8',
            prop: 'extracts',
            exintro: '1',
            explaintext: '1',
            exsentences: '1'
        });
        const url = `https://pt.wikipedia.org/w/api.php?${params.toString()}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Falha nas sugestões');
        const data = await res.json();
        // O formato retorna pages como objeto; normalizamos para array ordenada por index
        const pagesObj = data?.query?.pages || {};
        const items = Object.values(pagesObj).sort((a, b) => (a.index || 0) - (b.index || 0));
    return items.map(p => ({ title: p.title, snippet: (p.extract || '').slice(0, 240) }));
    }

    let selIndex = -1; // item selecionado no listbox
    function escapeHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }

    function escapeRegex(str) {
        return String(str).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const SNIPPET_MAX = 160; // caracteres visíveis (ajustável)

    function removeDiacritics(str) {
        return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    }

    // Melhor versão: usa normalization correta e mapeia índices para destacar sem alterar caracteres originais
        // Remove diacríticos (acentos) usando Unicode normalization
        function removeDiacritics(str) {
            return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        }

    function highlightNormalized(original, normRegex) {
        if (!normRegex) return escapeHtml(original);
        const chars = Array.from(original);
        // construir string normalizada e mapa de índice
        const normParts = [];
        const normIndexToOrig = [];
        for (let i = 0; i < chars.length; i++) {
            const ch = chars[i];
            const norm = removeDiacritics(ch).toLowerCase();
            for (let j = 0; j < norm.length; j++) normIndexToOrig.push(i);
            normParts.push(norm);
        }
        const normString = normParts.join('');
        // garantir flag g
        const flags = (normRegex.flags || '') + (normRegex.flags && normRegex.flags.indexOf('g') !== -1 ? '' : 'g');
        const re = new RegExp(normRegex.source, flags);
        const ranges = [];
        let m;
        while ((m = re.exec(normString)) !== null) {
            const s = m.index;
            const e = m.index + m[0].length;
            const origStart = normIndexToOrig[s];
            const origEnd = normIndexToOrig[e - 1] + 1;
            if (origStart != null && origEnd != null) ranges.push([origStart, origEnd]);
            // avoid infinite loop on zero-length matches
            if (m.index === re.lastIndex) re.lastIndex++;
        }
        if (ranges.length === 0) return escapeHtml(original);
        // merge overlapping ranges
        ranges.sort((a, b) => a[0] - b[0]);
        const merged = [ranges[0]];
        for (let i = 1; i < ranges.length; i++) {
            const last = merged[merged.length - 1];
            const cur = ranges[i];
            if (cur[0] <= last[1]) last[1] = Math.max(last[1], cur[1]); else merged.push(cur);
        }
        // build highlighted string
        let out = '';
        let lastIndex = 0;
        for (const r of merged) {
            const [s, e] = r;
            if (s > lastIndex) out += escapeHtml(chars.slice(lastIndex, s).join(''));
            out += '<strong>' + escapeHtml(chars.slice(s, e).join('')) + '</strong>';
            lastIndex = e;
        }
        if (lastIndex < chars.length) out += escapeHtml(chars.slice(lastIndex).join(''));
        return out;
    }

    function renderSuggestions(items) {
        if (!listbox) return;
        if (!items || items.length === 0) {
            listbox.hidden = true;
            listbox.innerHTML = '';
            return;
        }
        const term = (input && input.value) ? input.value.trim() : '';
        // Para destacar apenas palavras inteiras, separe em tokens e use \b (word-boundary)
        let regex = null;
        if (term) {
            const tokens = term.split(/\s+/).map(t => removeDiacritics(t.toLowerCase())).map(escapeRegex).filter(Boolean);
            if (tokens.length) regex = new RegExp('\\b(' + tokens.join('|') + ')\\b', 'i');
        }
        listbox.innerHTML = items.map((it, i) => {
            const title = (it.title || '').toString();
            let snippet = (it.snippet || '').toString();
            // Trunca snippet mantendo limite legível
            if (snippet.length > SNIPPET_MAX) snippet = snippet.slice(0, SNIPPET_MAX).trim() + '…';
        const highlightedTitle = highlightNormalized(title, regex);
        const highlightedSnippet = highlightNormalized(snippet, regex);
            return `<li role="option" id="sugg-${i}" ${i===selIndex? 'aria-selected="true"':''}>
                <button type="button" data-title="${escapeHtml(title)}">
            <span class="sugg-title">${highlightedTitle}</span>
            ${snippet ? `<span class=\"sugg-snippet\">${highlightedSnippet}</span>` : ''}
                </button>
            </li>`;
        }).join('');
        listbox.hidden = false;
    }

    let debounceT;
    input.addEventListener('input', () => {
        const term = input.value.trim();
        selIndex = -1;
        clearTimeout(debounceT);
        if (!term) { if (listbox) { listbox.hidden = true; listbox.innerHTML = ''; } return; }
        debounceT = setTimeout(async () => {
            try {
                const suggestions = await fetchSuggestions(term);
                renderSuggestions(suggestions || []);
            } catch { /* ignora */ }
        }, 200);
    });

    if (listbox) {
        listbox.addEventListener('click', (e) => {
            const btn = e.target.closest('button[data-title]');
            if (!btn) return;
            input.value = btn.dataset.title;
            listbox.hidden = true;
            form.requestSubmit();
        });
    }

    input.addEventListener('keydown', (e) => {
        if (!listbox || listbox.hidden) return;
        const items = Array.from(listbox.querySelectorAll('li'));
        if (items.length === 0) return;
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            selIndex = (selIndex + 1) % items.length;
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            selIndex = (selIndex - 1 + items.length) % items.length;
        } else if (e.key === 'Enter') {
            e.preventDefault();
            const li = items[selIndex] || items[0];
            const btn = li?.querySelector('button[data-title]');
            if (btn) btn.click();
            return;
        } else if (e.key === 'Escape') {
            listbox.hidden = true;
            return;
        } else {
            return; // não re-renderiza aqui
        }
        items.forEach((li, i) => li.setAttribute('aria-selected', i === selIndex ? 'true' : 'false'));
    });
});

// Scrollspy leve: destaca o post atualmente visível
document.addEventListener('DOMContentLoaded', function () {
    const posts = document.querySelectorAll('.post');
    if (posts.length === 0) return;
    const spy = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            entry.target.classList.toggle('in-view', entry.isIntersecting && entry.intersectionRatio > 0.5);
        });
    }, { threshold: [0.5] });
    posts.forEach(p => spy.observe(p));
});

// Lógica do Menu Hambúrguer
document.addEventListener('DOMContentLoaded', function () {
    const hamburgerBtn = document.querySelector('.hamburger-menu');
    const mainNavigation = document.getElementById('main-navigation');
    const body = document.body;

    if (hamburgerBtn && mainNavigation) {
        const firstNavLink = mainNavigation.querySelector('a');

        function openMenu() {
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            mainNavigation.classList.add('menu-open');
            body.classList.add('menu-open');
            if (firstNavLink) firstNavLink.focus();
        }

        function closeMenu() {
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            mainNavigation.classList.remove('menu-open');
            body.classList.remove('menu-open');
            hamburgerBtn.focus();
        }

        hamburgerBtn.addEventListener('click', () => {
            const isExpanded = hamburgerBtn.getAttribute('aria-expanded') === 'true';
            if (isExpanded) closeMenu(); else openMenu();
        });

        // Fechar menu ao clicar em um link (para UX mobile)
        mainNavigation.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                closeMenu();
            });
        });

        // Fechar ao clicar fora (no fundo do overlay do nav)
        mainNavigation.addEventListener('click', (e) => {
            if (e.target === mainNavigation && mainNavigation.classList.contains('menu-open')) {
                closeMenu();
            }
        });

        // Fechar com Esc
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && mainNavigation.classList.contains('menu-open')) {
                e.preventDefault();
                closeMenu();
            }
        });

        // Garantir estado consistente ao redimensionar
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && mainNavigation.classList.contains('menu-open')) {
                closeMenu();
            }
        });
    }
});