class Events {
  #vtEventsMap
  #vtEvents
  #event
  constructor(event) {
    this.event=event
    this.vtEvents=[]
    this.vtEventsMap=new Map()
    this.createVtEvents()
  }

  //-------------------------------------------------------------------------------------------------------
  getVtEvents() {
    return(this.vtEvents)
  }
  
  //-------------------------------------------------------------------------------------------------------
  getVtEventsMap() {
    return(this.vtEventsMap)
  }

  //-------------------------------------------------------------------------------------------------------
  createVtEvents() {
    if ( this.event["when"].includes("@") ) {
      this.createMultipleVtEvents()
    } else if ( this.event["when"].length == 10 ) {
      let vtEventM=new VtEvent(this.event["kind"],this.event["when"]+"M",this.event["note"])
      this.addVtEvent(vtEventM)
      let vtEventA=new VtEvent(this.event["kind"],this.event["when"]+"A",this.event["note"])
      this.addVtEvent(vtEventA)
    } else if ( this.event["when"].length == 11 ) {
      let vtEvent=new VtEvent(this.event["kind"],this.event["when"],this.event["note"])
      this.addVtEvent(vtEvent)
    }
  }

  //-------------------------------------------------------------------------------------------------------
   addVtEvent(vtEvent) {
    this.vtEvents.push(vtEvent)
    this.vtEventsMap.set(vtEvent.getWhen(),vtEvent)
  }

  //-------------------------------------------------------------------------------------------------------
  createMultipleVtEvents() {
    let whens=this.event["when"].split("@");
    if ( whens[0].length == 10 ) whens[0] += "M"
    if ( whens[1].length == 10 ) whens[1] += "A"
    let nstart=new Date(whens[0].substring(0,10));
    let nend=new Date(whens[1].substring(0,10));
    let loop = new Date(nstart);
    let dates=[];
    while(loop <= nend){
      let day=DateUtil.date2day(loop);
      dates.push(day+"M");
      dates.push(day+"A");
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    if (whens[0].endsWith("A")) dates.shift()
    if (whens[1].endsWith("M")) dates.pop()
    for (let d of dates) {
      let vtEvent=new VtEvent(this.event["kind"],d,this.event["note"])
      this.addVtEvent(vtEvent)
    }
  }
}
