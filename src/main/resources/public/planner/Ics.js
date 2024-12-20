class Ics {

#icsStr
#icsJson
#icsEvents
#planningMap
#planningList

constructor(icsStr) {
  this.icsStr=icsStr
  this.icsJson=[]
  this.icsEvents=[]
  this.planningMap=new Map()
  this.planningList=[]
  this.ics2json()
  this.simplifyEvents()
  this.events2Planning()
  let x=0
}

  
//---------------------------------------------------------------------------------------------------------------------------------------------
getPlanning() { 
  for (const [k,v] of this.planningMap.entries()) {
    this.planningList.push({"name":k,"events":v})
  }
  return(this.planningList)
}
  
//---------------------------------------------------------------------------------------------------------------------------------------------
ics2json() {  
   const lines = this.icsStr.split('\n');
   const events = []; 
   let event; 
   let ignore=false
   for (let i = 0; i < lines.length; i++) { 
     const line = lines[i].trim(); 
     if (line === 'BEGIN:VEVENT') { 
      event = {}; 
     } else if (line === 'END:VEVENT') { 
      events.push(event);
      ignore=false
     } else if (event) {
       // VALARM for example may be included in VEVENT .. skip
       if (line.startsWith("BEGIN") ) {
        ignore=true
       } 
       if (ignore) {
        continue
       }
       const match = /(.*):(.*)$/.exec(line); 
       if (match) { 
         const [, key, value] = match; 
         let tKey=key.split(";")[0]
         event[tKey] = value; 
       } 
     } 
    } 
    this.icsJson=events; 
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------
  getEventParameter(event,parm) {  
    if ( event.hasOwnProperty(parm) ) {
      return(event[parm])
    } else {
      return("")
    }
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------
  simplifyEvents() {  
    let keysToKeep=["SUMMARY","DTSTART","DTEND","DTSTAMP","RRULE","DESCRIPTION","LOCATION"]
    for (let event of this.icsJson ) {
      let sEvent={}
      for (let p of keysToKeep) {
        sEvent[p]=this.getEventParameter(event,p)
      }
      this.icsEvents.push(sEvent)
    }
  }


  //---------------------------------------------------------------------------------------------------------------------------------------------
  events2Planning() {  
    for (let event of this.icsEvents ) {
      let t=event["SUMMARY"].split(".")
      let name=t[0].trim()
      if ( !this.planningMap.has(name) ) {
        this.planningMap.set(name,new Array())
      }
      let kind=name
      if ( t.length > 1 ) {
        kind=t[1]
      }
      // temporary !!!! 
      console.log(" Event" + JSON.stringify(event))

      let rruleParser=new RruleParser(event)
      let whens=rruleParser.getWhens()
      
      for (let when of whens) {
        let note=event["SUMMARY"] + "," +event["DESCRIPTION"] + "," + event["LOCATION"]
        let vtEvent=new VtEvent(kind,when,note)
        this.planningMap.get(name).push(vtEvent)
      }
    }
  }

}