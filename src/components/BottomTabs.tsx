import React from "react";
import { colors } from "../constants/colors";
import { NavLink } from "react-router-dom";
import {
  TbMapSearch,
  TbHome,
  TbCameraPin,
  TbBook,
  TbUser,
} from "react-icons/tb";
import styled from "styled-components";

export default function BottomTabs() {
  return (
    <Nav>
      <StyledNavLink to="/home">
        {({ isActive }) => (
          <Tab className={isActive ? "active" : ""}>
            <IconWrapper>
              <TbHome />
            </IconWrapper>
            <Label>홈</Label>
          </Tab>
        )}
      </StyledNavLink>

      <StyledNavLink to="/search">
        {({ isActive }) => (
          <Tab className={isActive ? "active" : ""}>
            <IconWrapper>
              <TbMapSearch />
            </IconWrapper>
            <Label>탐색</Label>
          </Tab>
        )}
      </StyledNavLink>

      <StyledNavLink to="/ar">
        {({ isActive }) => (
          <Tab className={isActive ? "active" : ""}>
            <IconWrapper>
              <TbCameraPin />
            </IconWrapper>
            <Label>AR</Label>
          </Tab>
        )}
      </StyledNavLink>

      <StyledNavLink to="/lib">
        {({ isActive }) => (
          <Tab className={isActive ? "active" : ""}>
            <IconWrapper>
              <TbBook />
            </IconWrapper>
            <Label>설화</Label>
          </Tab>
        )}
      </StyledNavLink>

      <StyledNavLink to="/my">
        {({ isActive }) => (
          <Tab className={isActive ? "active" : ""}>
            <IconWrapper>
              <TbUser />
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
    color: ${colors.ORANGE_500};
  }

  &.active svg {
    color: ${colors.ORANGE_500};
  }
`;

const IconWrapper = styled.div`
  font-size: 24px;
`;

const Label = styled.span`
  font-size: 12px;
  font-weight: 500;
`;
