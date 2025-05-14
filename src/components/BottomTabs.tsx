import React from "react";
import { NavLink } from "react-router-dom";
import { FaHouse, FaMap, FaBook, FaUser } from "react-icons/fa6";
import styled from "styled-components";

export default function BottomTabs() {
  return (
    <Nav>
      <StyledNavLink to="/home">
        {({ isActive }) => (
          <Tab className={isActive ? "active" : ""}>
            <IconWrapper>
              <FaHouse />
            </IconWrapper>
            <Label>홈</Label>
          </Tab>
        )}
      </StyledNavLink>

      <StyledNavLink to="/search">
        {({ isActive }) => (
          <Tab className={isActive ? "active" : ""}>
            <IconWrapper>
              <FaMap />
            </IconWrapper>
            <Label>탐색</Label>
          </Tab>
        )}
      </StyledNavLink>

      <StyledNavLink to="/lib">
        {({ isActive }) => (
          <Tab className={isActive ? "active" : ""}>
            <IconWrapper>
              <FaBook />
            </IconWrapper>
            <Label>설화</Label>
          </Tab>
        )}
      </StyledNavLink>

      <StyledNavLink to="/my">
        {({ isActive }) => (
          <Tab className={isActive ? "active" : ""}>
            <IconWrapper>
              <FaUser />
            </IconWrapper>
            <Label>정보</Label>
          </Tab>
        )}
      </StyledNavLink>
    </Nav>
  );
}

// styled-components
const Nav = styled.nav`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  display: flex;
  border-top: 1px solid #e0e0e0;
  background: #ffffff;
  z-index: 20;
`;

const StyledNavLink = styled(NavLink)`
  flex: 1;
  text-decoration: none;
`;

const Tab = styled.div`
  color: #888;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2px;

  &.active {
    color: #027ec2;
  }

  &.active svg {
    color: #027ec2;
  }
`;

const IconWrapper = styled.div`
  font-size: 24px;
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
`;
