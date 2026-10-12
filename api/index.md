# API Системы паспортного учёта (ППО «Территория»)

## Общие сведения
- **Тип взаимодействия**: Внутренний API между модулями ПО СС / ПО МС и БД (Oracle).
- **Формат данных**: JSON (при обмене между сервисами), прямые SQL-вызовы к БД.
- **Версия**: 1.0

## Основные эндпоинты / Операции

### 1. Управление лицами и документами
- `POST /api/person/create` (вызов `PersonProvider.Save`) — Создание/обновление физического лица.
- `POST /api/document/issue` (вызов `DocumentProvider.Issue`) — Выдача документа (Сценарий №1).
- `POST /api/case/create` (вызов `CaseProvider.Create`) — Оформление дела.

### 2. Справочники
- `GET /api/dict/country` — Получение справочника стран (локальный CSV / таблица `DICT_COUNTRY`).
- `GET /api/dict/document-types` — Типы документов (`DICT_DOCUMENT_TYPE`).

### 3. Миграция и учет (отчетность)
- `POST /api/mig/labour-report` — Формирование формы ИР (данные из `MIG_LABOURMIGDATA`).
- `POST /api/mig/unreg` — Снятие с учета (данные из `MIG_UNREG_DATA`).

## Сверка полей операций с таблицами БД

### Операция: `issueNewDocument` (Выдача документа)
Соответствие полей JSON-запроса и таблиц БД:

| Поле в API (JSON) | Таблица БД | Поле в БД | Тип в БД | Обяз. | Примечание |
|---|---|---|---|---|---|
| `personId` | `CORE_PERSON` | `ID` | NUMBER | ✓ | Идентификатор лица |
| `firstName` | `CORE_PERSONDATA` | `FIRSTNAME` | VARCHAR2(100) | ✓ | Имя |
| `lastName` | `CORE_PERSONDATA` | `LASTNAME` | VARCHAR2(200) | ✓ | Фамилия |
| `middleName` | `CORE_PERSONDATA` | `MIDDLENAME` | VARCHAR2(100) | | Отчество |
| `birthDate` | `CORE_PERSONDATA` | `BIRTHDATE` | DATE | | Дата рождения |
| `documentType` | `CORE_DOCUMENT` | `DOCUMENTTYPE_ID` | NUMBER | ✓ | FK на `DICT_DOCUMENT_TYPE` |
| `docSeries` | `CORE_DOCUMENT` | `DOCUMENTSERIES` | VARCHAR2(30) | | Серия |
| `docNumber` | `CORE_DOCUMENT` | `DOCUMENTNUMBER` | VARCHAR2(50) | ✓ | Номер |
| `issueDate` | `CORE_DOCUMENT` | `DOCUMENTISSUEDDATE` | DATE | ✓ | Дата выдачи |
| `caseId` | `CORE_CASE` | `ID` | NUMBER | ✓ | Привязка к делу |

### Операция: `createLabourMigReport` (Форма ИР / Миграция)
Соответствие полей для отчета по трудовой миграции:

| Поле в API (JSON) | Таблица БД | Поле в БД | Тип в БД | Обяз. | Примечание |
|---|---|---|---|---|---|
| `personId` | `MIG_LABOURMIGDATA` | `ID` (связь) | NUMBER | ✓ | Временное хранение |
| `isPermitted` | `MIG_LABOURMIGDATA` | `ISPERMITTED` | NUMBER(1) | ✓ | Патент/разрешение |
| `issuedWorkPerm` | `MIG_LABOURMIGDATA` | `ISSUEDWORKPERMISSION` | NUMBER(1) | ✓ | Выдано разрешение |
| `permitSeries` | `MIG_LABOURMIGDATA` | `PERMITSERIES` | VARCHAR2(30) | | Серия разрешения |
| `permitNumber` | `MIG_LABOURMIGDATA` | `PERMITNUMBER` | VARCHAR2(50) | | Номер разрешения |
| `permitValidTo` | `MIG_LABOURMIGDATA` | `PERMITVALIDTO` | DATE | | Срок действия |
| `citizenshipCode` | `MIG_LABOURMIGDATA` | `CITIZENSHIPALPHACODE` | VARCHAR2(30) | | Код гражданства |

### Операция: `unregisterPerson` (Снятие с учета)
Соответствие полей для снятия с миграционного учета:

| Поле в API (JSON) | Таблица БД | Поле в БД | Тип в БД | Обяз. | Примечание |
|---|---|---|---|---|---|
| `personId` | `MIG_UNREG_DATA` | `ID` | NUMBER | ✓ | Идентификатор записи |
| `removalReason` | `MIG_UNREG_DATA` | `REMOVALREASON_ID` | NUMBER | ✓ | Причина снятия (FK) |
| `departureKpp` | `MIG_UNREG_DATA` | `DEPARTURE_KPP_ID` | NUMBER | ✓ | КПП выезда (FK) |
| `departureDate` | `MIG_UNREG_DATA` | `DEPARTURE_DATE` | DATE | ✓ | Дата выезда |
| `noticeNumber` | `MIG_UNREG_DATA` | `NOTICENUMBER` | VARCHAR2(250) | | Номер уведомления |

## Особенности и валидация
1. **Оптимистическая блокировка**: Все таблицы ядра и миграции содержат поле `VERSION` (NUMBER). При вызове API обновления обязательно передается текущий `version` для предотвращения конфликтов.
2. **Откат транзакций**: Операция отката (`RollbackScenario1`) не несет полезной нагрузки в JSON (пустой объект), фактический откат происходит через хранимые процедуры/триггеры БД по `caseId`.
3. **Справочники**: При создании лица/документа поля типа `DOCUMENTTYPE_ID`, `CITIZENSHIP_ID` в БД ожидают числовые ID, в то время как в API могут передаваться строковые коды (конвертация происходит на уровне `Common.Data.Providers`).
