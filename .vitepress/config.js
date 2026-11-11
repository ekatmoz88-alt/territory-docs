export default {
  lang: 'ru-RU',
  title: 'PPO ID Docs',
  description: 'Техническая документация ППО ID Docs',
  base: '/territory-docs/',

  themeConfig: {
    nav: [
      { text: 'Главная', link: '/' },
      { text: 'Архитектура', link: '/architecture/' },
      { text: 'База данных', link: '/database/' },
      { text: 'Логическая модель', link: '/database/logical-structure-model' },
      { text: 'Физическая структура БД', link: '/database/physical-structure-specification' },
      { text: 'Исходный код', link: '/source-code/' },
      { text: 'API', link: '/api/' }
    ],

    sidebar: [
      {
        text: 'Документация системы',
        items: [
          { text: 'Обзор', link: '/' },
          { text: 'Архитектура системы', link: '/architecture/' },
          { text: 'База данных и модели', link: '/database/' },
          { text: 'Логическая модель', link: '/database/logical-structure-model' },
          { text: 'Физическая структура БД (381 позиция)', link: '/database/physical-structure-specification' },
          { text: 'Исходный код и модели', link: '/source-code/' },
          { text: 'API и операции', link: '/api/' }
        ]
      }
    ],

    search: {
      provider: 'local'
    },

    footer: {
      message: 'PPO ID Docs · Technical Documentation',
      copyright: 'Source-based documentation'
    }
  }
}
