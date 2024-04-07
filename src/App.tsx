import {createRef, useState} from "react";
import AbacusComponent, {AbacusComponentRef} from "./components/AbacusComponent";

function App() {
  const [value, setValue] = useState(0);
  const abacusRef = createRef<AbacusComponentRef>();

  function getAbacusValue() {
    if(abacusRef.current) setValue(abacusRef.current.getAbacusValue());
  }

  function resetAbacus() {
    if(abacusRef.current) abacusRef.current.reset();
    getAbacusValue();
  }

  return (
    <>
      <div>
        <p>Abacus Component</p>

        <div className="w-screen h-screen flex flex-col gap-2 px-4 py-4 items-center justify-center">
          <AbacusComponent ref={abacusRef} />

          <p>Current Abacus Value: {value.toFixed(2)}</p>
          <button onClick={getAbacusValue}>Get Abacus Value</button>
          <button onClick={resetAbacus}>Reset Abacus</button>
        </div>
      </div>
    </>
  );
}

export default App;
