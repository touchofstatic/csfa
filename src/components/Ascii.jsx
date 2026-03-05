import {
  useAsciiText,
  alligator,
  fraktur,
  ansiShadow,
  dosRebel,
  deltaCorpsPriest1,
} from 'react-ascii-text';

export default function Ascii({ text }) {
  const asciiTextRef = useAsciiText({
    font: deltaCorpsPriest1,
    text: text,
    isAnimated: false,
  });

  return (
    <pre
      ref={asciiTextRef}
      className="hidden md:block text-center text-[14px] gradient"
    ></pre>
  );
}
