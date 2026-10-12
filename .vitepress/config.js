export default {
  title: 'Territory Docs',
  description: 'Документация по системе УММС',
  base: '/',
  
  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'База данных', link: '/database/' },
      { text: 'Исходный код', link: '/source-code/' },
      { text: 'API', link: '/api/' }
    ],
    
    sidebar: {
      '/': [
        { text: 'Введение', link: '/' },
        { text: 'База данных и модели', link: '/database/' },
        { text: 'Исходный код', link: '/source-code/' },
        { text: 'API эндпоинты', link: '/api/' }
      ]
    }
  }
}
