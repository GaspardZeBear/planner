class HtmlVt {
  #table
  #vt
  #start
  #end
  #days
  #styles
  #weekend

  constructor(p) {
    this.start=p.start
    this.end=p.end
    this.table=p.table
    this.vt=p.virtualTable
    this.weekend=p.weekend
    this.styles=p.styles
    this.days=[]
    this.createDaysList()
    this.createTable()
  }

  Xconstructor(start,end,table,virtualTable,styles) {
    this.start=start
    this.end=end
    this.table=table
    this.vt=virtualTable
    this.days=[]
    this.styles=styles
    this.createDaysList()
    this.createTable()
  }

  //---------------------------------------------------------------------------------
  createTable() {
    this.createHeaderRow()
    this.createBodyRows()
  }

  //---------------------------------------------------------------------------------
  createDaysList() {
    let loop = this.start;
    let end=this.end
    while(loop <= end){
      let day=DateUtil.date2day(loop);
      this.days.push(day+"M");
      this.days.push(day+"A");
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
  }

  //---------------------------------------------------------------------------------
  generateTh(row,txt,clazz) {
    let th = document.createElement("th");
    let sp=txt.split("<br>");
    for (let s of sp) {
      let text = document.createTextNode(s);
      th.appendChild(text);
      let br=document.createElement("br");
      th.appendChild(br);
      th.classList.add(clazz);
    }
    row.appendChild(th);
  }

  //---------------------------------------------------------------------------------  
  createHeaderRow() {
    let thead = this.table.createTHead();
    let row = thead.insertRow();
    this.generateTh(row,"Item<br>Date","dummy");
    for (let d of this.days) {
      let txt
      if ( d.endsWith("M") ) {
        txt=d.substr(0,10);
      } else {
        txt=new Date(d.substr(0,10)).toDateString().substring(0,3)
      }
      let clazz
      if ( d.substr(0,10) == DateUtil.getTodayAsString(0) ) {
        clazz="todayh"
      } else {
        clazz="d" + DateUtil.dayOfWeek(d).toString() +"h"
      }
      this.generateTh(row,txt.replace("-","<br>").replace("-","/"),clazz);
    }
  }

  //-------------------------------------------------------------------------------------------------------
  generateTdRuler(row) {
    let cell = row.insertCell();
    cell.setAttribute("colspan",this.days.length )
    cell.classList.add("ruler")
    let text = document.createTextNode(" ");
    cell.appendChild(text); 
  }

  //-------------------------------------------------------------------------------------------------------
  getHrefFromEvent(line,when) {
    return(line+"_"+when);
  }

  //-------------------------------------------------------------------------------------------------------
  generateTd(line,row, vtEvent, col, clazz) {
    let cell = row.insertCell();
    if ( col == 1 ) {
      let text = document.createTextNode(line);
      cell.classList.add(clazz);
      cell.appendChild(text)
      return
    }
    
    if (vtEvent == null) {
      let text = document.createTextNode("");
      cell.classList.add(clazz);
      cell.appendChild(text)
      return
    }

    let text = document.createTextNode(vtEvent.getKind());
    let content; 

    content=document.createElement('a');
    text = document.createTextNode(vtEvent.getKind().substring(0,4));
    let attrib;
    attrib=vtEvent.getProcessing()  + ";" + vtEvent.getWhen()
    content.setAttribute("data-tootik",attrib+"\n")
    content.setAttribute("data-tootik-conf","invert multiline square shadow")
    let style
    if ( this.styles.hasOwnProperty(vtEvent.getKind()) ) {
      style=this.styles[vtEvent.getKind()]
    }
    if ( style !=null && !style.includes(":") ) {
      style="background-color :" + style
    }
    cell.setAttribute("style" , style)
    cell.classList.add(vtEvent.getKind());
    //let details=document.createElement('details')
	  //let p=document.createElement('p')
	  //p.append("balbala")
	  //let summary=document.createElement('summary')
	  //summary.append(text)
	  //details.append(p)
	  //details.append(summary)
    //cell.appendChild(details);
    content.href="#"+this.getHrefFromEvent(line,vtEvent.getWhen());
    content.append(text);
    cell.appendChild(content);
    content.append(text);
    cell.appendChild(content);
    cell.classList.add(clazz);
  }

  //-------------------------------------------------------------------------------------------------------
  createBodyRows() {
  //console.log(items);
    let names=Array.from(this.vt.keys()).sort()
    for (let line of names ) {
      let row = this.table.insertRow();
      // fill in  first columns
      this.generateTd(line,row,null,1,"col_1");
      let xx=this.vt.get(line).size
      if ( this.vt.get(line).size == null ) {
        this.generateTdRuler(row)
        continue
      } 
      for (let d of this.days) {
        let clazz
        if ( d.substr(0,10) == DateUtil.getTodayAsString(0) ) {
          clazz="today"
        } else {
          clazz="d" + DateUtil.dayOfWeek(d).toString()
        }
        if (this.weekend && DateUtil.isWeekend(d) ) {
          this.generateTd(line,row,null,3,clazz);
          continue
        }
        if ( this.vt.get(line).has(d) ) {
          if (this.vt.get(line).get(d).length > 1 ) {
            let multiVtEvent=new VtEvent("Multi",d,"*")
            for (let vtEvent of this.vt.get(line).get(d)) {
              multiVtEvent.addProcessing(vtEvent.getNote())
            }
            this.generateTd(line,row,multiVtEvent,3,clazz);
          } else {
            this.generateTd(line,row,this.vt.get(line).get(d)[0],3,clazz);
          }
        } else  {
          this.generateTd(line,row,null,3,clazz);
        }
      }
    }
  }

}