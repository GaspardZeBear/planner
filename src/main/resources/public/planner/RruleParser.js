class RruleParser {
  #event
  #whens

  constructor(event) {
    this.event=event
    this.whens=[]
    this.rrule2whens()
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------
  buildDaysOffSet(byday) {
  }
  
  //---------------------------------------------------------------------------------------------------------------------------------------------
  dailyRrule(rruleMap) {
    //this.fake()
    console.log("DAILY " + rruleMap)
    //let type
    let start=DateUtil.icsDateConvert(this.event["DTSTART"])
    let end
    let maxCount=90
    let daysOn=new Set()
    if ( rruleMap.has("BYDAY") ) {
      daysOn=DateUtil.buildDaysOnSet(rruleMap.get("BYDAY"))
    }

    if ( rruleMap.has("COUNT") ) {
        //end=DateUtil.icsDateConvert(this.event["DTEND"])
        let count=parseInt(rruleMap.get("COUNT"))
        if ( count > maxCount ) {
          count=90
        }
        let dList=DateUtil.getListOfDates(start,count,daysOn)
        for (let d of dList) {
          this.whens.push(d)
        }
    } else if (rruleMap.has("UNTIL")) {
        end=DateUtil.icsDateConvert(rruleMap.get("UNTIL"))
        this.whens.push(start + "@" + end )
    } else {
       //end=DateUtil.icsDateConvert(this.event["DTEND"])
       let dList=DateUtil.getListOfDates(start,maxCount,daysOn)
       for (let d of dList) {
        this.whens.push(d)
       }
       console.log("Unknown RRULE freq " + rruleMap)
    }

  }

  //----------------------------------------------------------------------------------------------------------------------------------------------
  //Event{"SUMMARY":"Natation.Crawl","DTSTART":"20241125T120000","DTEND":"20241125T140000","DTSTAMP":"20241122T063801Z",
  //    "RRULE":"FREQ=WEEKLY;WKST=SU;COUNT=4;BYDAY=MO,WE","DESCRIPTION":"Piscine"}

  //Event{"SUMMARY":"Compta03.Stage","DTSTART":"20241127T083000","DTEND":"20241127T153000","DTSTAMP":"20241122T063801Z",
  //    "RRULE":"FREQ=WEEKLY;BYDAY=FR,MO,TH,TU,WE","DESCRIPTION":"Discussion cafet"}
  // No end !!!!!!! forever ?
  weeklyRrule(rruleMap) {
    this.fake()
    console.log("WEEKLY " + rruleMap)
    let maxCount=90
    let start=DateUtil.icsDateConvert(this.event["DTSTART"])
    let daysOn=new Set()
    if ( rruleMap.has("BYDAY") ) {
      daysOn=DateUtil.buildDaysOnSet(rruleMap.get("BYDAY"))
    }

    let end
    if ( rruleMap.has("COUNT") ) {
      //end=DateUtil.icsDateConvert(this.event["DTEND"])
      let count=parseInt(rruleMap.get("COUNT"))*7
      if ( count > maxCount ) {
        count=maxCount
      }
      let dList=DateUtil.getListOfDates(start,count,daysOn)
      for (let d of dList) {
        this.whens.push(d)
      }
    } else {
       //end=DateUtil.icsDateConvert(this.event["DTEND"])
       let dList=DateUtil.getListOfDates(start,maxCount,daysOn)
       for (let d of dList) {
         this.whens.push(d)
       }
       console.log("Unknown RRULE " + rruleMap)
    }
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------
  monthlyRrule(rruleMap) {
    this.fake()
    console.log("MONTHLY " + rruleMap)
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------
  fake() {
    this.whens.push(DateUtil.icsDateConvert(this.event["DTSTART"]) + "@" + DateUtil.icsDateConvert(this.event["DTEND"]))
  }
  
  //----------------------------------------------------------------------------------------------------------------------------------------------
  getWhens() {
    return(this.whens)
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------
  XgetFreq(rrule) {
    
    const match = /FREQ=(.*);(.*)$/.exec(rrule);
    if (! match) { 
      console.log(" RRULE bad pattern : FREQ=DAILY;xxxx" )
      return
    } 
    console.log("Match " +JSON.stringify(match))
    const [, _freq, freq,body] = match;
    if (_freq != "FREQ") {
      console.log("No 'FREQ' <" + _freq + "> " + match) 
      return
    }  
    return(freq)
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------
  getFreq(rrule) {
    let trrule=rrule.split(";")
    let rruleMap=new Map()
    for (let t of trrule) {
      let t1=t.split("=")
      rruleMap.set(t1[0],t1[1])
    }
    return(rruleMap)
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------
  rrule2whens() {
    
    let rrule=this.event["RRULE"]
    console.log(" Processing " + JSON.stringify(this.event) + " " + rrule)
    if ( rrule.length == 0 ) {
      // temporary : no suffix !!
      this.whens.push(DateUtil.icsDateConvert(this.event["DTSTART"]) + "@" + DateUtil.icsDateConvert(this.event["DTEND"]))
      return
    }
    let rruleMap=this.getFreq(rrule)
    if (!rruleMap.has("FREQ")) {
      console.log("No 'FREQ' ")
      return
    }

    switch (rruleMap.get("FREQ") ) {
      case("DAILY") :
        this.dailyRrule(rruleMap)
        break;
      case("WEEKLY") :
        this.weeklyRrule(rruleMap)
        break;
      case("MONTHLY") :
        this.monthlyRrule(rruleMap)
        break;
      case("YEARLY") :
        break;
      default :
        console.log("Unknown RRULE freq " + rrule)
        break;
    }
  }

}