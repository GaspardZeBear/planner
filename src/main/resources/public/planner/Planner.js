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
  
  if (myPlanning == null ) {
    console.log("Create page called : myPlanning not found")
    return
  } 

  vt=new VirtualTable(myPlanning)
  console.log("Create page : vt " + JSON.stringify(vt.getVirtualTable()))
  
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

  initPublicHolidays("2022")
  initPublicHolidays("2023")
  initPublicHolidays("2024")
  initPublicHolidays("2025")

  var table=document.querySelector("#planning");
  table.innerHTML=""
  let HtParms={
    "start":CTX.getStart(),
    "end":CTX.getEnd(),
    "table":table,
    "virtualTable":vt.getVirtualTable(),
    "styles":CTX._styles,
    "weekend":CTX._weekend
  }
  //new HtmlVt(CTX.getStart(),CTX.getEnd(),table,vt.getVirtualTable(),CTX._styles)
  new HtmlVt(HtParms)

}

//--------------------------------------------------------------------------------------------------------------------------------------
//-- Main ----------------
//--------------------------------------------------------------------------------------------------------------------------------------
CTX={}
//myPlanning=null
