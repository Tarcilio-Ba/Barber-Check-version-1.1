import styled from "styled-components"
import fundo from "../../assets/barbearia.png";

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-image: url(${fundo});
  background-repeat: : no-repeat;
`;

export const Form = styled.form`
  width: 400px;
  background: #fff;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #999;
  background-color: transparent;
  img {
    width: 350px;
    margin: 10px 0 40px;
    border-radius: 100px;
  }
  p {
    color: white;
    margin-bottom: 15px;
    border: 1px solid #ff3333;
    padding: 5px;
    width: 100%;
    text-align: center;
    font-weight: bold;
    background: #ff3333;
  }
  input {
    display: flex;
    height: 46px;
    margin-bottom: 15px;
    padding: 0 20px;
    color: #777;
    font-size: 15px;
    width: 100%;
    border-radius: 15px;
    &::placeholder {
      color: #777;
    }
  }
  button {
    color: #fff;
    font-size: 20px;
    font-weight: bold;
    background: blue;
    height: 56px;
    border: 0;
    border-radius: 25px;
    width: 50%;
  }
  button:hover {
    background: #000080;
  }
  hr {
    margin: 20px 0;
    border: none;
    border-bottom: 1px solid #cdcdcd;
    width: 100%;
  }
  a {
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    color: white;
    text-decoration: none;
    type: button;
    background: green;
    border-radius: 25px;
  }
`;