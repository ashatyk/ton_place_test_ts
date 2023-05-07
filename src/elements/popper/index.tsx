import styled from "styled-components";

export interface PopperProps {
  popperOpen: boolean
}

export const Popper = styled(`ul`)<PopperProps>`
  position: absolute;
  margin: 0;
  padding: 0;
  display: none;
  list-style: none;
  max-height: 250px;
  border-radius: 0 0 ${({theme}) => theme.size.size_border_radius__regular} ${({theme}) => theme.size.size_border_radius__regular};
  overflow-y: auto;
  border: 1px solid ${({theme}) => theme.palette.color_field_border_alpha};
  width: 100%;
  left: -1px;
  top: 100%;
  z-index: 100;
  background-color: ${({theme}) => theme.palette.color_field_background};
  
  ${props => props.popperOpen && "display: block;" };
  
  ::-webkit-scrollbar {
    width: ${({theme}) => theme.size.size_border_radius__regular};
  }
  ::-webkit-scrollbar-thumb {
    width: 2px;
    background-color: ${({theme}) => theme.palette.color_icon_medium};
    border-radius: 4px;
    border: 2px solid ${({theme}) => theme.palette.color_field_background};
  }
`

export interface PopperOptionProps {
  isOptionHighlighted?: boolean
  isLastElement?: boolean
}

export const PopperOptions = styled(`li`)<PopperOptionProps>`
  padding: 6px 0 8px 9px;
  display: flex;
  cursor: pointer;
  background-color: ${({theme,isOptionHighlighted}) => isOptionHighlighted && theme.palette.color_transparent__hover};
  flex-direction: column;
  gap: 4px;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
  ${({theme,isLastElement}) =>!isLastElement && `border-bottom: 1px solid ${theme.palette.color_field_border_alpha};`}
`

export const PopperOptionsPrimary = styled(`div`)`
  display: flex;
  font-size: 13px;
  justify-content: flex-start;
  color: ${({theme}) => theme.palette.color_text_primary};
`

export const PopperOptionsSubhead = styled(`span`)`
  display: flex;
  font-size: 12px;
  justify-content: flex-start;
  color: ${({theme}) => theme.palette.color_text_subhead};
`

