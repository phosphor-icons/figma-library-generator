import React from "react";
import { useRecoilState } from "recoil";

import { iconWeightAtom } from "../../state";
import { IconStyle } from "../../lib";

type StyleInputProps = {};

const StyleInput: React.FC<StyleInputProps> = () => {
  const [style, setStyle] = useRecoilState(iconWeightAtom);

  const handleStyleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setStyle(event.target.value as IconStyle);
  };

  return (
    <select value={style} onChange={handleStyleChange}>
      <option value={IconStyle.THIN}>Thin</option>
      <option value={IconStyle.LIGHT}>Light</option>
      <option value={IconStyle.REGULAR}>Regular</option>
      <option value={IconStyle.BOLD}>Bold</option>
      <option value={IconStyle.FILL}>Fill</option>
      <option value={IconStyle.DUOTONE}>Duotone</option>
    </select>
  );
};

export default StyleInput;
