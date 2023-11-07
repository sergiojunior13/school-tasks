import {
  ActivityIndicator,
  ActivityIndicatorProps,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";
import colors from "tailwindcss/colors";

interface LoadingButtonProps extends TouchableOpacityProps {
  isLoading: boolean;
  loaderProps?: ActivityIndicatorProps;
}

export function LoadingButton({
  isLoading,
  loaderProps,
  children,
  className,
  ...rest
}: LoadingButtonProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={isLoading}
      className={"flex-row space-x-2 " + (isLoading ? "opacity-50" : "")}
      {...rest}
    >
      {children}
      {isLoading && <ActivityIndicator size={32} color={colors.zinc[50]} {...loaderProps} />}
    </TouchableOpacity>
  );
}
