document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-bar input');
    const searchButton = document.querySelector('.search-bar button');
    const posts = document.querySelectorAll('.post');

    const filterPosts = () => {
        const query = searchInput.value.toLowerCase().trim();

        posts.forEach(post => {
            const title = post.querySelector('h2').textContent.toLowerCase();
            const shouldShow = title.includes(query);
            post.style.display = shouldShow ? 'block' : 'none';
        });
    };

    searchButton.addEventListener('click', filterPosts);

    // Optional: Also filter when the user presses Enter
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            filterPosts();
        }
    });
});