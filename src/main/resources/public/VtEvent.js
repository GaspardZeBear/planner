
class VtEvent {
  #kind
  #when
  #note
  constructor(kind,when,note) {
    this.kind=kind
    this.when=when
    this.note=note
    this.processing=""
  }

  getKind() { return(this.kind) }
  setKind(kind) { this.kind=kind }
  getNote() { return(this.note) }
  getWhen() { return(this.when) }
  addProcessing(msg) {
    this.processing += ";" + msg
  }



}