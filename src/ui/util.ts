import * as Icons from "@phosphor-icons/react";
import type { Icon } from "@phosphor-icons/react";
import {
  icons as iconData,
  IconEntry as CoreEntry,
} from "@phosphor-icons/core";

export interface IconEntry extends CoreEntry {
  Icon: Icon;
}

export const icons: ReadonlyArray<IconEntry> = iconData.map((entry) => ({
  ...entry,
  Icon: Icons[entry.pascal_name as keyof typeof Icons] as Icons.Icon,
}));
