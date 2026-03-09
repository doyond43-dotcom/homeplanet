import { useState } from "react";

type Ticket = {
  id: number;
  text: string;
  stage: number;
};

const stages = ["NEW","ON GRILL","PLATING","READY","COMPLETED"];

export default function MomsKitchenDemo() {

  const [tickets,setTickets] = useState<Ticket[]>([
    {id:1,text:"Table 4\n2 Eggs • Bacon • Toast",stage:0},
    {id:2,text:"Takeout #14\nPatty Melt • Fries",stage:0},
    {id:3,text:"Table 2\nPancakes • Sausage",stage:1},
    {id:4,text:"Table 8\nClub Sandwich • Fries",stage:2},
    {id:5,text:"Table 5\nPatty Melt • Onion Rings",stage:3},
    {id:6,text:"Table 1\nBiscuits & Gravy",stage:4},
  ]);

  function moveTicket(id:number){
    setTickets(prev =>
      prev.map(t =>
        t.id===id && t.stage < stages.length-1
          ? {...t,stage:t.stage+1}
          : t
      )
    );
  }

  function addOrder(){
    const newId = Date.now();

    const sample = [
      "Table 7\nWestern Omelette • Coffee",
      "Table 9\nBiscuits & Gravy",
      "Takeout #21\nBreakfast Burrito",
      "Table 3\nPancakes • Bacon"
    ];

    const order = sample[Math.floor(Math.random()*sample.length)];

    setTickets(prev=>[
      ...prev,
      {id:newId,text:order,stage:0}
    ]);
  }

  return (
    <div style={{background:"#0f1116",minHeight:"100vh",color:"white",padding:"20px"}}>

      <h1 style={{marginBottom:20}}>
        🍳 Mom's Kitchen Live Board — Demo
      </h1>

      <button
        onClick={addOrder}
        style={{
          padding:"10px 16px",
          marginBottom:"20px",
          background:"#7c3aed",
          border:"none",
          borderRadius:8,
          color:"white",
          cursor:"pointer"
        }}
      >
        + Demo Order
      </button>

      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:15}}>

        {stages.map((stage,stageIndex)=>(
          <div
            key={stage}
            style={{
              background:"#1b1f27",
              padding:10,
              borderRadius:8,
              minHeight:400
            }}
          >
            <h2 style={{textAlign:"center"}}>{stage}</h2>

            {tickets
              .filter(t=>t.stage===stageIndex)
              .map(t=>(
                <div
                  key={t.id}
                  onClick={()=>moveTicket(t.id)}
                  style={{
                    background:"#2a2f38",
                    padding:10,
                    borderRadius:6,
                    marginBottom:10,
                    cursor:"pointer",
                    whiteSpace:"pre-line"
                  }}
                >
                  {t.text}
                </div>
              ))
            }

          </div>
        ))}

      </div>
    </div>
  );
}