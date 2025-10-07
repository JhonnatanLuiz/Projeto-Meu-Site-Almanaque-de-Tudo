# Almanaque Digital

Este é um protótipo de um almanaque digital interativo, construído com HTML, CSS e JavaScript puros. O projeto foi projetado para ser um repositório de conhecimento fácil de navegar, com foco em uma experiência de usuário limpa e moderna.

---

This is a prototype for an interactive digital almanac, built with pure HTML, CSS, and JavaScript. The project is designed to be an easy-to-navigate knowledge repository with a focus on a clean and modern user experience.

---

## 🇧🇷 Em Português

### ✨ Funcionalidades

- **Estrutura de Conteúdo Escalável**: Os artigos são armazenados em arquivos Markdown (`.md`), tornando simples adicionar novo conteúdo.
- **Design Responsivo e Moderno**: Interface limpa inspirada em plataformas como Medium e Notion.
- **Tema Escuro e Claro**: Um seletor de tema permite que os usuários alternem entre os modos claro e escuro para uma leitura confortável. A preferência é salva no navegador.
- **Navegação por Cards Ilustrados**: Os artigos são exibidos em um grid de cards, cada um com uma imagem, título e resumo, oferecendo uma experiência de navegação visualmente atraente.
- **Busca Inteligente**: Uma barra de busca com Fuse.js permite encontrar artigos por título de forma rápida e eficiente.
- **Artigo Aleatório**: Um botão para descobrir um artigo surpresa, incentivando a exploração.
- **Acessibilidade**: Construído com tags semânticas e navegação acessível por teclado.

### 🚀 Como Executar Localmente

Como o projeto usa a API `fetch` para carregar os artigos em Markdown, ele precisa ser servido por um servidor web para funcionar corretamente (abrir o `index.html` diretamente do sistema de arquivos não funcionará devido às políticas de CORS).

1.  **Clone o repositório:**
    ```bash
    git clone <url-do-repositorio>
    cd <pasta-do-repositorio>
    ```

2.  **Inicie um servidor web local:**
    Se você tem Python 3 instalado, pode usar o módulo `http.server` para iniciar um servidor simples na pasta raiz do projeto.
    ```bash
    python3 -m http.server 8000
    ```

3.  **Abra no navegador:**
    Acesse [`http://localhost:8000`](http://localhost:8000) no seu navegador.

### 📁 Estrutura de Arquivos

```
/
├── content/              # Contém os artigos em formato Markdown (.md)
├── css/                  # Arquivos de estilo (CSS)
│   └── style.css
├── js/                   # Scripts (JavaScript)
│   ├── app.js            # Lógica principal da aplicação
│   └── database.js       # "Banco de dados" central com a estrutura de conteúdo
└── index.html            # Arquivo principal da aplicação
```

---

## 🇬🇧 In English

### ✨ Features

- **Scalable Content Structure**: Articles are stored in Markdown (`.md`) files, making it simple to add new content.
- **Responsive and Modern Design**: A clean interface inspired by platforms like Medium and Notion.
- **Dark and Light Theme**: A theme switcher allows users to toggle between light and dark modes for comfortable reading. The preference is saved in the browser.
- **Illustrated Card Navigation**: Articles are displayed in a card grid, each with an image, title, and summary, providing a visually engaging browsing experience.
- **Smart Search**: A search bar powered by Fuse.js allows users to find articles by title quickly and efficiently.
- **Random Article**: A button to discover a surprise article, encouraging exploration.
- **Accessibility**: Built with semantic tags and accessible keyboard navigation.

### 🚀 How to Run Locally

Because the project uses the `fetch` API to load Markdown articles, it needs to be served by a web server to work correctly (opening `index.html` directly from the file system will not work due to CORS policies).

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd <repository-folder>
    ```

2.  **Start a local web server:**
    If you have Python 3 installed, you can use the `http.server` module to start a simple server in the project's root folder.
    ```bash
    python3 -m http.server 8000
    ```

3.  **Open in your browser:**
    Access [`http://localhost:8000`](http://localhost:8000) in your browser.

### 📁 File Structure

```
/
├── content/              # Contains the articles in Markdown format (.md)
├── css/                  # Style files (CSS)
│   └── style.css
├── js/                   # Scripts (JavaScript)
│   ├── app.js            # Main application logic
│   └── database.js       # Central "database" with the content structure
└── index.html            # Main application file
```