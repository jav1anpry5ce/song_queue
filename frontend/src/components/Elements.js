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
  margin-top: 5px;
  position: relative;

  &:hover {
    box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  }
`;

export const TextContainer = styled.div`
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
`;

export const Title = styled.h4`
  color: black;
  font-size: 18px;
  margin-bottom: 0px;
`;

export const Text = styled.p`
  font-size: ${(props) => (props.mobile ? "14px" : "17px")};
  font-style: italic;
  margin: 0px;
  text-transform: capitalize;

  &:hover {
    text-decoration: ${(props) => (props.hover ? "underline" : null)};
    cursor: ${(props) => (props.hover ? "pointer" : null)};
    color: ${(props) => (props.hover ? "#a24ac2" : "black")};
  }
`;

export const Image = styled.img`
  width: 105px;
  height: auto;
  opacity: 0.93;
`;
