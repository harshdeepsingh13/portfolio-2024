import Header from "./components/Header";
import styled from "styled-components";
import AppRouter from "./AppRouter";

function App() {
	return (
		<>
			<AppContainer>
				<Header/>
				<AppRouter/>
			</AppContainer>
		</>
	);
}

const AppContainer = styled.div`
  letter-spacing: 1px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export default App;
