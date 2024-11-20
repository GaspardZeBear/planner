class VirtualTable {

  #initialItems
  #items
  #infos
  #errors
  #vt

  constructor(items) {
    this.initialItems=items
    this.infos=[]
    this.errors=[]
    this.items=[]
    this.vt=new Map()
    this.list(this.initialItems)
    this.checkItems01()
    this.list(this.items)
    this.showInfo()
    this.build()
  }

  //-----------------------------------------------------------------------------------------
  list(items) {
    //console.log(JSON.stringify(items))
    for (let item of items) {
      this.info(JSON.stringify(item))
    }
  }

  //-----------------------------------------------------------------------------------------
  getVirtualTable() {
    return(this.vt)
  }
  
  //-----------------------------------------------------------------------------------------
  error(msg) {
    this.info(msg,"ERROR")
  }

  //-----------------------------------------------------------------------------------------
  info(msg,tag="INFO") {
    this.infos.push("[" + tag + "] " + msg)
  }

 //-----------------------------------------------------------------------------------------
  showInfo() {
    for (let info of this.infos) {
      //console.log(info)
    }
  }
  
  //-----------------------------------------------------------------------------------------
  checkItem01(item) {
    //console.log("checkItem() this <" + JSON.stringify(this) + ">")
    //console.log("checkItem() item <" + JSON.stringify(item) + ">")
    if (!item.hasOwnProperty("name") ) {
      this.error(this.checkItem01.name + "() item has no name !")
      return(false)
    }
    if ( item["name"].length == 0) {
      this.error(this.checkItem01.name + "() name length = 0! ")
      return(false)
    }
    if (!item.hasOwnProperty("events") ) {
      this.error(this.checkItem01.name + "() " + item["name"] + " " + " no events!")
      return(false)
    }
    if (item["events"].length == 0) {
      this.error(this.checkItem01.name + "() " + item["name"] + " " + "   events length 0!")
      return(false)
    }
    for (let event of item["events"]) {
      if (! event.hasOwnProperty("kind") ) {
        this.error(this.checkItem01.name + "() " + item["name"] + " " + " no kind!")
        return(false)
      } 
      if (! event.hasOwnProperty("when") ) {
        this.error(this.checkItem01.name + "() " + item["name"] + " " + " no when!")
        return(false)
      } 
      if ( !isNaN(event["when"]) ) {

      } else if ( event["when"].length < 10 ) {
        this.error(this.checkItem01.name + "() " + item["name"] + " " +  "  when length < 10!")
        return(false)
      }
    }
    this.info(item["name"] + " " + "is Valid")
    return(true)
  }

  //-----------------------------------------------------------------------------------------
  checkItems01() {
    for (let item of this.initialItems) {
      if (this.checkItem01(item)) {
        this.items.push(item)
      }
    }
  }

  //-----------------------------------------------------------------------------------------
  build() {
    for (let item of this.items) {
      this.addItemToVt(item)
    }
  } 

  //-----------------------------------------------------------------------------------------
  getNewName(name,counter) {
    return(name+"_"+ counter.toString().padStart(2, '0') + '+')
  }

  //-----------------------------------------------------------------------------------------
  addItemToVt(item) {
    for (let event of item["events"]) {
      let events=new Events(event)
      let vtEventsMap=events.getVtEventsMap()
      let name=item["name"]
      // if entry has a list, push else create the list and push
      if (this.vt.has(name)) {
        for (const [k,v] of vtEventsMap.entries() ) {
          let x=[]
          if ( this.vt.get(name).has(k) ) {
            x=this.vt.get(name).get(k)
          }
          x.push(v)

          this.vt.get(name).set(k,x)
        }
      } else {
        this.vt.set(name,new Map())
        //if ( vtEventsMap.size == 0 ) {
          
         // return
        //}
        for (const [k,v] of vtEventsMap.entries() ) {
          let x=[]
          if ( this.vt.get(name).has(k) ) {
            x=this.vt.get(name).get(k)
          }
          x.push(v)
          this.vt.get(name).set(k,x)
        }
      }
    }
  }

}