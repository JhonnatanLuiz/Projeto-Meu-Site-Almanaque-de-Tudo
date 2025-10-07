const database = {
    categories: [
        {
            name: 'Ciência',
            subcategories: [
                {
                    name: 'Astronomia',
                    articles: [
                        { title: 'Buracos Negros', file: 'buracos_negros.md' },
                        { title: 'Estrelas de Nêutrons', file: 'estrelas_neutrons.md' }
                    ]
                },
                {
                    name: 'Biologia',
                    articles: [
                        { title: 'A Vida nas Profundezas do Oceano', file: 'vida_profunda.md' }
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
                        { title: 'A Biblioteca de Alexandria', file: 'biblioteca_alexandria.md' }
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
                        { title: 'O Impacto de Star Wars', file: 'impacto_star_wars.md' }
                    ]
                }
            ]
        }
    ]
};