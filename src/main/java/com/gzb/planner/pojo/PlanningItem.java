package com.gzb.planner.pojo;


public class PlanningItem {

private String comment; 
private String name;
private String kind;
private String when;
private String note;

  public PlanningItem() {
    comment="";
    name="";
    kind="";
    when="";
    note="";
  }

  public void setIdx(int idx,String str) {
    switch(idx) {
      case 0 :
        this.comment=str;
        break;
      case 1 :
        this.name=str;
        break;
      case 2 :
        this.kind=str;
        break;
      case 3 :
        this.when=str;
        break;
      case 4 :
        this.note=str;
        break;
      default :
        break;
    }
    
  }

  public void setComment(String str) {
    this.comment=str;
  }

  public String getComment() {
    return(this.comment);
  }


  public void setName(String str) {
    this.name=str;
  }
  public String getName() {
    return(this.name);
  }

  public void setKind(String str) {
    this.kind=str;
  }
  public String getKind() {
    return(this.kind);
  }

  public void setWhen(String str) {
    this.when=str;
  }
  public String getWhen() {
    return(this.when);
  }
  
  public void setNote(String str) {
    this.note=str;
  }
  public String getNote() {
    return(this.note);
  }

  public String toString() {
    return("|" + comment + "|" + name + "|" + kind + "|" + when + "|" + note);
  }
  


}
