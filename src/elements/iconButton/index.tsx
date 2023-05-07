import styled from "styled-components";

export const IconButton = styled(`div`)`
  transition: color 0.2s ease-in-out;
  display: flex;
  align-items: center;
  cursor: pointer;
  pointer-events: auto;
  color: ${({theme}) => theme.palette.color_icon_medium_alpha};
  &:hover {
    color: ${({theme}) => theme.palette.color_text_accent_themed};
  },
`
