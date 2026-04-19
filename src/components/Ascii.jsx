import {
  useAsciiText,
  // alligator,
  // fraktur,
  ansiShadow,
  // dosRebel,
  // deltaCorpsPriest1,
} from "react-ascii-text";

// Design guideline: blocky, tui-like feel. But I included a few edgy gothic fonts because it's my site and I do whatever I want
// IMPORTANT:
// <pre> scale is controlled manually by text-size.
// Whitespace horizontal lines can be fixed with negative margin.
// Each ascii font has wildly different inherent size and whitespaces. Therefore each would need its own custom <pre> with text-size and margin chosen specifically for it to look right. I set ansiShadow by default because it's the least troublesome "out of the box".
export default function Ascii({ text }) {
  const asciiTextRef = useAsciiText({
    font: ansiShadow,
    text: text,
    isAnimated: false,
  });

  // TODO feature: User can set different ascii logos. Add switch that returns custom <pre>s for each font option. font name is from user settings and passed by prop. Create a setting for it
  return (
    <pre
      ref={asciiTextRef}
      className="gradient text-[12px] md:block md:text-[17px]"
    ></pre>
  );
}
