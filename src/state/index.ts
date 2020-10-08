import { atom } from "recoil";

import { IconStyle } from "../lib";

export const iconWeightAtom = atom<IconStyle>({
  key: "iconWeightAtom",
  default: IconStyle.REGULAR,
});
