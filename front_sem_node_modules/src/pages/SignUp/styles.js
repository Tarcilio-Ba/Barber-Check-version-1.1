import styled from "styled-components"
import Fundo from "../../assets/barbearia12.png"

export const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 110vh;
  background-image: url(${Fundo});
  background-repeat: repeat-y;
  background-position: center;
`

export const Form = styled.form`
  width: 500px;
  background: #fff;
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #999;
  background-color: transparent;
  img {
    width: 300px;
    margin: 10px 0 40px;
    border-radius: 100px 
  }
  p {
    color: white;
    margin-bottom: 15px;
    border: 1px solid #ff3333;
    padding: 10px;
    width: 100%;
    text-align: center;
    font-weight: bold;  
    background:#ff3333;
  }
  input {
    display: flex;
    height: 40px;
    margin-bottom: 15px;
    padding: 0 20px;
    color: #777;
    font-size: 15px;
    width: 100%;
    border-radius: 25px;
    &::placeholder {
      color: #777;
    }
  }
  button {
    color: #fff;
    font-size: 16px;
    background: blue;
    height: 45px;
    border: 0;
    border-radius: 5px;
    
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
    margin-left: 5px;
    background: green;
    border-radius: 5px;
  }
`;