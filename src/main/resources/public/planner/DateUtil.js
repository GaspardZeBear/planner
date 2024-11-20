class DateUtil {

  static daysOff

  static {
      DateUtil.daysOff=DateUtil.joursFeries("2024")
  }

  //-------------------------------------------------------------------------------------------------------
  static joursFeries (an) {
	  var JourAn = new Date(an, "00", "01")
	  var FeteTravail = new Date(an, "04", "01")
	  var Victoire1945 = new Date(an, "04", "08")
    var FeteNationale = new Date("2022","06", "14","01","00","00")
    var FeteNationale = new Date(an, "05","14")
	  var Assomption = new Date(an, "07", "15")
	  var Toussaint = new Date(an, "10", "01")
	  var Armistice = new Date(an, "10", "11")
	  var Noel = new Date(an, "11", "25")
	  var G = an%19
	  var C = Math.floor(an/100)
	  var H = (C - Math.floor(C/4) - Math.floor((8*C+13)/25) + 19*G + 15)%30
	  var I = H - Math.floor(H/28)*(1 - Math.floor(H/28)*Math.floor(29/(H + 1))*Math.floor((21 - G)/11))
	  var J = (an*1 + Math.floor(an/4) + I + 2 - C + Math.floor(C/4))%7
	  var L = I - J
	  var MoisPaques = 3 + Math.floor((L + 40)/44)
	  var JourPaques = L + 28 - 31*Math.floor(MoisPaques/4)
	  var Paques = new Date(an, MoisPaques-1, JourPaques)
	  var LundiPaques = new Date(an, MoisPaques-1, JourPaques+1)
	  var Ascension = new Date(an, MoisPaques-1, JourPaques+39)
	  var Pentecote = new Date(an, MoisPaques-1, JourPaques+49)
	  var LundiPentecote = new Date(an, MoisPaques-1, JourPaques+50)
	  return new Array(JourAn, Paques, LundiPaques, FeteTravail, Victoire1945, Ascension, Pentecote, LundiPentecote, FeteNationale, Assomption, Toussaint, Armistice, Noel)
  }

    //---------------------------------------------------------------------------------------------------------------------------------------------
  static getMondayAsString(offset) {
    let msday=86400*1000
    var prevMonday = new Date();
    prevMonday.setDate(prevMonday.getDate() - (prevMonday.getDay() + 6) % 7);
    let monday=new Date(prevMonday.getTime() + 7*offset*msday -msday);
    return(monday.toJSON().slice(0,10));
  }

  //---------------------------------------------------------------------------------------------------------------------------------------------
  static getTodayAsString(offset) {
    let msday=86400*1000
    let nd= new Date(new Date().getTime() + offset*msday).toJSON().slice(0, 10)
    return(nd);
  }

  //-----------------------------------------------------------------------------------
  static date2String(d) {
    let nd= new Date(new Date(d).getTime()).toJSON().slice(0, 10)
    return(nd)
  }

  //-----------------------------------------------------------------------------------
  static dayOfWeek(d) {
    return(new Date(d.substring(0,10)).getDay())
  }

  //-------------------------------------------------------------------------------------------------------
  static date2day(d) {
    let l=d.toLocaleString("fr-FR").substring(0,10);
    let t=l.split("/");
    return(t[2]+"-"+t[1]+"-"+t[0]);
  }

  //-------------------------------------------------------------------------------------------------------
  static isWeekend(when) {  
    let dayOfWeek=new Date(when.substring(0,10)).getDay()
    if ( dayOfWeek == 0 || dayOfWeek == 6) {
      return(true)
    } else {
      return(false)
    }
  } 

  //---------------------------------------------------------------------------------------------------------------------------------------------
  static buildDaysOnSet(byday) {
    let s=new Set()
    if (byday == null) {
      return(s)
    }
    let alias0= {"SU":0,"MO":1,"TU":2,"WE":3,"TH":4,"FR":5,"SA":6,
                "0":0,"1":1,"2":2,"3":3,"4":4,"5":5,"6":6,
                "DI":0,"LU":1,"MA":2,"ME":3,"JE":4,"VE":5,"SA":6,
    }
    let days=byday.split(",")
    for (let d of days) {
      s.add(alias0[d]) 
    }
    return(s)
  }
    
  //-------------------------------------------------------------------------------------------------------
  static getListOfDates(start,count,daysOn) { 
    let nstart=new Date(start.substring(0,10));
    let loop = new Date(nstart);
    let dates=[];
    for (let i=0;i<count;i++) {
      let dow=loop.getDay()
      let push=true
      if (daysOn != null) {
        if ( daysOn.size > 0 ) {
          if ( !daysOn.has(dow) ) {
            push=false
          }
        }
      }
      if (push) {
        let day=DateUtil.date2day(loop);
        dates.push(day+"M");
        dates.push(day+"A");
      }
      let newDate = loop.setDate(loop.getDate() + 1);
      loop = new Date(newDate);
    }
    return(dates)
  } 

  //-------------------------------------------------------------------------------------------------------
  static  icsDateConvert(date) {
    return(date.substring(0,4)+'-'+date.substring(4,6)+'-'+date.substring(5,7))

  }

  //-------------------------------------------------------------------------------------------------------
  static  isWhenInStartEnd(when,start,end) {
  //console.log("isWhenInStartEnd() when  " + when + " compared to " + DateUtil.date2String(start) + " " + DateUtil.date2String(end))
    if ( when < DateUtil.date2String(start) ) {
      //console.log("isWhenInStartEnd() < start")
      return(false)
    }
    if ( when > DateUtil.date2String(end ) ) {
      //console.log("isWhenInStartEnd() > end")
      return(false)
    }
  //console.log("isWhenInStartEnd() in interval")
    return(true)
  }

}