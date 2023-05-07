import React from "react";
import styled from "styled-components";

const HighlightSubstring = styled("b")`
  background-color: ${({theme}) => theme.palette.color_background_tertiary_alpha__active};
  border-radius: 1px;
  padding: 0 1px;
`

export interface HighlightProps{
  children: string,
  match: string,
}

export const Highlight: React.FunctionComponent<HighlightProps> = ({ children: text = "", match }) => {
  const isValidRegex = (s: string) => {

    let parts = s.split('/');
    let regex = s;
    let options = "";

    if (parts.length > 1) {
      regex = parts[1];
      options = parts[2];
    }
    try {
      new RegExp(regex, options);
      return true;
    }
    catch(e) {
      return false;
    }
  }

  if (!match.length || !isValidRegex(match)) return <>{text}</>;

  const matches = [...text?.matchAll(new RegExp(match, "ig"))];

  const startingText = text.slice (0, matches[0]?.index);

  return (
    <div>
      {startingText}
      {matches.map((match, index) => {
        const highlightSubstring = match[0];
        const untilNextText = text.slice (match.index! + highlightSubstring?.length, matches[index + 1]?.index);
        return (
          <div key={`${highlightSubstring}/${index}`}>
            <HighlightSubstring>{highlightSubstring}</HighlightSubstring>
            {untilNextText}
          </div>
        );
      })}
    </div>
  )
}
