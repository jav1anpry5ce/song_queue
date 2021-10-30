import styled from "styled-components";

export const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

export const Card = styled.div`
  border-radius: 5px;
  background-color: #ffe0e0;
  box-shadow: 1px 1px #cccccc;
  /* max-height: 90px; */
  margin-top: 5px;
`;

export const TextContainer = styled.div`
  padding: 7px;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;

export const Title = styled.h4`
  color: black;
  font-size: 18px;
  margin-bottom: 0px;
`;

export const Text = styled.p`
  font-size: 16px;
  font-style: italic;
  margin: 0px;
`;
