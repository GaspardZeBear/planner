class RruleParser {
  #event
  #whens

  constructor(event) {
    this.event=event
    this.whens=[]
    this.rrule2whens()
  }

  
  //-------------------------------------------------------------------------------------------------------------------------------------
  getCount(count) {
    let maxCount=90
    if ( count > maxCount ) {
      return(maxCount)
    }
    return(count)
  }

  //-------------------------------------------------------------------------------------------------------------------------------------
  getDaysOn(rruleMap) {
    let daysOn=new Set()
    if ( rruleMap.has("BYDAY") ) {
      daysOn=DateUtil.buildDaysOnSet(rruleMap.get("BYDAY"))
    }
    return(daysOn)
  }

   //-------------------------------------------------------------------------------------------------------------------------------------
   pushToWhens(start,count,daysOn) {
    let starthh=this.event["DTSTART"].substr(9,6)
    let endhh=this.event["DTEND"].substr(9,6)
    let dList=DateUtil.getListOfDates(start,starthh,endhh,count,daysOn)
    for (let d of dList) {
       this.whens.push(d)
    }
   }
  
  //---------------------------------------------------------------------------------------------------------------------------------------------
  dailyRrule(rruleMap) {
    //this.fake()
    console.log("DAILY " + rruleMap)
    //let type
    let start=DateUtil.icsDateConvert(this.event["DTSTART"])
    let daysOn=this.getDaysOn(rruleMap)
    if ( rruleMap.has("COUNT") ) {
        let count=this.getCount(parseInt(rruleMap.get("COUNT")))
        this.pushToWhens(start,count,daysOn)
    } else if (rruleMap.has("UNTIL")) {
        let end=DateUtil.icsDateConvert(rruleMap.get("UNTIL"))
        this.whens.push(start + "@" + end )
    } else {
      let count=this.getCount(999)
      this.pushToWhens(start,count,daysOn)
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
    let start=DateUtil.icsDateConvert(this.event["DTSTART"])
    let daysOn=this.getDaysOn(rruleMap)
    if ( rruleMap.has("COUNT") ) {
      //end=DateUtil.icsDateConvert(this.event["DTEND"])
      let count=this.getCount(parseInt(rruleMap.get("COUNT")))*7
      this.pushToWhens(start,count,daysOn)
    } else {
       //end=DateUtil.icsDateConvert(this.event["DTEND"])
       let count=this.getCount(999)
       this.pushToWhens(start,count,daysOn)
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
    //this.whens.push(DateUtil.icsDateConvert(this.event["DTSTART"]) + "@" + DateUtil.icsDateConvert(this.event["DTEND"]))
  }
  
  //----------------------------------------------------------------------------------------------------------------------------------------------
  getWhens() {
    return(this.whens)
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