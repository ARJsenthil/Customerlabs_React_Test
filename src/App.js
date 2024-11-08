import { useState } from 'react';
import Segment from './component/segment';
import './App.css';

function App() {
  const [toggleStatus, setToggleStatus] = useState(false);
  return (
    <div className="d-flex">
      <button className="btn border-success m-auto mt-5 w-50 w-auto" onClick={() => setToggleStatus(true)}>Save Segment</button>
      { toggleStatus && <Segment onClose={ () => setToggleStatus(false) }/> }
    </div>
  );
}

export default App;