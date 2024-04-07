import { useState } from "react";
import AbacusComponent from "./components/AbacusComponent";

function App() {
  const [value, setValue] = useState(0);
  return (
    <>
      <div>
        <p>Abacus Component</p>

        <div className="w-screen h-screen flex flex-col gap-2 px-4 py-4 items-center justify-center">
          <AbacusComponent onValueChange={setValue} />

          <p>Current Abacus Value: {value.toFixed(2)}</p>
        </div>
      </div>
    </>
  );
}

export default App;
