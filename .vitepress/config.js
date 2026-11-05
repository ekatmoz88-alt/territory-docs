export default {
  lang: 'ru-RU',
  title: 'Territory Docs',
  description: 'Техническая документация ППО «Территория»',
  base: '/territory-docs/',

  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'База данных', link: '/database/' },
      { text: 'Исходный код', link: '/source-code/' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: [
      {
        text: 'Документация системы',
        items: [
          { text: 'Обзор', link: '/' },
          { text: 'База данных и модели', link: '/database/' },
          { text: 'Исходный код и модели', link: '/source-code/' },
          { text: 'API и операции', link: '/api/' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'Territory Docs · Technical Documentation',
      copyright: 'Source-based documentation'
    }
  }
}
