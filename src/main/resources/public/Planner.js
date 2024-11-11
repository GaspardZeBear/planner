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

function generateHtmlTableHead(table) {
  let thead = table.createTHead();
  let row = thead.insertRow();
  var loop = new Date(CTX.getStart());
  //generateTh(row,"Item<br>Date","col_1");
  generateTh(row,"Item<br>Date","dummy");
  //generateTh(row,"","dummy");
  for (i in CTX.getVirtualTable()) {
    for (j in CTX.getVirtualTable()[i]) {
      if ( j > date2String(CTX.getEnd()) ) {
        break;
      }
      
      txt=j;
      //console.log(txt);
      if ( txt.endsWith("M") ) {
        txt=txt.substr(0,10);
      } else {
        // quick and dirty way to get day from class !!!!!
        switch(CTX.getDayProps()[j]) {
          case 'd0' :
            txt="Sun";
            break;
          case 'd1' :
            txt="Mon";
            break;
          case 'd2' :
            txt="Tue";
            break;
          case 'd3' :
            txt="Wed";
            break;
          case 'd4' :
            txt="Thu";
            break;
          case 'd5' :
            txt="Fri";
            break;
          case 'd6' :
            txt="Sat";
            break;
          default :
            txt="Tod";
        }
        
      }
      generateTh(row,txt.replace("-","<br>").replace("-","/"),CTX.getDayProps()[j]+"h");
      //generateTh(row,txt.replace("-","<br>").replace("-","/").replace("M","<br>M").replace("A","<br>"),CTX.getDayProps()[j]);
    }
    break;
  }
}

function getHrefFromEvent(line,event) {
  //console.log("getHref " + JSON.stringify(event))
  return(line+"_"+event["when"]);
}

function generateTd(line,row, event, col, clazz) {
    //console.log("____ " + event["when"] + " " + date2String(CTX.getEnd()));
    //if ( event["when"] > date2String(CTX.getEnd()) ) {
    //  return
    //}
    //console.log("line : " + line + " row " + row + " event " + JSON.stringify(event) + " col : " + col)
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
        if ( j > date2String(CTX.getEnd()) ) {
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
    //if ( CTX.getVirtualTable()[line][when] == null ) {
      //console.log("updateVirtualTableCell virtual table entry null, create entry " )
      CTX.getVirtualTable()[line][when]=event
      CTX.getNamesCounter()[line]=0
      return
    }
    //console.log("updateVirtualTableCell virtual table entry contains something 1" )
    if (   Object.keys(CTX.getVirtualTable()[line][when]).length > 0 ) {
      //console.log("updateVirtualTableCell virtual table entry contains something 2" )

      // Save initial event in specific line
      //if (CTX.getNamesCounter()[line]==0) {
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
      //nEvent["note"] += processing
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
    } else {
      //CTX.getVirtualTable()[line][when]=event;
    }
}

//-------------------------------------------------------------------------------------------------------
function isWhenInStartEnd(when) {
  //console.log("isWhenInStartEnd() when  " + Date(when.substring(0,10)) + " compared to " + CTX.getStart())
  if ( new Date(when.substring(0,10)) < CTX.getStart() ) {
    console.log("isWhenInStartEnd() < CTX.getStart()")
    return(false)
  }
  if ( new Date(when.substring(0,10)) > CTX.getEnd() ) {
    //console.log("isWhenInStartEnd() > CTX.getEnd()")
    return(false)
  }
  //console.log("isWhenInStartEnd() in interval")
  return(true)
}
//-------------------------------------------------------------------------------------------------------
// Suffix A or M
function updateVirtualTableCellWithSuffix(line,event,suffix) {
  //console.log("updateVirtualTableCellWithSuffix line " + line)
  //console.log("updateVirtualTableCellWithSuffix event " + JSON.stringify(event))
  //console.log("updateVirtualTableCellWithSuffix " + isWhenInStartEnd(event["when"]))
  //console.log("updateVirtualTableCellWithSuffix suffix " + JSON.stringify(suffix))
  if ( ! isWhenInStartEnd(event["when"]) ) {
    return
  }
  let nEvent=JSON.parse(JSON.stringify(event));
  let nWhen=event["when"]+suffix;
  nEvent["date"]=nWhen;
  nEvent["when"]=nWhen;
  updateVirtualTableCell(line,nEvent);
}

//-------------------------------------------------------------------------------------------------------
// when contains a entire date (ex 2024-11-05)  or entire date with A or M suffix (ex 2024-11-05A)
function simpleWhenVirtualTable(line,event) {
  //console.log("simpleWhenVirtualTable line " + line)
  //console.log("simpleWhenVirtualTable event " + JSON.stringify(event))
  //console.log("simpleWhenVirtualTable " + isWhenInStartEnd(event["when"]))
  if ( ! isWhenInStartEnd(event["when"]) ) {
    return
  }
  let nEvent=JSON.parse(JSON.stringify(event));
  nEvent["line"]=line;
  //console.log("simpleWhenVirtualTable nEvent " + JSON.stringify(nEvent))

  // if entire day (no A or M suffix) 
  if (event["when"].length == 10) {
    updateVirtualTableCellWithSuffix(line,event,"M");
    updateVirtualTableCellWithSuffix(line,event,"A");
  } else {
    // if A or M suffix
    nEvent["date"]=event["when"];
    updateVirtualTableCell(line,event,nEvent);
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

  console.log("multipleWhensVirtualTable() accept " + event["when"])
  // Build an list of dates (suffix A or M) for new events
  let loop = new Date(nstart);
  let dates=[];
  while(loop <= nend){
    let day=date2day(loop);
    console.log("multipleWhensVirtualTable() add " + day);
    dates.push(day+"M");
    dates.push(day+"A");
    let newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
  }
  
  //throw new Error('This is not an error. This is just to abort javascript');
  console.log("multipleWhensVirtualTable() dates before  " + dates);
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

  console.log("multipleWhensVirtualTable() dates after  " + dates);
  // for each date (with suffix A or M), create a new event
  for (d of dates) {
    let nEvent=JSON.parse(JSON.stringify(event));;
    nEvent["when"]=d;
    console.log("multipleWhensVirtualTable() new event  " + JSON.stringify(nEvent));
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
    //multipleWhensVirtualTable(line,when,event);
    multipleWhensVirtualTable(line,event);
  } else {
    //simpleWhenVirtualTable(line,when,event);
    simpleWhenVirtualTable(line,event);
  }
  //console.log("---- End whensVirtualTable");
}

//-------------------------------------------------------------------------------------------------------
function fillInVirtualTable() {
  console.log("---- Begin fillInVirtualTable");
  for (let item of CTX._myPlanning) {
    console.log("Item : " + JSON.stringify(item));
    let name=item["name"];
    if (name.length == 0) {
      continue
    }
    CTX.getEventsCounter()[name]=0
    for (let event of item["events"]) {
       //console.log(" event " + JSON.stringify(event));
       CTX.getEventsCounter()[name] += 1

       //event["note"]="myNote"
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
function date2day(d) {
  let l=d.toLocaleString("fr-FR").substring(0,10);
  let t=l.split("/");
  return(t[2]+"-"+t[1]+"-"+t[0]);
}

//-------------------------------------------------------------------------------------------------------
function JoursFeries (an){
	var JourAn = new Date(an, "00", "01")
	var FeteTravail = new Date(an, "04", "01")
	var Victoire1945 = new Date(an, "04", "08")
  var FeteNationale = new Date("2022","06", "14","01","00","00")
  var FeteNationale = new Date("2022-07-14T00:00")
	var Assomption = new Date(an, "07", "15")
	var Toussaint = new Date(an, "10", "01")
	var Armistice = new Date(an, "10", "11")
	var Noel = new Date(an, "11", "25")
	var G = an%19
	var C = Math.floor(an/100)
	var H = (C - Math.floor(C/4) - Math.floor((8*C+13)/25) + 19*G + 15)%30
	var I = H - Math.floor(H/28)*(1 - Math.floor(H/28)*Math.floor(29/(H + 1))*Math.floor((21 - G)/11))
	var J = (an*1 + Math.floor(an/4) + I + 2 - C + Math.floor(C/4))%7
	var L = I - J
	var MoisPaques = 3 + Math.floor((L + 40)/44)
	var JourPaques = L + 28 - 31*Math.floor(MoisPaques/4)
	var Paques = new Date(an, MoisPaques-1, JourPaques)
	var LundiPaques = new Date(an, MoisPaques-1, JourPaques+1)
	var Ascension = new Date(an, MoisPaques-1, JourPaques+39)
	var Pentecote = new Date(an, MoisPaques-1, JourPaques+49)
	var LundiPentecote = new Date(an, MoisPaques-1, JourPaques+50)
	return new Array(JourAn, Paques, LundiPaques, FeteTravail, Victoire1945, Ascension, Pentecote, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel)
}

//-------------------------------------------------------------------------------------------------------
function createVirtualTableLine(name) {
  CTX.getVirtualTable()[name]={};
  let today=new Date()
  let loop = new Date(CTX.getStart());
  while(loop <= CTX.getMaxDate()){
  //while(loop <= CTX.getEnd()){
    let day=date2day(loop);
    CTX.getVirtualTable()[name][day + "M"]={};
    CTX.getVirtualTable()[name][day + "A"]={};
    let dayOfWeek=new Date(day.substring(0,10)).getDay();
    CTX.getDayProps()[day + "M"]="d" + dayOfWeek.toString();
    CTX.getDayProps()[day + "A"]="d" + dayOfWeek.toString();
    if ((day in CTX.getPublicHolidays() ) && (dayOfWeek != 0 ) && (dayOfWeek != 6 )) {
      CTX.getDayProps()[day + "M"]="feast";
      CTX.getDayProps()[day + "A"]="feast";
    }
    if ( date2day(today) == date2day(loop) ) {
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
    if (item["name"].length == 0) {
      continue
    }
    createVirtualTableLine(item["name"]) 
  }
  //console.log(JSON.stringify(CTX.getVirtualTable()))
  console.log("--- end initVirtualTable")
}

//-------------------------------------------------------------------------------------------------------
function fillDetailsTable(datas) {
    for (i in CTX.getVirtualTable()) {
      for (j in CTX.getVirtualTable()[i]) { 
        k=CTX.getVirtualTable()[i][j];
        if ( Object.keys(k).length > 0 && !(k["note"]=== undefined) && k["kind"].length > 0) {
          let row = datas.insertRow();
          row.insertCell().appendChild(document.createTextNode(i));
          row.insertCell().appendChild(document.createTextNode(j));
          let cell=row.insertCell();
          cell.appendChild(document.createTextNode(k["kind"]));
          cell.setAttribute("id",getHrefFromEvent(i,k));
          //console.log("fillDetailsTable(datas) k=" + JSON.stringify(k))

          //cell.classList.add(k["kind"]);
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
    let day=date2day(loop);
    CTX.getDaysList().push(day + "M")
    CTX.getDaysList().push(day + "A")
    let newDate = loop.setDate(loop.getDate() + 1);
    loop = new Date(newDate);
   }
}
//-----------------------------------------------------------------------------------
function date2String(d) {
  let nd= new Date(new Date(d).getTime()).toJSON().slice(0, 10)
  return(nd)
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function getToday(offset) {
  let msday=86400*1000
  let nd= new Date(new Date().getTime() + offset*msday).toJSON().slice(0, 10)
  return(nd);
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function getMonday(offset) {
  let msday=86400*1000
  var prevMonday = new Date();
  prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
  monday=new Date(prevMonday.getTime() + 7*offset*msday -msday);
  return(monday.toJSON().slice(0,10));
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function initPublicHolidays(year) {
  for (let d of JoursFeries(year)) {
    CTX.getPublicHolidays()[date2day(d)]=true;
  }
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function resetDates() {
  document.getElementById("start").value="";
  document.getElementById("end").value="";
}

//---------------------------------------------------------------------------------------------------------------------------------------------
function modifyStartDate(offset) {
  //document.getElementById("start").value=document.getElementById("start").value;
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
  // Declare variables
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
function createPage(myPlanning,myStyles) {
  if ( Object.keys(CTX).length == 0 ) {
    console.log("Create page called CTX empty ")
  } else {
    console.log("Create page called : " + JSON.stringify(CTX))
  }
  console.log("Create page called : " + myPlanning + " " + myStyles)
  let start=document.getElementById("start").value
  if (start.length == 0) {
    //document.getElementById("start").value=getToday(-2)
    document.getElementById("start").value=getMonday(0)
  }
  let end=document.getElementById("end").value
  if (end.length == 0) {
    //document.getElementById("end").value=getToday(14)
    document.getElementById("end").value=getMonday(3)
  }
  let duration=document.getElementById("duration").value
  if (duration.length == 0) {
    //document.getElementById("end").value=getToday(14)
    document.getElementById("duration").value=21
  }
   
  if (myPlanning == null ) {
    console.log("Create page called : myPlanning not found")
    return
  } 
  //console.log("Create page : myPlanning " + JSON.stringify(myPlanning))
  maxDate=getMonday(52)
  CTX={
    _start: document.getElementById("start").value,
    _end: document.getElementById("end").value,
    _duration: document.getElementById("duration").value,
    _daysList: [],
    _dayProps:{},
    _namesCounter:{},
    _eventsCounter:{},
    _publicHolidays:{},
    _maxDate:getMonday(52),
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
  initVirtualTable();
  fillInVirtualTable();
  //console.table(virtualTable)
  var table = document.querySelector("#planning");
  table.innerHTML=""
  generateHtmlTable(table); // generate the table first
  generateHtmlTableHead(table); // then the head
  
  var datas = document.querySelector("#details");
  fillDetailsTable(datas) ;
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
