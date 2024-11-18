class Util {
 
  
//---------------------------------------------------------------------------------------------------------------------------------------------
static buildFilesList(selector,pFilesList,action) {
  console.log("fFiles " + JSON.stringify(filesList))
  var filesList = document.createElement("select");
  filesList.id=selector;
  document.querySelector("#" + selector).appendChild(filesList)
  let selected = false
  var option=document.createElement("option")
  option.value=""
  option.text=""
  option.selected=selected
  selected=false
  filesList.appendChild(option)
  for ( let xfile of pFilesList.sort() ){
    console.log(" File " + xfile)
    var option=document.createElement("option")
    option.value=xfile
    option.text=xfile
    option.selected=selected
    selected=false
    filesList.appendChild(option)
  }
  document.querySelector("#" + selector).addEventListener('change', function (e) { 
    console.log("File selected change " + e.target.value)
    if ( e.target.value.length > 0 ) {
      action(e.target.value)
    }
    },true);
  document.querySelector("#" + selector).addEventListener('click', function (e) { 
    console.log("File selected click " + e.target.value)
    if ( e.target.value.length > 0 ) {
      action(e.target.value)
    }
    },true);

  }
}