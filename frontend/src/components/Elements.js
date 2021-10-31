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
  position: relative;
`;

export const TextContainer = styled.div`
  padding: 10px;
  padding-right: 11px;
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
`;

export const Image = styled.img`
  width: 105px;
  height: auto;
  opacity: 0.93;
`;
