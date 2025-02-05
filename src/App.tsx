import './App.css';
import SearchChat from './component/SearchChat';
import KaiLogo from 'kai-assets/logo.svg';

function App() {

  return (
    <div className="App">
      <div className="content">
        <div className="logo">
          <img src={KaiLogo} alt="Kai Logo" />
        </div>

        <SearchChat />
      </div>
    </div>
  );
}

export default App;
