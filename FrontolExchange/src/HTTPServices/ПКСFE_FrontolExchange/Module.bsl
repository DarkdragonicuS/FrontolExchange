
Функция API(Запрос)
	СтруктураПараметровЗапроса = ПолучитьСтруктуруПараметровЗапроса(Запрос);
	
	МетодЗапроса = СтруктураПараметровЗапроса.МетодЗапроса;
	ИмяОбъекта = СтруктураПараметровЗапроса.ИмяОбъекта;
	ИмяМетода = СтруктураПараметровЗапроса.ИмяМетода;
	
	Роутинг = "";
	
	Попытка 
		
		Если ИмяОбъекта = "system" или ИмяОбъекта=Неопределено или ИмяОбъекта="" или ИмяОбъекта="/" Тогда 
			
			Результат = ОбработатьОбъектSystem(Запрос, СтруктураПараметровЗапроса, Роутинг);
			
		ИначеЕсли ИмяОбъекта = "wares" Тогда                
			
			Результат = ОбработатьОбъектWares(Запрос, СтруктураПараметровЗапроса, Роутинг);
				
		Иначе		
			
			Результат = "001"                               
			
		КонецЕсли;
		
		Если Результат = "001" Тогда
			
			СтруктураОписанияОшибки = Новый  Структура;				
			СтруктураОписанияОшибки.Вставить("Описание", "Не найден метод " + МетодЗапроса + " " + ИмяМетода + " у объекта " + ИмяОбъекта + ". ");
			
			Результат = ПодготовитьОтветJSON(, СтруктураОписанияОшибки);
			
		КонецЕсли;

	Исключение
		
		СтруктураОписанияОшибки = Новый  Структура;				
		СтруктураОписанияОшибки.Вставить("Описание", "Ошибка метода " + МетодЗапроса + " " + ИмяМетода + " у объекта " + ИмяОбъекта + ". По причине: " + ОписаниеОшибки());
		
		Результат = ПодготовитьОтветJSON(, СтруктураОписанияОшибки);
	
	КонецПопытки;	
	
	
	Ответ = Новый HTTPСервисОтвет(200);
	Ответ.Заголовки.Вставить("Content-Type", "application/json; charset=utf-8");

	
	Попытка
		
		JSONРезультат = СформироватьJSONОтвета(Результат);
		Ответ.УстановитьТелоИзСтроки(JSONРезультат, "UTF-8", ИспользованиеByteOrderMark.НеИспользовать);
		
	Исключение 
		
		СтруктураОписанияОшибки = Новый  Структура;				
		СтруктураОписанияОшибки.Вставить("Описание", "Ошибка ответа метода " + МетодЗапроса + " " + ИмяМетода + " у объекта " + ИмяОбъекта + ". По причине: " + ОписаниеОшибки());
			
		Результат = ПодготовитьОтветJSON(, СтруктураОписанияОшибки);
		
	КонецПопытки;
	
	Попытка	
		Если Результат.Свойство("description") Тогда		
			Ответ.КодСостояния = 901;  
			Ответ.Причина = "error"; 
		КонецЕсли;		
	Исключение		
	КонецПопытки;
	
	Возврат Ответ;
	
КонецФункции

Функция ПолучитьСтруктуруПараметровЗапроса(Запрос)
	
	СтруктураПараметровЗапроса = Новый Структура;
	
	СтруктураПараметровЗапроса.Вставить("МетодЗапроса",     "");
	СтруктураПараметровЗапроса.Вставить("ИмяОбъекта",       "");
	СтруктураПараметровЗапроса.Вставить("ИмяМетода",        "");

	СтруктураПараметровЗапроса.МетодЗапроса = Запрос.HTTPМетод;
	
	///api/system/info	
	ОтносительныйURL = Запрос.ОтносительныйURL;
	//system/info
	ОтносительныйURL = СтрЗаменить(ОтносительныйURL,"/api/","");
	
	РазделительМетода = Найти(ОтносительныйURL,"/");
	РазделительМетода = ?(РазделительМетода>0,РазделительМетода-1,РазделительМетода);
	
	//system
	ИмяОбъекта = ?(РазделительМетода>0,Лев(ОтносительныйURL,РазделительМетода),ОтносительныйURL);	
	СтруктураПараметровЗапроса.ИмяОбъекта = ИмяОбъекта;
	
	///info
	ИмяМетода = ?(РазделительМетода>0,Прав(ОтносительныйURL,СтрДлина(ОтносительныйURL)-РазделительМетода),"");
	СтруктураПараметровЗапроса.ИмяМетода = ИмяМетода;

	
	Возврат СтруктураПараметровЗапроса;
	
КонецФункции

Функция ОбработатьОбъектSystem(Запрос, СтруктураПараметровЗапроса, Роутинг)
	
	Ответ = Неопределено;
	
	МетодЗапроса = СтруктураПараметровЗапроса.МетодЗапроса;
	ИмяОбъекта = СтруктураПараметровЗапроса.ИмяОбъекта;
	ИмяМетода = СтруктураПараметровЗапроса.ИмяМетода;

	Если ИмяОбъекта=Неопределено или ИмяОбъекта="" или ИмяОбъекта="/" Тогда
			
		Роутинг = "FEServerInfo"; 
			
		Ответ = ПКСFE_FrontolExchangeHTTP.FEServerInfo();

	ИначеЕсли МетодЗапроса = "GET" ИЛИ МетодЗапроса = "POST" Тогда
		
		Если ИмяМетода = "/info" Тогда
			
			Роутинг = "FEServerInfo"; 
			
			Ответ = ПКСFE_FrontolExchangeHTTP.FEServerInfo();
						
		ИначеЕсли ИмяМетода = "/version" Тогда
			
			Роутинг = "GETVersion"; 

			Ответ = ПКСFE_FrontolExchangeHTTP.GetVersion();
			
		ИначеЕсли ИмяМетода = "/ping" Тогда
			
			Роутинг = "GETPing"; 
			
			Ответ = ПКСFE_FrontolExchangeHTTP.Ping();
				
		Иначе
			
			Ответ = "001";
			
		КонецЕсли;
		
	ИначеЕсли МетодЗапроса = "POST" Тогда
		
		Ответ = "001";
		
	ИначеЕсли МетодЗапроса = "PUT" Тогда
		
		Ответ = "001";
		
	ИначеЕсли МетодЗапроса = "DELETE" Тогда
		
		Ответ = "001";
		
	Иначе
		
		Ответ = "001";

	КонецЕсли;	
	
	Возврат Ответ;
	
КонецФункции

Функция ОбработатьОбъектWares(Запрос, СтруктураПараметровЗапроса, Роутинг)
	
	Ответ = Неопределено;
	СтруктураHttpПараметров = Новый Структура;
	
	МетодЗапроса = СтруктураПараметровЗапроса.МетодЗапроса;
	ИмяМетода = СтруктураПараметровЗапроса.ИмяМетода;
	
	Если МетодЗапроса = "GET" ИЛИ МетодЗапроса = "POST" Тогда
		
		
		Если ИмяМетода = "" Тогда
					
			ПолучитьHttpПараметрыПоМетодамAPI(Запрос, СтруктураПараметровЗапроса, СтруктураHttpПараметров);
			
			posId 			= СтруктураHttpПараметров.posId; 
			code 			= СтруктураHttpПараметров.code; 
			barcode 		= СтруктураHttpПараметров.barcode;  
			
			Роутинг = "GetWareInfo";
				
			Ответ = ПКСFE_FrontolExchangeHTTP.GetWareInfo(posId, code, barcode);
			
		ИначеЕсли ИмяМетода = "/rest" Тогда  	
			
			ПолучитьHttpПараметрыПоМетодамAPI(Запрос, СтруктураПараметровЗапроса, СтруктураHttpПараметров);
			
			posId	 	= СтруктураHttpПараметров.posId;
			code 		= СтруктураHttpПараметров.code; 
			barcode 	= СтруктураHttpПараметров.barcode; 
			guid 		= СтруктураHttpПараметров.guid; 
			
			Роутинг = "GetWareRest";
			
			Ответ = ПКСFE_FrontolExchangeHTTP.GetWareRest(posId, code, barcode, guid);	
			
		ИначеЕсли ИмяМетода = "/list" Тогда
			
			ПолучитьHttpПараметрыПоМетодамAPI(Запрос, СтруктураПараметровЗапроса, СтруктураHttpПараметров);
			
			posId	 	= СтруктураHttpПараметров.posId;
			tree		= СтруктураHttpПараметров.tree;
			partName	= СтруктураHttpПараметров.partName;
			code		= СтруктураHttpПараметров.code;
			barcode		= СтруктураHttpПараметров.barcode;
			art			= СтруктураHttpПараметров.art;
			
			Params   	= "";
			
			Роутинг = "GetWareList";
			
			Ответ = ПКСFE_FrontolExchangeHTTP.GetWareList(posId, tree, code, barcode, partName, art);	
						
		Иначе
			
			Ответ = "001";
	
		КонецЕсли;
				
	Иначе 
		
		Ответ = "001";

	КонецЕсли;	
	
	Возврат Ответ;
	
КонецФункции

Процедура ПолучитьHttpПараметрыПоМетодамAPI(Запрос, СтруктураПараметровЗапроса, СтруктураHttpПараметров)
	
	МетодЗапроса = СтруктураПараметровЗапроса.МетодЗапроса;
	ИмяОбъекта = СтруктураПараметровЗапроса.ИмяОбъекта;
	ИмяМетода = СтруктураПараметровЗапроса.ИмяМетода;
			
	Если ИмяОбъекта = "wares" Тогда		
		
		Если МетодЗапроса = "GET" ИЛИ МетодЗапроса = "POST" Тогда
			
			Если ИмяМетода = "" Тогда 
				
				СтруктураHttpПараметров.Вставить("posId",       "");
				СтруктураHttpПараметров.Вставить("code",        "");
				СтруктураHttpПараметров.Вставить("barcode",         "");
				
			ИначеЕсли ИмяМетода = "/rest" Тогда
				
				СтруктураHttpПараметров.Вставить("posId",       "");
				СтруктураHttpПараметров.Вставить("code",        "");
				СтруктураHttpПараметров.Вставить("barcode",         "");
				СтруктураHttpПараметров.Вставить("guid","");
			ИначеЕсли ИмяМетода = "/list" Тогда
				
				СтруктураHttpПараметров.Вставить("posId",       "");
				СтруктураHttpПараметров.Вставить("tree",         Ложь);
				СтруктураHttpПараметров.Вставить("code",        "");
				СтруктураHttpПараметров.Вставить("barcode",         "");
				СтруктураHttpПараметров.Вставить("partName",         "");
				СтруктураHttpПараметров.Вставить("art",         "");

			КонецЕсли;
		КонецЕсли;
	
	Иначе
		
		СтруктураHttpПараметров.Вставить("posId",  "");
		
	КонецЕсли;
	
	Попытка 	
		ПрочитатьВсеHttpПараметры(Запрос, СтруктураПараметровЗапроса, СтруктураHttpПараметров);	
	Исключение 			
	КонецПопытки;

КонецПроцедуры

Процедура ПрочитатьВсеHttpПараметры(Запрос, СтруктураПараметровЗапроса, СтруктураHttpПараметров)

	ЗапросТело = Запрос.ПолучитьТелоКакСтроку();
	
	Для каждого Элемент из СтруктураHttpПараметров Цикл
		ТекущееЗначениеПараметра = (Запрос.ПараметрыЗапроса.Получить(Элемент.Ключ));
		Если ТекущееЗначениеПараметра<>Неопределено Тогда 
			СтруктураHttpПараметров[Элемент.Ключ] = ТекущееЗначениеПараметра;
		КонецЕсли;	
	КонецЦикла;
	
	Попытка
		
		ЧтениеJSON = Новый ЧтениеJSON;
		ЧтениеJSON.УстановитьСтроку(ЗапросТело);
		
		ВходящиеПараметры = Неопределено;
		СформироватьДерево(ЧтениеJSON, ВходящиеПараметры);
		
		ЧтениеJSON.Закрыть();
		
		Для каждого Элемент из СтруктураHttpПараметров Цикл
			Если Элемент.Ключ <> "posId" Тогда
				Если Элемент.Ключ = "fecustomvaluelist" Тогда  
					Если ВходящиеПараметры.Количество() <> 0 Тогда
						МассивЗначений = Новый Массив;
						Для Каждого Стр Из ВходящиеПараметры Цикл
							
							МассивЗначений.Добавить(ПолучитьСтруктуруИзСоответствия(Стр));									
							
						КонецЦикла;
						СтруктураHttpПараметров[Элемент.Ключ] = МассивЗначений;
					КонецЕсли;
				Иначе	
					ТекущееЗначениеПараметра = ВходящиеПараметры.Получить(Элемент.Ключ);
					Если ТекущееЗначениеПараметра <> Неопределено Тогда 
						СтруктураHttpПараметров[Элемент.Ключ] = ТекущееЗначениеПараметра;
					КонецЕсли;	
				КонецЕсли;
			КонецЕсли;
		КонецЦикла;
		
	Исключение 
		
	КонецПопытки;
	
КонецПроцедуры

Функция ПолучитьСтруктуруИзСоответствия(ВходящееЗначение) Экспорт
	
	СтруктураВозврат = Новый Структура;
	
	Если ТипЗнч(ВходящееЗначение) = Тип("Соответствие") Тогда
				
		Для Каждого ТекущееЗначение Из ВходящееЗначение Цикл
			Попытка
				СтруктураВозврат.Вставить(ТекущееЗначение.Ключ,ПолучитьСтруктуруИзСоответствия(ТекущееЗначение.Значение));
			Исключение
				Прервать;
			КонецПопытки;
		КонецЦикла;
				
		Возврат СтруктураВозврат; 
		
	ИначеЕсли ТипЗнч(ВходящееЗначение)=Тип("Массив") Тогда
		
		НовыйМассив=Новый Массив;
		Для Каждого ЭлементМассива Из ВходящееЗначение Цикл
			НовыйМассив.Добавить(ПолучитьСтруктуруИзСоответствия(ЭлементМассива));
		КонецЦикла;
		
		Возврат НовыйМассив;
		
	КонецЕсли;
	
	Возврат ВходящееЗначение; 
	
КонецФункции

Функция ОбработатьЭкранированиеСтроки(ВходящаяСтрока) Экспорт

	ВходящаяСтрока = СтрЗаменить(ВходящаяСтрока, "&lt;", "<");
	ВходящаяСтрока = СтрЗаменить(ВходящаяСтрока, "&gt;", ">");
	ВходящаяСтрока = СтрЗаменить(ВходящаяСтрока, "&quot;", """");
	ВходящаяСтрока = СтрЗаменить(ВходящаяСтрока, "&apos;", "'");
	ВходящаяСтрока = СтрЗаменить(ВходящаяСтрока, "\/", "/");
	ВходящаяСтрока = СтрЗаменить(ВходящаяСтрока, Символ(0), """");
		
	Возврат ВходящаяСтрока;

КонецФункции // ()

Процедура СформироватьДерево(ЧтениеJSON, Дерево)
    
    ИмяСвойства = Неопределено;
    
    Пока ЧтениеJSON.Прочитать() Цикл
        TипJSON = ЧтениеJSON.ТипТекущегоЗначения;
        
        Если TипJSON = ТипЗначенияJSON.НачалоОбъекта 
        ИЛИ TипJSON = ТипЗначенияJSON.НачалоМассива Тогда
            НовыйОбъект = ?(TипJSON = ТипЗначенияJSON.НачалоОбъекта, Новый Соответствие, Новый Массив);
            
            Если ТипЗнч(Дерево) = Тип("Массив") Тогда
                Дерево.Добавить(НовыйОбъект);
            ИначеЕсли ТипЗнч(Дерево) = Тип("Соответствие") И ЗначениеЗаполнено(ИмяСвойства) Тогда
                Дерево.Вставить(ИмяСвойства, НовыйОбъект);
            КонецЕсли;
            
            СформироватьДерево(ЧтениеJSON, НовыйОбъект);
            
            Если Дерево = Неопределено Тогда
                Дерево = НовыйОбъект;
            КонецЕсли;
        ИначеЕсли TипJSON = ТипЗначенияJSON.ИмяСвойства Тогда
            ИмяСвойства = ЧтениеJSON.ТекущееЗначение;
        ИначеЕсли TипJSON = ТипЗначенияJSON.Число 
        ИЛИ TипJSON = ТипЗначенияJSON.Строка 
        ИЛИ TипJSON = ТипЗначенияJSON.Булево 
        ИЛИ TипJSON = ТипЗначенияJSON.Null Тогда
            Если ТипЗнч(Дерево) = Тип("Массив") Тогда
                Дерево.Добавить(ЧтениеJSON.ТекущееЗначение);
            ИначеЕсли ТипЗнч(Дерево) = Тип("Соответствие") Тогда
                Дерево.Вставить(ИмяСвойства, ЧтениеJSON.ТекущееЗначение);
            КонецЕсли;
        Иначе
            Возврат;
        КонецЕсли;
    КонецЦикла;
    
КонецПроцедуры

// ПОДГОТОВКА РЕЗУЛЬТАТА
Функция СформироватьJSONОтвета(Данные)
	
	СтрокаJSON = "";
	
	НастройкиСериализации = Новый НастройкиСериализацииJSON;
	НастройкиСериализации.ФорматСериализацииДаты = ФорматДатыJSON.JavaScript;
	ПараметрыJSON = Новый ПараметрыЗаписиJSON(ПереносСтрокJSON.Нет, "", Истина);
	
	Запись = Новый ЗаписьJSON;
	Запись.ПроверятьСтруктуру = Истина;
	Запись.УстановитьСтроку(ПараметрыJSON);
	
		
	ЗаписатьJSON(Запись, Данные, НастройкиСериализации);
	СтрокаJSON = Запись.Закрыть();


	Возврат СтрокаJSON;
	
КонецФункции

Функция ПодготовитьОтветJSON(СтруктураДанных = Неопределено, СтруктураОписанияОшибки = Неопределено)
	
	Ответ = Новый Массив;
		
	СтруктураОшибок = Новый Структура;
	
	Если СтруктураОписанияОшибки = Неопределено Тогда	
				
		Ответ = СтруктураДанных;
		
	Иначе
		 
		СтруктураОшибок.Вставить("description", СтруктураОписанияОшибки.Описание); 
		
		Ответ = СтруктураОшибок;
		
	КонецЕсли;
	
	Возврат Ответ;

КонецФункции
