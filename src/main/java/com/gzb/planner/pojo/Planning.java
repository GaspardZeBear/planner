package com.gzb.planner.pojo;

import java.util.ArrayList;
import java.util.HashMap;

import com.gzb.planner.pojo.PlanningItem;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;

public class Planning {
  private ArrayList<PlanningItem> itemList;
  private HashMap<String,String> stylesList;

  public Planning(ArrayList<PlanningItem> itemList, HashMap<String,String> stylesList) {
    this.itemList=itemList;
    this.stylesList=stylesList;
  }

  public String toJson() {
    JSONArray items=new JSONArray();
    HashMap<String,JSONObject> objsMap = new HashMap<String,JSONObject>();
    HashMap<String,JSONArray> eventsMap = new HashMap<String,JSONArray>();
    for (PlanningItem item : itemList) {
      System.out.println("Processing " + item.getName());
      JSONObject obj;
      JSONArray events;
      if ( objsMap.containsKey(item.getName()) ) {
        obj=objsMap.get(item.getName());
        events=eventsMap.get(item.getName());
      } else {
        System.out.println("Creating  " + item.getName() + " in maps");
        obj=new JSONObject();
        obj.put("name",item.getName());
        objsMap.put(item.getName(),obj);
        events=new JSONArray();
        obj.put("events",events);
        eventsMap.put(item.getName(),events);
        items.add(obj);
        System.out.println(items.toJSONString());
      }
      JSONObject event=new JSONObject();
      event.put("kind",item.getKind());
      event.put("when",item.getWhen());
      event.put("note",item.getNote());
      events.add(event);
      System.out.println(items.toJSONString());
    }
    JSONObject j=new JSONObject();
    j.put("Planning",items);
    j.put("Styles",new JSONObject(stylesList));
    //return(items.toJSONString());
    return(j.toJSONString());
  }

}
