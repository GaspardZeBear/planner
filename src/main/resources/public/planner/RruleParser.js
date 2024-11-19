class RruleParser {
  #event
  #whens

  constructor(event) {
    this.event=event
    this.whens=[]
    this.rrule2whens()
  }
  
  //---------------------------------------------------------------------------------------------------------------------------------------------
  dailyRrule(rruleBody) {
    this.fake()
    let type
    let start=DateUtil.icsDateConvert(this.event["DTSTART"])
    let end=DateUtil.icsDateConvert(this.event["DTEND"])
    let t=rruleBody.split("=")
    
    switch (t[0]) {
      case("COUNT") :
        this.whens.push(DateUtil.getListOfDates(start,parseInt(t[1])))
        break;
      case("UNTIL") :
        this.whens.push(start + "@" + end )
        break
      default :
        console.log("Unknown RRULE freq " + rrule)
      break;
    }

    console.log("DAILY " + rruleBody)
  }
  //----------------------------------------------------------------------------------------------------------------------------------------------
  weeklyRrule(rruleBody) {
    this.fake()
    console.log("WEEKLY " + rruleBody)
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------
  monthlyRrule(rruleBody) {
    this.fake()
    console.log("MONTHLY " + rruleBody)
  }

  //----------------------------------------------------------------------------------------------------------------------------------------------
  fake() {
    this.whens.push(DateUtil.icsDateConvert(this.event["DTSTART"]) + "@" + DateUtil.icsDateConvert(this.event["DTEND"]))
  }
  
  //----------------------------------------------------------------------------------------------------------------------------------------------
   getWhens() {
    return(this.whens)
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------
  rrule2whens() {
    let rrule=this.event["RRULE"]
    if ( rrule.length == 0 ) {
      // temporary : no suffix !!
      this.whens.push(DateUtil.icsDateConvert(this.event["DTSTART"]) + "@" + DateUtil.icsDateConvert(this.event["DTEND"]))
      return
    }
    const match = /(.*)=(.*);(.*)$/.exec(rrule); 
    if (! match) { 
      console.log(" RRULE bad pattern : FREQ=DAILY;xxxx" + rrule)
      return
    } 
    const [, _freq, freq,body] = match;
    if (_freq != "FREQ") {
      console.log("No 'FREQ' " + _freq) 
      return
    }  

    switch (freq ) {
      case("DAILY") :
        this.dailyRrule(body)
        break;
      case("WEEKLY") :
        this.weeklyRrule(body)
        break;
      case("MONTHLY") :
        this.monthlyRrule(body)
        break;
      case("YEARLY") :
        break;
      default :
        console.log("Unknown RRULE freq " + rrule)
        break;
    }
  }

}