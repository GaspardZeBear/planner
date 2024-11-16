//window.onload= createPage 
 
function generateTh(row, txt, clazz) {
    let th = document.createElement("th");
    let sp=txt.split("<br>");
    for (s of sp) {
      let text = document.createTextNode(s);
      th.appendChild(text);
      br=document.createElement("br");
      th.appendChild(br);
      th.classList.add(clazz);
    }
    row.appendChild(th);
}

//------------------------------------------------------------------------------------------
function generateHtmlTableHead(table) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  var loop = new Date(CTX.getStart());
  //generateTh(row,"Item<br>Date","col_1");
  generateTh(row,"Item<br>Date","dummy");
  //generateTh(row,"","dummy");
  for (i in CTX.getVirtualTable()) {
    for (j in CTX.getVirtualTable()[i]) {
      if ( j > DateUtil.date2String(CTX.getEnd()) ) {
        break;
      }
      txt=j;
      //console.log(txt);
      if ( txt.endsWith("M") ) {
        txt=txt.substr(0,10);
      } else {
        txt=new Date(txt.substr(0,10)).toDateString().substring(0,3)
      }
      generateTh(row,txt.replace("-","<br>").replace("-","/"),CTX.getDayProps()[j]+"h");
    }
    break;
  }
}

function getHrefFromEvent(line,event) {
  //console.log("getHref " + JSON.stringify(event))
  return(line+"_"+event["when"]);
}


function generateTd(line,row, event, col, clazz) {
    //console.log("generateTd() line : " + line + " row " + row + " event " + JSON.stringify(event) + " col : " + col)
    let cell = row.insertCell();
    //console.log(event);
    if ( (Object.keys(event).length == 0)) {
        cell.classList.add(clazz);
      return
    }
    if ( (Object.keys(event).length > 0) && ("kind" in event) ) {
      let text = document.createTextNode(event["kind"]);
      let content; 
      if ( col > 1 ) {
        content=document.createElement('a');
        text = document.createTextNode(event["kind"].substring(0,4));
        let attrib;
        if ( event["kind"] == "Multi" ) {
          attrib=event["processing"] + ";" + event["when"]
        } else {
          attrib=event["kind"] + ";" + event["note"] + ";" + event["when"]
        }
        content.setAttribute("data-tootik",attrib+"\n")
        content.setAttribute("data-tootik-conf","invert multiline square shadow")
        style=CTX._styles[event["kind"]]
        //console.log("Style " + style)
        if ( style !=null && !style.includes(":") ) {
          style="background-color :" + style
        }
        cell.setAttribute("style" , style)
        cell.classList.add(event["kind"]);
      	details=document.createElement('details')
	      p=document.createElement('p')
	      p.append("balbala")
	      summary=document.createElement('summary')
	      summary.append(text)
	      details.append(p)
	      details.append(summary)
        //cell.appendChild(details);
        content.href="#"+getHrefFromEvent(line,event);
        content.append(text);
        cell.appendChild(content);
      } else {
        content=document.createElement('span');
      }
      content.append(text);
      cell.appendChild(content);
    }
    cell.classList.add(clazz);
}

//-------------------------------------------------------------------------------------------------------
function generateTdRuler(row) {
  let cell = row.insertCell();
  cell.setAttribute("colspan",CTX.getDaysList().length )
  cell.classList.add("ruler")
  let text = document.createTextNode(" ");
  cell.appendChild(text); 
}

//-------------------------------------------------------------------------------------------------------
function generateHtmlTable(table) {
  //console.log(items);
  names=Object.keys(CTX.getVirtualTable())
  names.sort()
  for (line of names ) {
    let row = table.insertRow();
    // fill in  first columns
    generateTd(line,row,{kind:line},1,"col_1");
    if ( CTX.getEventsCounter()[line] == 0 ) {
      generateTdRuler(row)
    } else {
      for (j in CTX.getVirtualTable()[line]) {
        if ( j > DateUtil.date2String(CTX.getEnd()) ) {
          break;
        }
        //console.log("generateHtmlTable(table) : " + CTX.getVirtualTable()[line] + " j: " +j);
        generateTd(line,row,CTX.getVirtualTable()[line][j],3,CTX.getDayProps()[j]);
      }
    }
  }
}

//-------------------------------------------------------------------------------------------------------
function updateVirtualTableCell(line,event) {
    // some events at same date
    //console.log("updateVirtualTableCell line " + JSON.stringify(line)) 
    //console.log("updateVirtualTableCell event " + JSON.stringify(event)) 
    when=event["when"]
    //console.log("updateVirtualTableCell virtual table entry " + JSON.stringify(CTX.getVirtualTable()[line][when]))

    // if virtual table entry <name><suffixed date> already contains an event
    // must create a new table line with new name : <name_<num>+><suffixed date>
    // (<num> Each name has a counter !)

    if (   Object.keys(CTX.getVirtualTable()[line][when]).length == 0) {
      CTX.getVirtualTable()[line][when]=event
      CTX.getNamesCounter()[line]=0
      return
    }

    //console.log("updateVirtualTableCell virtual table entry contains something 1" )
    if (   Object.keys(CTX.getVirtualTable()[line][when]).length > 0 ) {
      //console.log("updateVirtualTableCell virtual table entry contains something 2" )

      // Save initial event in specific line
      if ( CTX.getVirtualTable()[line][when]["kind"] != "Multi" ) {
        let newLine0=line+"_"+ CTX.getNamesCounter()[line].toString().padStart(2, '0') + '+'
        CTX.getNamesCounter()[line] += 1
        createVirtualTableLine(newLine0)
        whensVirtualTable(newLine0,CTX.getVirtualTable()[line][when]);
      }

      // replace the event in virtual table with new event kind multi
      let processing = "[" + CTX.getVirtualTable()[line][when]["kind"] + "/" + CTX.getVirtualTable()[line][when]["note"]  + "]";
      processing += "\n&& " + "[" + event["kind"] + "/" + event["note"] + "]";
      let nEvent=JSON.parse(JSON.stringify(CTX.getVirtualTable()[line][when]));
      //console.log("updateVirtualTableCell nEvent " +JSON.stringify(nEvent))
      nEvent["kind"]="Multi";
      nEvent["processing"]+=processing;
      CTX.getVirtualTable()[line][when]=nEvent;
         
      // Create a new line with new event 
      //if ( ! (line in CTX.getNamesCounter()) ) {
      //  console.log("updateVirtualTableCell bug, no namesCounter !!!")
      //  CTX.getNamesCounter()[line]=1
      //}
      let newLine=line+"_"+ CTX.getNamesCounter()[line].toString().padStart(2, '0') + '+'
      CTX.getNamesCounter()[line] += 1
      createVirtualTableLine(newLine)
      whensVirtualTable(newLine,event);
    } 
}


//-------------------------------------------------------------------------------------------------------
// Suffix A or M
function updateVirtualTableCellWithSuffix(line,event,suffix) {
  //console.log("updateVirtualTableCellWithSuffix line " + line)
  //console.log("updateVirtualTableCellWithSuffix event " + JSON.stringify(event))
  //console.log("updateVirtualTableCellWithSuffix suffix " + JSON.stringify(suffix))
  if ( !DateUtil.isWhenInStartEnd(event["when"],CTX.getStart(),CTX.getEnd()) ) {
    //console.log("updateVirtualTableCellWithSuffix not in interval " + JSON.stringify(suffix))
    return
  }
  //console.log("updateVirtualTableCellWithSuffix in interval " + JSON.stringify(suffix))
  let nEvent=JSON.parse(JSON.stringify(event));
  let nWhen=event["when"]+suffix;
  nEvent["date"]=nWhen;
  nEvent["when"]=nWhen;
  updateVirtualTableCell(line,nEvent);
}


function keepThisDay(when) {  
  testIt=document.getElementById("weekend").value
  //console.log("keepThisDay() testIt  " + testIt);
  if ( CTX._weekend ) {
    return(true)
  }
  dayOfWeek=new Date(when.substring(0,10)).getDay()
  //console.log("keepThisDay() when  " + when + " dayOfWeek " + dayOfWeek.toString());
  if ( dayOfWeek == 0 || dayOfWeek == 6) {
    return(false)
  } else {
    return(true)
  }
} 

//-------------------------------------------------------------------------------------------------------
// when contains a entire date (ex 2024-11-05)  or entire date with A or M suffix (ex 2024-11-05A)
function simpleWhenVirtualTable(line,event) {
  //console.log("simpleWhenVirtualTable line " + line)
  //console.log("simpleWhenVirtualTable event " + JSON.stringify(event))
  //console.log("simpleWhenVirtualTable " + isWhenInStartEnd(event["when"]))

  // Excel formatted when as a date, not a string !
  //console.log("simpleWhenVirtualTable() type of when " + typeof(event["when"] ) )
  if ( !isNaN(event["when"]) ) {
    //console.log("simpleWhenVirtualTable() event " + JSON.stringify(event))
    let d = new Date(Math.round((event["when"] - 25569) * 86400 * 1000));
    event["when"]=date2String(d);
    //console.log("simpleWhenVirtualTable event.when " + event["when"]);
  }
  //console.log("simpleWhenVirtualTable event when modified ?" + JSON.stringify(event))
  if ( ! DateUtil.isWhenInStartEnd(event["when"],CTX.getStart(),CTX.getEnd()) ) {
    console.log("simpleWhenVirtualTable event is not in interval" + JSON.stringify(event))
    return
  }
  //console.log("simpleWhenVirtualTable event is in interval" + JSON.stringify(event))
  let nEvent=JSON.parse(JSON.stringify(event));
  nEvent["line"]=line;
  //console.log("simpleWhenVirtualTable nEvent " + JSON.stringify(nEvent))

  if (! keepThisDay(DateUtil.date2String(event["when"]))) {
    return
  }

  // if entire day (no A or M suffix) 
  if (event["when"].length == 10) {
    updateVirtualTableCellWithSuffix(line,event,"M");
    updateVirtualTableCellWithSuffix(line,event,"A");
  } else {
    // if A or M suffix
    nEvent["date"]=event["when"];
    //updateVirtualTableCell(line,event,nEvent);
    updateVirtualTableCell(line,nEvent);
  }
 }

//-------------------------------------------------------------------------------------------------------
function multipleWhensVirtualTable(line,event) {
  let whens=event["when"].split("@");
  let nstart=new Date(whens[0].substring(0,10));
  if ( nstart < new Date(CTX.getStart()) ) {
    nstart = new Date(CTX.getStart())
  }
  let nend=new Date(whens[1].substring(0,10));
  if ( nend > new Date(CTX.getEnd()) ) {
    nend = new Date(CTX.getEnd())
  }
  if ( nend < new Date(CTX.getStart()) ) {
    console.log("Rejected 1 end before start");
    return
  }
  if ( nstart > new Date(CTX.getEnd()) ) {
    console.log("Rejected 2 start after end");
    return
  }
  if ( nstart > new Date(nend)) {
    console.log("Rejected 3");
    return
  }

  //console.log("multipleWhensVirtualTable() accept " + event["when"])
  // Build an list of dates (suffix A or M) for new events
  let loop = new Date(nstart);
  let dates=[];
  while(loop <= nend){
    let day=DateUtil.date2day(loop);
    //console.log("multipleWhensVirtualTable() add " + day);
    if (keepThisDay(DateUtil.date2String(loop))) {
      dates.push(day+"M");
      dates.push(day+"A");
    }
    let newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
  }
  
  //console.log("multipleWhensVirtualTable() dates before  " + dates);
  if ( whens[0].length == 10 ) {
    whens[0] += "M"
  }
  if ( whens[1].length == 10 ) {
    whens[1] += "A"
  }

  if (dates[0].localeCompare(whens[0]) != 0 ) {
    //dates.shift();
  } 
  if ( dates[dates.length-1].localeCompare(whens[1]) != 0 ) {
    //dates.pop();
  }

  //console.log("multipleWhensVirtualTable() dates after  " + dates);
  // for each date (with suffix A or M), create a new event
  for (d of dates) {
    let nEvent=JSON.parse(JSON.stringify(event));;
    nEvent["when"]=d;
    //console.log("multipleWhensVirtualTable() new event  " + JSON.stringify(nEvent));
    updateVirtualTableCell(line,nEvent);
  }
}

//-------------------------------------------------------------------------------------------------------
function whensVirtualTable(line,event) {
  //console.log("---- Begin whensVirtualTable");
  //console.log("line " + JSON.stringify(line));
  //console.log("event " + JSON.stringify(event));
  event["date"]="";
  if ( event["when"].includes("@") ) {
    multipleWhensVirtualTable(line,event);
  } else {
    simpleWhenVirtualTable(line,event);
  }
  //console.log("---- End whensVirtualTable");
}

//-------------------------------------------------------------------------------------------------------
function isValidLine(line) {
  //console.log("isValidLine() " + JSON.stringify(line))
  if (! line.hasOwnProperty("name") ) {
    //console.log("isValidLine() no name !")
    return(false)
  }
  if ( line["name"].length == 0) {
    //console.log("isValidLine()  name length = 0! ")
    return(false)
  }
  if (! line.hasOwnProperty("events") ) {
    console.log("isValidLine() no events!")
    return(false)
  }
  if (line["events"].length == 0) {
    console.log("isValidLine() events length 0!")
    return(false)
  }
  for (let event of line["events"]) {
    if (! event.hasOwnProperty("kind") ) {
      console.log("isValidLine() no kind!")
      return(false)
    } 
    if (! event.hasOwnProperty("when") ) {
      console.log("isValidLine() no when!")
      return(false)
    } 
    if ( !isNaN(event["when"]) ) {
      console.log("isValidLine() event " + JSON.stringify(event))
      let d = new Date(Math.round((event["when"] - 25569) * 86400 * 1000));
      event["when"]=DateUtil.date2String(d);
      console.log("isValidLine event.when " + event["when"]);
    }
    if ( event["when"].length < 10 ) {
      console.log("isValidLine()  when length < 10!")
      return(false)
    }

  }
  console.log("isValidLine() is Valid")
  return(true)
}



//-------------------------------------------------------------------------------------------------------
function fillInVirtualTable() {
  console.log("---- Begin fillInVirtualTable");
  for (let item of CTX._myPlanning) {
    //console.log("fillInVirtualTable() Item : " + JSON.stringify(item));
    if ( !isValidLine(item) ) {
      //console.log("fillInVirtualTable() Item : isNotValid");
      continue
    }
    console.log("fillInVirtualTable() Item : isValid");
    let name=item["name"];
    CTX.getEventsCounter()[name]=0
    for (let event of item["events"]) {
       console.log(" fillInVirtualTable() event " + JSON.stringify(event));
       event["processing"]=""
       CTX.getEventsCounter()[name] += 1

       if ( (typeof event["note"] === 'undefined')  || event["note"].length == 0) {
         event["note"]=item["name"]
       } else {
         event["note"] = item["name"] + ";" + event["note"]
       }
       whensVirtualTable(name,event);
       if (  "links" in event ) {
         for ( link of event["links"] ) {
           whensVirtualTable(link,event);
         }
       }
    }
  }
  //console.log("fillInVirtualTable : " + JSON.stringify(CTX.getVirtualTable()));
  console.log("---- End fillInVirtualTable");
}

//-------------------------------------------------------------------------------------------------------
function createVirtualTableLine(name) {
  CTX.getVirtualTable()[name]={};
  let today=new Date()
  let loop = new Date(CTX.getStart());
  while(loop <= CTX.getMaxDate()){
    let day=DateUtil.date2day(loop);
    CTX.getVirtualTable()[name][day + "M"]={};
    CTX.getVirtualTable()[name][day + "A"]={};
    let dayOfWeek=new Date(day.substring(0,10)).getDay();
    CTX.getDayProps()[day + "M"]="d" + dayOfWeek.toString();
    CTX.getDayProps()[day + "A"]="d" + dayOfWeek.toString();
    if ((day in CTX.getPublicHolidays() ) && (dayOfWeek != 0 ) && (dayOfWeek != 6 )) {
      CTX.getDayProps()[day + "M"]="feast";
      CTX.getDayProps()[day + "A"]="feast";
    }
    if ( DateUtil.date2day(today) == DateUtil.date2day(loop) ) {
      CTX.getDayProps()[day + "M"]="today";
      CTX.getDayProps()[day + "A"]="today";
    }
    let newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
  }
}

//-------------------------------------------------------------------------------------------------------
function initVirtualTable() {
  console.log("--- begin initVirtualTable")
  for (let item of CTX._myPlanning) {
    if ( !isValidLine(item) ) {
      continue
    }
    createVirtualTableLine(item["name"]) 
  }
  //console.log(JSON.stringify(CTX.getVirtualTable()))
  console.log("--- end initVirtualTable")
}

//-------------------------------------------------------------------------------------------------------
function fillDetailsTable(datas) {
    for (line in CTX.getVirtualTable()) {
      for (j in CTX.getVirtualTable()[line]) { 
        k=CTX.getVirtualTable()[line][j];
        if ( Object.keys(k).length > 0 && !(k["note"]=== undefined) && k["kind"].length > 0) {
          let row = datas.insertRow();
          row.insertCell().appendChild(document.createTextNode(line));
          row.insertCell().appendChild(document.createTextNode(j));
          let cell=row.insertCell();
          cell.appendChild(document.createTextNode(k["kind"]));
          cell.setAttribute("id",getHrefFromEvent(line,k));
          //console.log("fillDetailsTable(datas) k=" + JSON.stringify(k))

          cell.classList.add(k["kind"]);
          style=CTX._styles[k["kind"]]
          cell.setAttribute("style" , style)
          //cell.classList.add(CTX._styles[k["kind"]]);
          
          if ( "note" in k && k["note"].length > 0 ) {      
            row.insertCell().appendChild(document.createTextNode(k["note"]));
          } else {
            row.insertCell().appendChild(document.createTextNode(""));
          }
          row.insertCell().appendChild(document.createTextNode(k["processing"]));
        }
     }
  }
}

//-------------------------------------------------------------------------------------------------------
function initDaysList() {
   let loop = new Date(CTX.getStart());
   while(loop <= CTX.getEnd()){
    let day=DateUtil.date2day(loop);
    CTX.getDaysList().push(day + "M")
    CTX.getDaysList().push(day + "A")
    let newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
   }
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function initPublicHolidays(year) {
  for (let d of DateUtil.joursFeries(year)) {
    CTX.getPublicHolidays()[DateUtil.date2day(d)]=true;
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function resetDates() {
  document.getElementById("start").value="";
  document.getElementById("end").value="";
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function modifyStartDate(offset) {
  var d=new Date(CTX.getStart());
  d.setDate(d.getDate() + offset)
  document.getElementById("start").value = d.toJSON().slice(0,10)
  CTX.setStart(document.getElementById("start").value = d.toJSON().slice(0,10))
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function modifyDuration(duration) {
  let msday=86400*1000
  document.getElementById("duration").value=duration;
  CTX.setDuration(duration)
  var d=new Date(CTX.getStart());
  let nd= new Date(new Date().getTime() + duration*msday).toJSON().slice(0, 10)
  document.getElementById("end").value=nd;
  CTX.setEnd(nd);
}




//---------------------------------------------------------------------------------------------------------------------------------------------
function filterItems() {
  var input, filter, table, tr, td, i, txtValue;
  input = document.getElementById("lineFilter");
  filter = input.value.toUpperCase();
  table = document.getElementById("planning");
  tr = table.getElementsByTagName("tr");
  if ( filter.endsWith("!") ) {
      return
  }
  if ( filter.endsWith("\\") ) {
      return
  }

  // Loop through all table rows, and hide those who don't match the search query
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    if (td) {
      txtValue = td.textContent || td.innerText;
      //if (txtValue.toUpperCase().indexOf(filter) > -1) {
      let re = new RegExp(filter);
      if (filter.startsWith("!")) {
        re = new RegExp("^((?!" + filter.substr(1) + ").)*$");
      } 
      //^((?!\+).)*$
      if ( re.test(txtValue.toUpperCase()) ) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function toggleWeekend() {
  console.log(" toggleWeekend() " + document.getElementById("weekend").value)
  CTX._weekend=!CTX._weekend
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function createPage(myPlanning,myStyles) {
  if ( Object.keys(CTX).length == 0 ) {
    console.log("Create page called CTX empty ")
  } else {
    console.log("Create page called : " + JSON.stringify(CTX))
  }
  console.log("Create page called : " + myPlanning + " " + myStyles)
  let start=document.getElementById("start").value
  if (start.length == 0) {
    document.getElementById("start").value=DateUtil.getMondayAsString(0)
  }
  let end=document.getElementById("end").value
  if (end.length == 0) {
    document.getElementById("end").value=DateUtil.getMondayAsString(3)
  }
  let duration=document.getElementById("duration").value
  if (duration.length == 0) {
    document.getElementById("duration").value=21
  }
  let cweekend=document.getElementById("weekend")
  //console.log("Create page : cweekend " + cweekend)
  let weekend
  if (cweekend.checked ) {
    weekend=true
  } else {
    weekend=false
  }
  
  console.log("Create page : weekend " + weekend)

  if (myPlanning == null ) {
    console.log("Create page called : myPlanning not found")
    return
  } 
  fake=[{"toto":1234},
        {"name":"totoKO"},
        {"name":"OK",
          "events":[{"kind":"gookind","when":"2024-11-01"}]
        }]
  vt=new VirtualTable(myPlanning)
  console.log("Create page : vt " + JSON.stringify(vt.getVirtualTable()))
  
  //console.log("Create page : myPlanning " + JSON.stringify(myPlanning))
  maxDate=DateUtil.getMondayAsString(52)
  CTX={
    _start: document.getElementById("start").value,
    _end: document.getElementById("end").value,
    _weekend:weekend,
    _duration: document.getElementById("duration").value,
    _daysList: [],
    _dayProps:{},
    _namesCounter:{},
    _eventsCounter:{},
    _publicHolidays:{},
    _maxDate:DateUtil.getMondayAsString(52),
    // deep clone because initial one will be modified
    _myPlanning: JSON.parse(JSON.stringify(myPlanning)),
    _virtualTable :{},
    _styles:myStyles,
    getNamesCounter  : function () { return(this._namesCounter) },
    getEventsCounter  : function () { return(this._eventsCounter) },
    getPublicHolidays  : function () { return(this._publicHolidays) },
    getVirtualTable  : function () { return(this._virtualTable) },
    getDaysList  : function () { return(this._daysList) },
    getDayProps  : function () { return(this._dayProps) },
    getMaxDate  : function () { return(new Date(this._maxDate)) },
    getStart  : function () { return(new Date(this._start)) },
    setStart  : function (val) { this._start=val },
    setEnd  : function (val) { this._end=val },
    getEnd  : function () { return(new Date(this._end)) },
    setDuration  : function (val) { this._duration=val },
    getDuration  : function () { return(this._duration) },
  }

  initDaysList()
  initPublicHolidays("2022")
  initPublicHolidays("2023")
  initPublicHolidays("2024")
  initPublicHolidays("2025")
  //initVirtualTable();
  //fillInVirtualTable();
  var table = document.querySelector("#planning");
  table.innerHTML=""
  //generateHtmlTable(table); // generate the table first
  //generateHtmlTableHead(table); // then the head

  var tableN=document.querySelector("#planningN");
  tableN.innerHTML=""
  new HtmlVt(CTX.getStart(),CTX.getEnd(),tableN,vt.getVirtualTable(),CTX._styles)
  
  var datas = document.querySelector("#details");
  //fillDetailsTable(datas) ;
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function buildExcelFilesList(filesList) {
  console.log("excelFiles " + JSON.stringify(filesList))
  var excelFilesList = document.createElement("select");
  excelFilesList.id="excelFiles";
  document.querySelector("#excelFiles").appendChild(excelFilesList)
  let selected = false
  var option=document.createElement("option")
  option.value=""
  option.text=""
  option.selected=selected
  selected=false
  excelFilesList.appendChild(option)
  for ( xfile of filesList.sort() ){
    console.log(" File " + xfile)
    var option=document.createElement("option")
    option.value=xfile
    option.text=xfile
    option.selected=selected
    selected=false
    excelFilesList.appendChild(option)
  }
  document.querySelector("#excelFiles").addEventListener('change', function (e) { 
    console.log("File selected" + e.target.value)
    if ( e.target.value.length > 0 ) {
      buildPlanningFromExcelFile(e.target.value)
    }
   },true);
}
//--------------------------------------------------------------------------------------------------------------------------------------
//-- Main ----------------
//--------------------------------------------------------------------------------------------------------------------------------------
CTX={}
//myPlanning=null
