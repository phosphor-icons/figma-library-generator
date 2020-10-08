import React from "react";
import { useRecoilState } from "recoil";
// import Select from "react-dropdown-select";
// import { CaretDown, CaretUp, PencilLine } from "phosphor-react";

import { iconWeightAtom } from "../../state";
import { IconStyle } from "../../lib";

// type WeightOption = { key: string; value: IconStyle; icon: JSX.Element };

// const options: WeightOption[] = [
//   {
//     key: "Thin",
//     value: IconStyle.THIN,
//     icon: <PencilLine size={24} weight="thin" />,
//   },
//   {
//     key: "Light",
//     value: IconStyle.LIGHT,
//     icon: <PencilLine size={24} weight="light" />,
//   },
//   {
//     key: "Regular",
//     value: IconStyle.REGULAR,
//     icon: <PencilLine size={24} weight="regular" />,
//   },
//   {
//     key: "Bold",
//     value: IconStyle.BOLD,
//     icon: <PencilLine size={24} weight="bold" />,
//   },
//   {
//     key: "Fill",
//     value: IconStyle.FILL,
//     icon: <PencilLine size={24} weight="fill" />,
//   },
//   {
//     key: "Duotone",
//     value: IconStyle.DUOTONE,
//     icon: <PencilLine size={24} weight="duotone" />,
//   },
// ];

type StyleInputProps = {};

const StyleInput: React.FC<StyleInputProps> = () => {
  const [style, setStyle] = useRecoilState(iconWeightAtom);

  // const handleStyleChange = (values: WeightOption[]) =>
  //   setStyle(values[0].value as IconStyle);

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

  // return (
  //   <Select
  //     options={options}
  //     values={[options[2]]}
  //     searchable={false}
  //     labelField="key"
  //     onChange={handleStyleChange}
  //     itemRenderer={({
  //       item,
  //       itemIndex,
  //       state: { cursor, values },
  //       methods,
  //     }) => (
  //       <span
  //         role="option"
  //         aria-selected={item.key === values[0].key}
  //         className={`react-dropdown-select-item ${
  //           itemIndex === cursor ? "react-dropdown-select-item-active" : ""
  //         }`}
  //         onClick={() => methods.addItem(item)}
  //       >
  //         {item.icon}
  //         {item.key}
  //       </span>
  //     )}
  //     contentRenderer={({ state: { values } }) => (
  //       <div className="react-dropdown-select-content">
  //         {values[0].icon}
  //         {values[0].key}
  //       </div>
  //     )}
  //     dropdownHandleRenderer={({ state }) =>
  //       state.dropdown ? <CaretDown /> : <CaretUp />
  //     }
  //   />
  // );
};

export default StyleInput;
