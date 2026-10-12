# Исходный код и модели

## Обзор
Описание структуры исходного кода, основных модулей и сопоставления моделей данных с таблицами БД.

## Структура проектов
- **Common.Data** — Базовые модели, провайдеры, интерфейсы доступа к данным.
- **Umms.Core** — Ядро бизнес-логики (ПО СС / ПО МС).
- **Umms.Service** — Сервисный слой, реализация сценариев.
- **Umms.UsbExchange** — Модуль обмена данными по USB (АРМ МС).

## Основные модули ПО СС / ПО МС
- **Лица** (`UmmsPersonModel`) — управление физическими лицами.
- **Документы** (`UmmsDocumentModel`) — учет документов, удостоверяющих личность.
- **Дела** (`UmmsCaseModel`) — оформление услуг и дел.
- **Адреса** (`UmmsAddressModel`) — регистрация и адресные справочники.

## Сценарий № 1 (Выдача нового документа / откат)
- `issueNewDocument`: Создание нового документа, привязка к делу и лицу.
- `RollbackScenario1`: Откат операции (отправляет пустой объект, особенность транзакций).

## USB-обмен (АРМ МС)
- Синхронизация справочников (страны, документы).
- Примечание: `getCountryDictionary` в коде не вызывается — клиент использует локальный файл `dict_country.csv`.

## Соответствие моделей кода и таблиц БД

### Common.Data.Models.Umms → Таблицы CORE_*

| Модель | Таблица | Примечание |
|---|---|---|
| `UmmsPersonModel` | `CORE_PERSON`, `CORE_PERSONDATA` | Основные данные лица + персональные данные |
| `UmmsDocumentModel` | `CORE_DOCUMENT` | Документы, удостоверяющие личность |
| `UmmsCaseModel` | `CORE_CASE`, `CORE_PERSON_CASE` | Дело + связь лица с делом |
| `UmmsAddressModel` | `CORE_ADDRESS`, `CORE_PERSON_ADDRESS` | Адрес + привязка адреса к лицу |
| `CountryModel` | `DICT_COUNTRY` | Справочник стран |
| `UmmsOrgModel` | `CORE_ORGANIZATION` | Организации/УФМС |
| `UmmsPaymentModel` | `CORE_PAYMENT` | Платежи |

### Common.Data.Providers → Запросы к БД

| Провайдер | Используемые таблицы | Описание |
|---|---|---|
| `PersonProvider` | `CORE_PERSON`, `CORE_PERSONDATA`, `CORE_PERSON_ADDRESS` | Получение/сохранение данных лица |
| `DocumentProvider` | `CORE_DOCUMENT`, `DICT_DOCUMENT_TYPE` | Работа с документами |
| `CaseProvider` | `CORE_CASE`, `CORE_PERSON_CASE`, `CORE_CASE_STATUS` | Управление делами |
| `CountryProvider` | `DICT_COUNTRY` | Справочник стран |
| `AddressProvider` | `CORE_ADDRESS`, `CORE_PERSON_ADDRESS`, `DICT_REGION`, `DICT_CITY` | Адресные данные |

### Особенности соответствия

1. **`getCountryDictionary`** в коде не вызывается — клиент использует локальный файл `dict_country.csv`. Таблица `DICT_COUNTRY` в БД существует, но данные берутся из CSV.
2. **`RollbackScenario1`** отправляет пустой объект — при откате `issueNewDocument` фактические данные не передаются, что может быть связано с особенностями реализации транзакций.
3. **`MIG_LABOURMIGDATA`** и **`MIG_UNREG_DATA`** не имеют прямых моделей в `Common.Data.Models.Umms` — эти таблицы используются для отчетности (форма ИР) и снятия с учета, вероятно через SQL-запросы напрямую.
