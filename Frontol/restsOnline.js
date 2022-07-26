//используется библиотека WSO 1.1 (Copyright (c) 2004-2015 Veretennikov Alexander Borisovich, Russian Federation, Ekaterinburg)
//http://www.veretennikov.org/WSO/Help/html/index.html

//вызывать wareListUniForm()
login = "FE";
password = "";
serverAddress = "localhost";
baseName = "book";

function checkServer()
{
  xmlhttp = new ActiveXObject("MsXml2.ServerXMLHTTP");
  try
    {
        request = "/";
        xmlhttp.open("GET", GetDalionHttpAdress()+request, false);
    }
    catch (E)
    {
        frontol.actions.showMessage("Нет связи с сервером Далион. " + E.description);
        return -1;
    }
    try
    {
      xmlhttp.setRequestHeader("Authorization","Basic " + authString(login,password));
      xmlhttp.setRequestHeader("Content-Type", "application/json");
      xmlhttp.setRequestHeader("Accept", "application/json");
      xmlhttp.send(null);
    }
    catch (E)
    {
        frontol.actions.showMessage("Нет связи с сервером Далион. " + E.description);
        return -999;
    }
    if(xmlhttp.status == 200)
    {
      return 0
    }
    else
    {
      frontol.actions.showMessage("Нет связи с сервером Далион. " + xmlhttp.responseText);
      return -xmlhttp.status;
    }
}

function init()
{

  checkServer();

}

//вывод остатков в виде таблицы
function showRests(data,wareName)
{
o = new ActiveXObject("Scripting.WindowSystemObject")

o.EnableVisualStyles = true

restListForm = o.CreateForm(0,0,0,0)

restListForm.Text = "Остатки товара '" + wareName + "'"

restListForm.ClientWidth = 1105
restListForm.ClientHeight = 500
restListForm.CenterControl()

buttonCancel = restListForm.CreateButton(0,0,0,0,"Выход")
buttonCancel.Cancel = true
buttonCancel.OnClick = closeFormHandler


ListViewRests = restListForm.CreateListView(0,0,1100,500,o.Translate("LVS_REPORT"))
ListViewRests.Align = o.Translate("AL_CLIENT")
ListViewRests.Columns.Add("",0)
ListViewRests.Columns.Add("Магазин",450)
ListViewRests.Columns.Add("Склад",450)
ListViewRests.Columns.Add("Остаток",200)
ListViewRests.OnColumnClick = OnColumnClick
ListViewRests.RowSelect = true

ListViewRests.CustomDraw = true
ListViewRests.Font.Size = 20

ListViewRests.OnDrawItem = ListViewOnDrawItem

restLine = 0;
restTotal = 0;
for(objEnum = new Enumerator(data);!objEnum.atEnd();objEnum.moveNext()){
        restLine++
        strRest = objEnum.item();
        var Item = ListViewRests.Add(restLine);
        Item.SubItems(0) = strRest.shopName;
        Item.SubItems(1) = strRest.warehouseName;
        Item.SubItems(2) = strRest.rest;
        restTotal += strRest.rest
}
if(restLine > 1){
  var Item = ListViewRests.Add(restLine+1);
  Item.SubItems(1) = "Всего:";
  Item.SubItems(2) = restTotal;
}

if(restLine == 0){
  frontol.actions.showMessage("Товар отсутствует на складах.");
  return 0;
}

SortColumn = -1
SortReverse = false

restListForm.OnResize = OnRestListFormResize

restListForm.Maximize()
restListForm.ShowModal()

o.Run()

function OnRestListFormResize(Sender)
  {
    adaptRestListElements(Sender)
  }

function adaptRestListElements(Sender)
  {

    ListViewRestsWidth = Sender.Width - 10
    ListViewRestsHeight = Sender.Height - 20
    ListViewRests = Sender.Controls.Item(1)
    ListViewRests.Width = ListViewRestsWidth
    ListViewRestsWidth.Height = ListViewRestsHeight

    //колонки
    //Магазин
    ListViewRests.Columns(1).Width = (ListViewRestsWidth - 210) / 2
    //Склад
    ListViewRests.Columns(2).Width = (ListViewRestsWidth - 210) / 2
    //Остаток
    ListViewRests.Columns(3).Width = 200
  }

function OnColumnClick(Sender,Column)
  {
        if (SortColumn == Column.Index)
        {
                SortReverse = !SortReverse
        } else
        {
                SortColumn = Column.Index
                SortReverse = false
        }
        var SortMode = o.Translate("DT_STRING")
        if (Column.Index == 3){
          SortMode = o.Translate("DT_INTEGER")
        }
        ListView.Sort(SortMode,SortReverse,Column.Index)
  }

}
//</function showRests(data)>

//читаемая отрисовка строк в ListView
function ListViewOnDrawItem(Sender,Item)
{
  i = Item.Index
  if (i % 2 == 0){
    Item.TextBkColor = 0xFFFFFF
  }
  else{
    Item.TextBkColor = 0xE4E4E4
  }
}

//унифицированная форма списка номенклатуры
function wareListUniForm()
{
o = new ActiveXObject("Scripting.WindowSystemObject")

o.EnableVisualStyles = true

wareListForm = o.CreateForm(0,0,0,0)

wareListForm.Text = "Товары"

wareListForm.ClientWidth = 1560
wareListForm.ClientHeight = 1110
wareListForm.CenterControl()

frameInput = wareListForm.CreateFrame(0,0,0,110)
frameInput.Align = o.Translate("AL_TOP")

to = frameInput.TextOut(10,15,"Код:")
to.Font.Size = 20
inputCodeEdit = frameInput.CreateEdit(75,10,300,0)
inputCodeEdit.Font.Size = 20

to = frameInput.TextOut(385,15,"ШК:")
to.Font.Size = 20

inputBarcodeEdit = frameInput.CreateEdit(450,10,300,0)
inputBarcodeEdit.Font.Size = 20

to = frameInput.TextOut(760,15,"Арт:")
to.Font.Size = 20

inputArtEdit = frameInput.CreateEdit(825,10,300,0)
inputArtEdit.Font.Size = 20

buttonSearch = frameInput.CreateButton(1135,10,150,38,"Поиск")
buttonSearch.Default = true
buttonSearch.Font.Size = 20
buttonSearch.OnClick = searchAndFillWareList

buttonCancel = frameInput.CreateButton(1295,10,150,38,"Выход")
buttonCancel.Cancel = true
buttonCancel.Font.Size = 20
buttonCancel.OnClick = closeFormHandler

to = frameInput.TextOut(10,65,"Наименование:")
to.Font.Size = 20

inputNameEdit = frameInput.CreateEdit(210,60,1235,0)
inputNameEdit.Font.Size = 20

ListView = wareListForm.CreateListView(0,60,1550,1000,o.Translate("LVS_REPORT"))
ListView.Align = o.Translate("AL_TOP")
ListView.Columns.Add("",0)
ListView.Columns.Add("Код",150)
ListView.Columns.Add("Артикул",250)
ListView.Columns.Add("Наименование",1000)
ListView.Columns.Add("Цена",150)
ListView.OnColumnClick = OnColumnClick
ListView.OnDblClick = getWareRestUni
ListView.RowSelect = true

ListView.CustomDraw = true
ListView.Font.Size = 20

ListView.OnDrawItem = ListViewOnDrawItem

SortColumn = -1
SortReverse = false

wareListForm.OnResize = OnWareListFormResize

wareListForm.Maximize()

adaptWareListElements(wareListForm)

wareListForm.Show()

o.Run()

function OnWareListFormResize(Sender)
  {
    adaptWareListElements(Sender)
  }

function adaptWareListElements(Sender)
  {
    FrameWidth = Sender.Controls.Item(0).Form.Width - 20
    InputControls = Sender.Controls.Item(0).Controls
    ListView = Sender.Controls.Item(1)

    //надпись "Код:"
    InputControls.Item(0).Left = 10
    InputControls.Item(0).Top = 15

    //поле "Код"
    InputControls.Item(1).Left = InputControls.Item(0).Left + 60
    InputControls.Item(1).Top = InputControls.Item(0).Top - 5
    InputControls.Item(1).Width = FrameWidth / 4 - 70
    InputControls.Item(1).Height = 0

    //надпись "ШК:"
    InputControls.Item(2).Left = InputControls.Item(1).Left + InputControls.Item(1).Width + 10
    InputControls.Item(2).Top = InputControls.Item(0).Top

    //поле "ШК"
    InputControls.Item(3).Left = InputControls.Item(2).Left + 60
    InputControls.Item(3).Top = InputControls.Item(2).Top - 5
    InputControls.Item(3).Width = FrameWidth / 4 - 70
    InputControls.Item(3).Height = 0

    //надпись "Арт.:"
    InputControls.Item(4).Left = InputControls.Item(3).Left + InputControls.Item(3).Width + 10
    InputControls.Item(4).Top = InputControls.Item(0).Top

    //поле "Арт.:"
    InputControls.Item(5).Left = InputControls.Item(4).Left + 60
    InputControls.Item(5).Top = InputControls.Item(4).Top - 5
    InputControls.Item(5).Width = FrameWidth / 4 - 70
    InputControls.Item(5).Height = 0

    //кнопка "Поиск"
    InputControls.Item(6).Left = InputControls.Item(5).Left + InputControls.Item(5).Width + 10
    InputControls.Item(6).Top = InputControls.Item(0).Top - 5
    InputControls.Item(6).Width = (FrameWidth / 4 - 30)/2
    InputControls.Item(6).Height = 38

    //кнопка "Выход"
    InputControls.Item(7).Left = InputControls.Item(6).Left + InputControls.Item(6).Width + 10
    InputControls.Item(7).Top = InputControls.Item(6).Top
    InputControls.Item(7).Width = (FrameWidth / 4 - 30)/2
    InputControls.Item(7).Height = 38

    //надпись "Наименование:"
    InputControls.Item(8).Left = InputControls.Item(0).Left
    InputControls.Item(8).Top = InputControls.Item(0).Top + 50

    //поле "Наименование"
    InputControls.Item(9).Left = InputControls.Item(8).Left + 200
    InputControls.Item(9).Top = InputControls.Item(8).Top - 5
    InputControls.Item(9).Width = FrameWidth - 220
    InputControls.Item(9).Height = 0

    ListView.Width = Sender.Width - 10
    ListView.Height = Sender.Height - Sender.Controls.Item(0).Height - 20

    //колонки
    //"Код"
    ListView.Columns(1).Width = 150
    //"Артикул"
    ListView.Columns(2).Width = 250
    //"Наименование"
    ListView.Columns(3).Width = ListView.Width - 550 - 5
    //"Цена"
    ListView.Columns(4).Width = 150
  }

function getWareRestUni(Sender)
  {
    Item = Sender.Item(Sender.ItemIndex)
    GUID = Item.SubItems(4)
    getWareRests("","",GUID)
  }

function searchAndFillWareList(Sender)
  {
     frameInputControls = Sender.Parent.Controls
     code = frameInputControls.Item(1).Text;
     barcode = frameInputControls.Item(3).Text;
     art = frameInputControls.Item(5).Text;
     partName = frameInputControls.Item(9).Text;

     data = getWareList(code,barcode,partName,art);
     ListView = Sender.Parent.Parent.Controls.Item(1);
     ListView.Visible = false
     ListView.Clear()
     if(typeof(data)=="object"){
       wareLine = 0;
       for(objEnum = new Enumerator(data);!objEnum.atEnd();objEnum.moveNext()){
         wareLine++
         strWare = objEnum.item();
         ListView = Sender.Parent.Parent.Controls.Item(1);
         var Item = ListView.Add(wareLine);
         Item.SubItems(0) = strWare.code;
         Item.SubItems(1) = strWare.art;
         Item.SubItems(2) = strWare.name;
         Item.SubItems(3) = strWare.price;
         Item.SubItems(4) = strWare.GUID;
       }
     ListView.Visible = true
       if(wareLine == 0){
         return 0;
       }
     }
  }

function OnColumnClick(Sender,Column)
  {
        if (SortColumn == Column.Index)
        {
                SortReverse = !SortReverse
        } else
        {
                SortColumn = Column.Index
                SortReverse = false
        }
        var SortMode = o.Translate("DT_STRING")
        if (Column.Index == 1){
          SortMode = o.Translate("DT_INTEGER")
        }
        ListView.Sort(SortMode,SortReverse,Column.Index)
  }
}
//</function wareListUniForm()>

//закрытие формы
function closeFormHandler(sender)
{
	sender.form.close()
}

//адрес сервиса
function GetDalionHttpAdress()
{
  return "http://"+serverAddress+"/"+baseName+"/hs/FrontolExchange";
}

//Получение остатков с сервера
function getWareRests(code,barcode,guid)
{
  o = new ActiveXObject("Scripting.WindowSystemObject")

  o.EnableVisualStyles = true

  f = o.CreateForm(0,0,0,0,o.Translate("WS_SYSMENU"))

  f.Text = "Получение остатков"
  f.ClientWidth = 385
  f.ClientHeight = 50
  f.CenterControl()

  to = f.TextOut(10,10,"получение остатков...")
  to.Font.Size = 20

  f.Show()
  //o.Run()


  xmlhttp = new ActiveXObject("MsXml2.ServerXMLHTTP");
  try
    {
        request = "/api/wares/rest";
        if(typeof(guid)=="undefined"){
          body = JSON.stringify({'code':code,'barcode':barcode});
        }
        else{
          body = JSON.stringify({'guid':guid});
        }
        xmlhttp.open("POST", GetDalionHttpAdress()+request, false);
        xmlhttp.setRequestHeader("Authorization","Basic " + authString(login,password));
    }
    catch (E)
    {
        f.Close()
        frontol.actions.showError("Не удалось получить остатки." + E.description);
        return -1;
    }
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Accept", "application/json");
    try
    {
        xmlhttp.send(body);
    }
    catch (E)
    {
        f.Close()
        frontol.actions.showError("Не удалось получить остатки. " + E.description);
        return -999;
    }
    if(xmlhttp.status == 200)
    {
      response = xmlhttp.responseText;
      wareRests = JSON.parse(response);
      if(wareRests["_success"]){
        wareName = "";
        f.Close()
        showRests(wareRests["data"],wareName);
        return 0;
      }
      else {
        f.Close()
        frontol.actions.showMessage("Не найдена номенклатура по указанным данным.");
        return 200;
      }
    }
    f.Close()
    frontol.actions.showError("Не удалось получить остатки. " + xmlhttp.responseText);

    return -1;
}
//</function getWareRests(code,barcode,guid)>

//Получение списка номенклатуры с сервера
function getWareList(code,barcode,partName,art)
{
  o = new ActiveXObject("Scripting.WindowSystemObject")

  o.EnableVisualStyles = true

  f = o.CreateForm(0,0,0,0,o.Translate("WS_SYSMENU"))

  f.Text = "Получение списка товаров"
  f.ClientWidth = 385
  f.ClientHeight = 50
  f.CenterControl()

  to = f.TextOut(10,10,"получение списка товаров...")
  to.Font.Size = 20

  f.Show()

  xmlhttp = new ActiveXObject("MsXml2.ServerXMLHTTP");
  try
    {
        request = "/api/wares/list";
        params = {};
        params["code"] = code;
        params["barcode"] = barcode;
        params["partName"] = partName;
        params["art"] = art;

        body = JSON.stringify(params);

        xmlhttp.open("POST", GetDalionHttpAdress()+request, false);
        xmlhttp.setRequestHeader("Authorization","Basic " + authString(login,password));
    }
    catch (E)
    {
        f.Close()
        frontol.actions.showError("Не удалось получить список номенклатуры." + E.description);
        return -1;
    }
    xmlhttp.setRequestHeader("Content-Type", "application/json");
    xmlhttp.setRequestHeader("Accept", "application/json");
    try
    {
        xmlhttp.send(body);
    }
    catch (E)
    {
        f.Close()
        frontol.actions.showError("Не удалось получить список номенклатуры. " + E.description);
        return -999;
    }
    if(xmlhttp.status == 200)
    {
      response = xmlhttp.responseText;
      wareList = JSON.parse(response);
      if(wareList["_success"]){
        f.Close()
        return wareList["data"];
      }
      else {
        f.Close()
        return 200;
      }
    }
    f.Close()
    frontol.actions.showError("Не удалось получить список номенклатуры. " + xmlhttp.responseText);

    return -1;
}
//</function getWareList(code,barcode,partName,art)>

function authString(login,password)
{
  return b64Encode(login + ":" + password);
}

//base64
function b64Encode(str)
{
  objDoc = new ActiveXObject("MsXml2.DOMDocument");
  objNode = objDoc.createElement("document");
  objNode.dataType = "bin.base64";
  objNode.nodeTypedValue = Stream_StringToBinary(str);
  b64Enc = objNode.text;
  return b64Enc;
}

function Stream_StringToBinary(Text)
 {
  adTypeText = 2;
  adTypeBinary = 1;


  BinaryStream = new ActiveXObject("ADODB.Stream");

  BinaryStream.Type = adTypeText;

  BinaryStream.CharSet = "us-ascii";


  BinaryStream.Open();
  BinaryStream.WriteText(Text);

  BinaryStream.Position = 0;
  BinaryStream.Type = adTypeBinary;

  BinaryStream.Position = 0;


  return BinaryStream.Read();
}
// для работы с json
	"object"!=typeof JSON&&(JSON={}),function(){"use strict";function f(e){return 10>e?"0"+e:e}function this_value(){return this.valueOf()}function quote(e){return rx_escapable.lastIndex=0,rx_escapable.test(e)?'"'+e.replace(rx_escapable,function(e){var t=meta[e];return"string"==typeof t?t:"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})+'"':'"'+e+'"'}function str(e,t){var r,n,u,f,o,a=gap,p=t[e];switch(p&&"object"==typeof p&&"function"==typeof p.toJSON&&(p=p.toJSON(e)),"function"==typeof rep&&(p=rep.call(t,e,p)),typeof p){case"string":return quote(p);case"number":return isFinite(p)?String(p):"null";case"boolean":case"null":return String(p);case"object":if(!p)return"null";if(gap+=indent,o=[],"[object Array]"===Object.prototype.toString.apply(p)){for(f=p.length,r=0;f>r;r+=1)o[r]=str(r,p)||"null";return u=0===o.length?"[]":gap?"[\n"+gap+o.join(",\n"+gap)+"\n"+a+"]":"["+o.join(",")+"]",gap=a,u}if(rep&&"object"==typeof rep)for(f=rep.length,r=0;f>r;r+=1)"string"==typeof rep[r]&&(n=rep[r],u=str(n,p),u&&o.push(quote(n)+(gap?": ":":")+u));else for(n in p)Object.prototype.hasOwnProperty.call(p,n)&&(u=str(n,p),u&&o.push(quote(n)+(gap?": ":":")+u));return u=0===o.length?"{}":gap?"{\n"+gap+o.join(",\n"+gap)+"\n"+a+"}":"{"+o.join(",")+"}",gap=a,u}}var rx_one=/^[\],:{}\s]*$/,rx_two=/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,rx_three=/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,rx_four=/(?:^|:|,)(?:\s*\[)+/g,rx_escapable=/[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,rx_dangerous=/[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,gap,indent,meta,rep;"function"!=typeof JSON.stringify&&(meta={"\b":"\\b","    ":"\\t","\n":"\\n","\f":"\\f","\r":"\\r",'"':'\\"',"\\":"\\\\"},JSON.stringify=function(e,t,r){var n;if(gap="",indent="","number"==typeof r)for(n=0;r>n;n+=1)indent+=" ";else"string"==typeof r&&(indent=r);if(rep=t,t&&"function"!=typeof t&&("object"!=typeof t||"number"!=typeof t.length))throw new Error("JSON.stringify");return str("",{"":e})}),"function"!=typeof JSON.parse&&(JSON.parse=function(text,reviver){function walk(e,t){var r,n,u=e[t];if(u&&"object"==typeof u)for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(n=walk(u,r),void 0!==n?u[r]=n:delete u[r]);return reviver.call(e,t,u)}var j;if(text=String(text),rx_dangerous.lastIndex=0,rx_dangerous.test(text)&&(text=text.replace(rx_dangerous,function(e){return"\\u"+("0000"+e.charCodeAt(0).toString(16)).slice(-4)})),rx_one.test(text.replace(rx_two,"@").replace(rx_three,"]").replace(rx_four,"")))return j=eval("("+text+")"),"function"==typeof reviver?walk({"":j},""):j;throw new SyntaxError("JSON.parse")})}();
