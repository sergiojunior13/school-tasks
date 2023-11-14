import { Octicons } from "@expo/vector-icons";
import { IconProps } from "@expo/vector-icons/build/createIconSet";

export function Icon({
  name,
  color = "#fafafa",
  size = 32,
  ...rest
}: IconProps<keyof typeof Octicons.glyphMap>) {
  return <Octicons name={name} color={color} size={size} {...rest} />;
}
