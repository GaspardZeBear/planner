class VirtualTable {

  #initialItems
  #items
  #infos
  #errors

  constructor(items) {
    this.initialItems=items
    this.infos=[]
    this.errors=[]
    this.items=[]
    this.list(this.initialItems)
    this.checkItems01()
    this.list(this.items)
    this.showInfo()
  }

  //-----------------------------------------------------------------------------------------
  list(items) {
    console.log(JSON.stringify(items))
    for (let item of items) {
      this.info(JSON.stringify(item))
    }
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
        //this.trace("isValidLine() event " + JSON.stringify(event))
        //let d = new Date(Math.round((event["when"] - 25569) * 86400 * 1000));
        //event["when"]=DateUtil.date2String(d);
        //console.log("isValidLine event.when " + event["when"]);
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
    for (let ok of this.items) {
      //console.log("OK !!!!!!!!!!!!!!!!!!!!!!!! " + JSON.stringify(ok))
    }
 
    
  }
}