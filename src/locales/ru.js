export default {
  translation: {
    header: 'RSS агрегатор',
    lead: 'Начните читать RSS сегодня! Это легко, это красиво.',
    label: 'Ссылка RSS',
    buttonText: 'Добавить',
    sample: 'Пример: https://ru.hexlet.io/lessons.rss',
    feedbackNoInput: 'Не должно быть пустым',
    feedbackInvalid: 'Ссылка должна быть валидным URL',
    feedbackRssInvalid: 'Ресурс не содержит валидный RSS',
    feedbackNetworkError: 'Ошибка сети',
    feedbackAwaiting: 'Загружается...',
    feedbackAwaitingHollow: '',
    feedbackSubmitted: 'RSS успешно загружен',
    feedbackNotUnique: 'RSS уже существует',
    feedbackParsingError: 'Ресурс не содержит валидный RSS',
    // feedbackParsingError: 'Не удалось прочесть документ', // original
    feedbackFilling: '',
    postsHeader: 'Посты',
    channelsHeader: 'Фиды',
    postOpenBtn: 'Просмотр',
    modalReadFull: 'Читать полностью',
    modalCloseButton: 'Закрыть',
    errorInvalidUrl: 'The value {{value}} is not a valid URL',
    errorEmptyInput: 'Input URL is empty',
    errorNotUnique: 'URL {{value}} is already added',
    errorInvalidContents:
      'Could not get RSS from {{url}}. Source server response status: {{response}}',
    errorXmlIsNotRss: 'XML document is not RSS',
    errorUpdateError:
      'Could not update source {{link}}. Origin proxy status: {{proxyStatus}}. RSS source status: {{sourceStatus}}',
  },
};
