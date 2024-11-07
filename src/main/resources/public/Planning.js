let _dummy={ name: "3.Dummy", events: [ { kind: "EVT", when : "2024-11-10@2024-11-12"}] };


let _0= { name: "0..PEOPLE", events: [ ] }
let _0_SSS={ name: "0.SSS", events: [
    { kind: "HOL", when : "2024-11-02A"},
    { kind: "HOL", when : "2024-11-11", note: 'hol01-11'},
    { kind: "EVT", when : "2024-11-11M", note: 'evt01-11M'},
    { kind: "EVT", when : "2024-11-12"},
    { kind: "TEA", when : "2024-11-17"},
    { kind: "PUP", when : "2024-11-18"},
] };
let _0_CCC=  { name: "0.CCC", events: [
    { kind: "HOL", when : "2024-11-03M",note:"This is a tooltip"}
] };
let _0_DDD={ name: "0.DDD", events: [
    { kind: "HOL", when : "2024-11-05A@2024-11-15A",note:"Some holidays"} ,
    { kind: "TEA", when : "2024-11-08M@2024-11-10A",note:"Newcomers"} ,
    { kind: "PUP", when : "2024-11-09M@2024-11-10A",note:"Must learn ocp4"} ,
] };
let _0_GGG= { name: "0.GGG", events: [
    { kind: "HOL", when : "2024-11-05A@2024-11-07M"}
] };
let _0_TTT= { name: "0.TTT", events: [
    { kind: "HOL", when : "2024-11-05A"}
] };

let _1={ name: "1..EVENTS", events: [ ] }
let _1_DEVOPS={ name: "1.DEVOPS", events: [ { kind: "EVT", when : "2024-11-05@2024-11-07"} ] }
let _1_TECHMEETING={ name: "1.TECHMEETING", events: [ { kind: "EVT", when : "2024-11-05@2024-11-07"} ] }
let _1_PARISTECH={ name: "1.PARISTECH", events: [ { kind: "EVT", when : "2024-11-10@2024-11-12"} ] }




let _2={ name: "2..TRAINING", events: [ ] }
let _2_NEWCOMERS={ name: "2.Newcomers", events: [
    { kind: "EVT", when : "2024-11-03@2024-11-05", links : ["0.SSS","0.GGG"]}
] }


let _info={ name: "4..INFO", events: [
    { kind: "EVT", when : "2024-11-10@2024-11-12"}
] };

let _5= { name: "5..FORMATION", events: [] };
let _5_BABA_COMPTA={ name: "5.BABA_COMPTA", events: [
    { kind: "EVT", when : "2024-11-14@2024-11-18"}
] };
let _5_ANAL_FIN={ name: "5.ANAL_FIN", events: [
    { kind: "EVT", when : "2024-11-14@2024-11-18"},
    { kind: "EVT", when : "2024-11-22@2024-11-27"},
] };

let myPlanning = [
  _0,
  _0_CCC,
  _0_DDD,
  _0_GGG,
  _0_TTT,
  _0_SSS,
  _1,
  _1_DEVOPS,
  _1_TECHMEETING,
  _1_PARISTECH,
  _2,
  _2_NEWCOMERS,
  _info,
  _5,
  _5_BABA_COMPTA,
  _5_ANAL_FIN,
  _dummy,
];


