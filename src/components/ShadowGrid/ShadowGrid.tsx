import React from "react";
import { useRecoilValue } from "recoil";
import { IconContext } from "phosphor-react";

import { iconWeightAtom } from "../../state";
import { icons } from "../../lib/icons";

const ShadowGrid: React.FC<{}> = () => {
  const weight = useRecoilValue(iconWeightAtom);

  return (
    <div className="grid">
      <IconContext.Provider
        value={{ size: 32, color: "black", weight, mirrored: false }}
      >
        {icons.map(({ Icon }) => (
          <span key={Icon.displayName} title={Icon.displayName}>
            <Icon className="icon" key={Icon.displayName} />
          </span>
        ))}
      </IconContext.Provider>
    </div>
  );
};

export default ShadowGrid;
