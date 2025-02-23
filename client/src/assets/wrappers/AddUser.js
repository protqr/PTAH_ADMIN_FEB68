import styled from "styled-components";

const Wrapper = styled.section`
  input {
    height: 50px;
    width: 200px;
    margin-top: 35px;
    margin-left: 15px;
    margin-right: 15px;
    border-radius: 5px;
    border: 0.1px solid white;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Add box shadow */
  }

  button {
    color: #87cefa;
    background-color: white;
    margin-top: 20px;
    width: 150px;
    height: 35px;
    border-radius: 10px;
    border: 0.1px solid #87cefa;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Add box shadow */

    margin-left: 460px; /* Align the button to the right */
  }
  h1 {
    font-size: 40px;
    border-bottom: 2px solid #87cefa;
    padding: 10px;
  }
  .divadduser {
    width: 100%;
    height: auto;
    margin-top: 20px;
    padding: 20px;
    box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3); /* Add box shadow */
  }
`;

export default Wrapper;
