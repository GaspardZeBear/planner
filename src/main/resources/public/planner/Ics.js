class Ics {

#ics
#icsJson

constructor(ics) {
  this.ics=ics
  this.icsJson=ics2json(ics)
}

  
//---------------------------------------------------------------------------------------------------------------------------------------------
 ics2json(ics) {  
   const lines = icsString.split('\n');
   const events = []; 
   let event; 
   for (let i = 0; i < lines.length; i++) { 
     const line = lines[i].trim(); 
     if (line === 'BEGIN:VEVENT') { 
       event = {}; 
     } else if (line === 'END:VEVENT') { 
      events.push(event);
     } else if (event) {
       const match = /^([A-Z]+):(.*)$/.exec(line); 
       if (match) { 
         const [, key, value] = match; 
         event[key] = value; 
       } 
     } 
    } 
    return events; 

  }
}