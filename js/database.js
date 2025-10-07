const database = {
    categories: [
        {
            name: 'Ciência',
            subcategories: [
                {
                    name: 'Astronomia',
                    articles: [
                        { title: 'Buracos Negros', file: 'buracos_negros.md', summary: 'Explore os misteriosos objetos cósmicos com gravidade tão intensa que nada pode escapar.', image: 'https://picsum.photos/seed/blackhole/400/200' },
                        { title: 'Estrelas de Nêutrons', file: 'estrelas_neutrons.md', summary: 'Descubra os restos superdensos de estrelas massivas que explodiram como supernovas.', image: 'https://picsum.photos/seed/neutronstar/400/200' }
                    ]
                },
                {
                    name: 'Biologia',
                    articles: [
                        { title: 'A Vida nas Profundezas do Oceano', file: 'vida_profunda.md', summary: 'Conheça as criaturas bizarras e fascinantes que habitam as zonas abissais do oceano.', image: 'https://picsum.photos/seed/deepsea/400/200' }
                    ]
                }
            ]
        },
        {
            name: 'História',
            subcategories: [
                {
                    name: 'Antiguidade',
                    articles: [
                        { title: 'A Biblioteca de Alexandria', file: 'biblioteca_alexandria.md', summary: 'A história do maior centro de conhecimento do mundo antigo e seu trágico desaparecimento.', image: 'https://picsum.photos/seed/alexandria/400/200' }
                    ]
                }
            ]
        },
        {
            name: 'Cultura Pop',
            subcategories: [
                {
                    name: 'Cinema',
                    articles: [
                        { title: 'O Impacto de Star Wars', file: 'impacto_star_wars.md', summary: 'Como uma saga de ficção científica se tornou um dos maiores fenômenos culturais da história.', image: 'https://picsum.photos/seed/starwars/400/200' }
                    ]
                }
            ]
        }
    ]
};