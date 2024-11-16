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
    console.log(JSON.stringify(items))
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
      console.log(info)
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
      if (this.vt.has(name)) {
        let existingMap=this.vt.get(name)
        let collision=0
        for (const [k1,v1]  of existingMap.entries() ) {
          for (const [k2,v2] of  vtEventsMap.entries() ) {
            // collision
            if ( k1 == k2 ) {
              collision++;
              existingMap.get(k1).setKind("Multi")
              existingMap.get(k1).addProcessing(v2.getKind() + ";" +v2.getProcessing())
              let i=1
              while (this.vt.has(this.getNewName(name,i)) ) {
                i++
              }
              let newName2=this.getNewName(name,i)
              let newMap2=new Map()
              newMap2.set(k2,v2)
              this.vt.set(newName2,newMap2)
            }
          } 
        }
        // no collision, merge maps 
        if ( collision == 0 ) {
          for (const [k,v] of vtEventsMap.entries() ) {
            this.vt.get(name).set(k,v)
          }
        }
      } else {
        this.vt.set(name,vtEventsMap)
      }
    }
  }
}