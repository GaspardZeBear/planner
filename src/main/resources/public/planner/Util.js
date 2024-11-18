class Util {
 
  
//---------------------------------------------------------------------------------------------------------------------------------------------
static buildFilesList(selector,pFilesList,actions) {
  console.log("fFiles " + JSON.stringify(pFilesList))
  
  //cleanup all the div
  const element = document.querySelector("#" + selector);
  while (element.firstChild) {
    element.removeChild(element.firstChild);
  }

  
  var selectedItem=document.createElement("Text")
  selectedItem.id=selector+"Selected"
  document.querySelector("#" + selector).appendChild(selectedItem)

  // Create the action buttons and associated listener
  console.log("Buttons creation ") 
  for (let action of actions) {
    console.log("Button creation " + action["text"]) 
    var button=document.createElement("Button")
    button.textContent=action["text"]
    button.id=selector+"Button"+action["text"]
    console.log("Button created " + action["text"]) 
    document.querySelector("#" + selector).appendChild(button)
    document.querySelector("#" + selector + "Button" +action["text"]).addEventListener('click', function (e) {
        console.log("Button hit " + action["text"]) 
        let sel=document.getElementById(selector + "Selected")
        if ( sel.value == null ) {
          return
        }
        action["action"](sel.value)
    },true)
  }
  console.log("Buttons created ") 

  // build select box
  console.log(" Building select box")
  var filesList = document.createElement("select");
  filesList.id=selector+"Select";
  let selected = false
  var option=document.createElement("option")
  option.value=""
  option.text=""
  option.selected=selected
  selected=false
  filesList.appendChild(option)
  for ( let xfile of pFilesList.sort() ){
    console.log(" File " + xfile + " added to select box")
    var option=document.createElement("option")
    option.value=xfile
    option.text=xfile
    option.selected=selected
    selected=false
    filesList.appendChild(option)
  }
  document.querySelector("#" + selector).appendChild(filesList)
  console.log(" Select box built")

  // Add select box listeners
  document.querySelector("#" + selector + "Select").addEventListener('change', function (e) { 
      console.log("File selected change " + e.target.value)
      console.log("index " + e.target.selectedIndex)
      if ( e.target.value.length > 0 ) {
        document.getElementById(selector + "Selected").value=e.target.value
        //action(e.target.value)
      }
    },true);
    
  } // EoMethod

} //EoClass