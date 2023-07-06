import React from "react"

import styled from "styled-components";


interface IProps {
	title: string;
	onClick: () => void;
}

export const CButton : React.FC<IProps> = ({
	title,
	onClick

})  => {
    const Background = styled.div`
//   background: #2d2d2d;
  display: flex;
  justify-content: center;
`;

const Content = styled.a`
  color: black;
  padding: 0.7em calc(0.7em * 1.2);
  display: inline-block;
  position: relative;
  font-size: 1.5em;
  cursor: pointer;
  letter-spacing: 0.07em;
  text-decoration: none;

  .text {
    transform: translate3d(0, 0.7em, 0);
    display: block;
    transition: transform 0.4s cubic-bezier(0.2, 0, 0, 1) 0.4s;
  }

  &:after {
    position: absolute;
    content: "";
    bottom: -3px;
    left: calc(0.7em * 1.2);
    right: calc(0.7em * 1.2);
    height: 3px;
    background: #1c8e77;
    transition: transform 0.8s cubic-bezier(1, 0, 0.37, 1) 0.2s,
      right 0.2s cubic-bezier(0.04, 0.48, 0, 1) 0.6s,
      left 0.4s cubic-bezier(0.04, 0.48, 0, 1) 0.6s;
    transform-origin: left;
  }

  .line {
    position: absolute;
    background: #1c8e77;
  }

  .line.-right,
  .line.-left {
    width: 3px;
    bottom: -3px;
    top: -3px;
    transform: scale3d(1, 0, 1);
  }

  .line.-top,
  .line.-bottom {
    height: 3px;
    left: -3px;
    right: -3px;
    transform: scale3d(0, 1, 1);
  }

  .line.-right {
    right: -3px;
    transition: transform 0.1s cubic-bezier(1, 0, 0.65, 1.01) 0.23s;
    transform-origin: top;
  }

  .line.-top {
    top: -3px;
    transition: transform 0.08s linear 0.43s;
    transform-origin: left;
  }

  .line.-left {
    left: -3px;
    transition: transform 0.08s linear 0.51s;
    transform-origin: bottom;
  }

  .line.-bottom {
    bottom: -3px;
    transition: transform 0.3s cubic-bezier(1, 0, 0.65, 1.01);
    transform-origin: right;
  }

  &:hover .text,
  &:active .text {
    transform: translate3d(0, 0, 0);
    transition: transform 0.6s cubic-bezier(0.2, 0, 0, 1) 0.4s;
  }

  &:hover:after,
  &:active:after {
    transform: scale3d(0, 1, 1);
    right: -3px;
    left: -3px;
    transform-origin: right;
    transition: transform 0.2s cubic-bezier(1, 0, 0.65, 1.01) 0.17s,
      right 0.2s cubic-bezier(1, 0, 0.65, 1.01),
      left 0s 0.3s;
  }

  &:hover .line,
  &:active .line {
    transform: scale3d(1, 1, 1);
  }

  &:hover .line.-right,
  &:active .line.-right {
    transition: transform 0.1s cubic-bezier(1, 0, 0.65, 1.01) 0.2s;
    transform-origin: bottom;
  }

  &:hover .line.-top,
  &:active .line.-top {
    transition: transform 0.08s linear 0.4s;
    transform-origin: right;
  }

  &:hover .line.-left,
  &:active .line.-left {
    transition: transform 0.08s linear 0.48s;
    transform-origin: top;
  }

  &:hover .line.-bottom,
  &:active .line.-bottom {
    transition: transform 0.5s cubic-bezier(0, 0.53, 0.29, 1) 0.56s;
    transform-origin: left;
  }
`;

    return (
        <Background className="portfolio-experiment">
        <Content onClick={onClick} href="#">
          <span className="text">{title}</span>
          <span className="line -right"></span>
          <span className="line -top"></span>
          <span className="line -left"></span>
          <span className="line -bottom"></span>
        </Content>
      </Background>
    );
}